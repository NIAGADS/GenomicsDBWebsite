import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { RootState } from "wdk-client/Core/State/Types";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles({
    label: {
        fontWeight: 600,
        flex: 1,
    },
    rightAlignedBox: {
        display: "flex",
        justifyContent: "flex-end",
    },
});

const GenomeBuildBanner: React.FC<any> = ({}) => {
    const buildNumber = useSelector((state: RootState) => state.globalData?.config?.buildNumber);
    const classes = useStyles();
    return (
        <Box p={3} className={classes.rightAlignedBox}>
            <Typography variant="h5" className={classes.label}>
                Reference Genome Build: {buildNumber}
            </Typography>
        </Box>
    );
};

export default GenomeBuildBanner;
