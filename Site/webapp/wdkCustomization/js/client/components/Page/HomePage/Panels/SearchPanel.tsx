import React from "react";
import { useGoto } from "../../../../hooks";
import { Grid, Typography } from "@material-ui/core";

import { SiteSearch, SearchResult } from "../../../Tools";
import { buildRouteFromResult, buildSummaryRoute } from "../../../../util/util";
import { PanelProps } from "../Panels";


export const SearchPanel: React.FC<PanelProps> = ({ classes }) => {
    const goto = useGoto();
    //const classes = useStyles();
    return (
        <Grid item container direction="column" spacing={3} xs={6}>
            <Grid item>
                <Typography variant="h3" className={`${classes.secondaryText} ${classes.bold}`}>
                    NIAGADS
                </Typography>
                <Typography variant="h2" className={`${classes.secondaryText} ${classes.bold}`}>
                    Alzheimer's Genomics Database
                </Typography>
            </Grid>

            <Grid item>
                <Typography className={classes.darkContrastText} variant="body2">
                    The NIAGADS Alzhemier's GenomicsDB is an interactive knowledgebase for Alzheimer's disease (AD) genetics that provides a platform for data
                    sharing, discovery, and analysis to help advance the understanding of the complex genetic
                    underpinnings of AD neurodegeneration and accelerate the progress of research on AD and AD related
                    dementias (ADRD).
                </Typography>
            </Grid>

            <Grid item>
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
            </Grid>
        </Grid>
    );
};

