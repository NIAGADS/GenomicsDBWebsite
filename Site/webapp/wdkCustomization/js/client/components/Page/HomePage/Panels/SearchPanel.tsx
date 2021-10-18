import React from "react";
import { useGoto } from "../../../../hooks";
import { Grid, Typography, Box } from "@material-ui/core";

import { SiteSearch, SearchResult } from "../../../Tools";
import { buildRouteFromResult, buildSummaryRoute } from "../../../../util/util";
import { PanelProps } from "../Panels";
import { SecondaryLink } from "../../../MaterialUI/Links";

export const SearchPanel: React.FC<PanelProps> = ({ classes }) => {
    const goto = useGoto();
    //const classes = useStyles();
    return (
        <Grid item container direction="column" spacing={6} xs={12} sm={10} md={6}>
            <Grid item>
                <Box pt={3}>
                <Typography variant="h3" className={`${classes.secondaryText} ${classes.bold}`}>
                    NIAGADS
                </Typography>
                </Box>
                <Typography variant="h2" className={`${classes.secondaryText} ${classes.bold}`}>
                    Alzheimer's Genomics Database
                </Typography>
                <Box pt={4}>
                    <Typography className={classes.darkContrastText} variant="body2">
                        The NIAGADS Alzhemier's GenomicsDB is an interactive knowledgebase for Alzheimer's disease (AD)
                        genetics. It provides a platform for data sharing, discovery, and analysis to help advance the
                        understanding of the complex genetic underpinnings of AD neurodegeneration and accelerate the
                        progress of research on AD and AD related dementias (ADRD).
                    </Typography>
                </Box>
            </Grid>
            <Grid item justifyContent="center">
                <SiteSearch
                    variant="panel"
                    onSelect={(value: SearchResult, searchTerm: string) =>
                        goto(
                            !value || value.type == "summary"
                                ? buildSummaryRoute(searchTerm)
                                : buildRouteFromResult(value)
                        )
                    }
                />
                <Box mt={1}>
                    <Typography variant="caption" className={classes.darkContrastText}>
                        Examples - Gene: <SecondaryLink to={"record/gene/ENSG00000130203"}> APOE</SecondaryLink> -
                        Variant by RefSNP: <SecondaryLink to="record/variant/rs6656401">rs6656401</SecondaryLink> -
                        Variant:{" "}
                        <SecondaryLink to="record/variant/19:45411941:T:C_rs429358">19:45411941:T:C</SecondaryLink>
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
};
