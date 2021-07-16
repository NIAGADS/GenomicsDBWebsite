// modified from https://github.com/ggascoigne/react-table-example

import { Theme, createStyles, makeStyles } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionActions from "@material-ui/core/AccordionActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import React, { FormEvent, ReactElement, useCallback } from "react";
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

    /* const onSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            onClose();
        },
        [onClose]
    ); */

    const resetFilters = useCallback(() => {
        setAllFilters([]);
    }, [setAllFilters]);

    return (
        <div className={classes.root}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1c-content" id="panel1c-header">
                    <div className={classes.column}>
                        <Typography className={classes.heading}>Advanced Filter</Typography>
                    </div>
                </AccordionSummary>

                <AccordionDetails className={classes.details}>
                    <form>
                        <div className={classes.grid}>
                            {allColumns
                                //@ts-ignore
                                .filter((item) => item.canFilter)
                                .map((column) => (
                                    <div key={column.id} className={classes.cell}>
                                        {column.render("Filter")}
                                    </div>
                                ))}
                        </div>
                        <Button className={classes.hidden} type={"submit"}>
                            &nbsp;
                        </Button>
                    </form>
                </AccordionDetails>
                <Divider />
                <AccordionActions>
                    <Button color="primary" onClick={resetFilters}>
                        Reset
                    </Button>
                </AccordionActions>
            </Accordion>
        </div>
    );
}

export default FilterPanel;
