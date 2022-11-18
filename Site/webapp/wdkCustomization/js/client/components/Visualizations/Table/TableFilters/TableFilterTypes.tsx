import { TableInstance } from "react-table";

export type FilterPageProps = {
    instance: TableInstance;
    filterGroups?: FilterGroup[];
};

export interface FilterGroup {
    label: string;
    columns: string[];
    defaultOpen?: boolean;
    collapsible?: boolean;
}