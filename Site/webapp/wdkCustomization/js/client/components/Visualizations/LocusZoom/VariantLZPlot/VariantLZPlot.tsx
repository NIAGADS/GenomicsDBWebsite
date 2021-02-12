import React, { useState } from "react";
import { Grid, ListItem, withStyles } from "@material-ui/core";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import LZPlot from "../LZPlot";

interface VariantLzPlotProps {
    chromosome: string;
    datasetChoices: { [key: string]: string }[];
    variant: string;
}

interface TopHit {
    end: number;
    hit: string;
    start: number;
    chromosome: string;
    feature_type: string;
    neg_log10_pvalue: number;
    ld_reference_variant: string;
}

const VariantLzPlot: React.FC<VariantLzPlotProps> = ({ chromosome, datasetChoices, variant }) => {
    const [dataset, setDataset] = useState<string>(Object.keys(datasetChoices[0])[0]),
        [selectClass, setSelectClass] = useState(Math.random().toString(32).slice(2).replace(/\d/g, "")),
        [population, setPopulation] = useState<string>("EUR"),
        [refVariant, setRefVariant] = useState<string>(variant);

    const populationChoices = [
        { EUR: "EUR: European" },
        { AFR: "AFR: African/African American" },
        { AMR: "AMR: Ad Mixed American" },
        { EAS: "EAS: East Asian" },
        { SAS: "SAS: South Asian" },
    ];

    return (
        <div className="variant-plot">
            <form>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label>Select a Dataset</label>
                            <select className="form-control" onChange={(e) => setDataset(e.currentTarget.value)}>
                                {datasetChoices.map((item) => {
                                    return safeHtml(
                                        Object.values(item)[0],
                                        { key: Object.keys(item)[0], value: Object.keys(item)[0] },
                                        "option"
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label>Select a Population</label>
                            <select className="form-control" onChange={(e) => setPopulation(e.currentTarget.value)}>
                                {populationChoices.map((item) => {
                                    return (
                                        <option key={Object.keys(item)[0]} value={Object.keys(item)[0]}>
                                            {Object.values(item)[0]}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            </form>
            <Grid container wrap="nowrap" justify="center" direction="row">
                <Grid item>
                    <LZPlot
                        chromosome={chromosome}
                        population={population}
                        refVariant={refVariant}
                        selectClass={selectClass}
                        track={dataset}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

export default VariantLzPlot;
