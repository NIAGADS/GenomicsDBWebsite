export * from "./AboutPanel";
export * from "./SearchPanel";
export * from "./StatsPanel";
export * from "./PrimaryBackgroundPanel";
export * from "./AboutPanel";
export * from "./AvailableDataPanel";
export * from "./LightBackgroundPanel";
export { TransparentBackgroundPanel as DefaultBackgroundPanel } from "./TransparentBackgroundPanel";

export interface PanelProps {
    webAppUrl?: string;    
    children?: React.ReactNode
    classes?: any;
    hasBaseArrow?: boolean
    background?: string;
}

