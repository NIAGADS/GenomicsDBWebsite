import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

import { PanelProps, DefaultBackgroundPanel } from "@components/MaterialUI";
import { _externalUrls } from "genomics-client/data/_externalUrls";
import { _siteStatistics } from "genomics-client/data/_siteStatistics";

import useHomePageStyles from "../styles";

export const AboutPanel: React.FC<PanelProps> = ({ background = "light", webAppUrl }) => {
    const classes = useHomePageStyles();
    const bodyTextColor = background === "dark" ? classes.darkContrastText : classes.lightContrastText;
    const headingTextColor = background === "dark" ? classes.secondaryText : classes.primaryText;
    const linkType = background === "dark" ? classes.darkBgLink : classes.lightBgLink;
    const bodyText = bodyTextColor + " " + classes.largeBody;
    
    return (
        <DefaultBackgroundPanel classes={classes} hasBaseArrow={false}>
            <Grid item container direction="column" spacing={6} xs={12} sm={10}>
                <Grid item>
                    <Typography variant="h3" className={headingTextColor} align="center">
                        About the Project
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography variant="body1" className={bodyText} align="left">
                        The NIAGADS Alzheimer's Genomics Database is developed by a team of researchers at the
                        University of Pennsylvania as part of the{" "}
                        <Link className={linkType} href={_externalUrls.NIAGADS_BASE_URL}>
                            National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site
                        </Link>{" "}
                        (NIAGADS), a national genetics repository created by NIA to facilitate access to genotypic data
                        for the study of the genetics of late-onset Alzheimer's disease. We welcome the involvement of
                        interested researchers.{" "}
                        <Link className={linkType} href={`${_externalUrls.NIAGADS_BASE_URL}/data`}>
                            Click here to learn more
                        </Link>{" "}
                        about contributing data or making formal data access requests. Or{" "}
                        <Link className={linkType} href={`${_externalUrls.NIAGADS_BASE_URL}/contact`}>
                            contact us
                        </Link>{" "}
                        for more information. The GenomicsDB is a collaboration among the following organizations which
                        may also provide funding or governance:
                    </Typography>
                </Grid>

                <Grid item>
                    <Grid container item spacing={4} direction="row" justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <img width="210" src={`${webAppUrl}/images/home/nih-logo.svg`} />
                        </Grid>
                        <Grid item>
                            <img width="145px" src={`${webAppUrl}/images/home/adsp-logo.svg`} />
                        </Grid>
                        <Grid item>
                            <img width="210px" src={`${webAppUrl}/images/home/psom_logo_blue.png`} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DefaultBackgroundPanel>
    );
};
