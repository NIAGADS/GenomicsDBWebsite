import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { makeStyles, createStyles, Theme } from "@material-ui/core";

import { RootState } from "wdk-client/Core/State/Types";

import { SiteSearch, SearchResult } from "@components/Tools";
import { buildRouteFromResult, buildSummaryRoute } from "genomics-client/util/util";
import { PanelProps, PrimaryBackgroundPanel } from "@components/MaterialUI";
import useHomePageStyles from "../styles";

import { useGoto } from "genomics-client/hooks";

const useTypographyStyles = makeStyles((theme: Theme) =>
    createStyles({
        heading: {
            fontSize: "3rem",
        },
        subheading: {
            fontSize: "2.5rem"
        },
        body: {
            fontSize: "1.5rem",
            fontFamily: '"Raleway", "Roboto", "Arial", "sans-serif"',
        },
    })
);

export const SearchPanel: React.FC<PanelProps> = ({ }) => {
    const goto = useGoto();
    const classes = useHomePageStyles();
    const tClasses = useTypographyStyles();
    const buildNumber = useSelector((state: RootState) => state.globalData?.config?.buildNumber);
    const [buildInfo, setBuildInfo] = useState(null);
    const [exampleVariant, setExampleVariant] = useState(null);

    useEffect(() => {
        buildInfo && buildInfo.build == 'GRCh38'
            ? setExampleVariant('19:44908684:T:C:rs429358')
            : setExampleVariant('19:45411941:T:C:rs429358');
    }, [buildInfo]);

    useEffect(() => {
        if (buildNumber) {
            setBuildInfo(JSON.parse(buildNumber));
        }
    }, [buildNumber]);

    return (
        <PrimaryBackgroundPanel classes={classes}>
            <Grid item container direction="column" spacing={6} xs={12} sm={10}>
                <Grid item>
                    <Box pt={3}>
                        <Typography variant="h3" className={`${classes.secondaryText} ${classes.bold} ${tClasses.heading}`}>
                            The NIAGADS
                        </Typography>
                    </Box>
                    <Typography variant="h2" className={`${classes.secondaryText} ${classes.bold} ${tClasses.subheading}`}>
                        Alzheimer's Genomics Database
                    </Typography>
                    <Typography variant="h5" className={`${classes.secondaryText} ${classes.bold}`}>
                        {buildInfo ? `(v. ${buildInfo.build})` : <CircularProgress color="secondary" />}
                    </Typography>
                    <Box pt={4}>
                        <Typography className={`${classes.darkContrastText} ${tClasses.body}`} variant="body2">
                            is an interactive knowledgebase for Alzheimer's disease
                            (AD) genetics. It provides a platform for data sharing, discovery, and analysis to help
                            advance the understanding of the complex genetic underpinnings of AD neurodegeneration and
                            accelerate the progress of research on AD and AD related dementias (ADRD).
                        </Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <SiteSearch
                        variant="panel"
                        onSelect={(value: SearchResult, searchTerm: string) =>
                            goto(
                                !value || value.type == "summary"
                                    ? buildSummaryRoute(searchTerm)
                                    : buildRouteFromResult(value)
                            )
                        }
                    />
                    <Box mt={1}>
                        <Typography variant="caption" className={classes.darkContrastText}>
                            Examples - Gene:{" "}
                            <RouterLink className={classes.secondaryLink} to={"record/gene/ENSG00000130203"}>
                                APOE
                            </RouterLink>{" "}
                            - Variant by RefSNP:{" "}
                            <RouterLink className={classes.secondaryLink} to="record/variant/rs6656401">
                                rs6656401
                            </RouterLink>{" "}
                            - Variant:{" "}
                            <RouterLink className={classes.secondaryLink} to={`record/variant/${exampleVariant}`}>
                                {exampleVariant}
                            </RouterLink>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </PrimaryBackgroundPanel>
    );
};
