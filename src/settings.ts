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
  	"use strict";
	import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;

  	export class VisualSettings extends DataViewObjectsParser {
		public infoSettings: InfoSettings = new InfoSettings();
		public measureFormatSettings: MeasureFormatSettings = new MeasureFormatSettings();
		public imageSettings: ImageSettings = new ImageSettings();
  	}

  	export class InfoSettings {
		public show: boolean = false;
		public infoTitle: string = "";
		public infoText: string = "";
    }

    export enum MeasureFormats {
		none = <any>"none",
		thousands = <any>"thousands",
		millions = <any>"millions",
		billions = <any>"billions",
		trillions = <any>"trillions",
  	}
  
  	export class MeasureFormatSettings{
    	public measureFormat: MeasureFormats = MeasureFormats.none;
	}
	
	export class ImageSettings{
		public show: boolean = false;
		public imageUrl: string = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Infobox_info_icon.svg/1024px-Infobox_info_icon.svg.png";
	}
}
