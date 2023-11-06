import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "wdk-client/Core/State/Types";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { CustomLink as Link, StyledTooltip as Tooltip } from "@components/MaterialUI";

const DISABLE_ALT_VERSION_LINK = false;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        label: {
            fontSize: "0.8rem",
            color: theme.palette.primary.contrastText,
        },
        currentBuild: {
            color: theme.palette.secondary.light,
            fontWeight: "bold",
        },
        altBuild: {
            color: theme.palette.grey[100],
            fontWeight: "bold",
        },
        disabled: {
            textDecoration: "underline",
            fontSize: "0.8rem",
            color: theme.palette.primary.contrastText,
        },
        banner: {
            //display: "flex",
            //justifyContent: "center",
            backgroundColor: theme.palette.primary.light,
        },
        secondaryLink: {
            color: theme.palette.secondary.main,
            "&:hover": {
                color: theme.palette.secondary.light,
            },
        },
    })
);

const GenomeBuildBanner: React.FC<any> = ({}) => {
    const buildNumber = useSelector((state: RootState) => state.globalData?.config?.buildNumber);
    const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);
    const classes = useStyles();

    const [buildInfo, setBuildInfo] = useState(null);

    useEffect(() => {
        if (buildNumber) {
            setBuildInfo(JSON.parse(buildNumber));
        }
    }, [buildNumber]);

    return buildInfo ? (
        <Box p={1} className={classes.banner} textAlign="center">
            <Typography className={classes.label}>
                <Box component="span" className={classes.currentBuild}>
                    v. {buildInfo.build}
                </Box>

                {" / "}
                {DISABLE_ALT_VERSION_LINK ? (
                    <Tooltip title={`The ${buildInfo.alt_build} site is being updated.  Please check back soon.`}>
                        <Box component="span">
                            Looking for{" "}
                            <Typography className={classes.disabled} component="span" color="secondary">
                                {" "}
                                {buildInfo.alt_build}
                            </Typography>
                        </Box>
                    </Tooltip>
                ) : (
                    <Box component="span">
                        Looking for{" "}
                        <Link style="secondary" target="_blank" href={buildInfo.alt_build_target}>
                            {buildInfo.alt_build}
                        </Link>
                    </Box>
                )}
            </Typography>
        </Box>
    ) : null;
};

export default GenomeBuildBanner;
