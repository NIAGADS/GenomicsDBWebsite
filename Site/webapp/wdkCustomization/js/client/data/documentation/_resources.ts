import { DocumentationItem } from "./Documentation";

export const dataSources: DocumentationItem[] = [
    {
        anchor: "ontologies",
        title: "Ontologies",
        text: "The GenomicsDB uses ontologies to capture phenotypes, biosample types, aspects experimental design, and organize the information on report pages into concept-related sections. The ontologies currently used to standardize and help harmonize the information in the GenomicsDB are as follows:",
        dataSourceKey: "ontology|ontology",
    },
    {
        anchor: "genes",
        dataSourceKey: "gene|all",
        title: "Gene Annotation",
        text: "The following resources are used to provide gene annotations.  More details about specific use-cases can be found on <strong>gene<strong> report pages (click the <strong>About this Page</strong> button).",
    },
    {
        anchor: "variants",
        dataSourceKey: "gene|all",
        title: "Variant Annotation",
        text: "The following resources are used to provide gene annotations.  More details about specific use-cases can be found on <strong>variant</strong> report pages (click the <strong>About this Page</strong> button).",
    },
];
