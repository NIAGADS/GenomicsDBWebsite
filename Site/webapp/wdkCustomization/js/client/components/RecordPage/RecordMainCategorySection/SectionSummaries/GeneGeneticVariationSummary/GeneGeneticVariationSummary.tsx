import { Typography } from "@material-ui/core";
import React from "react";
import { BaseTextSmall } from "../../../../Shared";
import * as GR from "../../../types";
import { resolveJsonInput } from "./../../../../../util/jsonParse";

const GeneGeneticVariationSummary: React.FC<{ record: GR.GeneRecord }> = (props) => (
    <BaseTextSmall>
        The&nbsp;
        <Typography variant="inherit" color="primary">
            {props.record.attributes.gene_symbol}
        </Typography>
        &nbsp;gene contains&nbsp;
        {resolveJsonInput(props.record.attributes.num_colocated_variants)}
        &nbsp;variants records (corresponding to {props.record.attributes.num_unique_colocated_variants} unique genomic
        positions).
        <br />
        The following variants, contained within ±100kb of&nbsp;
        <Typography variant="inherit" color="primary">
            {props.record.attributes.gene_symbol}
        </Typography>
        , have been found to be associated with Alzheimer's disease in a GWAS study:
    </BaseTextSmall>
);

export default GeneGeneticVariationSummary;
