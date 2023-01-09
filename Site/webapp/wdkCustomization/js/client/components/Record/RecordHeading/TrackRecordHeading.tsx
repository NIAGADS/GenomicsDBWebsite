import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { CustomLink as Link } from "@components/MaterialUI";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import GetAppIcon from "@material-ui/icons/GetApp";

import {
    LabeledAttributeItem as RecordAttributeItem,
    LabeledBooleanAttribute,
    LinkAttributeList,
} from "@components/Record/Attributes";

import { useHeadingStyles } from "@components/Record/RecordHeading/styles";
import { RecordHeading } from "@components/Record/Types";

import { RootState } from "wdk-client/Core/State/Types";
import { makeClassNameHelper } from "wdk-client/Utils/ComponentUtils";

import { CustomPanel, StyledTooltip as Tooltip } from "@components/MaterialUI";
import { useTypographyStyles } from "@components/MaterialUI";

import { convertHtmlEntites } from "genomics-client/util/util";
import { _externalUrls } from "genomics-client/data/_externalUrls";

import { PlotlyManhattan } from "@viz/Manhattan";

//import { GWASDatasetLZPlot } from "@viz/LocusZoom";

import "./TrackRecordHeading.scss";
import Box from "@material-ui/core/Box";

interface HeaderImage {
    src: string;
    type?: string;
}

const cx = makeClassNameHelper("gwas-RecordHeading");

const DatasetHeaderImage: React.FC<HeaderImage> = ({ src, type }) => {
    const enclosingGrid = useRef(0);

    const wrapperClass = cx(`--${type}-wrapper`);

    const handleImgError = () => {
        (document.getElementsByClassName(wrapperClass)[0] as HTMLElement).style.display = "none";
    };

    return (
        <Grid item container direction="column" className={wrapperClass}>
            <Grid item>
                <img className={cx(`--${type}`)} src={src} onError={handleImgError} />
            </Grid>
            <Grid>
                <Link color="initial" href={src}>
                    View HighRes Image <GetAppIcon fontSize="small" />
                </Link>
            </Grid>
        </Grid>
    );
};

const TrackRecordSummary: React.FC<RecordHeading> = ({ record, recordClass, headerActions }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);

    const classes = useHeadingStyles();
    const tClasses = useTypographyStyles();

    let imgPrefix = `${webAppUrl}/images/manhattan/${record.attributes.niagads_accession}/png/${record.id[0].value}`;

    return (
        <CustomPanel
            hasBaseArrow={false}
            className={classes.panel}
            alignItems="flex-start"
            justifyContent="space-between"
        >
            <Grid item container direction="row" spacing={5}>
                <Grid item container direction="column" sm={3} xs={12}>
                    {/* <RecordHeaderActions record={record} recordClass={recordClass} headerActions={headerActions} /> */}
                    <Typography variant="h5">{convertHtmlEntites(record.attributes.name.toString())}</Typography>
                    <Typography>{record.attributes.attribution}</Typography>
                    <Typography>{record.attributes.description}</Typography>

                    {record.attributes.is_adsp && (
                        <LabeledBooleanAttribute
                            value={record.attributes.is_adsp.toString()}
                            label="ADSP"
                            className="red"
                        />
                    )}

                    <List>
                        <ListItem>
                            <RecordAttributeItem
                                label="Accession"
                                children={
                                    <Box component="span">
                                        {record.attributes.niagads_accession}{" "}
                                        <Link
                                            href={`${_externalUrls.NIAGADS_BASE_URL}/datasets/${record.attributes.niagads_accession}`}
                                        >
                                            <i className={`${tClasses.small} fa fa-external-link`}></i>
                                        </Link>
                                    </Box>
                                }
                                tooltip="View NIAGADS Accession / Request Access to full summary statistics"
                            ></RecordAttributeItem>
                        </ListItem>
                        {record.attributes.related_tracks && (
                            <ListItem>
                                <RecordAttributeItem
                                    label="Related Tracks"
                                    children={
                                        <LinkAttributeList
                                            value={record.attributes.related_tracks.toString()}
                                            asString={true}
                                        />
                                    }
                                />
                            </ListItem>
                        )}
                    </List>

                    <DatasetHeaderImage src={`${imgPrefix}-manhattan.png`} type={"standard-manhattan"} />
                </Grid>
                <Grid item sm={6} xs={12}>
                    <PlotlyManhattan
                        track={record.id[0].value}
                        accession={record.attributes.niagads_accession.toString()}
                        webAppUrl={webAppUrl}
                    />
                </Grid>
                {/* <Grid item sm={6} xs={12}>
                    <GWASDatasetLZPlot dataset={record.id[0].value} /> 
                    </Grid>*/}
            </Grid>
        </CustomPanel>
    );
};

export default TrackRecordSummary;
