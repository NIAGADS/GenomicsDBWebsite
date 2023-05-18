import { SectionDocumentation } from "./Documentation";
import questions from "./_faq";
import { dataSources } from "./_resources";
import software  from "./_software";

const doc: SectionDocumentation[] = [
    {section: "FAQ", documentation: questions},
  //  {section: "Software", documentation: software},
    {section: "Data Sources", documentation: dataSources}
];

export default doc;