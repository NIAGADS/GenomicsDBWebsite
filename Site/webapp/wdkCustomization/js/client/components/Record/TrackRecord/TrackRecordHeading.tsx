import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import GetAppIcon from "@material-ui/icons/GetApp";

import { HeaderRecordActions, useHeadingStyles, RecordAttributeItem } from "../RecordHeading";
import { RecordHeading } from "../Types";

import { RootState } from "wdk-client/Core/State/Types";
import { makeClassNameHelper } from "wdk-client/Utils/ComponentUtils";

import { CustomPanel, withTooltip } from "@components/MaterialUI";
import { useTypographyStyles } from "@components/MaterialUI";

import { convertHtmlEntites } from "genomics-client/util/util";
import { resolveJsonInput } from "genomics-client/util/jsonParse";

import { GWASDatasetLZPlot } from "@viz/LocusZoom";

import "./TrackRecordHeading.scss";

/*



import Grid from "@material-ui/core/Grid";

import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";


import { UnpaddedListItem as ListItem } from "@components/MaterialUI";
import { _externalUrls } from "genomics-client/data/_externalUrls";



 */
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
                    {/* <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} /> */}
                    <Typography variant="h5">{convertHtmlEntites(record.attributes.name.toString())}</Typography>
                    <Typography>{record.attributes.attribution}</Typography>
                    <List>
                        <ListItem>
                            <RecordAttributeItem
                                label="Accession"
                                attribute={record.attributes.niagads_accession.toString()}
                            />
                        </ListItem>
                        <ListItem>
                            <Typography>{record.attributes.description}</Typography>
                        </ListItem>
                    </List>
                    {record.attributes.is_adsp && (
                        <Typography>
                            <strong> {resolveJsonInput(record.attributes.is_adsp.toString())}</strong>
                        </Typography>
                    )}
                    <DatasetHeaderImage src={`${imgPrefix}-manhattan.png`} type={"standard-manhattan"} />
                </Grid>
                <Grid item sm={6} xs={12}>
                    <GWASDatasetLZPlot dataset={record.id[0].value} />
                </Grid>
            </Grid>

          
        </CustomPanel>
    );
};

export default TrackRecordSummary;
