// modeled after https://github.com/ggascoigne/react-table-example

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { assign } from "lodash";

import Typography from "@material-ui/core/Typography";

import FilterListIcon from "@material-ui/icons/FilterList";





import {
    Table,
    TableToolbar,
    ToggleColumnsPanel,
    FilterPanel,
    FilterChipBar,
    LinkedPanel,
} from "@viz/Table/TableSections";

import { useTableStyles } from "@viz/Table";

import { CustomPanel, NavigationDrawer } from "@components/MaterialUI";

interface LinkedPanelAction {
    action: any;
    type: "Button" | "Check";
    tooltip: string;
}

interface LinkedPanelOptions {
    label: string;
    contents: any;
    className?: any;
    select: LinkedPanelAction;
}


export interface TableContainerProps {
    table: any;
    title: string;
    linkedPanel?: LinkedPanelOptions;
}



export const TableContainer: React.FC<TableContainerProps> = ({
    table,
    title,
    linkedPanel
}) => {
    // Use the state and functions returned from useTable to build your UI
    //const instance = useTable({ columns, data }, ...hooks) as TableTypeWorkaround<T>;
    const [linkedPanelIsOpen, setlinkedPanelIsOpen] = useState(false);
    const [hasLinkedPanel, setHasLinkedPanel] = useState(linkedPanel !== null);

    const canSelect = hasLinkedPanel && linkedPanel.select !== null;

    const classes = useTableStyles();





   /* const _buildDrawerSections = () => {
        const sections: React.ReactNode[] = showHideColumns
            ? [<ToggleColumnsPanel instance={instance} requiredColumns={requiredColumns} />]
            : [];
        showAdvancedFilter && sections.push(<FilterPanel instance={instance} filterGroups={filterGroups} />);
        return sections;
    };*/

    const renderDrawerHeaderContents = (
        <>
            <Typography variant="h6" style={{ padding: "8px" }}>
                Modify table: <em className="red">{title}</em>
            </Typography>
        </>
    );

    const toggleLinkedPanel = useCallback(
        (isOpen: boolean) => {
            setlinkedPanelIsOpen(isOpen);
        },
        [hasLinkedPanel]
    );
return null;
    // Render the UI for the table
    /*return (
        <CustomPanel justifyContent="flex-start">
            <NavigationDrawer
                navigation={
                    <TableToolbar
                        instance={instance}
                        canFilter={canFilter}
                        hasLinkedPanel={hasLinkedPanel}
                        linkedPanelOptions={{ toggle: toggleLinkedPanel, label: "LocusZoom" }}
                    />
                }
                toggleAnchor="left"
                toggleIcon={showAdvancedFilter || showHideColumns ? <FilterListIcon /> : null}
                toggleHelp="Select columns and advanced filters"
                toggleText="Modify Table"
                drawerSections={_buildDrawerSections()}
                drawerCloseLabel="Close"
                drawerHeaderContents={title ? renderDrawerHeaderContents : null}
                className={classes.navigationToolbar}
            >
                {canFilter && <FilterChipBar instance={instance} />}
            </NavigationDrawer>
            {hasLinkedPanel && <LinkedPanel className={linkedPanel.className} isOpen={linkedPanelIsOpen}>{linkedPanel.contents}</LinkedPanel>}
            <Table className={className} instance={instance} />
        </CustomPanel>
    ); */
};
