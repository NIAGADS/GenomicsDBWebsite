import React, { useCallback, useState, useRef } from "react";
import { connect } from "react-redux";
import { HeaderRecordActions, RecordAttributeItem } from "../Shared";
import { RecordHeading } from "../RecordHeadingTypes";
import { resolveJsonInput } from "../../../../../util/jsonParse";
import { convertHtmlEntites } from "../../../../../util/util";
import { HelpIcon, CollapsibleSection } from "wdk-client/Components";
import { makeClassNameHelper } from "wdk-client/Utils/ComponentUtils";

import GWASDatasetLZPlot from "../../../../Visualizations/LocusZoom/GWASDatasetLZPlot";
import { Box, FormGroup, Grid, List, FormHelperText } from "@material-ui/core";
import {
    BaseText,
    BaseTextSmall,
    PrimaryActionButton,
    PrimaryExternalLink,
    Subheading,
    SubheadingSmall,
    UnlabeledTextFieldOutlined,
    UnpaddedListItem,
} from "../../../../MaterialUI";

import { _externalUrls } from "../../../../../data/_externalUrls";

import GetAppIcon from "@material-ui/icons/GetApp";

import "./GWASDatasetRecordHeading.scss";

const SEARCH_PATH = "../../search/gwas_summary/filter";
const PVALUE_PARAM_NAME = "param.pvalue";
const ACCESSION_PARAM_NAME = "param.gwas_accession";
const DATASET_PARAM_NAME = "param.gwas_dataset";

const cx = makeClassNameHelper("gwas-RecordHeading");
interface SearchProps {
    record: string;
    accession: string;
}

const GWASDatasetSearchHelp: React.FC = () => {
    return (
        <Box>
            <BaseTextSmall>
                Set the threshold for GWAS significance. The search will return all variants supported by a p-value &le;
                the specified threshold.
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

        if (parseFloat(val) > 0.001) {
            return setError(true);
        }

        setError(false);
    }, []);

    return (
        <>
            <BaseText>
                Mine this dataset
                <HelpIcon>
                    <GWASDatasetSearchHelp />
                </HelpIcon>
            </BaseText>
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
                        />
                    </Box>
                    <Box display="flex" alignItems="flex-start">
                        <PrimaryActionButton disabled={error} type="submit">
                            Search
                        </PrimaryActionButton>
                    </Box>
                </FormGroup>
            </form>
            {error && (
                <BaseTextSmall color="error">
                    Please enter a valid p-value &le; 0.001, e.g., 0.0007, 3e-6, 3^-6, 3x10^-6
                </BaseTextSmall>
            )}
        </>
    );
};

interface HeaderImage {
    src: string;
    type?: string;
}

const DatasetHeaderImage: React.FC<HeaderImage> = ({ src, type }) => {
    const enclosingGrid = useRef(0);

    const wrapperClass = cx(`--${type}-wrapper`);

    const handleImgError = () => {
        (document.getElementsByClassName(wrapperClass)[0] as HTMLElement).style.display = 'none';
    }

    return (
        <Grid item container direction="column" className={wrapperClass}>
            <Grid item>
                <img
                    className={cx(`--${type}`)}
                    src={src}
                    onError={handleImgError}
                />
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
                    <Subheading style={{ paddingBottom: 0 }}>{convertHtmlEntites(record.attributes.name.toString())}</Subheading>
                    <SubheadingSmall style={{ padding: 0 }}>{record.attributes.attribution}</SubheadingSmall>
                    <List>
                        <UnpaddedListItem>
                            <RecordAttributeItem
                                label="Accession:"
                                attribute={record.attributes.niagads_accession.toString()}
                            />
                        </UnpaddedListItem>
                        <UnpaddedListItem>
                            <BaseText variant="body2">{record.attributes.description}</BaseText>
                        </UnpaddedListItem>
                    </List>
                    {record.attributes.is_adsp && (
                        <Subheading>
                            <strong>&nbsp;{resolveJsonInput(record.attributes.is_adsp.toString())}</strong>
                        </Subheading>
                    )}
                   {/* <GWASDatasetSearch
                        accession={record.attributes.niagads_accession.toString()}
                        record={record.id[0].value}
                   ></GWASDatasetSearch> */}
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
