import React, { useState } from "react";
import { connect } from "react-redux";
import { Grid, List, ListItem, Typography, withStyles } from "@material-ui/core";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { PrimaryExternalLink } from "../../../../Shared";
import LZPlot from "../../../../Visualizations/LocusZoom/LZPlot";
import { get, noop } from "lodash";
import { useWdkService } from "wdk-client/Hooks/WdkServiceHook";

interface VariantLzPlotProps {
    chromosome: string;
    endpoint: string;
    datasetChoices: { [key: string]: string }[];
    populationChoices: { [key: string]: string }[];
    selectClass: string;
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

const VariantLzPlot: React.FC<VariantLzPlotProps> = ({
    chromosome,
    datasetChoices,
    endpoint,
    populationChoices,
    selectClass,
    variant,
}) => {
    const [dataset, setDataset] = useState<string>(Object.keys(datasetChoices[0])[0]),
        [population, setPopulation] = useState<string>(Object.keys(populationChoices[0])[0]),
        [topHits, setTopHits] = useState<TopHit[]>(),
        [refVariant, setRefVariant] = useState<string>(variant),
        [range, setRange] = useState<{ start: number; end: number }>();

    const loadTopHit = (hit: TopHit) => {
        setRange({ start: hit.start, end: hit.end });
        setRefVariant(hit.ld_reference_variant);
    };

    useWdkService(
        (service) => {
            if (dataset) {
                service
                    ._fetchJson<TopHit[]>("get", `/dataset/gwas/top?track=${dataset}&limit=10`)
                    .then((res) => setTopHits(res));
            }
            return new Promise(noop);
        },
        [dataset]
    );

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
                    <Typography>Top Hits</Typography>
                    <List>
                        {(topHits || []).map((t) => (
                            //@ts-ignore
                            <TopHitListItem key={t.ld_reference_variant}>
                                <PrimaryExternalLink onClick={() => loadTopHit(t)} href="#">
                                    {t.hit}
                                </PrimaryExternalLink>
                            </TopHitListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item>
                    <LZPlot
                        chromosome={chromosome}
                        end={get(range, "end")}
                        population={population}
                        refVariant={refVariant}
                        selectClass={selectClass}
                        start={get(range, "start")}
                        track={dataset}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

//@ts-ignore
const TopHitListItem = withStyles({ root: { paddingTop: 0, paddingLeft: 0 } })(ListItem);

export default connect((state: any) => ({
    endpoint: state.globalData.siteConfig.endpoint,
}))(VariantLzPlot);
