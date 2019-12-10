export interface MenuItem {
  id: string;
  text?: string;
  tooltip?: string;
  webAppUrl?: string;
  children?: MenuItem[];
  route?: string;
}


export default function mainMenuItems({ siteConfig, preferences }: { siteConfig: any, preferences: any }, defaultItems: any): MenuItem[] {
  return [
    { id: 'home', text: 'GenomicsDB', route: '/'},
    { id: 'about', text: 'About', tooltip: 'Coming soon', webAppUrl: '#' },
    { id: 'search', text: 'Search Datasets', tooltip: 'browse & search GWAS summary statistics datasets', route: '/search/variant/gwas_stats' },
    { id: 'workspace', text: 'Workspace', webAppUrl: '#', tooltip: 'Coming soon' },
    {
      id: 'tools',
      text: 'Tools',
      webAppUrl: '#',
      tooltip: 'Coming soon'
    },
    {
      id: 'documentation',
      text: 'Documentation',
      webAppUrl: '#',
      tooltip: 'Coming soon'
    },
    {
      id: 'news',
      text: 'News',
      webAppUrl: '#',
      tooltip: 'Coming soon'
    }
  ];
}

