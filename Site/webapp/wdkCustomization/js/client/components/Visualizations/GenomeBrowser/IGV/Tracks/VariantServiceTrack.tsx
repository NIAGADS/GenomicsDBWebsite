// modified from https://github.com/igvteam/igv.js/tree/master/js/variant/variantTrack.js
import igv from "igv/dist/igv.esm";

const DEFAULT_POPOVER_WINDOW = 100000000;
const DEFAULT_VISIBILITY_WINDOW = 1000000;
const DEFAULT_COLOR_BY = "impact";
const TOP_MARGIN = 10;

interface ColorByCategory {
    field: string;
    label: string;
    default: string;
}

export interface ConsequenceData {
    conseq: string;
    impact: string;
    is_coding: boolean;
    codon_change: string;
    amino_acid_change: string;
    impacted_gene: string;
    impacted_gene_symbol: string;
}

export interface VcfInfo {
    location: string;
    position: number;
    chromosome: string;
    display_id: string;
    metaseq_id: string;
    ref_snp_id: string;
    variant_class: string;
    display_allele: string;
    is_adsp_variant: boolean;
    variant_class_abbrev: string;
    most_severe_consequence: ConsequenceData;
}

const COLOR_BY_FIELDS: ColorByCategory[] = [
    { field: "type", label: "Variant Type", default: "SNV" },
    { field: "filter", label: "CADD Score", default: "Not reported" },
    { field: "is_adsp_variant", label: "ADSP Variant", default: "No" },
    { field: "impact", label: "Consequence Severity", default: "NONE" },
    { field: "consequence", label: "Consequence Type", default: "other / no predicted consequence" },
    { field: "is_coding", label: "Coding Variant", default: "No" },
];

class VariantServiceTrack extends igv.TrackBase {
    constructor(config: any, browser: any) {
        // this way we can use the description() function to color the tracks
        if (config.hasOwnProperty("description")) {
            if (config.hasOwnProperty("metadata")) {
                config.metadata = Object.assign(config.metadata, { Descripton: config.description });
            } else {
                config.metadata = { Description: config.description };
            }
            delete config.description;
        }
        super(config, browser);
    }

    init(config: any) {
        super.init(config);

        this.visibilityWindow = config.visibilityWindow;
        this.displayMode = config.displayMode || "EXPANDED"; // COLLAPSED | EXPANDED | SQUISHED
        this.labelDisplayMode = config.labelDisplayMode;
        this.expandedVariantHeight = config.expandedVariantHeight || config.variantHeight || 10;
        this.squishedVariantHeight = config.squishedVariantHeight || 2;
        this.squishedCallHeight = config.squishedCallHeight || 1;
        this.expandedCallHeight = config.expandedCallHeight || 10;
        this.expandedVGap = config.expandedVGap !== undefined ? config.expandedVGap : 2;
        this.squishedVGap = config.squishedVGap !== undefined ? config.squishedVGap : 1;
        this.expandedGroupGap = config.expandedGroupGap || 10;
        this.squishedGroupGap = config.squishedGroupGap || 5;
        this.featureHeight = config.featureHeight || 14;
        this.visibilityWindow = config.visibilityWindow;
        this.featureSource = igv.FeatureSource(config, this.browser.genome);
        this.noGenotypeColor = config.noGenotypeColor || "rgb(200,180,180)";
        this.noCallColor = config.noCallColor || "rgb(225, 225, 225)";
        this.nonRefColor = config.nonRefColor || "rgb(200, 200, 215)";
        this.mixedColor = config.mixedColor || "rgb(200, 220, 200)";
        this.homrefColor = config.homrefColor || "rgb(200, 200, 200)";
        this.homvarColor = config.homvarColor || "rgb(17,248,254)";
        this.hetvarColor = config.hetvarColor || "rgb(34,12,253)";
        this.sortDirection = "ASC";
        this.type = config.type || "variant";

        this.colorBy = config.colorBy === undefined ? DEFAULT_COLOR_BY : config.colorBy; // Can be undefined => default
        this._initColorBy = config.colorBy === undefined ? DEFAULT_COLOR_BY : config.colorBy;
        if (config.colorTable) {
            this.colorTables = new Map();
            this.colorTables.set(config.colorBy, new igv.ColorTable(config.colorTable));
        }
        this._color = config.color;

        this.showGenotypes = config.showGenotypes === undefined ? true : config.showGenotypes;

        // The number of variant rows are computed dynamically, but start with "1" by default
        this.variantRowCount(1);
    }

    async postInit() {
        this.header = await this.getHeader(); // cricital, don't remove' -- fossilfriend: don't think we need
        if (this.config.id === "dbSNP") {
            this.visibilityWindow = 100000; // these are very dense
            this.displayMode = "SQUISHED";
        } else if (undefined === this.visibilityWindow && this.config.indexed !== false) {
            if (typeof this.featureSource.defaultVisibilityWindow === "function") {
                this.visibilityWindow = await this.featureSource.defaultVisibilityWindow();
            } else {
                this.visibilityWindow = DEFAULT_VISIBILITY_WINDOW;
            }
        }
        return this;
    }

    supportsWholeGenome() {
        return false;
    }

    get color() {
        return this._color;
    }

    set color(c) {
        this._color = c;
        this.colorBy = undefined;
    }

    // leaving this in for now, but may be irrelevant
    async getHeader() {
        if (!this.header) {
            if (typeof this.featureSource.getHeader === "function") {
                const header = await this.featureSource.getHeader();
                if (header) {
                    this.callSets = header.callSets || [];
                }
                this.header = header;
            }
            this.sampleNames = this.callSets ? this.callSets.map((cs: any) => cs.name) : [];
        }

        return this.header;
    }

    getCallsetsLength() {
        return this.callSets ? this.callSets.length : 0;
    }

    async getFeatures(chr: string, start: number, end: number, bpPerPixel: number) {
        if (this.header === undefined) {
            this.header = await this.getHeader();
        }
        return this.featureSource.getFeatures({ chr, start, end, bpPerPixel, visibilityWindow: this.visibilityWindow });
    }

    hasSamples() {
        return this.getCallsetsLength() > 0;
    }

    getSamples() {
        return {
            yOffset: this.sampleYOffset,
            names: this.sampleNames,
            height: this.sampleHeight,
        };
    }

    /**
     * The required height in pixels required for the track content.   This is not the visible track height, which
     * can be smaller (with a scrollbar) or larger.
     *
     * @param features
     * @returns {*}
     */
    computePixelHeight(features: any) {
        if (!features || features.length == 0) return TOP_MARGIN;

        const nVariantRows = this.displayMode === "COLLAPSED" ? 1 : this.nVariantRows;
        const vGap = this.displayMode === "SQUISHED" ? this.squishedVGap : this.expandedVGap;
        const variantHeight = this.displayMode === "SQUISHED" ? this.squishedVariantHeight : this.expandedVariantHeight;
        const callHeight = this.displayMode === "SQUISHED" ? this.squishedCallHeight : this.expandedCallHeight;
        const nCalls = this.showGenotypes === false ? 0 : this.getCallsetsLength() * nVariantRows;
        const h = TOP_MARGIN + nVariantRows * (variantHeight + vGap);
        return h + vGap + (nCalls + 1) * (callHeight + vGap);
    }

    variantRowCount(count: any) {
        this.nVariantRows = count;
    }

    draw(options: any) {
        const { context, pixelWidth, pixelHeight, bpPerPixel, bpStart, pixelTop, features } = options;
        igv.IGVGraphics.fillRect(context, 0, pixelTop, pixelWidth, pixelHeight, { fillStyle: "rgb(255, 255, 255)" });

        const vGap = "SQUISHED" === this.displayMode ? this.squishedVGap : this.expandedVGap;
        const rc = "COLLAPSED" === this.displayMode ? 1 : this.nVariantRows;
        const variantHeight = "SQUISHED" === this.displayMode ? this.squishedVariantHeight : this.expandedVariantHeight;
        this.variantBandHeight = TOP_MARGIN + rc * (variantHeight + vGap);

        const callSets = this.callSets;
        const nCalls = this.getCallsetsLength();
        if (callSets && nCalls > 0 && this.showGenotypes !== false) {
            igv.IGVGraphics.strokeLine(context, 0, this.variantBandHeight, pixelWidth, this.variantBandHeight, {
                strokeStyle: "rgb(224,224,224) ",
            });
        }

        if (features) {
            const callHeight = "SQUISHED" === this.displayMode ? this.squishedCallHeight : this.expandedCallHeight;
            const vGap = "SQUISHED" === this.displayMode ? this.squishedVGap : this.expandedVGap;
            const bpEnd = bpStart + pixelWidth * bpPerPixel + 1;

            // Loop through variants.  A variant == a row in a VCF file
            for (let variant of features) {
                if (variant.end < bpStart) continue;
                if (variant.start > bpEnd) break;

                const variantHeight =
                    "SQUISHED" === this.displayMode ? this.squishedVariantHeight : this.expandedVariantHeight;
                const y = TOP_MARGIN + ("COLLAPSED" === this.displayMode ? 0 : variant.row * (variantHeight + vGap));
                const h = variantHeight;

                // Compute pixel width.   Minimum width is 3 pixels,  if > 5 pixels create gap between variants
                let x = Math.round((variant.start - bpStart) / bpPerPixel);
                let x1 = Math.round((variant.end - bpStart) / bpPerPixel);
                let w = Math.max(1, x1 - x);
                if (w < 3) {
                    w = 3;
                    x -= 1;
                } else if (w > 5) {
                    x += 1;
                    w -= 2;
                }
                context.fillStyle = this.getVariantColor(variant);
                context.fillRect(x, y, w, h);
                variant.pixelRect = { x, y, w, h };

                // Loop though the calls for this variant.  There will potentially be a call for each sample.
                if (nCalls > 0 && this.showGenotypes !== false) {
                    const nVariantRows = "COLLAPSED" === this.displayMode ? 1 : this.nVariantRows;
                    this.sampleYOffset = this.variantBandHeight + vGap;
                    this.sampleHeight = nVariantRows * (callHeight + vGap); // For each sample, there is a call for each variant at this position

                    let sampleNumber = 0;
                    for (let callSet of callSets) {
                        const call = variant.calls[callSet.id];
                        if (call) {
                            const row = "COLLAPSED" === this.displayMode ? 0 : variant.row;
                            const py =
                                this.sampleYOffset + sampleNumber * this.sampleHeight + row * (callHeight + vGap);
                            let allVar = true; // until proven otherwise
                            let allRef = true;
                            let noCall = false;

                            if (call.genotype) {
                                for (let g of call.genotype) {
                                    if ("." === g) {
                                        noCall = true;
                                        break;
                                    } else {
                                        if (g !== 0) allRef = false;
                                        if (g === 0) allVar = false;
                                    }
                                }
                            }

                            if (!call.genotype) {
                                context.fillStyle = this.noGenotypeColor;
                            } else if (noCall) {
                                context.fillStyle = this.noCallColor;
                            } else if (allRef) {
                                context.fillStyle = this.homrefColor;
                            } else if (allVar) {
                                context.fillStyle = this.homvarColor;
                            } else {
                                context.fillStyle = this.hetvarColor;
                            }

                            context.fillRect(x, py, w, callHeight);

                            callSet.pixelRect = { x, y: py, w, h: callHeight };
                        }
                        sampleNumber++;
                    }
                }
            }
        } else {
            console.log("No feature list");
        }
    }

    getConsequenceValue(conseqStr: string) {
        let conseqValue = conseqStr.replace(/ /g, "_");
        return conseqValue.includes(",") ? conseqValue.split(",")[0] : conseqValue;
    }

    getVariantClass(vc: string, allele: string) {
        if (allele.includes("dup")) {
            return "DUP";
        }
        const isIns = allele.includes("ins");
        const isDel = allele.includes("del");
        if (isIns && isDel) {
            return "INDEL";
        }
        if (isIns) {
            return "INS";
        }
        if (isDel) {
            return "DEL";
        }

        return vc;
    }

    getColorByValue(info: VcfInfo) {
        switch (this.colorBy) {
            case "type":
                return this.getVariantClass(info.variant_class_abbrev, info.display_allele);
            case "is_adsp_variant":
                return info.is_adsp_variant;
            case "impact":
                return info.most_severe_consequence !== null ? info.most_severe_consequence.impact : "*";
            case "consequence":
                return info.most_severe_consequence !== null
                    ? this.getConsequenceValue(info.most_severe_consequence.conseq)
                    : "*";
            case "is_coding":
                return info.most_severe_consequence !== null ? info.most_severe_consequence.is_coding : "*";
            default:
                return "*";
        }
    }

    getFilterValue(fValue: string) {
        return fValue === "." || fValue === null ? 0 : parseFloat(fValue);
    }

    getVariantColor(variant: any) {
        const v = variant._f || variant;
        let variantColor;

        if (this.colorBy) {
            const value = this.colorBy === "filter" ? this.getFilterValue(v.filter) : this.getColorByValue(v.info);
            variantColor = this.getVariantColorTable(this.colorBy).getColor(value);
            if (!variantColor) {
                variantColor = "gray";
            }
        } else if (this._color) {
            variantColor = typeof this._color === "function" ? this._color(v) : this._color;
        } else if ("NONVARIANT" === v.type) {
            variantColor = this.nonRefColor;
        } else if ("MIXED" === v.type) {
            variantColor = this.mixedColor;
        } else {
            variantColor = this.defaultColor;
        }
        return variantColor;
    }

    clickedFeatures(clickState: any, features: any) {
        let featureList = super.clickedFeatures(clickState, features);

        const vGap = this.displayMode === "EXPANDED" ? this.expandedVGap : this.squishedVGap;
        const callHeight = vGap + ("SQUISHED" === this.displayMode ? this.squishedCallHeight : this.expandedCallHeight);
        // Find the variant row (i.e. row assigned during feature packing)
        const yOffset = clickState.y;
        if (yOffset <= this.variantBandHeight) {
            // Variant
            const variantHeight =
                "SQUISHED" === this.displayMode ? this.squishedVariantHeight : this.expandedVariantHeight;
            const variantRow = Math.floor((yOffset - TOP_MARGIN) / (variantHeight + vGap));
            featureList = featureList.filter((f: any) => f.row === variantRow);
        } else if (this.callSets) {
            const callSets = this.callSets;
            const sampleY = yOffset - this.variantBandHeight;
            const sampleRow = Math.floor(sampleY / this.sampleHeight);
            if (sampleRow >= 0 && sampleRow < callSets.length) {
                const variantRow = Math.floor((sampleY - sampleRow * this.sampleHeight) / callHeight);
                const variants = featureList.filter((f: any) => f.row === variantRow);
                const cs = callSets[sampleRow];
                featureList = variants.map((v: any) => {
                    const call = v.calls[cs.id];
                    expandGenotype(call, v);
                    return call;
                });
            }
        }

        return featureList;
    }

    /**
     * Return "popup data" for feature @ genomic location.  Data is an array of key-value pairs
     */
    popupData(clickState: any, features: any) {
        const featureList = this.clickedFeatures(clickState, features);
        const genomicLocation = clickState.genomicLocation;
        const genomeID = this.browser.genome.id;
        const sampleInformation = this.browser.sampleInformation;

        let popupData = [];
        for (let v of featureList) {
            const f = v._f || v; // Get real variant from psuedo-variant, e.g. whole genome or SV mate

            if (popupData.length > 1) {
                popupData.push({ html: "<hr/>" });
            }

            if (typeof f.popupData === "function") {
                const vf = f.popupData(genomicLocation, genomeID);
                Array.prototype.push.apply(popupData, vf);
            } else {
                // Assume this is a call (genotype)
                const call = f;

                if (call.callSetName !== undefined) {
                    popupData.push({ name: "Name", value: call.callSetName });
                }

                if (call.genotypeName) {
                    popupData.push({ name: "Genotype", value: call.genotypeName });
                }

                if (call.phaseset !== undefined) {
                    popupData.push({ name: "Phase set", value: call.phaseset });
                }
                if (call.genotypeLikelihood !== undefined) {
                    popupData.push({ name: "genotypeLikelihood", value: call.genotypeLikelihood.toString() });
                }

                if (sampleInformation) {
                    var attr = sampleInformation.getAttributes(call.callSetName);
                    if (attr) {
                        Object.keys(attr).forEach(function (attrName) {
                            var displayText = attrName.replace(/([A-Z])/g, " $1");
                            displayText = displayText.charAt(0).toUpperCase() + displayText.slice(1);
                            popupData.push({ name: displayText, value: attr[attrName] });
                        });
                    }
                }

                //var infoKeys = Object.keys(call.info);

                /* if (sampleInformation && infoKeys.length) {
                    popupData.push("<hr/>");
                } */

                const recHref = this.config.endpoint.replace("service/track/variant", "app/record");
                const color = this.getVariantColor(call);

                popupData.push({
                    name: "Variant:",
                    html: `<a target="_blank" href="${recHref}/variant/${call.id}">${call.info.display_id}</a>`,
                    title: "View GenomicsDB record for variant " + call.info.display_id,
                });

                if (call.info.ref_snp_id !== null) {
                    popupData.push({ name: "Ref SNP ID:", value: call.info.ref_snp_id });
                }
                popupData.push({ name: "Location:", value: call.chr + ":" + call.info.location });
                popupData.push({ name: "Allele:", value: call.info.display_allele });

                if (this.colorBy === "type") {
                    popupData.push({
                        name: "Class:",
                        value: this.getVariantClass(call.info.variant_class_abbrev, call.info.display_allele),
                        color: color,
                    });
                } else {
                    popupData.push({
                        name: "Class:",
                        value: this.getVariantClass(call.info.variant_class_abbrev, call.info.display_allele),
                    });
                }

                if (this.colorBy === "is_adsp_variant") {
                    popupData.push({
                        name: "ADSP Variant?",
                        value: call.info.is_adsp_variant === null ? "No" : "Yes",
                        color: color,
                    });
                } else {
                    popupData.push({
                        name: "ADSP Variant?",
                        value: call.info.is_adsp_variant === null ? "No" : "Yes",
                    });
                }

                if (this.getFilterValue(call.filter) > 0) {
                    if (this.colorBy === "filter") {
                        popupData.push({
                            name: "CADD (PHRED):",
                            value: call.filter,
                            color: color,
                        });
                    } else {
                        popupData.push({
                            name: "CADD (PHRED):",
                            value: call.filter,
                        });
                    }
                }

                if (call.info.most_severe_consequence !== null) {
                    const msc = call.info.most_severe_consequence;
                    if (this.colorBy === "consequence") {
                        popupData.push({
                            name: "Consequence:",
                            value: msc.conseq,
                            color: color,
                        });
                    } else {
                        popupData.push({ name: "Consequence:", value: msc.conseq });
                    }

                    if (this.colorBy === "impact") {
                        popupData.push({ name: "Impact:", value: msc.impact, color: color });
                    } else {
                        popupData.push({ name: "Impact:", value: msc.impact });
                    }

                    if (this.colorBy === "is_coding") {
                        popupData.push({
                            name: "Is Coding?",
                            value: msc.is_coding === null ? "No" : msc.is_coding ? "Yes" : "No",
                            color: color,
                        });
                    } else {
                        popupData.push({
                            name: "Is Coding?",
                            value: msc.is_coding === null ? "No" : msc.is_coding ? "Yes" : "No",
                        });
                    }
                    if (msc.impacted_gene !== null) {
                        popupData.push({
                            name: "Impacted Gene:",
                            html: `<a target="_blank" href="${recHref}/gene/${msc.impacted_gene}">${msc.impacted_gene_symbol}</a>`,
                            title: "View GenomicsDB record for gene " + msc.impacted_gene_symbol,
                        });
                    }
                }
            }
        }
        return popupData;
    }

    menuItemList() {
        const menuItems = [];
        menuItems.push("<hr/>");
        const $e = $('<div class="igv-track-menu-category igv-track-menu-border-top">');
        $e.text("Color by:");
        menuItems.push({ name: undefined, object: $e, click: undefined, init: undefined });

        COLOR_BY_FIELDS.forEach((item: ColorByCategory) => {
            const selected = this.colorBy === item.field;
            // don't color by ADSP variant for ADSP tracks
            if (item.field === "is_adsp_variant") {
                !this.config.id.includes("ADSP") &&
                    menuItems.push(this.colorByCB({ key: item.field, label: item.label }, selected));
            } else {
                menuItems.push(this.colorByCB({ key: item.field, label: item.label }, selected));
            }
        });

        menuItems.push(this.colorByCB({ key: undefined, label: "None" }, this.colorBy === undefined));
        menuItems.push("<hr/>");

        if (this.getCallsetsLength() > 0) {
            menuItems.push({ object: $('<div class="igv-track-menu-border-top">') });
            menuItems.push({
                object: $(igv.createCheckbox("Show Genotypes", this.showGenotypes)),
                click: () => {
                    this.showGenotypes = !this.showGenotypes;
                    //adjustTrackHeight();
                    this.trackView.checkContentHeight();
                    this.trackView.repaintViews();
                },
            });
        }

        menuItems.push({ object: $('<div class="igv-track-menu-border-top">') });
        for (let displayMode of ["COLLAPSED", "SQUISHED", "EXPANDED"]) {
            var lut = {
                COLLAPSED: "Collapse",
                SQUISHED: "Squish",
                EXPANDED: "Expand",
            };

            menuItems.push({
                //@ts-ignore
                object: $(igv.createCheckbox(lut[displayMode], displayMode === this.displayMode)),
                click: () => {
                    this.displayMode = displayMode;
                    this.trackView.checkContentHeight();
                    this.trackView.repaintViews();
                },
            });
        }

        // Experimental JBrowse circular view integration
        if (this.browser.circularView && true === this.browser.circularViewVisible) {
            menuItems.push("<hr>");
            menuItems.push({
                label: "Add SVs to circular view",
                click: () => {
                    const inView = [];
                    for (let viewport of this.trackView.viewports) {
                        const refFrame = viewport.referenceFrame;
                        for (let f of viewport.getCachedFeatures()) {
                            if (f.end >= refFrame.start && f.start <= refFrame.end) {
                                inView.push(f);
                            }
                        }
                    }

                    const chords = igv.makeVCFChords(inView);
                    const color = igv.IGVColor.addAlpha(this._color || this.defaultColor, 0.5);
                    this.browser.circularView.addChords(chords, { track: this.name, color: color });
                },
            });
        }

        return menuItems;
    }

    //@ts-ignore
    contextMenuItemList(clickState: any) {
        // Experimental JBrowse circular view integration
        if (this.browser.circularView && true === this.browser.circularViewVisible) {
            const viewport = clickState.viewport;
            const list = [];

            list.push({
                label: "Add SVs to Circular View",
                click: () => {
                    const refFrame = viewport.referenceFrame;
                    const inView =
                        "all" === refFrame.chr
                            ? this.featureSource.getAllFeatures()
                            : this.featureSource.featureCache.queryFeatures(refFrame.chr, refFrame.start, refFrame.end);
                    const chords = igv.makeVCFChords(inView);
                    const color = igv.IGVColor.addAlpha(this._color || this.defaultColor, 0.5);
                    this.browser.circularView.addChords(chords, { track: this.name, color: color });
                },
            });

            list.push("<hr/>");
            return list;
        }
    }

    description() {
        const wrapKeyValue = (k: string, v: any) => `<div class="igv-track-label-popup-shim"><b>${k}: </b>${v}</div>`;
        const wrapLegendValue = (v: string, c: any) =>
            `<div class="igv-track-label-popup-shim"><i class="fa fa-square" style="color:${c}"></i> ${v}</div>`;

        let str = '<div class="igv-track-label-popup">';

        str += wrapKeyValue("Track", this.name);

        if (this.config) {
            if (this.config.metadata) {
                for (let key of Object.keys(this.config.metadata)) {
                    const value = this.config.metadata[key];
                    str += wrapKeyValue(key, value);
                }
            }
        }

        str += "</div>";

        if (this.colorBy) {
            str += '<hr><div class="igv-track-label-popup">';
            const cbOptions = COLOR_BY_FIELDS.filter((f: any) => f.field == this.colorBy)[0];
            str += wrapKeyValue("Legend", cbOptions.label);
            str += "<br>";
            if (this.colorBy === "filter") {
                const cScale = this.getVariantColorTable(this.colorBy);
                for (const [index, color] of cScale.colors.entries()) {
                    const bin = cScale.thresholds[index];
                    str += wrapLegendValue(bin === 0 ? "N/A" : bin, color);
                }
            } else {
                const cTable = this.getVariantColorTable(this.colorBy).colorTable;
                for (const [value, color] of Object.entries(cTable)) {
                    str += wrapLegendValue(
                        value.includes("*") ? cbOptions.default : value === "true" ? "Yes" : value.replace("_", " "),
                        color
                    );
                }
            }
            str += "</div>";
        }

        return str;
    }

    /**
     * Create a "color by" checkbox menu item, optionally initially checked
     * @param menuItem
     * @param showCheck
     * @returns {{init: undefined, name: undefined, click: clickHandler, object: (jQuery|HTMLElement|jQuery.fn.init)}}
     */
    colorByCB(menuItem: any, showCheck: any) {
        const $e = $(igv.createCheckbox(menuItem.label, showCheck));
        const clickHandler = () => {
            if (menuItem.key === this.colorBy) {
                this.colorBy = undefined;
                delete this.config.colorBy;
                this.trackView.repaintViews();
            } else {
                this.colorBy = menuItem.key;
                this.config.colorBy = menuItem.key;
                this.trackView.repaintViews();
            }
        };
        //@ts-ignore
        return { name: undefined, object: $e, click: clickHandler, init: undefined };
    }

    getState() {
        const config = super.getState();
        if (this._color && typeof this._color !== "function") {
            config.color = this._color;
        }
        return config;
    }

    getVariantColorTable(key: any) {
        if (!this.colorTables) {
            this.colorTables = new Map();
        }

        if (!this.colorTables.has(key)) {
            let tbl;
            switch (key) {
                case "type":
                    tbl = SV_COLOR_TABLE;
                    break;
                case "consequence":
                    tbl = CONSEQUENCE_COLOR_TABLE;
                    break;
                case "is_adsp_variant":
                case "is_coding":
                    tbl = BOOLEAN_COLOR_TABLE;
                    break;
                case "impact":
                    tbl = IMPACT_COLOR_TABLE;
                    break;
                case "filter":
                    tbl = CADD_COLOR_SCALE;
                    break;
                default:
                    tbl = new igv.PaletteColorTable("Set1");
            }
            this.colorTables.set(key, tbl);
        }
        return this.colorTables.get(key);
    }
}

function expandGenotype(call: any, variant: any) {
    if (call.genotype) {
        let gt = "";
        if (variant.alternateBases === ".") {
            gt = "No Call";
        } else {
            const altArray = variant.alternateBases.split(",");
            for (let allele of call.genotype) {
                if (gt.length > 0) {
                    gt += "|";
                }
                if ("." === allele) {
                    gt += ".";
                } else if (allele === 0) {
                    gt += variant.referenceBases;
                } else {
                    let alt = altArray[allele - 1].replace("<", "&lt;");
                    gt += alt;
                }
            }
        }
        call.genotypeName = gt;
    }
}

const CADD_COLOR_SCALE = new igv.BinnedColorScale({
    thresholds: [0, 1, 10, 20, 30, 40, 50],
    colors: ["#45515c", "#440d53", "#443983", "#32678d", "#23908c", "#37b779", "#8fd744"],
});

const SV_COLOR_TABLE = new igv.ColorTable({
    DEL: "#ff2101",
    INS: "#f59300",
    DUP: "#028401",
    INV: "#008688",
    CNV: "#8931ff",
    INDEL: "#891100",
    "*": "#45515c",
});

const IMPACT_COLOR_TABLE = new igv.ColorTable({
    HIGH: "#ff00ff",
    MODERATE: "#f59300",
    LOW: "#008000",
    MODIFIER: "#377eb8",
    "*": "#45515c",
});

const BOOLEAN_COLOR_TABLE = new igv.ColorTable({
    true: "#e41a1c",
    "*": "#45515c",
});

const CONSEQUENCE_COLOR_TABLE = new igv.ColorTable({
    splice_acceptor_variant: igv.appleCrayonPalette.salmon,
    start_lost: igv.appleCrayonPalette.honeydew,
    splice_region_variant: igv.appleCrayonPalette.fern,
    prime_UTR_variant: igv.appleCrayonPalette.clover,
    splice_donor_variant: igv.appleCrayonPalette.moss,
    inframe_insertion: igv.appleCrayonPalette.teal,
    splice_donor_region_variant: igv.appleCrayonPalette.midnight,
    non_coding_transcript_exon_variant: igv.appleCrayonPalette.eggplant,
    stop_gained: igv.appleCrayonPalette.plum,
    inframe_deletion: igv.appleCrayonPalette.maroon,
    stop_retained_variant: igv.appleCrayonPalette.aqua,
    intron_variant: igv.appleCrayonPalette.mocha,
    missense_variant: igv.appleCrayonPalette.maraschino,
    synonymous_variant: igv.appleCrayonPalette.tangerine,
    intergenic_variant: igv.appleCrayonPalette.ocean,
    frameshift_variant: igv.appleCrayonPalette.bubblegum,
    protein_altering_variant: igv.appleCrayonPalette.lemon,
    coding_sequence_variant: igv.appleCrayonPalette.spring,
    stop_lost: igv.appleCrayonPalette.cantaloupe,
    "*": "#377eb8",
});

export default VariantServiceTrack;
