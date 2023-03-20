import React from "react";

import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";

import { ComingSoonAlert } from "@components/MaterialUI";

export const TableHelpDialog: React.FC<{ isOpen: boolean; handleClose: any }> = ({ isOpen, handleClose }) => {
    return (
        <Dialog maxWidth="xs" aria-labelledby="dialog-title" open={isOpen} onClose={handleClose}>
            <DialogTitle id="dialog-title">How to browse and mine data tables</DialogTitle>
            <DialogContent dividers>
                <ComingSoonAlert message="Documentation coming soon." />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const MemoTableHelpDialog = React.memo(TableHelpDialog);