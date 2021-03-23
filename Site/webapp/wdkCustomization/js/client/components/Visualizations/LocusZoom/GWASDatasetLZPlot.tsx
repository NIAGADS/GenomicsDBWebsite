import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import {
    Grid,
    List,
    ListItem,
    Box,
    Typography,
    withStyles,
    Select,
    MenuItem,
    FormHelperText
} from "@material-ui/core";
import { PrimaryExternalLink, PseudoLink, UnlabeledTextField } from "../../Shared";
import LZPlot from "./LZPlot";
import { get } from "lodash";
import { useWdkService } from "wdk-client/Hooks/WdkServiceHook";
import { LoadingOverlay } from "wdk-client/Components";

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
    ld_reference_variant: string;
}

const GWASDatasetLZPlot: React.FC<GWASDatasetLZPlotProps> = ({ dataset }) => {
    const [population, setPopulation] = useState<string>("EUR"),
        [topHits, setTopHits] = useState<TopHit[]>(),
        [refVariant, setRefVariant] = useState<string>(),
        [chromosome, setChromosome] = useState<string>(),
        [range, setRange] = useState<{ start: number; end: number }>();

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
        setRefVariant(hit.ld_reference_variant);
        setChromosome(hit.chromosome);
    };

    useWdkService(
        (service) =>
            service._fetchJson<TopHit[]>("get", `/dataset/gwas/top?track=${dataset}&flank`).then((res) => {
                setTopHits(res);
                loadTopHit(res[0]);
            }),
        []
    );

    return chromosome && refVariant && range ? (
        <Box className="locuszoom-plot">
            <Grid container spacing={2}>
                <Grid item container direction="column" spacing={1} sm={3}>
                    <Grid item>
                        <Select style={{fontSize:14.4, width:100}}
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
                    <Grid item>
                        <Typography>Top Hits</Typography>
                        <List style={{ maxHeight: 350, minWidth: 150, overflow: "auto" }}>
                            {(topHits || []).map((t) => (
                                //@ts-ignore
                                <TopHitListItem key={t.ld_reference_variant}>
                                    <PseudoLink onClick={() => loadTopHit(t)}>{t.hit}</PseudoLink>
                                </TopHitListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
                <Grid item direction="column">
                    <LZPlot
                        chromosome={chromosome}
                        end={get(range, "end")}
                        population={population}
                        refVariant={refVariant}
                        selectClass={selectClass.current}
                        start={get(range, "start")}
                        track={dataset}
                    />
                </Grid>
            </Grid>
        </Box>
    ) : (
        <LoadingOverlay />
    );
};

const TopHitListItem = withStyles({ root: { paddingTop: 0, paddingLeft: 0 } })(ListItem);

export default connect((state: any) => ({
    endpoint: state.globalData.siteConfig.endpoint,
}))(GWASDatasetLZPlot);
