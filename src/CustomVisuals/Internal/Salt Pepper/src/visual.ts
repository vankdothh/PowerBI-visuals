/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ''Software''), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
    'use strict';
    import ISelectionId = powerbi.visuals.ISelectionId;
    import TextProperties = powerbi.extensibility.utils.formatting.TextProperties;
    import textMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;
    import PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
    import ValueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
    import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;

    interface IVisualViewModel {
        dataPoints: IVisualDataPoint[];
        categoryName: string;
        sourceName: string;
        measureName: string;
        destinationName: string;
        sumOfSource: number;
        sumOfDestination: number;
        fontColor: string;
        fontSize: number;
    }

    interface IVisualDataPoint {
        category: PrimitiveValue;
        source: number;
        measures: number[];
        destination: number[];
        color: string;
        selectionId: ISelectionId;
        dataPercentageSource: string;
        dataPercentageDestination: string;
    }

  /**
   * Gets property value for a particular object in a category.
   *
   * @function
   * @param {DataViewCategoryColumn} category  -  List of category objects.
   * @param {number} index                     -  Index of category object.
   * @param {string} objectName                -  Name of desired object.
   * @param {string} propertyName              -  Name of desired property.
   * @param {T} defaultValue                   -  Default value of desired property.
   */
    export function getCategoricalObjectValue<T>(category: DataViewCategoryColumn, index: number,
                                                 objectName: string, propertyName: string, defaultValue: T): T {
        const categoryObjects: DataViewObjects[] = category.objects;
        if (categoryObjects) {
            const categoryObject: DataViewObject = categoryObjects[index];
            if (categoryObject) {
                const object: DataViewPropertyValue = categoryObject[objectName];
                if (object) {
                    const property: T = <T>object[propertyName];
                    if (property !== undefined) {
                        return property;
                    }
                }
            }
        }

        return defaultValue;
    }
    export function getAutoByUnits(dataValue: string, displayUnits: number): number {
        let dataValueLength: number;
        if (dataValue === null || dataValue === '') {
            return displayUnits;
        } else {
            dataValueLength = dataValue.toString().length;
        }

        if (dataValueLength >= 4 && dataValueLength < 6) {
            displayUnits = 1001;
        } else if (dataValueLength >= 6 && dataValueLength < 9) {
            displayUnits = 1e6;
        } else if (dataValueLength >= 9 && dataValueLength < 12) {
            displayUnits = 1e9;
        } else if (dataValueLength >= 12) {
            displayUnits = 1e12;
        }

        return displayUnits;
    }
    export class Visual implements IVisual {
        private target: HTMLElement;
        private updateCount: number;
        private host: IVisualHost;
        private visualModel: IVisualViewModel;
        private visualCont: d3.Selection<SVGElement>;
        private labelDiv: d3.Selection<SVGElement>;
        private mainContainer: d3.Selection<SVGElement>;
        private categoryLabelContainer: d3.Selection<SVGElement>;
        private tooltipServiceWrapper: ITooltipServiceWrapper;
        private visualDataPoint: IVisualDataPoint[];
        private visualSelection: d3.selection.Update<IVisualDataPoint>;
        // tslint:disable-next-line:no-any
        private dataViews: any;
        private sourceFormat: string;
        private destinationFormat: string;
        private static visibilityTextLabel: boolean = true;
        private static settings: VisualSettings;
        private static selectionManager: ISelectionManager;

        // Constants
        public static MAXWIDTHRATIO: number = 0.7;
        private static cX: number;
        private static cY: number;
        public static SOURCEMEASURELABELRELATIVEHEIGHT: number = 0.053;
        public static DESTINATIONMEASURELABELRELATIVEHEIGHT: number = 0.873;
        public static MINCONVERSIONBOXWIDTH: number = 0.07;
        public static MINCONVERSIONBOXHEIGHT: number = 0.1;
        public static SOURCEDATALABELRELATIVEHEIGHT: number = 0.08;
        public static DESTINATIONDATALABELRELATIVEHEIGHT: number = 0.95;
        public static MAXLENGTHMEASURELABEL: number = 0.29;
        public static MAXWIDTHMEASURELABEL: number = 0.3;
        public static sourceStringLiteral: string = 'source';
        public static destinationStringLiteral: string = 'destination';
        public static percentageLiteral: string = '%';
        public static openBracketLiteral: string = '(';
        public static closeBracketLiteral: string = ')';
        public static pxLiteral: string = 'px';
        public static classListLiteral: string = 'classList';
        public static upperTriLiteral: string = 'upperTri';
        public static lowerTriLiteral: string = 'lowerTri';
        public static dotLiteral: string = '.';
        public static measureLabelDestLiteral: string = 'measureLabelDest';
        public static textLabelLiteral: string = 'textLabel';
        public static emptyString: string = '';
        public static measureLabelLiteral: string = 'measureLabel';
        public static percentageBgLiteral: string = 'percentageBg';
        public static conversionBoxLiteral: string = 'conversionBox';
        public static spaceLiteral: string = ' ';
        public static percentageValueLiteral: string = 'percentageValue';
        public static conversionValueLiteral: string = 'conversionValue';

        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.target = options.element;
            this.tooltipServiceWrapper = createTooltipServiceWrapper(this.host.tooltipService, options.element);
            Visual.selectionManager = options.host.createSelectionManager();

            // tslint:disable-next-line:no-any
            const targetContainer: d3.Selection<any> = d3.select(this.target);
            this.categoryLabelContainer = targetContainer
                .append('div')
                .classed('categoryLabelContainer', true);

            this.mainContainer = targetContainer
                .append('div')
                .classed('mainContainer', true);
            this.visualCont = this.mainContainer
                .append('svg')
                .classed('visualContainer', true);

            this.labelDiv = this.mainContainer.append('div').attr({
                id: 'mainDivContainer'
            }).classed('mainDivContainer', true)
                .style({
                    width: '30%',
                    height: '100%',
                    top: '0px',
                    position: 'absolute'
                });
        }

        public VisualTransform(options: VisualUpdateOptions, host: IVisualHost): IVisualViewModel {
            const dataViews: DataView[] = options.dataViews;
            let len: number;
            let iIndexOfCategory: number = -1;
            let iIndexOfSource: number = -1;
            let iIndexOfDestination: number = -1;

            const viewModel: IVisualViewModel = {
                dataPoints: [],
                categoryName: '',
                sourceName: '',
                measureName: '',
                destinationName: '',
                sumOfSource: 0,
                sumOfDestination: 0,
                fontSize: 10,
                fontColor: '#000'
            };
            if (options.dataViews[0].categorical.hasOwnProperty('categories')) {
                iIndexOfCategory = 1;
            }
            if (options.dataViews[0].categorical.hasOwnProperty('values')) {
                len = options.dataViews[0].categorical.values.length;
            } else {
                this.displayBasicRequirement(4);

                return;
            }
            for (let index: number = 0; index < len; index++) {
                    if (options.dataViews[0].categorical.values[index].source.roles.hasOwnProperty(Visual.sourceStringLiteral)) {
                        iIndexOfSource = 2;
                    } else if (options.dataViews[0].categorical.values[index].source.roles
                        .hasOwnProperty(Visual.destinationStringLiteral)) {
                        iIndexOfDestination = 3;
                    }
            }
            if (iIndexOfCategory === -1) {
                this.displayBasicRequirement(1);

                return;
            } else if (iIndexOfSource === -1) {
                this.displayBasicRequirement(2);

                return;
            } else if (iIndexOfDestination === -1) {
                this.displayBasicRequirement(3);

                return;
            }
            Visual.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            const dataPoints: IVisualDataPoint[] = [];
            const categorical: DataViewCategorical = dataViews[0].categorical;
            const categories: PrimitiveValue[] = dataViews[0].categorical.categories[0].values;
            // tslint:disable-next-line:no-any
            let sourceArr: any[] = [];
            // tslint:disable-next-line:no-any
            let destinationArr: any[] = [];
            // tslint:disable-next-line:no-any
            let measuresArr: any[] = [];
            let sourceName: string;
            let destinationName: string;
            let measureName: string;

            categorical.values.forEach(function (val: DataViewValueColumn): void {
                if (val.source.roles[Visual.sourceStringLiteral]) {
                    sourceArr = val.values;
                    sourceName = val.source.displayName;
                } else if (val.source.roles[Visual.destinationStringLiteral]) {
                    destinationArr = val.values;
                    destinationName = val.source.displayName;
                } else {
                    measuresArr = val.values;
                    measureName = val.source.displayName;
                }
            });

            if (0 === measuresArr.length) {
                let idxx: number = 0;
                for (idxx = 0; idxx < categories.length; idxx++) {
                    measuresArr.push(Math.round(destinationArr[idxx] * 100 / sourceArr[idxx]));
                }
            }

            const colorPalette: IColorPalette = host.colorPalette;
            const categoriesLength: number = categories.length;
            let idx: number = 0;
            for (idx = 0; idx < categoriesLength; idx++) {
                const defaultColor: Fill = {
                    solid: {
                        color: colorPalette.getColor(categorical.categories[0].values[idx] + Visual.emptyString).value
                    }
                };

                const dataPoint: IVisualDataPoint  = {
                    category: categories[idx],
                    source: sourceArr[idx],
                    destination: destinationArr[idx],
                    measures: measuresArr[idx],
                    color: getCategoricalObjectValue<Fill>(categorical.categories[0], idx, 'colorSettings', 'color',
                                                           defaultColor).solid.color,
                    selectionId: host.createSelectionIdBuilder()
                        .withCategory(categorical.categories[0], idx)
                        .createSelectionId(),
                    dataPercentageSource: null,
                    dataPercentageDestination: null
                };
                dataPoints.push(dataPoint);
            }

            this.sourceFormat = dataViews[0].categorical.values[0].source.format;
            this.destinationFormat = dataViews[0].categorical.values[1].source.format;

            // tslint:disable-next-line:no-any
            const getSum: any = function (total: any, val: any) : any {
                return total + val;
            };

            return {
                dataPoints: dataPoints,
                categoryName: categorical.categories[0].source.displayName,
                sourceName: sourceName,
                destinationName: destinationName,
                measureName: measureName,
                sumOfSource: sourceArr.reduce(getSum),
                sumOfDestination: destinationArr.reduce(getSum),
                fontColor: Visual.settings.conversionSettings.fontColor,
                fontSize: Visual.settings.conversionSettings.fontSize
            };
        }
        private displayBasicRequirement(iStatus: number): void {
            d3.select('.categoryLabelContainer').selectAll('*').empty();
            d3.select('.visualContainer').selectAll('*').empty();
            d3.select('.mainContainer').selectAll('*').empty();
            d3.select(this.target).insert('div', ':first-child')
            .attr('id', 'textToDisplay');
            if (iStatus === 1) {
                document.getElementById('textToDisplay').textContent = `Please select 'Category'`;
            } else if (iStatus === 2) {
                document.getElementById('textToDisplay').textContent = `Please select 'Source'`;
            } else if (iStatus === 3) {
                document.getElementById('textToDisplay').textContent = `Please select 'Destination'`;
            } else if (iStatus === 4) {
                document.getElementById('textToDisplay').textContent = `Please select 'Source' and 'Destination'`;
            }
        }

        // tslint:disable-next-line:cyclomatic-complexity
        public update(options: VisualUpdateOptions): void {
            const $this: this = this;
            d3.select('#textToDisplay').remove();
            // tslint:disable-next-line:no-any
            const dataView: any = options.dataViews[0].metadata.columns;
            $this.dataViews = options.dataViews[0];
            const viewModel: IVisualViewModel = $this.visualModel = $this.VisualTransform(options, $this.host);
            const viewportWidth: number = options.viewport.width;
            const viewportHeight: number = options.viewport.height;
            const maxBaseWidth: number = viewportWidth * Visual.MAXWIDTHRATIO; // use 70% of viewport
            const summaryLabelColor: string = viewModel.fontColor;
            const summaryLabelSize: number = viewModel.fontSize;
            Visual.cX = viewportWidth - maxBaseWidth / 2;
            Visual.cY = options.viewport.height;
            const measureName: string = viewModel.measureName;
            let isEllipses: boolean;
            let iswidthSame: boolean;
            const sourceLabelRelativeHeight: number = 0.053;

            if (Visual.settings.categoryLabelSettings.show) {
                const heightCategoryLabel: number = Visual.getCategoryLabelHeight();
                Visual.cY -= heightCategoryLabel;
            }

            Visual.cY /= 2;
            // Repainting all the elements
            d3.selectAll('.funnel').remove();
            d3.selectAll('.conversionContainer').remove();
            d3.select('.conversionMsgContainer').remove();
            d3.select('.measuresContainer').remove();
            d3.selectAll('.labelValue').remove();
            d3.selectAll('.separatorLine').remove();
            d3.selectAll(Visual.dotLiteral + Visual.measureLabelLiteral).remove();
            d3.selectAll(Visual.dotLiteral + Visual.measureLabelDestLiteral).remove();

            const triData: d3.selection.Update<IVisualDataPoint> = $this.visualCont.selectAll('.funnel')
                .data(viewModel.dataPoints);
            const maxConversionBoxWidth: number = 65;
            const maxConversionBoxHeight: number = 55;
            const minConversionBoxWidth: number = 25;
            const minConversionBoxHeight: number = 25;
            let conversionBoxWidth: number = Math.min(viewportWidth * Visual.MINCONVERSIONBOXWIDTH, maxConversionBoxWidth);
            let conversionBoxHeight: number = Math.min(viewportHeight * Visual.MINCONVERSIONBOXHEIGHT, maxConversionBoxHeight);
            conversionBoxWidth = Math.max(conversionBoxWidth, minConversionBoxWidth);
            conversionBoxHeight = Math.max(conversionBoxHeight, minConversionBoxHeight);
            // tslint:disable-next-line:no-any
            const noOfFunnels: number = (triData && triData[0]) ? triData[0].length : 0;
            // tslint:disable-next-line:no-any
            const conversionValues: any[] = [];
            // tslint:disable-next-line:no-any
            const sourceCumulative: any[] = [];
            // tslint:disable-next-line:no-any
            const destinationCumulative: any[] = [];
            let startXLabel: number = 0;
            let isLabelShrinked: boolean;
            sourceCumulative[0] = viewModel.dataPoints[0].source;
            destinationCumulative[0] = viewModel.dataPoints[0].destination;

            for (let idx: number = 1; idx <= viewModel.dataPoints.length - 1; idx++) {
                sourceCumulative[idx] = sourceCumulative[idx - 1] + viewModel.dataPoints[idx].source;
                destinationCumulative[idx] = destinationCumulative[idx - 1] + viewModel.dataPoints[idx].destination;
            }

            $this.mainContainer.attr({
                width: options.viewport.width,
                height: options.viewport.height
            }).style({
                width: options.viewport.width,
                height: options.viewport.height,
                position: 'absolute'
            });

            $this.visualCont.attr({
                width: options.viewport.width,
                height: options.viewport.height
            });

            $this.categoryLabelContainer.attr({
                width: '100%',
                height: 30
            });

            // on enter
            triData.enter()
                .append('g')
                .classed('funnel', true)
                .each(function (d: IVisualDataPoint, i: number): void {
                    // tslint:disable-next-line:no-any
                    const $$this: any = d3.select(this);
                    let catVar: string = d.category.toString();
                    catVar = catVar.replace(/\s/g, '');
                    $$this.append('path')
                        .classed(catVar + Visual.spaceLiteral + Visual.upperTriLiteral, true);
                    $$this.append('path')
                        .classed(catVar + Visual.spaceLiteral + Visual.lowerTriLiteral, true);
                    if (Visual.settings.separatorSettings.show) {
                        if ((noOfFunnels - 1) !== i) {
                            $$this.append('path')
                                .classed('separatorUpLine separatorLine', true);
                            $$this.append('path')
                                .classed('separatorDownLine separatorLine', true);
                        }
                    }
                });

            // on update
            let setstartXLabel: boolean = false;
            triData.each(function (d: IVisualDataPoint, i: number) : void {
                // tslint:disable-next-line:no-any
                const $$this: any = d3.select(this);
                // tslint:disable-next-line:no-any
                let conversionValue : any;
                let baseUpTri: number;
                let baseDownTri: number;
                let startUpTriX: number;
                let startDownTriX: number;
                // tslint:disable-next-line:no-any
                let dataLevel: any;
                // tslint:disable-next-line:no-any
                let dataValue: any;
                // tslint:disable-next-line:no-any
                let dataPercentage: any;
                const baseWidth: number = 100;
                const RELATIVERATIO: number = 0.7;

                let strokeStyle: string = Visual.settings.separatorSettings.lineStyle;
                if (strokeStyle === 'dashed') {
                    strokeStyle = '5 ,4';
                } else if (strokeStyle === 'dotted') {
                    strokeStyle = '2 ,1';
                } else if (strokeStyle === 'solid') {
                    strokeStyle = 'none';
                }

                iswidthSame = Visual.settings.conversionSettings.relativeWidth;
                let catVar: string = d.category.toString();
                catVar = catVar.replace(/\s/g, '');
                $$this.select(Visual.dotLiteral + catVar + Visual.dotLiteral + Visual.upperTriLiteral)
                    .attr({
                        // tslint:disable-next-line:no-any
                        d: function (k: any): string {
                            let maxWidth: number = Visual.calculateUpperMaxWidth(maxBaseWidth, viewModel);
                            if (maxWidth < maxBaseWidth * RELATIVERATIO && !iswidthSame) {
                                maxWidth = maxBaseWidth * RELATIVERATIO;
                            }
                            const base: number = maxWidth * (d.source / viewModel.sumOfSource);
                            const startX: number = options.viewport.width - maxWidth - (maxBaseWidth - maxWidth) / 2
                            - base + (maxWidth * sourceCumulative[i] / viewModel.sumOfSource);
                            startUpTriX = startX;
                            baseUpTri = base;
                            dataValue = d.source;
                            dataPercentage = Math.round(d.source / viewModel.sumOfSource * 100) + Visual.percentageLiteral;
                            dataLevel = dataValue + Visual.spaceLiteral + Visual.openBracketLiteral
                             + dataPercentage + Visual.closeBracketLiteral;
                            viewModel.dataPoints.forEach(function (cat: IVisualDataPoint): void {
                                if (cat.category === d.category) {
                                    cat.dataPercentageSource = dataPercentage;
                                }
                            });

                            return Visual.GetTriangleUpPath(Visual.cX, Visual.cY, startX, Visual.cY, base);
                        },
                        fill: d.color
                    })
                    .on('click', function(k: string): void {
                        Visual.selectionManager.select(d.selectionId).then((ids: ISelectionId[]) => {
                            const selSVG: string = d3.select(this).attr('class');
                            const oSelclassObj: string[] = selSVG.split(' ');
                            if (!d3.select(this).classed('selected')) {
                                d3.selectAll(Visual.dotLiteral + Visual.upperTriLiteral).style({
                                    opacity: '0.5'
                                });
                                d3.selectAll(Visual.dotLiteral + Visual.lowerTriLiteral).style({
                                    opacity: '0.5'
                                });
                                d3.select(this).classed('selected', true);
                                d3.select(this).style({
                                    opacity: '1'
                                });
                                d3.select(Visual.dotLiteral + oSelclassObj[0] + Visual.dotLiteral + Visual.lowerTriLiteral).style({
                                    opacity: '1'
                                })
                                .classed('selected', true);
                            } else {
                                d3.selectAll(Visual.dotLiteral + Visual.upperTriLiteral).style({
                                    opacity: '1'
                                })
                                .classed('selected', false);
                                d3.selectAll(Visual.dotLiteral + Visual.lowerTriLiteral).style({
                                    opacity: '1'
                                })
                                .classed('selected', false);
                                Visual.selectionManager.clear();
                            }
                        });
                    });

                const labelTextVisibility: {
                    visibility: string;
                    labelText: string;
                    xAxis: number;
                    yAxis: number;
                } = Visual.findlabetTextAndVisibilitySource(dataLevel, startUpTriX, dataPercentage, baseUpTri,
                                                            dataValue, Visual.cY, options, isEllipses);

                // if (Visual.settings.detailLabelSettings.show && baseUpTri > baseWidth) {
                if (Visual.settings.detailLabelSettings.show) {
                    $$this.append('text')
                        .classed(Visual.textLabelLiteral, true)
                        .style('font-size', Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral)
                        .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                        .style('fill', Visual.settings.detailLabelSettings.color)
                        .style('visibility', labelTextVisibility.visibility)
                        .attr({
                            x: labelTextVisibility.xAxis,
                            y: labelTextVisibility.yAxis
                        })
                        .text(labelTextVisibility.labelText);
                }
                const labelText: string = labelTextVisibility.labelText;

                $$this.select(Visual.dotLiteral + catVar + Visual.dotLiteral + Visual.lowerTriLiteral)
                    .attr({
                        // tslint:disable-next-line:no-any
                        d: function (k: any) : string {
                            let maxWidth: number = Visual.calculateLowerMaxWidth(maxBaseWidth, viewModel);
                            if (maxWidth < maxBaseWidth * RELATIVERATIO && !iswidthSame) {
                                maxWidth = maxBaseWidth * RELATIVERATIO;
                            }

                            const base: number = maxWidth * (k.destination / viewModel.sumOfDestination);
                            baseDownTri = base;
                            const startX: number = options.viewport.width - maxWidth - (maxBaseWidth - maxWidth) / 2
                                - base + (maxWidth * destinationCumulative[i] / viewModel.sumOfDestination);
                            startDownTriX = startX;
                            conversionValue = k.destination / k.source * 100;
                            if (conversionValue !== null) {
                                conversionValue = parseFloat(Number(conversionValue).toFixed(0)).toString() + Visual.percentageLiteral;
                            }
                            conversionValues.push({
                                percentageBg: Visual.percentageBgLiteral + i,
                                percentageValue: Visual.percentageValueLiteral + i,
                                value: conversionValue,
                                color: k.color,
                                categoryName: k.category
                            });

                            dataValue = k.destination;
                            dataPercentage = k.destination / viewModel.sumOfDestination * 100;
                            if (dataPercentage !== null) {
                                dataPercentage = Math.round(dataPercentage).toString() + Visual.percentageLiteral;
                            }
                            dataLevel = dataValue + Visual.spaceLiteral + Visual.openBracketLiteral
                             + dataPercentage + Visual.closeBracketLiteral;
                            viewModel.dataPoints.forEach(function (ca: IVisualDataPoint) : void {
                                if (ca.category === k.category) {
                                    ca.dataPercentageDestination = dataPercentage;
                                }
                            });

                            return Visual.GetTriangleDownPath(Visual.cX, Visual.cY, startX, Visual.cY, base);
                        },
                        fill: d.color
                    })
                    // tslint:disable-next-line:no-any
                    .on('click', function(k: any): void {
                        Visual.selectionManager.select(d.selectionId).then((ids: ISelectionId[]) => {
                            if (!d3.select(this).classed('selected')) {
                                d3.selectAll(Visual.dotLiteral + Visual.upperTriLiteral).style({
                                    opacity: '0.5'
                                });
                                d3.selectAll(Visual.dotLiteral + Visual.lowerTriLiteral).style({
                                    opacity: '0.5'
                                });
                                const selSVG: string = d3.select(this).attr('class');
                                const oSelclassObj: string[] = selSVG.split(' ');
                                d3.select(this).classed('selected', true);
                                d3.select(this).style({
                                    opacity: '1'
                                });
                                d3.select(Visual.dotLiteral + oSelclassObj[0] + Visual.dotLiteral + Visual.upperTriLiteral).style({
                                    opacity: '1'
                                })
                                .classed('selected', true);
                            } else {
                                d3.selectAll(Visual.dotLiteral + Visual.upperTriLiteral).style({
                                    opacity: '1'
                                })
                                .classed('selected', false);
                                d3.selectAll(Visual.dotLiteral + Visual.lowerTriLiteral).style({
                                    opacity: '1'
                                })
                                .classed('selected', false);
                                Visual.selectionManager.clear();
                            }
                        });
                    });

                const minTextWidth: number = 100;
                const labelTextVisibilityDest : {
                    visibility: string;
                    labelText: string;
                    xAxis: number;
                } = Visual.findlabelTextAndVisibilityDest(dataLevel, startDownTriX,
                                                          dataPercentage, baseDownTri, options, dataValue, Visual.cX);

                // if (Visual.settings.detailLabelSettings.show && baseDownTri >= minTextWidth) {
                if (Visual.settings.detailLabelSettings.show) {
                    $$this.append('text')
                        .classed(Visual.textLabelLiteral, true)
                        .style('font-size', Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral)
                        .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                        .style('fill', Visual.settings.detailLabelSettings.color)
                        .style('visibility', labelTextVisibilityDest.visibility)
                        .attr({
                            x: labelTextVisibilityDest.xAxis,
                            y: options.viewport.height * Visual.DESTINATIONDATALABELRELATIVEHEIGHT - Visual.getCategoryLabelHeight()
                        })
                        .text(labelTextVisibilityDest.labelText);
                }

                if ((noOfFunnels - 1) !== i) {
                    $$this.select('.separatorUpLine')
                        .attr({
                            d: function (k: IVisualDataPoint) : string {
                                return Visual.GetSeparatorUpPath(Visual.cX, Visual.cY, startUpTriX, Visual.cY, baseUpTri);
                            },
                            'stroke-width': Visual.settings.separatorSettings.strokeWidth,
                            'stroke-dasharray': strokeStyle,
                            stroke: Visual.settings.separatorSettings.color
                        });

                    $$this.select('.separatorDownLine')
                        .attr({
                            d: function (k: IVisualDataPoint) : string {
                                return Visual.GetSeparatorDownPath(Visual.cX, Visual.cY, startDownTriX, Visual.cY, baseDownTri);
                            },
                            fill: 'none',
                            'stroke-width': Visual.settings.separatorSettings.strokeWidth,
                            'stroke-dasharray': strokeStyle,
                            stroke: Visual.settings.separatorSettings.color
                        });
                }
            });

            if (Visual.settings.conversionSettings.show) {
                triData.enter()
                    .append('g')
                    .classed('conversionContainer', true)
                    .each(function (d: IVisualDataPoint, i: number): void {
                        // tslint:disable-next-line:no-any
                        const $$this: any = d3.select(this);
                        let conVar: string = d.category.toString();
                        conVar = conVar.replace(/\s/g, '');
                        $$this.append('rect')
                            .classed(conVar + Visual.spaceLiteral + Visual.percentageBgLiteral, true);
                        $$this.append('text')
                            .classed(Visual.conversionValueLiteral + Visual.spaceLiteral + Visual.percentageValueLiteral + i, true);
                    });

                triData.each(function (d: IVisualDataPoint, i: number) : void {
                    let maxWidth: number = maxBaseWidth;
                    const measureValue: number[] = d.measures;
                    // tslint:disable-next-line:no-any
                    let conversionPercent: any;

                    if (viewModel.sumOfSource < viewModel.sumOfDestination) {
                        maxWidth = maxBaseWidth * 0.8;
                    }
                    let visibility: string = 'visible';
                    let conVar: string = d.category.toString();
                    conVar = conVar.replace(/\s/g, '');

                    d3.select(Visual.dotLiteral + conVar + Visual.dotLiteral + Visual.percentageBgLiteral)
                        .attr({
                            x: Visual.cX + (i * conversionBoxWidth) - (noOfFunnels * conversionBoxWidth) / 2,
                            y: Visual.cY - (conversionBoxHeight / 2),
                            width: conversionBoxWidth,
                            height: conversionBoxHeight,
                            fill: d.color
                        });

                    if (measureName && measureValue !== null) {
                        conversionPercent = measureValue;
                    } else if (measureValue == null) {
                        conversionPercent = 'NA';
                    } else {
                        conversionPercent = conversionValues[i].value;
                    }

                    const textProperties: TextProperties = {
                        text: conversionPercent,
                        fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                        fontSize: Visual.settings.conversionSettings.fontSize + Visual.pxLiteral
                    };

                    const boxPercentage: string = textMeasurementService.getTailoredTextOrDefault(textProperties, conversionBoxWidth - 10);
                    const boxPercentageLength: number = boxPercentage.length;
                    if (3 >= boxPercentageLength && '...' === boxPercentage) {
                        visibility = 'hidden';
                    }

                    d3.select(Visual.dotLiteral + Visual.percentageValueLiteral + i)
                        .attr({
                            x: Visual.cX + (i * conversionBoxWidth) - (noOfFunnels * conversionBoxWidth) / 2 + conversionBoxWidth / 2,
                            y: Visual.cY + (conversionBoxHeight / 8)
                        }).text(boxPercentage)
                        .style('font-size', summaryLabelSize.toString() + Visual.pxLiteral)
                        .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                        .style('fill', summaryLabelColor.toString())
                        .style('visibility', visibility);

                    // Repainting Box Percentage after finding out how much width it will take in Box

                    // tslint:disable-next-line:no-any
                    let textElement: any;
                    textElement = d3.select(Visual.dotLiteral + Visual.percentageValueLiteral + i);
                    const widthSize: number = textMeasurementService.measureSvgTextElementWidth(textElement.node());
                    let xAxis: number = Visual.cX + (i * conversionBoxWidth) - (noOfFunnels * conversionBoxWidth) / 2
                    + (conversionBoxWidth - widthSize) / 2;
                    if (xAxis < 0) {
                        xAxis = 0;
                    }
                    d3.select(Visual.dotLiteral + Visual.percentageValueLiteral + i)
                        .attr({
                            x: xAxis
                        }).append('title').text(conversionPercent);
                });
            }

            if (Visual.settings.categoryLabelSettings.show) {

                const sourcetextProperties: TextProperties = {
                    text: viewModel.sourceName.toString(),
                    fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                    fontSize: Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral
                };

                const destinationtextProperties: TextProperties = {
                    text: viewModel.destinationName.toString(),
                    fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                    fontSize: Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral
                };

                let measureString: string;
                let measureStringLength: number;
                let visibility: string;
                let xAxis: number;
                let labelWidth: number;
                let availableWidth: number;
                let maxWidth: number;
                let isNarrow: boolean;
                let labelWidthDest: number;
                isEllipses = !Visual.settings.categoryLabelSettings.textwrap;
                isNarrow = false;
                isLabelShrinked = false;

                measureString = textMeasurementService.getTailoredTextOrDefault(sourcetextProperties, options.viewport.width * 0.29);
                measureStringLength = measureString.length;
                xAxis = options.viewport.width / 5; // -  (Visual.settings.categoryLabelSettings.fontSize * 2);
                labelWidth = textMeasurementService.measureSvgTextWidth(sourcetextProperties);
                labelWidthDest = textMeasurementService.measureSvgTextWidth(destinationtextProperties);
                visibility = 'visible';
                if (3 >= measureStringLength || 40 >= options.viewport.width * 0.28 || labelWidth > options.viewport.width * 0.8) {
                    visibility = 'hidden';
                }
                if (labelWidth < labelWidthDest) {
                    labelWidth = labelWidthDest;
                }

                // For gradually shifiting category labels to left while shrinking
                availableWidth = options.viewport.width * Visual.MAXLENGTHMEASURELABEL;
                maxWidth = options.viewport.width * Visual.MAXWIDTHMEASURELABEL;
                if (xAxis + labelWidth >= availableWidth) {
                    isNarrow = true;
                    isLabelShrinked = true;
                    if (availableWidth >= labelWidth) {
                        while (1) {
                            if (xAxis + labelWidth <= availableWidth) {
                                break;
                            } else {
                                xAxis--;
                            }
                        }
                    }
                }
                const subStringlabel: string = measureString.substring(measureStringLength - 3, measureStringLength);
                const measureStringDest: string = textMeasurementService.getTailoredTextOrDefault(destinationtextProperties,
                                                                                                  options.viewport.width * 0.29);
                const measureStringDestLength: number = measureStringDest.length;
                const subStringlabelDest: string = measureStringDest.substring(measureStringDestLength - 3, measureStringDestLength);
                if ('...' === subStringlabel || '...' === subStringlabelDest) {
                    isNarrow = true;
                } else {
                    isNarrow = false;
                }
                if (xAxis < 0 || isNarrow) {
                    xAxis = 0;
                }
                if (!setstartXLabel) {
                    startXLabel = xAxis;
                    setstartXLabel = true;
                }

                // Adding Source Label and Aligning DataLabel(textlabel) with Measure Label.
                let yAxis: number = options.viewport.height * Visual.SOURCEMEASURELABELRELATIVEHEIGHT;
                if ( options.viewport.height < 300) {
                    yAxis -= 5;
                } else if (options.viewport.height > 500) {
                    yAxis += 5;
                }

                $this.labelDiv.append('div')
                    .classed(Visual.measureLabelLiteral, true)
                    .attr({
                        x: xAxis,
                        y: yAxis,
                        top: yAxis,
                        title: viewModel.sourceName.toString()
                    })
                    .style('width', (options.viewport.width * Visual.MAXLENGTHMEASURELABEL - xAxis) + Visual.pxLiteral)
                    .style('font-size', Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral)
                    .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                    .style('fill', Visual.settings.categoryLabelSettings.fontColor)
                    .style('visibility', visibility)
                    .style('color', Visual.settings.categoryLabelSettings.fontColor)
                    .style('top', yAxis + Visual.pxLiteral)
                    .style('left', xAxis + Visual.pxLiteral)
                    .style('title', viewModel.sourceName.toString());

                // For updating properties of Source measure label
                if (isEllipses) {
                    d3.select(Visual.dotLiteral + Visual.measureLabelLiteral)
                        .text(measureString)
                        .style('white-space', 'nowrap')
                        .style('overflow', 'hidden')
                        .style('text-overflow', 'ellipsis');
                } else {
                    measureString = viewModel.sourceName.toString();
                    d3.select(Visual.dotLiteral + Visual.measureLabelLiteral)
                        .text(measureString)
                        .style('word-wrap', ' break-word');
                }

                // Adding Destination Label
                const top: number = options.viewport.height * Visual.DESTINATIONMEASURELABELRELATIVEHEIGHT;

                $this.labelDiv.append('div')
                    .classed(Visual.measureLabelDestLiteral, true)
                    .attr({
                        x: xAxis,
                        y: top,
                        title: viewModel.destinationName.toString()
                    })
                    .style('top', top + Visual.pxLiteral)
                    .style('left', xAxis + Visual.pxLiteral)
                    .style('width', (options.viewport.width * Visual.MAXLENGTHMEASURELABEL - xAxis) + Visual.pxLiteral)
                    .style('font-size', Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral)
                    .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                    .style('fill', Visual.settings.categoryLabelSettings.fontColor)
                    .style('visibility', visibility)
                    .style('color', Visual.settings.categoryLabelSettings.fontColor)
                    .style('title', viewModel.sourceName.toString());

                // For updating properties of Destination measure label
                let yAxisOfDestHeight : number;
                if (isEllipses) {
                    measureString = textMeasurementService.getTailoredTextOrDefault(destinationtextProperties,
                                                                                    options.viewport.width * Visual.MAXLENGTHMEASURELABEL);
                    measureStringLength = measureString.length;
                    yAxisOfDestHeight = Visual.calculateYaxisDestination(document, options, isEllipses);
                    d3.select(Visual.dotLiteral + Visual.measureLabelDestLiteral)
                        .text(measureString)
                        .style('top', yAxisOfDestHeight + Visual.pxLiteral)
                        .style('white-space', 'nowrap')
                        .style('overflow', 'hidden')
                        .style('text-overflow', 'ellipsis');
                } else {
                    measureString = viewModel.destinationName.toString();
                    measureStringLength = measureString.length;
                    d3.select(Visual.dotLiteral + Visual.measureLabelDestLiteral)
                        .text(measureString)
                        .style('word-wrap', ' break-word');
                    yAxisOfDestHeight = Visual.calculateYaxisDestination(document, options, isEllipses);

                    // After calculating correct position, change the top of measure
                    d3.select(Visual.dotLiteral + Visual.measureLabelDestLiteral).attr({
                        x: xAxis + Visual.pxLiteral,
                        y: yAxisOfDestHeight + Visual.pxLiteral,
                        title: viewModel.destinationName.toString()
                    })
                        .style('top', yAxisOfDestHeight + Visual.pxLiteral);
                }

                let previousWidth: number = -1;
                triData.each(function (d: IVisualDataPoint, i: number): void {
                    // tslint:disable-next-line:no-any
                    const labelContainer: d3.Selection<any> = d3.select('.categoryLabelContainer');
                    maxWidth = maxBaseWidth;
                    if (viewModel.sumOfSource < viewModel.sumOfDestination) {
                        maxWidth = maxBaseWidth * 0.8;
                    }
                    let base: number = maxWidth * (d.source / viewModel.sumOfSource);
                    base -= 1;
                    let marginLeft: number = options.viewport.width - maxWidth - (maxBaseWidth - maxWidth) / 2
                    - base + (maxWidth * sourceCumulative[i] / viewModel.sumOfSource);
                    if (previousWidth !== - 1) {
                        marginLeft = 0;
                    }
                    previousWidth++;
                    const textProperties: TextProperties = {
                        text: conversionValues[i].categoryName,
                        fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                        fontSize: Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral
                    };
                    const categoryName: string = textMeasurementService.getTailoredTextOrDefault(textProperties, base + 1);
                    visibility = 'visible';
                    if (maxWidth < 80 || '...' === categoryName) {
                        visibility = 'hidden';
                    }
                    labelContainer.append('div')
                        .classed('labelValue', true)
                        .text(conversionValues[i].categoryName)
                        .style('margin-left', marginLeft + Visual.pxLiteral)
                        .style('width', base + Visual.pxLiteral)
                        .style('font-size', Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral)
                        .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                        .style('color', Visual.settings.categoryLabelSettings.fontColor)
                        .style('float', 'left')
                        .style('text-align', 'center')
                        .style('visibility', visibility
                        );
                });
            }

            if (Visual.settings.categoryLabelSettings.show && Visual.settings.conversionSettings.show) {

                const converttextProperties: TextProperties = {
                    text: Visual.settings.conversionSettings.label,
                    fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                    fontSize: Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral
                };
                let conversionString: string;
                let conversionStringLength: number;
                let visibility: string;
                let xAxis: number;
                xAxis = options.viewport.width / 5 - (Visual.settings.categoryLabelSettings.fontSize * 2);
                if (xAxis < 0) {
                    xAxis = 0;
                }
                if (isEllipses) {
                    if (xAxis >= startXLabel && (isLabelShrinked || options.viewport.width * 0.4 <= 200)) {
                        xAxis = startXLabel;
                    }
                    conversionString = textMeasurementService.getTailoredTextOrDefault(converttextProperties,
                                                                                       options.viewport.width * 0.45);
                    conversionStringLength = conversionString.length;
                    visibility = 'visible';
                    if (3 >= conversionStringLength || 40 >= options.viewport.width * Visual.MAXLENGTHMEASURELABEL) {
                        visibility = 'hidden';
                    }
                    // For aligning 'Conversion %' with Measure label
                    $this.labelDiv
                        .append('div')
                        .classed('conversionMsgContainer', true)
                        .attr({
                            x: xAxis,
                            y: Visual.cY - (conversionBoxHeight / 6),
                            title: Visual.settings.conversionSettings.label,
                            id: 'conversionStringContainer'
                        })
                        .text(conversionString)
                        .style('id', 'conversionStringContainer')
                        .style('font-size', Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral)
                        .style('fill', Visual.settings.categoryLabelSettings.fontColor)
                        .style('visibility', visibility)
                        .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                        .style('top', Visual.cY - (conversionBoxHeight / 6) + Visual.pxLiteral)
                        .style('left', xAxis + 24 + Visual.pxLiteral)
                        .style('white-space', 'nowrap')
                        .style('overflow', 'hidden')
                        .style('color', Visual.settings.categoryLabelSettings.fontColor)
                        .style('title', Visual.settings.conversionSettings.label)
                        .style('text-overflow', 'ellipsis');
                } else {
                    if (xAxis >= startXLabel && (isLabelShrinked || options.viewport.width * 0.4 <= 200)) {
                        xAxis = startXLabel;
                    }
                    const labelWidth: number = textMeasurementService.measureSvgTextWidth(converttextProperties);
                    conversionString = Visual.settings.conversionSettings.label;
                    conversionStringLength = conversionString.length;
                    visibility = 'visible';
                    if (3 >= conversionStringLength || 50 >= options.viewport.width * 0.28) {
                        visibility = 'hidden';
                    }
                    $this.labelDiv
                        .append('div')
                        .classed('conversionMsgContainer', true)
                        .attr({
                            x: xAxis,
                            y: Visual.cY - (conversionBoxHeight / 6),
                            title: Visual.settings.conversionSettings.label
                        })
                        .text(conversionString)
                        .style('font-size', Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral)
                        .style('fill', Visual.settings.categoryLabelSettings.fontColor)
                        .style('visibility', visibility)
                        .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                        .style('top', Visual.cY - (conversionBoxHeight / 6) + Visual.pxLiteral)
                        .style('color', Visual.settings.categoryLabelSettings.fontColor)
                        .style('title', Visual.settings.conversionSettings.label)
                        .style('left', xAxis + Visual.pxLiteral)
                        .style('word-wrap', ' break-word');
                }
            }

            $this.visualSelection = $this.visualCont
                .selectAll('.funnel')
                .data(viewModel.dataPoints);

            $this.visualSelection
                .enter()
                .append('rect')
                .classed('.funnel', true);
            $this.tooltipServiceWrapper.addTooltip($this.visualCont.selectAll('.funnel'),
                                                   (tooltipEvent: TooltipEventArgs<number>) => $this.getTooltipData(
                                                       tooltipEvent.data,
                                                       viewModel.categoryName,
                                                       viewModel.sourceName,
                                                       viewModel.destinationName,
                                                       Visual.settings.conversionSettings.label,
                                                       viewModel.sumOfSource,
                                                       viewModel.sumOfDestination,
                                                       viewModel.dataPoints),
                                                   (tooltipEvent: TooltipEventArgs<number>) => null);

            triData.exit().remove();
        }

        // tslint:disable-next-line:no-any
        public static findlabelTextAndVisibilityDest(dataLevel: any, startDownTriX: number, dataPercentage: string,
            // tslint:disable-next-line:no-any
                                                     baseDownTri: number, options: any, dataValue: any, cX: number): {
                visibility: string;
                labelText: string;
                xAxis: number;
            } {
            const textProperties : TextProperties = {
                text: dataLevel,
                fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                fontSize: Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral
            };

            const finalValue: string = Visual.getValueByUnits(Visual.settings.detailLabelSettings.labelDisplayUnits,
                                                              Visual.settings.detailLabelSettings.labelPrecision, dataValue);
            let labelText: string = finalValue + Visual.spaceLiteral + Visual.openBracketLiteral
             + dataPercentage + Visual.closeBracketLiteral;
            dataLevel = labelText;
            const labeltextProperties : TextProperties = {
                text: labelText,
                fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                fontSize: Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral
            };

            let labelWidth: number;
            labelWidth = textMeasurementService.measureSvgTextWidth(labeltextProperties);
            if (labelWidth > baseDownTri * 0.65) {
                labelText = textMeasurementService.getTailoredTextOrDefault(labeltextProperties, baseDownTri * 0.65);
            } else {
                labelText = dataLevel;
            }
            const baseEnd: number = startDownTriX + baseDownTri;
            const xAxis: number = ((startDownTriX + baseEnd + Visual.cX) / 3);
            if (baseDownTri <= options.viewport.width * 0.3) {
                labelText = textMeasurementService.getTailoredTextOrDefault(labeltextProperties,
                                                                            startDownTriX + baseDownTri - (xAxis));
            }

            let visibility: string = 'visible';
            if (baseDownTri < labelWidth) {
                visibility = 'hidden';
            }
            const subStringLabelText: string = labelText.substring(0, 4);
            const subLabelText: string = labelText.substring(labelText.length - 4, labelText.length);
            if (' ...' === subLabelText || '....' === subLabelText) {
                labelText = labelText.substring(0, labelText.length - 4) + labelText.substring(labelText.length - 3, labelText.length - 0);
            }
            if ('null' === subStringLabelText || '...' === labelText) {
                visibility = 'hidden';
            }
            if (!this.visibilityTextLabel && visibility) {
                this.visibilityTextLabel = true;
            }

            return ({
                visibility: visibility,
                labelText: labelText,
                xAxis: xAxis
            });
        }

        // tslint:disable-next-line:no-any
        public static getValueByUnits(displayUnits: number, precisionValue: number, dataValue: any): string {
            switch (Visual.settings.detailLabelSettings.labelDisplayUnits) {
                case 1000:
                    displayUnits = 1001;
                    break;
                case 1000000:
                    displayUnits = 1e6;
                    break;
                case 1000000000:
                    displayUnits = 1e9;
                    break;
                case 1000000000000:
                    displayUnits = 1e12;
                    break;
                case 0:
                    displayUnits = getAutoByUnits(dataValue, displayUnits);
                    break;
                default:
                    break;
            }

            let iValueFormatter: IValueFormatter;
            if (precisionValue === 0) {
                iValueFormatter = ValueFormatter.create({
                    value: displayUnits
                });
            } else {
                iValueFormatter = ValueFormatter.create({
                    value: displayUnits,
                    precision: precisionValue
                });
            }

            return iValueFormatter.format(dataValue);
        }
        // tslint:disable-next-line:no-any
        public static findlabetTextAndVisibilitySource(dataLevel: any, startUpTriX: number, dataPercentage: string,
        // tslint:disable-next-line:no-any
                                                       baseUpTri: number, dataValue: any, cY: number, options: any, isEllipses: boolean): {
            visibility: string;
            labelText: string;
            xAxis: number;
            yAxis: number;
        } {
            const textProperties: TextProperties = {
                text: dataLevel,
                fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                fontSize: Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral
            };
            let labelWidth: number;
            let labelText: string;
            const startXCurrent: number = startUpTriX;

            // tslint:disable-next-line:no-any
            const finalValue: any = Visual.getValueByUnits(Visual.settings.detailLabelSettings.labelDisplayUnits,
                                                           Visual.settings.detailLabelSettings.labelPrecision, dataValue);
            const newLabelText: string = finalValue + Visual.spaceLiteral + Visual.openBracketLiteral
             + dataPercentage + Visual.closeBracketLiteral;
            dataLevel = newLabelText;

            const labeltextProperties: TextProperties = {
                text: newLabelText,
                fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                fontSize: Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral
            };
            labelWidth = textMeasurementService.measureSvgTextWidth(labeltextProperties);
            const baseEnd: number = startXCurrent + baseUpTri;
            const xAxis: number = (baseEnd - startXCurrent) < 150 ? startXCurrent - 10 : ((startXCurrent + baseEnd + Visual.cX) / 3);
            if (labelWidth > baseUpTri * 0.7) {
                labelText = textMeasurementService.getTailoredTextOrDefault(labeltextProperties, baseUpTri * 0.7);
            } else {
                labelText = dataLevel;
            }

            let visibility: string = 'visible';
            const subStringLabelText: string = labelText.substring(0, 4);
            if ('null' === subStringLabelText || '...' === labelText) {
                visibility = 'hidden';
            }

            const subLabelText: string = labelText.substring(labelText.length - 4, labelText.length);
            if (subLabelText === ' ...' || '....' === subLabelText) {
                labelText = labelText.substring(0, labelText.length - 4) + labelText.substring(labelText.length - 3, labelText.length - 0);
            }

            const yAxis: number = options.viewport.height * Visual.SOURCEDATALABELRELATIVEHEIGHT;

            return ({
                visibility: visibility,
                labelText: labelText,
                xAxis: xAxis,
                yAxis: yAxis
            });
        }

        public static getCategoryLabelHeight(): number {
            if (!Visual.settings.categoryLabelSettings.show) {
                return 0;
            }

            const textProperties: TextProperties = {
                text: 'dummyData',
                fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                fontSize: Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral
            };

            return textMeasurementService.measureSvgTextHeight(textProperties);
        }

        public static getDataLabelHeight(): number {
            if (!Visual.settings.detailLabelSettings.show) {
                return 0;
            }

            const textProperties: TextProperties = {
                text: 'dummyData',
                fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                fontSize: Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral
            };

            return textMeasurementService.measureSvgTextHeight(textProperties);
        }

        // tslint:disable-next-line:no-any
        public static calculateYaxisDestination(document: any, options: any, isEllipses: boolean): any {
            const categoryLabelHeight: number = Visual.getCategoryLabelHeight();
            const dataLabelHeight: number = Visual.getDataLabelHeight();
            let baseOftextLabel: number = -1;
            let yAxisOfDestHeight: number;
            let lengthTextLabel: number = 0;
            let destHeight: number = document.querySelectorAll(Visual.dotLiteral + Visual.measureLabelDestLiteral)[0].clientHeight;

            if (Visual.settings.detailLabelSettings.show) {
                lengthTextLabel = document.querySelectorAll(Visual.dotLiteral + Visual.textLabelLiteral).length;
            }
            if (Visual.settings.detailLabelSettings.show && this.visibilityTextLabel && lengthTextLabel > 0 && !isEllipses) {
                const categoryTextHeight: number = Visual.getCategoryLabelHeight();
                baseOftextLabel = options.viewport.height * Visual.DESTINATIONDATALABELRELATIVEHEIGHT - categoryTextHeight;
                yAxisOfDestHeight = baseOftextLabel - destHeight;
            } else {
                if (0 === destHeight) {
                    destHeight = categoryLabelHeight;
                }
                yAxisOfDestHeight = options.viewport.height * Visual.DESTINATIONDATALABELRELATIVEHEIGHT - categoryLabelHeight;
                yAxisOfDestHeight = yAxisOfDestHeight - destHeight;
                if (yAxisOfDestHeight + categoryLabelHeight > options.viewport.height * Visual.DESTINATIONDATALABELRELATIVEHEIGHT) {
                    yAxisOfDestHeight = options.viewport.height * Visual.DESTINATIONDATALABELRELATIVEHEIGHT - categoryLabelHeight;
                }
            }

            return yAxisOfDestHeight;
        }

        // tslint:disable-next-line:no-any
        public static calculateUpperMaxWidth(maxBaseWidth: number, viewModel: any): number {
            const sumOfSource: number = viewModel.sumOfSource;
            const sumOfDestination: number = viewModel.sumOfDestination;
            if (sumOfSource < sumOfDestination) {
                maxBaseWidth = maxBaseWidth * (sumOfSource / sumOfDestination);
            }

            return maxBaseWidth;
        }

        // tslint:disable-next-line:no-any
        public static calculateLowerMaxWidth(maxBaseWidth: number, viewModel: any): number {
            const sumOfSource: number = viewModel.sumOfSource;
            const sumOfDestination: number = viewModel.sumOfDestination;
            if (sumOfSource > sumOfDestination) {
                maxBaseWidth = maxBaseWidth * (sumOfDestination / sumOfSource);
            }

            return maxBaseWidth;
        }

        public static calculatePercentage(numerator: number, denominator: number): string {
            return Math.round(numerator / denominator * 100) + Visual.pxLiteral;
        }

        public static GetTriangleUpPath(cX: number, cY: number, startX: number, height: number, base: number): string {
            // tslint:disable-next-line:prefer-template
            return 'M' + cX + ' ' + cY
                + ' L' + (startX) + ' ' + (cY - height)
                + ' L' + (startX + base) + ' ' + (cY - height) + ' Z';
        }

        public static GetTriangleDownPath(cX: number, cY: number, startX: number, height: number, base: number): string {
            // tslint:disable-next-line:prefer-template
            return 'M' + cX + ' ' + cY
                + ' L' + (startX) + ' ' + (cY + height)
                + ' L' + (startX + base) + ' ' + (cY + height) + ' Z';
        }

        public static GetSeparatorUpPath(cX: number, cY: number, startX: number, height: number, base: number) : string {
            // tslint:disable-next-line:prefer-template
            return 'M' + (startX + base) + ' ' + (cY - height)
                + ' L' + cX + ' ' + cY;
        }

        public static GetSeparatorDownPath(cX: number, cY: number, startX: number, height: number, base: number): string {
            // tslint:disable-next-line:prefer-template
            return 'M' + cX + ' ' + cY
                + ' L' + (startX + base) + ' ' + (cY + height);
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /**
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
         * objects and properties you want to expose to the users in the property pane.
         *
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions):
        VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            const objectName: string = options.objectName;
            const objectEnumeration: VisualObjectInstance[] = [];
            switch (objectName) {
                case 'colorSettings':
                    for (const visualDataPoint of this.visualModel.dataPoints) {
                        objectEnumeration.push({
                            objectName: objectName,
                            displayName: visualDataPoint.category.toString(),
                            properties: {
                                color: visualDataPoint.color
                            },
                            selector: visualDataPoint.selectionId.getSelector()
                        });
                    }

                    return objectEnumeration;
                default:
                    return VisualSettings.enumerateObjectInstances(Visual.settings || VisualSettings.getDefault(), options);
            }
        }
        // tslint:disable-next-line:no-any
        private getTooltipData(value: any, categoryName: string, sourceName: string, destinationName: string, conversionlabel: any,
            // tslint:disable-next-line:no-any
                               sumOfSource: number, sumOfDestination: number, dataPoints: any): VisualTooltipDataItem[] {

            let sourceCategory: string;
            // tslint:disable-next-line:no-any
            let sourceValue: any;
            let sourceValueString: string;
            let destinationCategory: string;
            // tslint:disable-next-line:no-any
            let destinationValue: any;
            let destinationValueString: string;
            // tslint:disable-next-line:no-any
            let tooltipClass: any;
            tooltipClass = event.target[Visual.classListLiteral][0];
            if (tooltipClass.indexOf(Visual.upperTriLiteral) > - 1) {
                sourceCategory = sourceName;
                sourceValue = value.source;
                destinationCategory = destinationName;
                destinationValue = value.destination;
                sourceValueString = Visual.spaceLiteral + Visual.openBracketLiteral
                 + value.dataPercentageSource + Visual.closeBracketLiteral;
                destinationValueString = Visual.spaceLiteral + Visual.openBracketLiteral
                 + value.dataPercentageDestination + Visual.closeBracketLiteral;
            } else if (tooltipClass.indexOf(Visual.lowerTriLiteral) > - 1) {
                sourceValue = value.destination;
                sourceCategory = destinationName;
                destinationCategory = sourceName;
                destinationValue = value.source;
                sourceValueString = Visual.spaceLiteral + Visual.openBracketLiteral
                 + value.dataPercentageDestination + Visual.closeBracketLiteral;
                destinationValueString = Visual.spaceLiteral + Visual.openBracketLiteral
                 + value.dataPercentageSource + Visual.closeBracketLiteral;
            }

            if (sourceValue !== null && destinationValue !== null) {
                const iValueSourceFormatter: IValueFormatter = ValueFormatter.create({
                    format: this.sourceFormat
                });
                const iValueDestinationFormatter: IValueFormatter = ValueFormatter.create({
                    format: this.destinationFormat
                });
                sourceValue = iValueSourceFormatter.format(sourceValue);
                sourceValue += sourceValueString;
                destinationValue = iValueDestinationFormatter.format(destinationValue);
                destinationValue += destinationValueString;
            }

            if (sourceValue === '(Blank)undefined' || destinationValue === '(Blank)undefined') {
                return null;
            }

            return [{
                displayName: categoryName,
                value: value.category.toString()
            },
            {
                displayName: sourceCategory,
                value: sourceValue
            },
            {
                displayName: destinationCategory,
                value: destinationValue
            },
            {
                displayName: conversionlabel,
                value: (Math.round(value.destination / value.source * 100)).toString() + Visual.percentageLiteral
            }];
        }

    }
}
