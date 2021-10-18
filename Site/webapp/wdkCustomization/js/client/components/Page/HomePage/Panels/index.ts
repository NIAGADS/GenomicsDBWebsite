export * from "./AboutPanel";
export * from "./SearchPanel";
export * from "./PrimaryBackgroundPanel";
export * from "./DatasetReleasesPanel";
export { TransparentBackgroundPanel as DefaultBackgroundPanel } from "./TransparentBackgroundPanel";

export interface PanelProps {
    webAppUrl?: string;    
    children?: React.ReactNode
    classes?: any;
    hasBaseArrow?: boolean
}