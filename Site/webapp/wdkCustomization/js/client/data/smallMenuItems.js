/**
 * Get small menu entries
 * @return {Array<Entry>}
 */
export default function smallMenuEntries({ siteConfig: { projectId } }, defaultEntries) {
  return [
    defaultEntries.profileOrLogin,
    defaultEntries.registerOrLogout,
    {
      text: `About ${projectId}`,
      children: [
        {
          text: `What is ${projectId}?`,
          webAppUrl: '/showXmlDataContent.do?name=XmlQuestions.About'
        },
        {
          text: `FAQ`,
          webAppUrl: '/showXmlDataContent.do?name=XmlQuestions.FAQ'
        },
        {
          liClassName: 'eupathdb-SmallMenuDivider',
          text: `------ Data in ${projectId}`
        },
        {
          text: '${projectId} Variants',
          webAppUrl: '/processQuestion.do?questionFullName=OrganismQuestions.VariantMetrics'
        },
        {
          text: '${projectId} Genes',
          webAppUrl: '/processQuestion.do?questionFullName=OrganismQuestions.GeneMetrics'
        },
        {
          liClassName: 'eupathdb-SmallMenuDivider',
          text: `------ Submitting data`
        },
        {
          text: 'How to submit data to us',
          webAppUrl: '/dataSubmission.jsp'
        },
        {
          liClassName: 'eupathdb-SmallMenuDivider',
          text: '------ Usage and Citation'
        },
        {
          text: 'How to cite us',
          webAppUrl: '/showXmlDataContent.do?name=XmlQuestions.About#citing'
        },
        {
          text: 'Citing Data Providers',
          webAppUrl: '/showXmlDataContent.do?name=XmlQuestions.About#citingproviders'
        },
        {
          text: 'Publications that Use our Resources',
          url: 'http://scholar.google.com/scholar?as_q=&num=10&as_epq=&as_oq=EryhthronDB&hl=en'
        },
        {
          text: 'Data Access Policy',
          webAppUrl: '/showXmlDataContent.do?name=XmlQuestions.About#use'
        },
        {
          text: 'Website Privacy Policy',
          url: '/documents/ErythronDB_Website_Privacy_Policy.shtml'
        },
        {
          liClassName: 'eupathdb-SmallMenuDivider',
          text: '------ Who are we?'
        },
        {
          text: 'Scientific Working Group',
          webAppUrl: '/showXmlDataContent.do?name=XmlQuestions.AboutAll#swg'
        },
        {
          text: 'Acknowledgements',
          webAppUrl: '/showXmlDataContent.do?name=XmlQuestions.AboutAll#acks'
        },
        {
          text: 'Funding',
          webAppUrl: '/showXmlDataContent.do?name=XmlQuestions.About#funding'
        },
      ]
    },
    defaultEntries.contactUs,
    defaultEntries.twitter

  ];
}
