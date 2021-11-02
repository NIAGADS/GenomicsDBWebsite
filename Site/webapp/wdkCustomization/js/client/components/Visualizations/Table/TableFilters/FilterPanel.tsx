// modified from https://github.com/ggascoigne/react-table-example

import { Theme, createStyles, makeStyles } from "@material-ui/core";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import React, { ReactElement, useCallback } from "react";
import { TableInstance } from "react-table";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
        icon: {
            verticalAlign: "bottom",
            height: 20,
            width: 20,
        },
        details: {
            alignItems: "center",
        },
        column: {
            flexBasis: "33.33%",
        },
        helper: {
            borderLeft: `2px solid ${theme.palette.divider}`,
            padding: theme.spacing(1, 2),
        },
        link: {
            color: theme.palette.primary.main,
            textDecoration: "none",
            "&:hover": {
                textDecoration: "underline",
            },
        },
        filtersResetButton: {
            position: "absolute",
            top: 18,
            right: 21,
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 218px)",
            "@media (max-width: 600px)": {
                gridTemplateColumns: "repeat(1, 180px)",
            },
            gridColumnGap: 24,
            gridRowGap: 24,
        },
        cell: {
            width: "100%",
            display: "inline-flex",
            flexDirection: "column",
        },
        hidden: {
            display: "none",
        },
    })
);

type FilterPageProps = {
    instance: TableInstance;
};

function FilterPanel({ instance }: FilterPageProps): ReactElement {
    const classes = useStyles({});
    //@ts-ignore
    const { allColumns, setAllFilters } = instance;

    const resetFilters = useCallback(() => {
        setAllFilters([]);
    }, [setAllFilters]);

    return (
        <Grid container direction="column" style={{ paddingLeft: "20px" }}>
            <Grid container item alignContent="flex-end">
                <Button variant="contained" color="primary" onClick={resetFilters}>
                    Clear Advanced Filters
                </Button>
            </Grid>
            <Grid item>
                <form>
                    <Grid container item direction="column">
                        {/* render pvalue filter */}
                        <Grid item md={6}>
                            <div className={classes.grid}>
                                {allColumns
                                    .filter(
                                        //@ts-ignore
                                        (item) => item.canFilter && item.filter && item.filter.toLowerCase() === "pvalue"                                   
                                    )
                                    .map((column) => (
                                        <div key={column.id} className={classes.cell}>
                                            {column.render("Filter")}
                                        </div>
                                    ))}
                            </div>
                        </Grid>

                        <Grid container item direction="row" spacing={4}>
                            {/* render pie charts first ; includes to handle special cases */}
                            <Grid item md={6}>
                                <div className={classes.grid}>
                                    {allColumns
                                        .filter(
                                            //@ts-ignore
                                            (item) => item.canFilter && item.filter && item.filter.toLowerCase().includes("pie")
                                        )
                                        .map((column) => (
                                            <div key={column.id} className={classes.cell}>
                                                {column.render("Filter")}
                                            </div>
                                        ))}
                                </div>
                            </Grid>
                            {/* render selects */}
                            <Grid item>
                                <div className={classes.grid}>
                                    {allColumns
                                        //@ts-ignore
                                        .filter((item) => item.canFilter && item.filter === "select")
                                        .map((column) => (
                                            <div key={column.id} className={classes.cell}>
                                                {column.render("Filter")}
                                            </div>
                                        ))}
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Button className={classes.hidden} type={"submit"}>
                        &nbsp;
                    </Button>
                </form>
            </Grid>
        </Grid>
    );
}

export default FilterPanel;
