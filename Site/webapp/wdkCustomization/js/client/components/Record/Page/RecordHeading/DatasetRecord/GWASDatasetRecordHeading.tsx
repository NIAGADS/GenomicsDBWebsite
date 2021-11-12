import React, { useCallback, useState, useRef } from "react";
import { connect } from "react-redux";
import { RecordAttributeItem } from "../Shared";
import { RecordHeading } from "../RecordHeadingTypes";
import { resolveJsonInput } from "genomics-client/util/jsonParse";
import { convertHtmlEntites } from "genomics-client/util/util";

import { makeClassNameHelper } from "wdk-client/Utils/ComponentUtils";

import GWASDatasetLZPlot from "@viz/LocusZoom/GWASDatasetLZPlot";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import GetAppIcon from "@material-ui/icons/GetApp";

import { PrimaryExternalLink } from "@components/MaterialUI";
import { _externalUrls } from "genomics-client/data/_externalUrls";

import "./GWASDatasetRecordHeading.scss";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";

const cx = makeClassNameHelper("gwas-RecordHeading");
interface HeaderImage {
    src: string;
    type?: string;
}

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
                <PrimaryExternalLink href={src}>
                    View HighRes Image <GetAppIcon fontSize="small" />
                </PrimaryExternalLink>
            </Grid>
        </Grid>
    );
};

const GWASDatasetRecordSummary: React.FC<RecordHeading> = ({ record, recordClass, headerActions, webAppUrl }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    let imgPrefix = `${webAppUrl}/images/manhattan/${record.attributes.niagads_accession}/png/${record.id[0].value}`;

    return (
        <Grid container style={{ marginLeft: "10px" }}>
            <Grid item container direction="row" spacing={5}>
                <Grid item container direction="column" sm={3} xs={12}>
                    {/* <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} /> */}
                    <Typography variant="h5">{convertHtmlEntites(record.attributes.name.toString())}</Typography>
                    <Typography>{record.attributes.attribution}</Typography>
                    <List>
                        <ListItem>
                            <RecordAttributeItem
                                label="Accession:"
                                attribute={record.attributes.niagads_accession.toString()}
                            />
                        </ListItem>
                        <ListItem>
                            <Typography>{record.attributes.description}</Typography>
                        </ListItem>
                    </List>
                    {record.attributes.is_adsp && (
                        <Typography>
                            <strong>&nbsp;{resolveJsonInput(record.attributes.is_adsp.toString())}</strong>
                        </Typography>
                    )}
                </Grid>
                <Grid item sm={6} xs={12}>
                    {/*<DatasetHeaderImage src={`${imgPrefix}-cmanhattan.png`} type={"circular-manhattan"} />*/}
                    <DatasetHeaderImage src={`${imgPrefix}-manhattan.png`} type={"standard-manhattan"} />
                </Grid>
            </Grid>

            {/*<Grid item container direction="row">
                <CollapsibleSection
                    id="locuszoom-section"
                    className="wdk-RecordTableContainer"
                    headerComponent="h3"
                    headerContent={
                        <Box display="flex" justifyContent="space-between" alignItems="baseline">
                            <BaseText>Browse Top Loci</BaseText>
                            <HelpIcon>
                                Use this interactive LocusZoom plot to browse genomic loci associated with the variants
                                exhibiting the most genome-wide significance in this study.
                            </HelpIcon>
                        </Box>
                    }
                    isCollapsed={isCollapsed}
                    onCollapsedChange={setIsCollapsed}
                >
                    <GWASDatasetLZPlot dataset={record.id[0].value} />
                </CollapsibleSection>
                </Grid> */}
        </Grid>
    );
};

export default connect((state: any) => ({
    webAppUrl: state.globalData.siteConfig.webAppUrl,
}))(GWASDatasetRecordSummary);
