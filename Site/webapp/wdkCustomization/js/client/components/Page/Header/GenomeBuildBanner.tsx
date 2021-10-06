import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { RootState } from "wdk-client/Core/State/Types";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        label: {
            fontSize: "0.8rem",
            color: theme.palette.primary.contrastText,
        },
        currentBuild: {
            color: theme.palette.secondary.light,
            fontWeight: "bold"
        },
        banner: {
            //display: "flex",
            //justifyContent: "center",
            backgroundColor: theme.palette.primary.light,
        },
    })
);

const GenomeBuildBanner: React.FC<any> = ({}) => {
    const buildNumber = useSelector((state: RootState) => state.globalData?.config?.buildNumber);
    const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);
    const classes = useStyles();
    return (
        <Box p={1} className={classes.banner} textAlign="center">
            <Typography className={classes.label}>
                <Box component="span" className={classes.currentBuild}>v. {buildNumber}</Box>
                {" "}
                {projectId === "GRCh37"
                    ? '/ v. GRCh38 Coming Soon.'
                    : `{/ Looking for <a href="${webAppUrl}">GRCh37</a>?}`}
            </Typography>
        </Box>
    );
};

export default GenomeBuildBanner;
