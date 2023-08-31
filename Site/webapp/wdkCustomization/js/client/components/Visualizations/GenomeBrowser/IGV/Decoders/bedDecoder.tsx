import igv from "igv/dist/igv.esm";

const EXPECTED_BED_FIELDS = [
    "chr",
    "start",
    "end",
    "name",
    "score",
    "strand",
    "cdStart",
    "cdEnd",
    "color",
    "blockCount",
    "blockSizes",
    "blockStarts",
];

// make column name lower then comapare
const P_VALUE_FIELDS = ["pvalue", "p-value", "pval", "p_value", "pval_nominal", "pvalue_nominal"]; //TODO: check nominal pvalue
const GENE_SYMBOL_FIELDS = ["gene", "gene_name", "target_gene_symbol"];
const GENE_ID_FIELDS = ["gene_id", "target_gene_id", "target"];

const ignoreCaseIndexOf = (arr: any[], lookup: any) =>
    arr.findIndex((item) => lookup.toLowerCase() === item.toLowerCase());

const isSimpleType = (value: any) => {
    const simpleTypes = new Set(["boolean", "number", "string", "symbol"]);
    const valueType = typeof value;
    return value !== undefined && (simpleTypes.has(valueType) || value.substring || value.toFixed);
};

const capitalize = (str: string) => {
    return str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str;
};

const numberFormatter = (rawNumber: number) => {
    var dec = String(rawNumber).split(/[.,]/),
        sep = ",",
        decsep = ".";

    return (
        dec[0]
            .split("")
            .reverse()
            .reduce(function (prev, now, i) {
                return i % 3 === 0 ? prev + sep + now : prev + now;
            })
            .split("")
            .reverse()
            .join("") + (dec[1] ? decsep + dec[1] : "")
    );
};

export function decodeBedXY(tokens: any, header: any) {
    // Get X (number of standard BED fields) and Y (number of optional BED fields) out of format
    let match = header.format.match(/bed(\d{1,2})\+(\d+)/);
    const X = parseInt(match[1]);
    const Y = parseInt(match[2]);

    if (tokens.length < 3) return undefined;

    const chr = tokens[0];
    const start = parseInt(tokens[1]);
    const end = tokens.length > 2 ? parseInt(tokens[2]) : start + 1;
    if (isNaN(start) || isNaN(end)) {
        return new igv.DecodeError(`Unparsable bed record.`);
    }

    let feature = new BedXYFeature(chr, start, end);
    feature.setAdditionalAttributes({ popupData: extractPopupData });

    if (X > 3) {
        // parse additional standard BED (beyond chr, start, end) columns
        parseStandardFields(feature, X, tokens);
    }

    // parse optional columns
    parseOptionalFields(feature, tokens, X, header.columnNames);
    parsePValues(feature, tokens, header.columnNames);
    parseGeneIds(feature, tokens, header.columnNames);
    parseVariantIds(feature, tokens, header.columnNames);

    return feature;
}

function extractPopupData(genomeId: any) {
    //@ts-ignore
    const feature: BedXYFeature = this;

    const filteredProperties = new Set(["row", "color", "chr", "start", "end", "cdStart", "cdEnd", "strand", "alpha"]);
    const data = [];

    for (let property in feature) {
        if (feature.hasOwnProperty(property) && !filteredProperties.has(property) && isSimpleType(feature[property])) {
            let value = feature[property];
            data.push({ name: capitalize(property), value: value });
            //removed alleles code
        }
        //If it's the info object
        else if (feature.hasOwnProperty(property) && property === "info") {
            //iterate over info and add it to data
            for (let infoProp in feature[property]) {
                let value = feature[property][infoProp];
                let name = formatInfoKey(infoProp);
                if (value) data.push({ name: name, value: value });
            }
        }
    }

    // final chr position
    let posString = `${feature.chr}:${numberFormatter(feature.start + 1)}-${numberFormatter(feature.end)}`;
    if (feature.strand) {
        posString += ` (${feature.strand})`;
    }

    data.push({ name: "Location", value: posString });

    return data;
}

function formatInfoKey(key: string) {
    //handle special cases
    //should be updated as more are found
    let result = "";
    switch (key) {
        case "FDR":
            result = "FDR";
            break;
        case "qtl_dist_to_target":
            result = "QTL dist to target";
            break;
        case "QC_info":
            result = "QC info";
            break;
        default:
            result = key.replace(/_/g, " ");
            result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
    }

    return result;
}

function parseVariantIds(feature: BedXYFeature, tokens: any, columns: string[]) {
    if (feature.hasOwnProperty("name") && feature.name.startsWith("rs")) {
        feature.setAdditionalAttributes({ variant: feature.name, record_pk: feature.name });
    }
    /* let alleles = [ignoreCaseIndexOf(columns, 'allele2'), ignoreCaseIndexOf(columns, 'allele1') ]
    if (alleles[0] !== -1 && alleles[1] !== -1) {
        let variantProps = [feature.chr, feature.start, feature.info.allele1, feature.info.allele2]
        let variant = variantProps.join(':')
        variant.replace('chr', '')
        feature.setAdditionalAttributes({ variant: variant });
    } */
}

function parseGeneIds(feature: BedXYFeature, tokens: any, columns: string[]) {
    let geneSymbol = null;
    let geneId = null;
    for (let field of GENE_SYMBOL_FIELDS) {
        let index = ignoreCaseIndexOf(columns, field);
        if (index !== -1) {
            geneSymbol = tokens[index];
            feature.setAdditionalAttributes({ gene_symbol: geneSymbol });
        }
    }
    for (let field of GENE_ID_FIELDS) {
        let index = ignoreCaseIndexOf(columns, field);
        if (index !== -1) {
            geneId = tokens[index];
            geneId = geneId.replace(/\.\d+/, ""); // remove the versioning in Ensembl Gene IDs
            feature.setAdditionalAttributes({ gene_id: geneId });
        }
    }

    if (geneId === null && geneSymbol !== null) {
        feature.setAdditionalAttributes({ gene_id: geneSymbol });
    }
}

function parseBedToken(field: string, token: string) {
    switch (field) {
        case "name":
            return token === "." ? "" : token;
        case "score":
            if (token === ".") return 0;
            return Number(token);
        case "strand":
            return [".", "+", "-"].includes(token) ? token : null;
        case "cdStart":
        case "cdEnd":
            return parseInt(token);
        case "color":
            if (token === "." || token === "0") return null;
            return igv.IGVColor.createColorString(token);
        default:
            return token;
    }
}

function parseStandardFields(feature: BedXYFeature, X: number, tokens: any) {
    // building an object { EXPECTED_FIELDS[index]: token[index]}
    try {
        let attributes: any = {};
        for (let index = 3; index < X; index++) {
            let field: string = EXPECTED_BED_FIELDS[index];
            let value = parseBedToken(field, tokens[index]);
            if (value === null) continue;
            if (typeof value === "number" && isNaN(value)) {
                continue;
            }
            attributes[field] = value;
        }

        // add to the feature and return
        feature.setAdditionalAttributes(attributes);
    } catch (e) {
        console.error(e);
        return;
    }
}

function parseOptionalFields(feature: BedXYFeature, tokens: any, X: number, columns: any) {
    //go through tokens and perform minimal parsing add optional columns to feature.info
    let optionalFields: any = {};
    for (let i = X; i < columns.length; i++) {
        let optField = tokens[i];
        //check to see if the feature is a number in a string and convert it
        if (!isNaN(optField) && typeof optField !== "number") {
            let num = parseFloat(optField);
            Number.isInteger(num) ? parseInt(optField) : (optField = num);
        }
        if (optField === ".") optField = null;

        optionalFields[columns[i]] = optField;
    }

    feature.setAdditionalAttributes({ info: optionalFields });
}

function parsePValues(feature: BedXYFeature, tokens: any, columns: string[]) {
    for (let field of P_VALUE_FIELDS) {
        let pIndex = ignoreCaseIndexOf(columns, field);
        if (pIndex !== -1) {
            let pValue = parseFloat(tokens[pIndex]);
            let neg_log10_pvalue = -1 * Math.log10(pValue);
            feature.setAdditionalAttributes({
                pvalue: pValue,
                neg_log10_pvalue: neg_log10_pvalue,
            });
            break;
        }
    }
}

class BedXYFeature {
    chr: string;
    start: number;
    end: number;
    score: number;
    info: any;
    [key: string]: any;

    constructor(chr: string, start: number, end: number, score = 1000) {
        this.start = start;
        this.end = end;
        this.chr = chr;
        this.score = score;
    }

    setAdditionalAttributes(attributes: any) {
        Object.assign(this, attributes);
    }

    getAttributeValue(attributeName: string): any {
        const key = attributeName as keyof BedXYFeature;
        if (this.hasOwnProperty(key)) {
            return this[key];
        } else if (this.info.hasOwnProperty(key)) {
            return this.info[key];
        } else {
            return null;
        }
    }
}
