import React from "react";

import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";

import { RecordInstance } from "wdk-client/Utils/WdkModel";

import { CustomLink as Link, UnpaddedListItem as ListItem, useTypographyStyles } from "@components/MaterialUI";
import { LabeledAttributeItem as RecordAttributeItem, LinkAttributeList } from "@components/Record/Attributes";

import { _externalUrls } from "genomics-client/data/_externalUrls";

export const TrackAttributesList: React.FC<{ record: RecordInstance }> = ({ record }) => {
    const tClasses = useTypographyStyles();
    const { attributes } = record;
    return (
        <List disablePadding={true} dense={true}>
            <RecordAttributeItem
                small={true}
                label="Accession"
                children={
                    <Box component="span">
                        {attributes.niagads_accession}{" "}
                        <Link
                            href={`${_externalUrls.NIAGADS_BASE_URL}/datasets/${attributes.niagads_accession}`}
                        >
                            <i className={`${tClasses.small} fa fa-external-link`}></i>
                        </Link>
                    </Box>
                }
                tooltip="View NIAGADS Accession / Request Access to full summary statistics"
            ></RecordAttributeItem>

            {attributes.related_tracks && (
                <ListItem>
                    <RecordAttributeItem
                        label="Related Tracks"
                        children={
                            <LinkAttributeList value={attributes.related_tracks.toString()} asString={true} />
                        }
                    />
                </ListItem>
            )}
        </List>
    );
};
