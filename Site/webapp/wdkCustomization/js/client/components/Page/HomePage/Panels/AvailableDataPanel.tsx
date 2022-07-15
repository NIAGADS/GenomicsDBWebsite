import React from "react";

import { useTheme, useMediaQuery } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

import { PanelProps, DefaultBackgroundPanel } from "@components/MaterialUI";
import { DatasetOverviewChart, DatasetReleases } from "../Cards";
import useHomePageStyles, { useTypographyStyles as useHomePageTypographyStyles } from "../styles";

import { _externalUrls } from "genomics-client/data/_externalUrls";
import { _siteStatistics } from "genomics-client/data/_siteStatistics";

export const AvailableDataPanel: React.FC<PanelProps> = ({ background = "light", webAppUrl }) => {
    const classes = useHomePageStyles();
    const tClasses = useHomePageTypographyStyles();
    const bodyTextColor = background === "dark" ? classes.darkContrastText : classes.lightContrastText;
    const headingTextColor = background === "dark" ? classes.secondaryText : classes.primaryText;
    const linkType = background === "dark" ? "secondary" : "initial";
    const bodyText = bodyTextColor + " " + tClasses.largeBody;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <DefaultBackgroundPanel classes={classes} hasBaseArrow={true}>
            <Grid item container direction="column" spacing={6} xs={12} sm={10}>
                <Grid item>
                    <Typography variant="h3" className={headingTextColor} align="center">
                        Available Datasets
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1" className={bodyText} align="left">
                        The NIAGADS Alzheimer's Genomics Database enables browsing, searching, and analysis of
                        <strong>{_siteStatistics.DATASETS}</strong> publicly available summary statistics from AD/ADRD
                        genome-wide association studies (GWAS) deposited at{" "}
                        <Link href={_externalUrls.NIAGADS_BASE_URL} color={linkType}>
                            NIAGADS
                        </Link>
                        .
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid
                        item
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="space-evenly"
                        spacing={isMobile ? 4 : 8}
                        id="grid-test"
                    >
                        <Grid item>
                            {/* <HtmlTooltip
                            arrow
                            title={
                                <React.Fragment>
                                    <Typography color="inherit">Find datasets</Typography>
                                    {"by AD/ADRD phenotype, ethnic group, sequencing project, and more."}
                                </React.Fragment>
                            }
                        >
                            <Button
                                aria-label="browse and search full dataset listing"
                                color="secondary"
                                variant="contained"
                                href={`${webAppUrl}/app/record/dataset/accessions`}
                                endIcon={<ArrowRightIcon />}
                            >
                                Browse All Datasets
                            </Button>
                        </HtmlTooltip>*/}
                            <DatasetOverviewChart classes={classes} />
                        </Grid>
                        <Grid item>
                            <Typography variant="h4" className={headingTextColor} align="center">
                                What's new?
                            </Typography>
                            <DatasetReleases classes={classes} webAppUrl={webAppUrl} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DefaultBackgroundPanel>
    );
};
