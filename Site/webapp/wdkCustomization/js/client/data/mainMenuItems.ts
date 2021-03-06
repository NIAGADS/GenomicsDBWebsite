export interface MenuItem {
    id: string;
    text?: string;
    tooltip?: string;
    webAppUrl?: string;
    children?: MenuItem[];
    route?: string;
}

export default function mainMenuItems(
    { siteConfig, preferences }: { siteConfig: any; preferences: any },
    defaultItems: any
): MenuItem[] {
    return [
        { id: "home", text: "GenomicsDB", route: "/" },
        {
            id: "search",
            text: "Search Datasets",
            tooltip: "browse & search GWAS summary statistics datasets",
            route: "/search/gwas_summary/browse",
        },
        { id: "workspace", text: "Workspace", route: "/workspace/strategies" },
        {
            id: "tools",
            text: "Tools",
            webAppUrl: "#",
            tooltip: "Coming soon",
            children: [{ id: "browser", text: "Genome Browser", route: "/visualizations/browser" }],
        },
        {
            id: "documentation",
            text: "Documentation",
            webAppUrl: "#",
            tooltip: "Coming soon",
        },
        {
            id: "news",
            text: "News",
            webAppUrl: "#",
            tooltip: "Coming soon",
        },
    ];
}
