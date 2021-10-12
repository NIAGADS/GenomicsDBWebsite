export * from "./SearchPanel";
export * from "./PrimaryBackgroundPanel";

export interface PanelProps {
    webAppUrl?: string;    
    children?: React.ReactNode
    classes?: any;
}