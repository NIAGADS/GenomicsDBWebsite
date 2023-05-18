

export interface DocumentationItem {
    anchor: string;
    title: string;
    text: string;
    image?: string;
    comingSoon?: string;
    version?: string;
    url?: string;
    dataSourceKey?: string;
} 



export type Section = "FAQ" | "Software" | "Data Sources";


export interface SectionDocumentation {
    section: Section,
    documentation: DocumentationItem[]
}