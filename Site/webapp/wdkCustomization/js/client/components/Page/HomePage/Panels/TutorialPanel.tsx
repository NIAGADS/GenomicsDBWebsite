import React from "react";

import { useTheme, useMediaQuery, CardHeader, CardMedia, CardContent, GridListTile } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { CustomLink as Link } from "@components/MaterialUI";

import { PanelProps, DefaultBackgroundPanel } from "@components/MaterialUI";
import { DatasetOverviewChart, DatasetReleases } from "../Cards";
import useHomePageStyles, { useTypographyStyles as useHomePageTypographyStyles } from "../styles";

import { _externalUrls } from "genomics-client/data/_externalUrls";

export const TutorialPanel: React.FC<PanelProps> = ({ background = "light", webAppUrl, projectId }) => {
    const classes = useHomePageStyles();
    const tClasses = useHomePageTypographyStyles();
    const bodyTextColor = background === "dark" ? classes.darkContrastText : classes.lightContrastText;
    const headingTextColor = background === "dark" ? classes.secondaryText : classes.primaryText;
    const linkType = background === "dark" ? "secondary" : "initial";
    const bodyText = bodyTextColor + " " + tClasses.largeBody;
    //@ts-ignore

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <DefaultBackgroundPanel classes={classes} hasBaseArrow={true}>
            <Grid item container direction="column" spacing={6} xs={12} sm={10}>
                <Grid item>
                    <Typography variant="h3" className={headingTextColor} align="center">
                        Tutorials
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1" className={bodyText} align="left">
                        New Exercises and Tutorials will be added periodically. Visit this section or the site
                        documentation to explore new training material.
                    </Typography>
                </Grid>
                <Grid item>
                    <GridList cols={3} spacing={6} style={{ width: 600, height: 1000 }}>
                        <GridListTile>
                            <Card variant="outlined">
                                <CardMedia
                                    component="iframe"
                                    src="https://www.youtube.com/embed/vfs11w4-u_Q"
                                ></CardMedia>
                                <CardContent>
                                    <Typography>Introduction to the NIAGADS Alzheimer's Genomics Database</Typography>
                                </CardContent>
                            </Card>
                        </GridListTile>
                        <GridListTile>
                            <Card variant="outlined">
                                <CardMedia
                                    component="iframe"
                                    src="https://www.youtube.com/embed/y_wemO6kHoU"
                                ></CardMedia>
                                <CardContent>
                                    <Typography>Navigating the Gene Report</Typography>
                                </CardContent>
                            </Card>
                        </GridListTile>
                        <GridListTile>
                            <Card variant="outlined">
                                <CardMedia
                                    component="iframe"
                                    src="https://www.youtube.com/embed/h6ImfJwByyU"
                                ></CardMedia>
                                <CardContent>
                                    <Typography>Navigating the NIAGADS Genome Browser</Typography>
                                </CardContent>
                            </Card>
                        </GridListTile>
                    </GridList>
                </Grid>
            </Grid>
        </DefaultBackgroundPanel>
    );
};
