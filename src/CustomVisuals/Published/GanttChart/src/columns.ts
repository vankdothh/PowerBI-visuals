/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
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
    import converterHelper = powerbi.extensibility.utils.dataview.converterHelper;
    export type GanttCategoricalColumns = DataViewCategoryColumn & DataViewValueColumn[] & DataViewValueColumns;

    export class GanttColumns<T> {
        public static getColumnSources(dataView: DataView): GanttColumns<DataViewMetadataColumn> {
            return this.getColumnSourcesT<DataViewMetadataColumn>(dataView);
        }

        public static getCategoricalColumns(dataView: DataView): GanttColumns<GanttCategoricalColumns> {
            let categorical: DataViewCategorical;
            categorical = dataView && dataView.categorical;
            let categories: DataViewCategoricalColumn[];
            categories = categorical && categorical.categories || [];
            let values: DataViewValueColumns;
            values = categorical && categorical.values || <DataViewValueColumns>[];

            return categorical && _.mapValues(
                new this<GanttCategoricalColumns>(),
                // tslint:disable-next-line:typedef
                (n, i) => {
                    // tslint:disable-next-line:no-any typedef
                    let result: any = categories.filter(x => x.source.roles && x.source.roles[i])[0];
                    if (!result) {
                        result = values.source && values.source.roles && values.source.roles[i] && values;
                    }
                    if (!result) {
                        // tslint:disable-next-line:typedef
                        result = values.filter(x => x.source.roles && x.source.roles[i]);
                        if (_.isEmpty(result)) {
                            result = undefined;
                        }
                    }

                    return result;
                });
        }

        private static getColumnSourcesT<T>(dataView: DataView): GanttColumns<T> {
            let columns: DataViewMetadataColumn[];
            columns = dataView && dataView.metadata && dataView.metadata.columns;

            return columns && _.mapValues(
                // tslint:disable-next-line:typedef
                new this<T>(), (n, i) => columns.filter(x => x.roles && x.roles[i])[0]);
        }

    }
}
