import React, { useState, useRef, useEffect } from "react";
import { get } from "lodash";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import { withStyles } from "@material-ui/core";

import { useWdkService } from "wdk-client/Hooks/WdkServiceHook";
import { LoadingOverlay } from "wdk-client/Components";

import { UnlabeledTextField } from "@components/MaterialUI";
import { LocusZoomPlot } from "@viz/LocusZoom";
import { useWdkEffect } from "wdk-client/Service/WdkService";
import { setLoadingIdList } from "wdk-client/Actions/DatasetParamActions";


interface GWASDatasetLZPlotProps {
    dataset: string;
}

interface TopHit {
    end: number;
    hit: string;
    start: number;
    chromosome: string;
    feature_type: string;
    neg_log10_pvalue: number;
    variant: string;
}

export const GWASDatasetLZPlot: React.FC<GWASDatasetLZPlotProps> = ({ dataset }) => {
    const [population, setPopulation] = useState<string>("EUR"),
        [topHits, setTopHits] = useState<TopHit[]>(),
        [variant, setVariant] = useState<string>(),
        [chromosome, setChromosome] = useState<string>(),
        [range, setRange] = useState<{ start: number; end: number }>(),
        [loading, setLoading] = useState(true);

    const populationChoices = [
        { EUR: "EUR: European" },
        { AFR: "AFR: African/African American" },
        { AMR: "AMR: Ad Mixed American" },
        { EAS: "EAS: East Asian" },
        { SAS: "SAS: South Asian" },
    ];

    const selectClass = useRef(Math.random().toString(32).slice(2).replace(/\d/g, ""));

    const loadTopHit = (hit: TopHit) => {
        setRange({ start: hit.start, end: hit.end });
        setVariant(hit.variant);
        setChromosome(hit.chromosome);
        setLoading(false);
    };

    /* useEffect(() => {
        if (topHits) {setLoading(false)};
    }, []); */


    useWdkService(
        (service) =>
            service._fetchJson<TopHit[]>("get", `/dataset/gwas/top?track=${dataset}&flank`).then((res) => {
                setTopHits(res);
                loadTopHit(res[0]);
            }),
        []
    );

    return (!loading && variant) ? (
        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
            {console.log(loading)}
            {/* outer */}
            <Grid container item direction="column" xs={3}>
                {/* left col -- selectors */}
                <Grid item>
                    {/* top row -- population selector */}
                    <Select
                        style={{ fontSize: 14.4, width: 100 }}
                        value={population}
                        onChange={(e) => setPopulation(e.target.value as string)}
                        input={<UnlabeledTextField fullWidth={true} />}
                    >
                        {populationChoices.map((item) => {
                            return (
                                <MenuItem key={Object.keys(item)[0]} value={Object.keys(item)[0]}>
                                    {Object.values(item)[0]}
                                </MenuItem>
                            );
                        })}
                    </Select>
                    <FormHelperText>Select a LD population</FormHelperText>
                </Grid>

                <Grid item xs={6}>
                    {/* bottom row - top hits selector */}
                    <Typography>Top Hits</Typography>
                    <List style={{ maxHeight: 350, minWidth: 150, overflow: "auto" }}>
                        {(topHits || []).map((t:TopHit) => (
                            //@ts-ignore
                            <TopHitListItem key={t.variant}>
                                <Button variant="text" onClick={() => loadTopHit(t)}>
                                    {t.hit}
                                </Button>
                            </TopHitListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
            <Grid item>
                {/* right col - plot */}
                <LocusZoomPlot
                    population={population}
                    variant={variant}
                    selectClass={selectClass.current}
                    track={dataset}
                />
            </Grid>
        </Grid>
    ) : (
       // <LoadingOverlay /> 
       null
    );
};

const TopHitListItem = withStyles({ root: { paddingTop: 0, paddingLeft: 0 } })(ListItem);
