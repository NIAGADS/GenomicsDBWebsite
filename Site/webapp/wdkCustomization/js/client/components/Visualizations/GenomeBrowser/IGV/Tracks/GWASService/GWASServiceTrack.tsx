// modified from https://github.com/igvteam/igv.js/tree/master/js/gwas/gwasTrack.js

import igv from "igv/dist/igv.esm";
import gwasColors from "./gwasColors"

const DEFAULT_POPOVER_WINDOW = 100000000

//const type = "gwas";

class GWASServiceTrack extends igv.TrackBase {

    constructor(config: any, browser: any) {
        super(config, browser)
    }

    init(config: any) {

        super.init(config)

        this.useChrColors = false // config.useChrColors === undefined ? true : config.useChrColors
        this.valueProperty = "value"
        this.height = config.height || 100   // The preferred height
        this.autoscale = config.autoscale
        this.background = config.background    // No default
        this.divider = config.divider || "rgb(225,225,225)"
        this.dotSize = config.dotSize || 3
        this.popoverWindow = (config.popoverWindow === undefined ? DEFAULT_POPOVER_WINDOW : config.popoverWindow)
        this.maxValue = config.max || 25
        // this.minThreshold = 1 * (10**(this.maxValue * -1))

        this.colorScales = config.color ?
            new igv.ConstantColorScale(config.color) :
            {
                "*": new igv.BinnedColorScale(config.colorScale || {
                    //thresholds: [this.minThreshold, 5e-8, 1e-6, 0.5],
                    //colors: ["rgb(16,151,230)", "rgb(0,104,55)", "rgb(255,166,0)", "rgb(251,170,170)", "rgb(227,238,249)"],
                    thresholds: [0.3, 3, 6, 7.3, this.maxValue],
                    colors: ["rgb(227,238,249)", "rgb(251,170,170)", "rgb(245, 12, 12)", "rgb(255,166,0)", "rgb(20, 186, 59)", "rgb(16,151,230)"]
                })
            }

        this.featureSource = igv.FeatureSource(config, this.browser.genome)
    }

    async postInit() {

        if (typeof this.featureSource.getHeader === "function") {
            this.header = await this.featureSource.getHeader()
        }

        // Set properties from track line
        if (this.header) {
            this.setTrackProperties(this.header)   // setTrackProperties defined in TrackBase
        }

        // Set initial range if specfied, unless autoscale == true
        if (!this.autoscale) {
            this.dataRange = {
                min: this.config.min === undefined ? 0 : this.config.min,
                max: this.maxValue
            }           
        }

        return this

    }

    supportsWholeGenome() {
        return false
    }

    async getFeatures(chr: string, start: number, end: number) {
        const visibilityWindow = this.visibilityWindow
        return this.featureSource.getFeatures({chr, start, end, visibilityWindow});
    }

    draw(options:any) {
        const featureList = options.features
        const ctx = options.context
        const pixelWidth = options.pixelWidth
        const pixelHeight = options.pixelHeight
        const yScale = (this.dataRange.max - this.dataRange.min) / pixelHeight

        if (this.background) {
            igv.IGVGraphics.fillRect(ctx, 0, 0, pixelWidth, pixelHeight, {'fillStyle': this.background})
        }
        igv.IGVGraphics.strokeLine(ctx, 0, pixelHeight - 1, pixelWidth, pixelHeight - 1, {'strokeStyle': this.divider})

        if (featureList) {
            const bpPerPixel = options.bpPerPixel
            const bpStart = options.bpStart
            const bpEnd = bpStart + pixelWidth * bpPerPixel + 1
            for (let variant of featureList) {
                const pos = variant.start
                if (pos < bpStart) continue
                if (pos > bpEnd) break

                const colorScale = this.getColorScale(variant._f ? variant._f.chr : variant.chr)
                
                let val = variant.neg_log10_pvalue > this.maxValue ? this.maxValue : variant.neg_log10_pvalue;
                let color = colorScale.getColor(val)
            
                const px = Math.round((pos - bpStart) / bpPerPixel)
                const py = Math.max(this.dotSize, pixelHeight - Math.round((val - this.dataRange.min) / yScale))

                if (color) {
                    igv.IGVGraphics.setProperties(ctx, {fillStyle: color, strokeStyle: "black"})
                }
                igv.IGVGraphics.fillCircle(ctx, px, py, this.dotSize)
                variant.px = px
                variant.py = py
            }
        }
    }

    getColorScale(chr: string) {
        if (this.useChrColors) {
            let cs = this.colorScales[chr]
            if (!cs) {
                //@ts-ignore
                const color = gwasColors[chr] || igv.randomColorPalette()
                cs = new igv.ConstantColorScale(color)
                this.colorScales[chr] = cs
            }
            return cs
        } else {
            return this.colorScales["*"]
        }
    }

    paintAxis(ctx: number, pixelWidth: number, pixelHeight:number) {
        igv.IGVGraphics.fillRect(ctx, 0, 0, pixelWidth, pixelHeight, {'fillStyle': "rgb(255, 255, 255)"})
        var font = {
            'font': 'normal 10px Arial',
            'textAlign': 'right',
            'strokeStyle': "black"
        }

        const yScale = (this.dataRange.max - this.dataRange.min) / pixelHeight
        if (this.posteriorProbability) {
            const n = 0.1
            for (let p = this.dataRange.min; p < this.dataRange.max; p += n) {
                const yp = pixelHeight - Math.round((p - this.dataRange.min) / yScale)
                igv.IGVGraphics.strokeLine(ctx, 45, yp - 2, 50, yp - 2, font) // Offset dashes up by 2 pixel
                igv.IGVGraphics.fillText(ctx, p.toFixed(1), 44, yp + 2, font) // Offset numbers down by 2 pixels;
            }
        } else {
            const n = Math.ceil((this.dataRange.max - this.dataRange.min) * 10 / pixelHeight)
            for (let p = this.dataRange.min; p < this.dataRange.max; p += n) {
                const yp = pixelHeight - Math.round((p - this.dataRange.min) / yScale)
                igv.IGVGraphics.strokeLine(ctx, 45, yp, 50, yp, font) // Offset dashes up by 2 pixel
                igv.IGVGraphics.fillText(ctx, Math.floor(p), 44, yp + 4, font) // Offset numbers down by 2 pixels;
            }
        }

        font['textAlign'] = 'center'
        if (this.posteriorProbability) {
            igv.IGVGraphics.fillText(ctx, "PPA", pixelWidth / 2, pixelHeight / 2, font, {rotate: {angle: -90}})
        } else {
            igv.IGVGraphics.fillText(ctx, "-log10(pvalue)", pixelWidth / 2, pixelHeight / 2, font, {rotate: {angle: -90}})
        }
    }

    popupData(clickState: any, features: any) {
        const featureList = this.clickedFeatures(clickState, features);
        let data:any = []
        if (featureList) {
            let count = 0
            for (let f of featureList) {
                const xDelta = Math.abs(clickState.canvasX - f.px)
                const yDelta = Math.abs(clickState.canvasY - f.py)
                if (xDelta < this.dotSize && yDelta < this.dotSize) {
                    if (count > 0) {
                        data.push("<HR/>")
                    }
                    if (count == 5) {
                        data.push("...");
                        break
                    }
                    if (typeof f.popupData === 'function') {
                        data = data.concat(f.popupData())
                    } else {
                        const pos = f.end; // IGV is zero-based, so end of the variant is the position
                        const href = this.config.endpoint.replace('service/track/gwas', 'app/record/variant') + '/' + f.record_pk;
                        data.push({name: 'Variant:', html: `<a target="_blank" href="${href}">${f.variant}</a>`, title: "View GenomicsDB record for variant " + f.variant})
                        data.push({name: 'Location:', value: f.chr + ':' + pos})
                        data.push({name: 'p-Value:', value: f.pvalue})  
                    }
                    count++
                }
            }
        }

        return data
    }

    menuItemList() {
        return igv.MenuUtils.numericDataMenuItems(this.trackView)
    }

    doAutoscale(featureList: any) {
        if (featureList.length > 0) {
            const features =
                featureList.map(function (feature: any) {
                    return {value: feature.neg_log10_pvalue}
                })
            this.dataRange = igv.doAutoscale(features)

        } else {
            // No features --  p-values
            this.dataRange.max = this.maxValue;
            this.dataRange.min = this.config.min || 0
        }

        return this.dataRange
    }

}

export default GWASServiceTrack

