import React from "react";

import { Grid, Box, Typography, Button } from "@material-ui/core";

import { PanelProps } from "../Panels";


export const DatasetOverviewSection: React.FC<PanelProps> = ({classes}) => {

    return (

            <Grid container alignItems="center" item direction="column" spacing={6}>
                <Typography variant="h3" className={classes.headingPrimary}>Available datasets</Typography>
                <Grid item container spacing={4} direction="row" alignContent="center">
                    <Grid
                        container
                        item
                    >
                        <Typography>
                            The NIAGADS Alzheimer's GenomicsDB provides unrestricted access to published 
                            summary statistics from AD/ADRD genome-wide association studies (GWAS) deposited at NIAGADS. 
                        </Typography>
                        <Box display="flex" justifyContent="flex-end">
                            <Button href="record/dataset/accessions">
                                <span>
                                    Browse Datasets{"    "}
                                    <i className="fa fa-caret-right"></i>
                                </span>
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                       {/* <Donut />*/}
                    </Grid>
                </Grid>
            </Grid>

    );
};
