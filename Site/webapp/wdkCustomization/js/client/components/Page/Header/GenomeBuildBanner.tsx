import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "wdk-client/Core/State/Types";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { CustomLink as Link} from "@components/MaterialUI"

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
                <Box component="span">
                    Looking for <Link className={classes.secondaryLink} href={buildInfo.alt_build_target}>{buildInfo.alt_build}</Link>?
                </Box>
            </Typography>
        </Box>
    ) : null;
};

export default GenomeBuildBanner;
