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
    { id: 'about', text: 'About', tooltip: 'Learn More', route: '/about' },
    { id: 'search', text: 'Search', tooltip: 'Start a new search strategy', webAppUrl: '/genomics/search.jsp' },
    { id: 'workspace', text: 'Workspace', webAppUrl: '/workspace' },
    {
      id: 'tools',
      text: 'Tools',
      children: [
        {
          id: 'genome_browser',
          text: 'Genome Browser',
          webAppUrl: '/jbrowse.jsp'
        },
        {
          id: 'enrichment_analysis',
          text: 'Enrichment Analysis',
          webAppUrl: '/showQuestion.do?questionFullName=GeneQuestions.GeneUpload'
        }
      ]
    },
    {
      id: 'documentation',
      text: 'Documentation',
      webAppUrl: '/showXmlDataContent.do?name=XmlQuestions.Documentation'
    },
    {
      id: 'news',
      text: 'News',
      webAppUrl: '/showXmlDataContent.do?name=XmlQuestions.Documentation'
    }
  ];
}

