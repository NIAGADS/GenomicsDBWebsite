import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import GetAppIcon from "@material-ui/icons/GetApp";

import { LabeledBooleanAttribute, TrackAttributesList } from "@components/Record/Attributes";
import { useHeadingStyles, RecordHeader, SummaryPlotHeader } from "@components/Record/RecordHeader";
import { RecordHeading } from "@components/Record/Types";

import { RootState } from "wdk-client/Core/State/Types";

import { useTypographyStyles, CustomLink as Link } from "@components/MaterialUI";

import { convertHtmlEntites } from "genomics-client/util/util";

import { PlotlyManhattan } from "@viz/Manhattan";

interface HeaderImage {
    src: string;
    type?: string;
}

const ManhattanThumbnails: React.FC<HeaderImage> = ({ src, type }) => {
    const classes = useHeadingStyles();
    const enclosingGrid = useRef(0);

    const handleImgError = () => {
        (document.getElementsByClassName(classes.thumbnails)[0] as HTMLElement).style.display = "none";
    };

    return (
        <Grid item container direction="column" className={classes.thumbnails}>
            <Grid item>
                <img className={classes.thumbnails} src={src} onError={handleImgError} />
            </Grid>
            <Grid>
                <Link color="initial" href={src}>
                    Download HighRes Image <GetAppIcon fontSize="small" />
                </Link>
            </Grid>
        </Grid>
    );
};

const TrackRecordSummary: React.FC<RecordHeading> = ({ record, recordClass, headerActions, categoryTree }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);

    const classes = useHeadingStyles();
    const tClasses = useTypographyStyles();

    let imgLink = `${webAppUrl}/files/${record.attributes.niagads_accession}/png/${record.id[0].value}`;

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

    const renderSummary = (
        <Box>
            <Typography>{attributes.description}</Typography>
            <TrackAttributesList record={record} />
        </Box>
    );

    const renderPlotHelp = (
        <Box>
            <Box>
                <Typography variant="caption">
                    Interactive manhattan plot illustrating variant risk-associations.
                </Typography>
                <Typography variant="caption">
                    Mouse over indivdiual points to view information on the variant, including the observed p-value and
                    predicted gene impacts.
                </Typography>
            </Box>
            <Box mt={2}>
                <Typography variant="caption">
                    <span className="red">Red</span> points indicate variants found to have significant genome-wide
                    risk-association (p ≤ 5e<sup>-8</sup>).
                </Typography>
                <Typography variant="caption">
                    <span className="blue">Blue</span> points indicate variants found to have significant
                    risk-association (5e<sup>-8</sup> &lt; p ≤ 1e<sup>-6</sup>).
                </Typography>
            </Box>
            <Box mt={2}>
                <Typography variant="caption">
                    To improve rendering the interactive plots are filtered to remove variants with p-values &gt; 0.001
                    and are capped at 1e<sup>-50</sup>.
                </Typography>
                <Typography variant="caption">
                    In the interactive plot, chromosome 23 = chromosome X; chromosome 24 = chromosome Y.
                </Typography>
            </Box>
        </Box>
    );

    const renderImage = (
        <Box mt={4} style={{ width: "100%" }}>
            <SummaryPlotHeader
                text={`Manhattan plot providing an overview of association results for variants in this genome-wide association study`}
                anchor="#top_variants"
                help={renderPlotHelp}
            />

            <PlotlyManhattan
                track={record.id[0].value}
                accession={record.attributes.niagads_accession.toString()}
                webAppUrl={webAppUrl}
            />
        </Box>
    );

    return (
        <RecordHeader
            categoryTree={categoryTree}
            recordClass={recordClass}
            title={renderTitle}
            summary={renderSummary}
            image={renderImage}
        />
    );
};

export default TrackRecordSummary;
