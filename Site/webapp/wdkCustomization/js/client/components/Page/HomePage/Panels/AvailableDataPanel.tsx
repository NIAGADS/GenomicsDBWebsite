import React from "react";

import { Breakpoint, BreakpointProvider } from "react-socks";

import { useTheme, useMediaQuery } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Button from "@material-ui/core/Button";

import { HtmlTooltip } from "../../../MaterialUI";

import { PanelProps, DatasetOverviewChart } from ".";

import { _externalUrls } from "../../../../data/_externalUrls";
import { _siteStatistics } from "../../../../data/_siteStatistics";

export const AvailableDataPanel: React.FC<PanelProps> = ({ classes, background = "light", webAppUrl }) => {
    const bodyTextColor = background === "dark" ? classes.darkContrastText : classes.lightContrastText;
    const headingTextColor = background === "dark" ? classes.headingSecondary : classes.headingPrimary;
    const linkType = background === "dark" ? classes.darkBgLink : classes.lightBgLink;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Grid item container direction="column" spacing={6} xs={12} sm={10} md={6}>
            <Grid item>
                <Typography variant="h3" className={headingTextColor} align="center">
                    Available Datasets
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1" className={bodyTextColor} align="left">
                    The NIAGADS Alzheimer's Genomics Database enables browsing, searching, and analysis of
                    <strong>{_siteStatistics.DATASETS}</strong> publicly available summary statistics from AD/ADRD
                    genome-wide association studies (GWAS) deposited at{" "}
                    <Link href={_externalUrls.NIAGADS_BASE_URL} className={linkType}>
                        NIAGADS
                    </Link>
                    .
                </Typography>
            </Grid>
            <Grid item container justifyContent="center">
                <Grid item container direction="row" alignItems="center" justifyContent="center" spacing={isMobile ? 2 : 10}>
                    <Grid item>
                        <DatasetOverviewChart classes={classes} />
                    </Grid>
                    <Grid item>
                        <HtmlTooltip
                            arrow
                            title={
                                <React.Fragment>
                                    <Typography color="inherit">Find datasets</Typography>
                                    {"by AD/ADRD phenotype, ethnic group, sequencing project, and more."}
                                </React.Fragment>
                            }
                        >
                            <Button
                                aria-label="discover datasets"
                                className={classes.largeButton}
                                color="secondary"
                                variant="contained"
                                href={`${webAppUrl}/app/record/dataset/accessions`}
                                endIcon={<ArrowRightIcon />}
                            >
                                Discover Datasets
                            </Button>
                        </HtmlTooltip>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
