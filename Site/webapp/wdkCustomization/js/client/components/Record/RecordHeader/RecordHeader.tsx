import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import InfoIcon from "@material-ui/icons/Info";

import { CustomPanel } from "@components/MaterialUI";
import { useHeadingStyles } from "@components/Record/RecordHeader";
import { AboutThisPageDialog } from "./AboutThisPageDialog";

interface RecordHeader {
    title: React.ReactElement;
    recordClass: any;
    categoryTree: any;
    summary: React.ReactElement;
    image?: React.ReactElement;
    actions?: React.ReactElement;    
}

export const RecordHeader: React.FC<RecordHeader> = ({ title, summary, image, recordClass, categoryTree }) => {
    const classes = useHeadingStyles();

    const [aboutThisPageDialogIsOpen, setAboutThisPageDialogIsOpen] = useState(false);

    const closeAboutThisPageDialog = () => {
        setAboutThisPageDialogIsOpen(false);
    };

    return (
        <>
            <CustomPanel hasBaseArrow={false} className={classes.panel} alignItems="flex-start">
                <Grid item container sm={12} justifyContent="space-between" alignItems="baseline">
                    <Grid item>{title}</Grid>
                    <Grid item>
                        <Button
                            endIcon={<InfoIcon />}
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setAboutThisPageDialogIsOpen(true);
                            }}
                        >
                            About this Page
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container sm={12}>
                    {summary}
                </Grid>
                {image && (
                    <Grid item container sm={12}>
                        {image}
                    </Grid>
                )}
            </CustomPanel>
            <AboutThisPageDialog
                isOpen={aboutThisPageDialogIsOpen}
                handleClose={closeAboutThisPageDialog}
                recordClass={recordClass}
                categoryTree={categoryTree}
            ></AboutThisPageDialog>
        </>
    );
};
