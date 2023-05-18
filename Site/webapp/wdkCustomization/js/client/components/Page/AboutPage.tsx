import React, { useState } from "react";
import { Link as RouterLink, withRouter, RouteComponentProps } from "react-router-dom";
import { webAppUrl, projectId } from "ebrc-client/config";

import { useWdkEffect } from "wdk-client/Service/WdkService";

import { safeHtml } from "wdk-client/Utils/ComponentUtils";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import { CustomLink as Link, DefaultBackgroundPanel, ComingSoonAlert } from "@components/MaterialUI";
import { AboutPanel } from "@components/Page/HomePage/Panels";

import useHomePageStyles, {
    useTypographyStyles as useHomePageTypographyStyles,
} from "@components/Page/HomePage/styles";

import { SectionDocumentation, DocumentationItem } from "genomics-client/data/documentation/Documentation";

import _aboutPageDoc from "genomics-client/data/documentation/_about_page";
import { DatasourceTable } from "@components/Documentation/DatasourceTable";

const AboutPage: React.FC<RouteComponentProps<any>> = ({ location }) => {
    const classes = useHomePageStyles();

    const renderDocumentationItem = (item: DocumentationItem, index: number) => {
        const [dsRecord, dsCategory] = item.dataSourceKey ? item.dataSourceKey.split("|") : [null, null];
        return (
            <Grid item key={`item_${index}`}>
                <Box my={2}>
                    {item.title && (
                        <Box my={2}>
                            <Typography variant="h5">{item.title}</Typography>
                        </Box>
                    )}
                    <Typography>{safeHtml(item.text)}</Typography>

                    {item.comingSoon && <ComingSoonAlert message={item.comingSoon}></ComingSoonAlert>}
                    {dsRecord && <DatasourceTable recordClass={dsRecord} category={dsCategory} />}
                </Box>
            </Grid>
        );
    };

    const renderSectionDocumentation = (section: SectionDocumentation, index: number) => (
        <DefaultBackgroundPanel key={`section_${index}`} hasBaseArrow={false} classes={classes}>
            <Grid item container direction="column" spacing={6} xs={12} sm={10}>
                <Grid item>
                    <a id={section.section}>
                        <Typography variant="h5">
                            {section.section === "FAQ" ? "Frequently Asked Questions" : section.section}
                        </Typography>
                    </a>
                </Grid>

                {section.documentation.map((item: DocumentationItem, iIndex: number) =>
                    renderDocumentationItem(item, iIndex)
                )}
            </Grid>
        </DefaultBackgroundPanel>
    );

    const renderNavSubSection = (section: SectionDocumentation, index: number) => (
        <ListItem key={`section_${index}`}>
            <Link color="initial" href={`#${section.section}`} target="_self">
                {section.section}
            </Link>
        </ListItem>
    );

    const renderAboutPageNav = () => (
        <Box mt={4}>
            <List disablePadding={true}>
                <ListItem>
                    <Link color="initial" href="#about" target="_self">
                        About the project
                    </Link>
                </ListItem>
                <ListItem>
                    <Link color="initial" href="#cite" target="_self">
                        How to cite
                    </Link>
                </ListItem>

                {_aboutPageDoc.map((item: SectionDocumentation, index: number) => {
                    return renderNavSubSection(item, index);
                })}
            </List>
        </Box>
    );

    const renderHowToCite = () => (
        <DefaultBackgroundPanel hasBaseArrow={false} classes={classes}>
            <Grid item container direction="column" spacing={6} xs={12} sm={10}>
                <Grid item>
                    <a id="cite">
                        <Typography variant="h5">How to cite this resource</Typography>
                    </a>
                </Grid>
                <Grid item>
                    <Typography variant="body1" align="left">
                        We encourage you to use the data and insights offered in the NIAGADS Alzheimers's Genomics
                        database along with the following acknowledgement statement:
                    </Typography>
                    <Box mt={2} ml="auto" mr="auto" className={classes.inset}>
                        <Typography variant="body1">
                            <em>
                                The results published here are in whole or part based on data obtained from the NIAGADS
                                Alzheimer's GenomicsDB, available at https://www.niagads.org{webAppUrl}.
                            </em>
                        </Typography>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="body1" align="left">
                            To cite the resource using the following:
                        </Typography>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="body1" className={classes.inset}>
                            Greenfest-Allen et al. (28 April 2023). "NIAGADS Alzheimer’s GenomicsDB: A resource for
                            exploring Alzheimer’s Disease genetic and genomic knowledge":{" "}
                            <a href="https://doi.org/10.1101/2020.09.23.310276">
                                https://doi.org/10.1101/2020.09.23.310276
                            </a>
                        </Typography>
                    </Box>
                    <Box mt={2}>
                        <Typography align="left">
                            If referencing a specific GWAS summary statistics dataset from the NIAGADS repository,
                            please follow the accession link provided in the{" "}
                            <a href="dataset/accessions" target="_blank">
                                dataset browser
                            </a>{" "}
                            to obtain original publication information for the dataset to directly acknowledge.
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </DefaultBackgroundPanel>
    );

    return (
        <Grid container spacing={2} alignContent="flex-start">
            <Grid item xs={1}>
                {renderAboutPageNav()}
            </Grid>
            <Grid item xs={9}>
                <a id="about"></a>
                <AboutPanel webAppUrl={webAppUrl}></AboutPanel>
                {renderHowToCite()}
                {_aboutPageDoc.map((item: SectionDocumentation, index: number) =>
                    renderSectionDocumentation(item, index)
                )}
            </Grid>
        </Grid>
    );
};

export default withRouter(AboutPage);
