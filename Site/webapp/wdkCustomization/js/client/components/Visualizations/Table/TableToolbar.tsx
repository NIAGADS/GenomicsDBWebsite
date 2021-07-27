// modified from https://github.com/ggascoigne/react-table-example
// @xts-nocheck -- react-table type issues / should be fixed in v8
import { Button, IconButton, Theme, Toolbar, Tooltip, createStyles, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CreateIcon from "@material-ui/icons/CreateOutlined";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import FilterListIcon from "@material-ui/icons/FilterList";
import ViewColumnsIcon from "@material-ui/icons/ViewColumn";
import classnames from "classnames";
import React, { MouseEvent, MouseEventHandler, PropsWithChildren, ReactElement, useCallback, useState } from "react";
import { TableInstance } from "react-table";

import { TableMouseEventHandler } from "./TableTypes";
import { HideColumnPage } from "./HideColumnPage";
import FilterPanel from "./TableFilters/FilterPanel";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            display: "flex",
            justifyContent: "space-between",
        },
        leftButtons: {},
        rightButtons: {},
        leftIcons: {
            "&:first-of-type": {
                marginLeft: -12,
            },
        },
        rightIcons: {
            padding: 12,
            marginTop: "-6px",
            width: 48,
            height: 48,
            "&:last-of-type": {
                marginRight: -12,
            },
        },
    })
);

type InstanceActionButton = {
    instance: TableInstance;
    icon?: JSX.Element;
    onClick: TableMouseEventHandler;
    enabled?: (instance: TableInstance) => boolean;
    label: string;
    variant?: "right" | "left";
};

type ActionButton = {
    icon?: JSX.Element;
    onClick: MouseEventHandler;
    enabled?: boolean;
    label: string;
    variant?: "right" | "left";
};

export const InstanceLabeledActionButton = ({
    instance,
    icon,
    onClick,
    label,
    enabled = () => true,
}: InstanceActionButton): ReactElement => (
    <Button variant="contained" color="primary" onClick={onClick(instance)} disabled={!enabled(instance)}>
        {icon}
        {label}
    </Button>
);

export const LabeledActionButton = ({ icon, onClick, label, enabled = true }: ActionButton): ReactElement => (
    <Button variant="contained" color="primary" onClick={onClick} disabled={!enabled}>
        {icon}
        {label}
    </Button>
);

export const InstanceSmallIconActionButton = ({
    instance,
    icon,
    onClick,
    label,
    enabled = () => true,
    variant,
}: InstanceActionButton): ReactElement => {
    const classes = useStyles({});
    return (
        <Tooltip title={label} aria-label={label}>
            <span>
                <IconButton
                    className={classnames({
                        [classes.rightIcons]: variant === "right",
                        [classes.leftIcons]: variant === "left",
                    })}
                    onClick={onClick(instance)}
                    disabled={!enabled(instance)}
                >
                    {icon}
                </IconButton>
            </span>
        </Tooltip>
    );
};

export const SmallIconActionButton = ({
    icon,
    onClick,
    label,
    enabled = true,
    variant,
}: ActionButton): ReactElement => {
    const classes = useStyles({});
    return (
        <Tooltip title={label} aria-label={label}>
            <span>
                <IconButton
                    className={classnames({
                        [classes.rightIcons]: variant === "right",
                        [classes.leftIcons]: variant === "left",
                    })}
                    onClick={onClick}
                    disabled={!enabled}
                >
                    {icon}
                </IconButton>
            </span>
        </Tooltip>
    );
};

type TableToolbarProps = {
    instance: TableInstance;
    showAdvancedFilter: boolean;
    showHideColumns: boolean;
    canFilter: boolean;
};

function TableToolbar({
    instance,
    showAdvancedFilter,
    showHideColumns,
    canFilter,
}: PropsWithChildren<TableToolbarProps>): ReactElement | null {
    const { columns } = instance;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined);
    const [columnsOpen, setColumnsOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const hideableColumns = columns.filter((column) => !(column.id === "_selector"));

    const handleColumnsClick = useCallback(
        (event: MouseEvent) => {
            setAnchorEl(event.currentTarget);
            setColumnsOpen(true);
        },
        [setAnchorEl, setColumnsOpen]
    );

    const handleClose = useCallback(() => {
        setColumnsOpen(false);
        setAnchorEl(undefined);
    }, []);

    return (
        <Toolbar className={classes.toolbar}>
            <div className={classes.leftButtons}></div>
            <div className={classes.rightButtons}>
                {(canFilter && showAdvancedFilter)  && <FilterPanel instance={instance} />}

                { showHideColumns && <HideColumnPage instance={instance} onClose={handleClose} show={columnsOpen} anchorEl={anchorEl} />}
                { (showHideColumns && hideableColumns.length) > 1 && (
                    <SmallIconActionButton
                        icon={<ViewColumnsIcon />}
                        onClick={handleColumnsClick}
                        label="Add / Remove Columns"
                        variant="right"
                    />
                )}
            </div>
        </Toolbar>
    );
}

export default TableToolbar;
