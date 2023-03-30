// modified from https://github.com/igvteam/igv.js/tree/master/js/gwas/gwasTrack.js

import igv from "igv/dist/igv.esm";
import gwasColors from "./gwasColors"

const DEFAULT_POPOVER_WINDOW = 100000000

//const type = "gwas";

class GWASTrack extends igv.TrackBase {

    constructor(config: any, browser: any) {
        super(config, browser)
    }

    init(config: any) {

        super.init(config)

        this.useChrColors = config.useChrColors === undefined ? true : config.useChrColors
        this.trait = config.trait
        this.posteriorProbability = config.posteriorProbability
        this.valueProperty = "bed" === config.format ? "score" : "value"
        this.height = config.height || 100   // The preferred height
        this.autoscale = config.autoscale
        this.autoscalePercentile = config.autoscalePercentile === undefined ? 98 : config.autoscalePercentile
        this.background = config.background    // No default
        this.divider = config.divider || "rgb(225,225,225)"
        this.dotSize = config.dotSize || 3
        this.popoverWindow = (config.popoverWindow === undefined ? DEFAULT_POPOVER_WINDOW : config.popoverWindow)

        this.colorScales = config.color ?
            new igv.ConstantColorScale(config.color) :
            {
                "*": new igv.BinnedColorScale(config.colorScale || {
                    thresholds: [5e-8, 5e-4, 0.5],
                    colors: ["rgb(255,50,50)", "rgb(251,100,100)", "rgb(251,170,170)", "rgb(227,238,249)"],
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
            if (this.posteriorProbability) {
                this.dataRange = {
                    min: this.config.min === undefined ? 0 : this.config.min,
                    max: this.config.max === undefined ? 1 : this.config.max
                }
            } else {
                this.dataRange = {
                    min: this.config.min === undefined ? 0 : this.config.min,
                    max: this.config.max === undefined ? 25 : this.config.max
                }
            }
        }

        return this

    }

    supportsWholeGenome() {
        return false
    }

    async getFeatures(chr: string, start: number, end: number) {
        const visibilityWindow = this.visibilityWindow
        const x = this.featureSource.getFeatures({chr, start, end, visibilityWindow});
        return this.featureSource.getFeatures({chr, start, end, visibilityWindow});
    }

    draw(options:any) {
        const featureList = options.features
        const ctx = options.context
        const pixelWidth = options.pixelWidth
        const pixelHeight = options.pixelHeight
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


                let val = variant.neg_log10_pvalue
                let color = colorScale.getColor(val)
            
                const yScale = (this.dataRange.max - this.dataRange.min) / pixelHeight
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
            return this.colorScales("*")
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

    popupData(clickState: any) {
        let data:any = []
        const track = clickState.viewport.trackView.track
        const features = clickState.viewport.getCachedFeatures()

        if (features) {
            let count = 0
            for (let f of features) {
                const xDelta = Math.abs(clickState.canvasX - f.px)
                const yDelta = Math.abs(clickState.canvasY - f.py)
                const pvalue = f.pvalue
                if (xDelta < this.dotSize && yDelta < this.dotSize) {
                    if (count > 0) {
                        data.push("<HR/>")
                    }
                    if (count == 5) {
                        data.push("...")
                        break
                    }
                    if (typeof f.popupData === 'function') {
                        data = data.concat(f.popupData())
                    } else {
                        const chr = f.realChr || f.chr
                        const pos = (f.realStart || f.start) + 1
                        data.push({name: 'chromosome', value: chr})
                        data.push({name: 'position', value: pos})
                        data.push({name: 'name', value: f.variant})
                        data.push({name: 'pValue', value: pvalue})
                        
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
            // posterior probabilities are treated without modification, but we need to take a negative logarithm of P values
            const valueProperty = this.valueProperty
            const posterior = this.posteriorProbability
            const features =
                featureList.map(function (feature: any) {
                    const v = feature[valueProperty]
                    return {value: posterior ? v : -Math.log(v) / Math.LN10}
                })
            this.dataRange = igv.doAutoscale(features)

        } else {
            // No features -- pick something reasonable for PPAs and p-values
            if (this.posteriorProbability) {
                this.dataRange.min = this.config.min || 0
                this.dataRange.max = this.config.max || 1
            } else {
                this.dataRange.max = this.config.max || 25
                this.dataRange.min = this.config.min || 0
            }

        }

        return this.dataRange
    }

}

export default GWASTrack

