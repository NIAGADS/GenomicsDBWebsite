import React from "react";
import * as GR from "../../../types";
import { resolveJsonInput } from "./../../../../../util/jsonParse";

const GeneGeneticVariationSummary: React.SFC<{ record: GR.GeneRecord }> = (props) => (
    <span className="gene-genetic-variation-summary">
        The&nbsp;
        <span className="gene-symbol-text">{props.record.attributes.gene_symbol}</span>
        &nbsp;gene contains&nbsp;
        {resolveJsonInput(props.record.attributes.num_colocated_variants)}
        &nbsp;variants records (corresponding to {props.record.attributes.num_unique_colocated_variants} unique genomic
        positions).
        <br />
        The following variants, contained within ±100kb of&nbsp;
        <span className="gene-symbol-text">{props.record.attributes.gene_symbol}</span>, have been found to be
        associated with Alzheimer's disease in a GWAS study:
    </span>
);

export default GeneGeneticVariationSummary;
