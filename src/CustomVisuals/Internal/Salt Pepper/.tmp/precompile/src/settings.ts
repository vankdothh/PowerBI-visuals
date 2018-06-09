/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
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

module powerbi.extensibility.visual.saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F  {
  'use strict';
  import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;

  export class VisualSettings extends DataViewObjectsParser {
    public colorSettings: ColorSettings = new ColorSettings();
    public separatorSettings: SeparatorSettings = new SeparatorSettings();
    public categoryLabelSettings: CategoryLabelSettings = new CategoryLabelSettings();
    public legendSettings: LegendSettings = new LegendSettings();
    public enableTooltipSettings: EnableTooltipSettings = new EnableTooltipSettings();
    public conversionSettings: ConversionSettings = new ConversionSettings();
    public detailLabelSettings: DetailLabelSettings = new DetailLabelSettings();
  }

  export class ColorSettings {
    public color: string = '';
  }

  export class CategoryLabelSettings {
    public show: boolean = true;
    public fontColor: string = '#000';
    public fontFamily: string = 'Segoe UI';
    public fontSize: number = 12;
    public textwrap: boolean = false;
  }

  export class SeparatorSettings {
    public show: boolean = true;
    public color: string = '#fff';
    public strokeWidth: number = 4;
    public lineStyle: string = 'dashed';
  }

  export class LegendSettings {
    public show: boolean = false;
    public position: string = 'top';
  }

  export class EnableTooltipSettings {
    public show: boolean = true;
  }

  export class ConversionSettings {
    public show: boolean = true;
    public label: string = 'Conversion %';
    public labelfontColor: string = '#000';
    public fontSize: number = 8;
    public fontColor: string = '#000';
    public relativeWidth: boolean = false;
  }
  // Interface for Detail Labels
  export class DetailLabelSettings {
    public show: boolean = true;
    public fontSize: number = 12;
    public color: string = 'white';
    public labelDisplayUnits: number = 0;
    public labelPrecision: number = 0;
  }
}
