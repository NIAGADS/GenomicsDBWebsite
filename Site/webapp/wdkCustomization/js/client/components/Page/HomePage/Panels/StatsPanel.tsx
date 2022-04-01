import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

import { PanelProps, LightBackgroundPanel } from "@components/MaterialUI";
import useHomePageStyles from "../styles";

import { _externalUrls } from "genomics-client/data/_externalUrls";
import { _siteStatistics } from "genomics-client/data/_siteStatistics";
import { abbreviateLargeNumber } from "genomics-client/util/util";



export const StatsPanel: React.FC<PanelProps> = ({ background = "light" }) => {
    const classes = useHomePageStyles();
    const bodyTextColor = background === "dark" ? classes.darkContrastText : classes.lightContrastText;
    const headingTextColor = background === "dark" ? classes.secondaryText : classes.primaryText;
    const linkType = background === "dark" ? "secondary" : "initial";
    const bodyText = bodyTextColor + " " + classes.largeBody;

    return (
        <LightBackgroundPanel classes={classes} hasBaseArrow={true}>
            <Grid item container direction="column" spacing={6} xs={12} sm={10}>
                <Grid item>
                    <Typography variant="h3" className={headingTextColor} align="center">
                        Explore AD/ADRD Genetic Evidence for AD/ADRD
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid item container direction="row" alignItems="center" justifyContent="space-evenly" spacing={4}>
                        <Grid item>
                            <Typography variant="body1" className={bodyText} align="left">
                                For each dataset we provide a detailed interactive report summarizing the top
                                risk-associated variants. These variants are are annotated using the ADSP Annotation
                                Pipeline (PMID:{" "}
                                <Link color={linkType} href={`${_externalUrls.PUBMED_URL}/29590295`}>
                                    29590295
                                </Link>
                                ) and mapped against sequence features and functional genomics data tracks to help
                                researchers explore the potential impact of risk-associated variants in a broader
                                genomics context.
                            </Typography>
                        </Grid>
                        <Grid item /*alignItems="center" justifyContent="center" spacing={6}*/>
                            <Typography
                                align="left"
                                variant="h3"
                                className={`${classes.secondaryText} ${classes.bold} ${classes.smallCaps}`}
                            >
                                {abbreviateLargeNumber(_siteStatistics.ANNOTATED_VARIANTS, 2)} Annotated Variants
                            </Typography>
                            <Typography align="left" className={`${classes.highlightStat} ${classes.smallCaps}`}>
                                29M from the ADSP
                            </Typography>
                            <Typography align="left" className={`${classes.highlightStat} ${classes.smallCaps}`}>
                                {abbreviateLargeNumber(_siteStatistics.SIGNIFICANT_VARIANTS, 2)} with significant
                                AD/ADRD-risk association
                            </Typography>
                            <Typography align="left" className={`${classes.highlightStat} ${classes.smallCaps}`}>
                                {abbreviateLargeNumber(_siteStatistics.ANNOTATED_GENES, 2)} Annotated Genes
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </LightBackgroundPanel>
    );
};
