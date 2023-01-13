import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { CustomLink as Link } from "@components/MaterialUI";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import GetAppIcon from "@material-ui/icons/GetApp";

import { LabeledBooleanAttribute, TrackAttributesList } from "@components/Record/Attributes";
import { useHeadingStyles, RecordHeader } from "@components/Record/RecordHeader";
import { RecordHeading } from "@components/Record/Types";

import { RootState } from "wdk-client/Core/State/Types";
import { makeClassNameHelper } from "wdk-client/Utils/ComponentUtils";

import { useTypographyStyles } from "@components/MaterialUI";

import { convertHtmlEntites } from "genomics-client/util/util";

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

    const { attributes } = record;

    const renderTitle = (
        <Box pb={1}>
            <Typography variant="h5">
                <strong>{convertHtmlEntites(attributes.name.toString())}</strong>
            </Typography>
            <Typography variant="caption">{attributes.attribution}</Typography>
            {record.attributes.is_adsp && (
                <LabeledBooleanAttribute value={record.attributes.is_adsp.toString()} label="ADSP" className="red" />
            )}
        </Box>
    );

    const renderSummary = <TrackAttributesList record={record} />;

    const renderPlotHelp = (
        <Box>
            <Typography variant="caption">TBD</Typography>
        </Box>
    );

    const renderImage = (
        <PlotlyManhattan
            track={record.id[0].value}
            accession={record.attributes.niagads_accession.toString()}
            webAppUrl={webAppUrl}
        />
    );

    return <RecordHeader title={renderTitle} summary={renderSummary} image={renderImage} />;
};

export default TrackRecordSummary;
