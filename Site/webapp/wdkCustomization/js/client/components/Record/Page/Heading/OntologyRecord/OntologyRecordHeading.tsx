import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";

import { RecordHeading } from "../RecordHeadingTypes";
import { BaseText, BaseTextSmall, CustomPanel, DarkSecondaryExternalLink, withTooltip } from "../../../../MaterialUI";
import { _externalUrls } from "../../../../../data/_externalUrls";

import "./OntologyRecordHeading.scss";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        panel: {
            background: "transparent",
            position: "relative",
            top: "10px",
            paddingLeft: "50px",
        },
        infoBlock: {
            borderColor: theme.palette.info.main,
            borderStyle: "solid",
            borderWidth: "1px",
            borderRadius: "12px",
        },
        infoText: {
            color: theme.palette.info.dark,
            fontSize: "0.9rem",
        },
    })
);

const OntologyRecordSummary: React.FC<RecordHeading> = (props) => {
    const classes = useStyles();
    const { record, headerActions, recordClass } = props,
        { attributes } = record;

    return (
        <CustomPanel hasBaseArrow={false} className={classes.panel} alignItems="flex-start">
            <Grid item container direction="column" sm={6}>
                <Grid item>
                    <Typography variant="h3">
                        <strong>{record.attributes.name}</strong>
                    </Typography>
                </Grid>
                <Grid item>
                    <BaseText>{record.attributes.description}</BaseText>
                </Grid>
            </Grid>
            <Grid item container xs={12} sm={4}>
                <Grid item>
                    <Box className={classes.infoBlock} p={2}>
                        <InfoIcon className={classes.infoText} />{" "}
                        <Typography component="span" variant="body1" className={classes.infoText}>
                            Unable to find a term in the data dictionary that accurately describes your experimental
                            design, assay, or clinical, biospecimen, or genomic metadata?
                        </Typography>{" "}
                        <Box mt={2}>
                            <Typography variant="body1">
                                Visit our{" "}
                                {withTooltip(
                                    <DarkSecondaryExternalLink href="#">
                                        ontology lookup service (OLS)
                                    </DarkSecondaryExternalLink>,
                                    "Coming Soon"
                                )}
                                {" "}to search across all ontologies used to annotate NIAGADS resources.
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </CustomPanel>
    );
};

export default OntologyRecordSummary;
