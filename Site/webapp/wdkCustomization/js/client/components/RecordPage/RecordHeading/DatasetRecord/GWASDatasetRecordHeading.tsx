import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { HeaderRecordActions, RecordAttributeItem } from "./../Shared";
import { GWASDatasetRecord, HeaderActions } from "./../../types";
import { resolveJsonInput } from "../../../../util/jsonParse";
import { convertHtmlEntites } from "../../../../util/util";
import { HelpIcon } from "wdk-client/Components";
import GWASDatasetLZPlot from "../../../Visualizations/LocusZoom/GWASDatasetLZPlot";
import { Box, FormGroup, Grid, List } from "@material-ui/core";
import {
    BaseText,
    BaseTextSmall,
    PrimaryActionButton,
    Subheading,
    UnlabeledTextFieldOutlined,
    UnpaddedListItem,
} from "../../../Shared";

const SEARCH_PATH = "../../search/gwas_summary/filter";
const PVALUE_PARAM_NAME = "param.pvalue";
const ACCESSION_PARAM_NAME = "param.gwas_accession";
const DATASET_PARAM_NAME = "param.gwas_dataset";

interface GWASRecordHeading {
    record: GWASDatasetRecord;
    recordClass: { [key: string]: any };
    headerActions: HeaderActions[];
    externalUrls: { [key: string]: any };
    webAppUrl: string;
}

interface SearchProps {
    record: string;
    accession: string;
}

const GWASDatasetSearchHelp: React.FC = () => {
    return (
        <Box>
            <BaseTextSmall>
                Set the adjusted p-value threshold for GWAS significance. The search will return all genes supported by
                a p-value &le; the specified threshold.
            </BaseTextSmall>
            <BaseTextSmall>
                p-values may be specified in decimal (e.g., 0.000003) or scientific (e.g., 3e-6 or 3^-6 or 3 x 10^-6)
                notation.
            </BaseTextSmall>
            <BaseTextSmall>For exome array studies a p-value threshold of 1e-3 is recommended.</BaseTextSmall>
        </Box>
    );
};

const GWASDatasetSearch: React.FC<SearchProps> = ({ record, accession }) => {
    const [error, setError] = useState(false);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        //drop whitespace to simplify regex
        const val = event.target.value.replace(/ /g, ""),
            re = new RegExp(/(^\d(e|\^|x10\^)?-\d$)|(^((\d)?\.)\d+$)/);

        if (!re.test(val)) {
            return setError(true);
        }

        setError(false);
    }, []);

    return (
        <>
            <BaseText>Mine this dataset</BaseText>
            <form action={SEARCH_PATH}>
                <FormGroup row={true}>
                    <input type="hidden" name="autoRun" />
                    <input type="hidden" name={DATASET_PARAM_NAME} defaultValue={record} />
                    <input type="hidden" name={ACCESSION_PARAM_NAME} defaultValue={accession} />
                    <Box mr={1} mb={1}>
                        <UnlabeledTextFieldOutlined
                            name={PVALUE_PARAM_NAME}
                            defaultValue="5e-8"
                            placeholder={"5e-8"}
                            onChange={handleChange}
                            startAdornment={<BaseTextSmall style={{ whiteSpace: "nowrap" }}>p-value</BaseTextSmall>}
                        />
                    </Box>
                    <Box display="flex" alignItems="flex-start">
                        <PrimaryActionButton disabled={error} type="submit">
                            Search
                        </PrimaryActionButton>
                        <HelpIcon>
                            <GWASDatasetSearchHelp />
                        </HelpIcon>
                    </Box>
                </FormGroup>
            </form>
            {error && (
                <BaseTextSmall color="error">
                    Please enter a valid p-value, e.g., 0.0007, 3e-6, 3^-6, 3x10^-6
                </BaseTextSmall>
            )}
        </>
    );
};

const GWASDatasetRecordSummary: React.FC<GWASRecordHeading> = ({ record, recordClass, headerActions }) => (
    <Grid container style={{ marginLeft: "10px" }}>
        <Grid item container direction="column" sm={3} xs={12}>
            <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} />
            <Subheading>
                {convertHtmlEntites(record.attributes.name)} &nbsp;(
                {record.attributes.attribution})
            </Subheading>
            <List>
                <UnpaddedListItem>
                    <BaseText variant="body2">{record.attributes.description}</BaseText>
                </UnpaddedListItem>
                <UnpaddedListItem>
                    <RecordAttributeItem label="Category:" attribute={recordClass.displayName} />
                </UnpaddedListItem>
                <UnpaddedListItem>
                    <RecordAttributeItem
                        label="Explore related datasets:"
                        attribute={resolveJsonInput(record.attributes.accession_link)}
                    />
                </UnpaddedListItem>
            </List>
            {record.attributes.is_adsp && (
                <Subheading>
                    <strong>&nbsp;{resolveJsonInput(record.attributes.is_adsp)}</strong>
                </Subheading>
            )}

            <GWASDatasetSearch
                accession={record.attributes.niagads_accession}
                record={record.id[0].value}
            ></GWASDatasetSearch>
        </Grid>
        <Grid item sm={9} xs={12}>
            <GWASDatasetLZPlot dataset={record.id[0].value} />
        </Grid>
    </Grid>
);

export default connect((state: any) => ({
    externalUrls: state.globalData.siteConfig.externalUrls,
    webAppUrl: state.globalData.siteConfig.webAppUrl,
}))(GWASDatasetRecordSummary);
