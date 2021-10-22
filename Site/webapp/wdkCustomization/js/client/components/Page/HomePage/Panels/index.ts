export * from "./AboutPanel";
export * from "./SearchPanel";
export * from "./StatsPanel";
export * from "./DatasetOverviewChart";
export * from "./PrimaryBackgroundPanel";
export * from "./DatasetReleasesPanel";
export * from "./AvailableDataPanel";
export { TransparentBackgroundPanel as DefaultBackgroundPanel } from "./TransparentBackgroundPanel";

export interface PanelProps {
    webAppUrl?: string;    
    children?: React.ReactNode
    classes?: any;
    hasBaseArrow?: boolean
    background?: string;
}

