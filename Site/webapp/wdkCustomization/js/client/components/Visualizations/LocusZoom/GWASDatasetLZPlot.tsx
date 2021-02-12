import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Grid, List, ListItem, Typography, withStyles, FormControl } from "@material-ui/core";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { PrimaryExternalLink } from "../../Shared";
import LZPlot from "./LZPlot";
import { get, noop } from "lodash";
import { useWdkService } from "wdk-client/Hooks/WdkServiceHook";
import { LoadingOverlay } from "wdk-client/Components";


interface GWASDatasetLZPlotProps {
    dataset: string;
    populationChoices: { [key: string]: string }[];
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

const GWASDatasetLZPlot: React.FC<GWASDatasetLZPlotProps> = ({
    dataset,
    populationChoices,

}) => {
    const
        [population, setPopulation] = useState<string>(Object.keys(populationChoices[0])[0]),
        [topHits, setTopHits] = useState<TopHit[]>(null),
        [refVariant, setRefVariant] = useState(null),
        [chromosome, setChromosome] = useState(null),
        [range, setRange] = useState<{ start: number; end: number }>(null);


    const selectClass = useRef(Math.random().toString(32).slice(2)).current;

    const loadTopHit = (hit: TopHit) => {
        setRange({ start: hit.start, end: hit.end });
        setRefVariant(hit.ld_reference_variant);
        setChromosome(hit.chromosome);

    };

    useWdkService(
        (service) => {
            if (!topHits) {
                service
                    ._fetchJson<TopHit[]>("get", `/dataset/gwas/top?track=${dataset}&limit=10&flank`)
                    .then((res) => setTopHits(res));
            }
            return new Promise(noop);
        },
        [topHits]
    );

    useEffect(() => {
        if (topHits) {
            loadTopHit(topHits[0]);
        }
    }, [topHits]);

    return (
        chromosome && refVariant && range ?
            <div className="locuszoom-plot">
                <Grid container wrap="nowrap" justify="center" direction="row">
                    <FormControl>
                    <select onChange={(e) => setPopulation(e.currentTarget.value)}>
                                {populationChoices.map((item) => {
                                    return (
                                        <option key={Object.keys(item)[0]} value={Object.keys(item)[0]}>
                                            {Object.values(item)[0]}
                                        </option>
                                    );
                                })}
                    </select>
                    </FormControl>
                </Grid>
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

            : <LoadingOverlay />
    );
};

//@ts-ignore
const TopHitListItem = withStyles({ root: { paddingTop: 0, paddingLeft: 0 } })(ListItem);

export default connect((state: any) => ({
    endpoint: state.globalData.siteConfig.endpoint,
}))(GWASDatasetLZPlot);
