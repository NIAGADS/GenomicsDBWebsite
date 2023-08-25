import React from "react";

import { useTheme, useMediaQuery, CardHeader, CardMedia, CardContent, GridListTile } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { CustomLink as Link } from "@components/MaterialUI";

import { PanelProps, DefaultBackgroundPanel, LightBackgroundPanel } from "@components/MaterialUI";
import { DatasetOverviewChart, DatasetReleases } from "../Cards";
import useHomePageStyles, { useCardStyles, useTypographyStyles as useHomePageTypographyStyles } from "../styles";

import { _externalUrls } from "genomics-client/data/_externalUrls";

export const TutorialPanel: React.FC<PanelProps> = ({ background = "light", webAppUrl, projectId }) => {
    const classes = useHomePageStyles();
    const tClasses = useHomePageTypographyStyles();
    const cClasses = useCardStyles();
    const bodyTextColor = background === "dark" ? classes.darkContrastText : classes.lightContrastText;
    const headingTextColor = background === "dark" ? classes.secondaryText : classes.primaryText;
    const linkType = background === "dark" ? "secondary" : "initial";
    const bodyText = bodyTextColor + " " + tClasses.largeBody;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    // <DefaultBackgroundPanel classes={classes} hasBaseArrow={true}></DefaultBackgroundPanel>
    return (
        <LightBackgroundPanel classes={classes} hasBaseArrow={true}>
            <Grid item container direction="column" spacing={6} xs={12} sm={10}>
                <Grid item>
                    <Typography variant="h3" className={headingTextColor} align="center">
                        Tutorials
                    </Typography>
                </Grid>

                <Grid item container direction="row" spacing={8}>
                    <Grid item>
                        <Card className={cClasses.card} elevation={0} variant="outlined">
                            <CardContent className={cClasses.label}>
                                <Typography variant="body1">
                                    Introduction to the NIAGADS Alzheimer's Genomics Database
                                </Typography>
                            </CardContent>
                            <CardMedia
                                className={cClasses.media}
                                component="iframe"
                                allow="fullscreen"
                                src="https://www.youtube.com/embed/vfs11w4-u_Q"
                            ></CardMedia>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card className={cClasses.card} elevation={0} variant="outlined">
                            <CardContent className={cClasses.label}>
                                <Typography>Navigating the Gene Report</Typography>
                            </CardContent>
                            <CardMedia
                                className={cClasses.media}
                                component="iframe"
                                allow="fullscreen"
                                src="https://www.youtube.com/embed/y_wemO6kHoU"
                            ></CardMedia>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card className={cClasses.card} elevation={0} variant="outlined">
                            <CardContent className={cClasses.label}>
                                <Typography>Navigating the NIAGADS Genome Browser</Typography>
                            </CardContent>
                            <CardMedia
                                className={cClasses.media}
                                component="iframe"
                                allow="fullscreen"
                                src="https://www.youtube.com/embed/h6ImfJwByyU"
                            ></CardMedia>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card className={cClasses.card} elevation={0}>
                            <CardContent>
                                <Typography variant="body1">
                                    New Tutorials will be added periodically.{" "}
                                    <Link href="https://www.youtube.com/playlist?list=PLkQb0-TdWhp-TQzZmwAuFyXYpDumwYGsF">
                                        Browse the full the playlist
                                    </Link>{" "}
                                    on YouTube.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </LightBackgroundPanel>
    );
};
