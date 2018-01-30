/*
 *  Power BI Visual CLI
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

import valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
module powerbi.extensibility.visual.advanceTooltipADE8B01854F34CEF9616DF8EA6069129  {
    "use strict";

    interface ViewModel {
        tooltips: VisualTooltipDataItem[];
        identities: ISelectionId
    }

    export class Visual implements IVisual {
        private target: HTMLElement;
        private svg: d3.Selection<SVGAElement>;
        private svgGroup: d3.Selection<SVGAElement>;
        private host: IVisualHost;
        private viewModel: ViewModel;
        private dataView: powerbi.DataView[];
        private settings: VisualSettings;
        private toolTipClassName: string = "atooltip";
        private imageURL: string;

        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.target = options.element;
        }

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options.dataViews[0]);
            this.viewModel = this.getViewModel(options, this.settings);
            this.imageURL = this.settings.imageSettings.imageUrl;

            let viewPortHeight: number = options.viewport.height;
            let viewPortWidth: number = options.viewport.width;

            if(this.settings.imageSettings.show == true){
                if (typeof document !== "undefined"){
                    this.svg = d3.selectAll('.'+this.toolTipClassName).remove();
                    this.svg = d3.select(this.target)
                                .append("svg")
                                .classed(this.toolTipClassName, true)
                                .attr({
                                    width: options.viewport.width,
                                    height: options.viewport.height
                                });
                    this.svgGroup = this.svg.append("g")
                                    .classed("atooltip-group", true);

                    this.svgGroup.append("svg:image")
                                .attr('width', viewPortWidth)
                                .attr('height', viewPortHeight)
                                .attr("xlink:href", this.imageURL);

                    // this.svgGroup.append("rect")
                    //             .attr("width", viewPortWidth)
                    //             .attr("height", viewPortHeight)
                    //             .attr("fill", "#FF8100")
                    //             .attr("stroke", "#E85000")
                    //             .attr("stroke-width", "20");

                    // this.svgGroup.append("text")
                    //             .text("Select Image")
                    //             .attr("fill", "black")
                    //             .attr("x", viewPortWidth / 2)
                    //             .attr("y",viewPortHeight / 2)
                    //             .attr("font-size", (viewPortWidth + viewPortHeight) * 0.05)
                    //             .attr("font-family", "sans-serif")
                    //             .attr("text-anchor", "middle");

                    // this.svgGroup.append("input")
                    //             .classed("atooltip-image", true)
                    //             .attr("type", "file")
                    //             .attr({
                    //                 width: options.viewport.width,
                    //                 height: options.viewport.height
                    //             });
                }

            } else {
                if (typeof document !== "undefined") {
                    this.svg = d3.selectAll('.'+this.toolTipClassName).remove();
                    this.svg = d3.select(this.target)
                            .append("svg")
                            .classed(this.toolTipClassName, true)
                            .attr({
                                width: viewPortWidth,
                                height: viewPortHeight
                            });
                }
            }

            this.svg.on("mouseover", (e) => {
                let mouse = d3.mouse(this.svg.node());
                let x = mouse[0];
                let y = mouse[1];
                this.host.tooltipService.show({
                    dataItems: this.viewModel.tooltips,
                    identities: [this.viewModel.identities],
                    coordinates: [x, y],
                    isTouchEvent: false
                });
            }).on("mousemove", (e) => {
                let mouse = d3.mouse(this.svg.node());
                let x = mouse[0];
                let y = mouse[1];
                this.host.tooltipService.show({
                    dataItems: this.viewModel.tooltips,
                    identities: [this.viewModel.identities],
                    coordinates: [x, y],
                    isTouchEvent: false
                });
            });
        }

        private getViewModel(options: VisualUpdateOptions, settings: VisualSettings): ViewModel {
            this.dataView = options.dataViews;
            let viewModel: ViewModel = {
                tooltips: [],
                identities: []
            };

            if(
                !this.dataView[0] ||
                !this.dataView[0].table
            )
                return viewModel;

            if(settings.infoSettings.show == true){
                viewModel.tooltips.push({
                    displayName: settings.infoSettings.infoTitle.toString(),
                    value: settings.infoSettings.infoText.toString()
                });
            }

            let table = this.dataView[0].table;
            for(let i = 0; i < table.columns.length; i++){
                let currentColumn = table.columns[i];
                if(!currentColumn.type.text){
                    let formatType = this.getValue<string>(currentColumn.objects, "measureFormatSettings", "measureFormat", "auto");
                    let formatValue = 0;
                    switch(formatType){
                        case "thousands":
                            formatValue = 1001
                            break;
                        case "millions":
                            formatValue = 1e6
                            break;
                        case "billions":
                            formatValue = 1e9
                            break;
                        case "trillions":
                            formatValue = 1e12
                            break;
                    }
                    let formatter = valueFormatter.create({
                        format: currentColumn.format,
                        value: formatValue,
                        allowFormatBeautification: true
                    });
                    viewModel.tooltips.push({
                        displayName: currentColumn.displayName,
                        value: formatter.format(table.rows[0][i]).toString()
                    });
                } else if(currentColumn.type.dateTime == true){
                    let formatter = valueFormatter.create({
                        cultureSelector: "en-GB" 
                    });
                    viewModel.tooltips.push({
                        displayName: currentColumn.displayName,
                        value: formatter.format(table.rows[0][i]).toString()
                    });
                }                
                else{
                    viewModel.tooltips.push({
                        displayName: currentColumn.displayName,
                        value: table.rows[0][i].toString()
                    });
                }
            }
            viewModel.identities = this.host.createSelectionIdBuilder()
                                .withMeasure("measure")
                                .createSelectionId();

            return viewModel;
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] 
        | VisualObjectInstanceEnumerationObject {
            // let settings: VisualObjectInstance[] = (VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options) as VisualObjectInstanceEnumerationObject).instances;
            let settings: VisualObjectInstance[] = [];
            switch(options.objectName){
                case "measureFormatSettings":{
                    let columns = this.dataView[0].table.columns;
                    for(let i = 0; i < columns.length; i++){
                        let currentColumn = columns[i];
                        if(!currentColumn.type.text){
                            settings.push({
                                objectName: options.objectName,
                                displayName: currentColumn.displayName,
                                properties:{
                                    measureFormat: this.getValue<string>(currentColumn.objects, options.objectName, "measureFormat", "none")
                                },
                                selector: {metadata: currentColumn.queryName}
                            });
                        }
                    }
                }
                break;
                // case "infoSettings":{
                //     settings.push({
                //         objectName: options.objectName,
                //         properties: {
                //             show: this.settings.infoSettings.show,
                //             infoTitle: this.settings.infoSettings.infoTitle,
                //             infoText: this.settings.infoSettings.infoText
                //         },
                //         selector: null
                //     });
                // }
                // break;
            }
            if(settings.length > 0)
                return settings;
            else
                return (VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options) as VisualObjectInstanceEnumerationObject);
        }

        public getValue<T>(objects: DataViewObjects, objectName: string, propertyName: string, defaultValue: T): T {
            if (objects) {
                let object = objects[objectName];
                if (object) {
                    let property: T = <T>object[propertyName];
                    if (property !== undefined) {
                    return property;
                    }
                }
            }
            return defaultValue;
        }
    }
}
