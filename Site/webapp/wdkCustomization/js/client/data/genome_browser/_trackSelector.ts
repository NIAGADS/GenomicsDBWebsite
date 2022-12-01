import { TableProperties } from "@viz/Table/TableProperties";

/*"column": {
    "name": "Track",
    f "assay": "Assay",
    "gender": "Gender",
   f "tissue": "Tissue",
    "genotype": "Genotype",
    f"biomarker": "Biomarker",
    "biosample": "Biosample",
   f "diagnosis": "Diagnosis",
   f "covariates": "Covariates",
   f "population": "Population",
   f "data_source": "Data Source",
    "description": "Description",
    f"feature_type": "Feature",
    f"neuropathology": "Neuropathology",
    f"antibody_target": "Antibody Target",
    "anatomical_system": "Anatomical System",
    "track_type_display": "Track Type",
    "consortium": "consortium"
  }*/

export const _trackSelectorTableProperties: TableProperties = {
    filters: {
        track_type_display: "radio_select",
        feature_type: "radio_select",
        data_source: "select",
        assay: "select",
        covariates: "checkbox_select",
        population: "pie",
        diagnosis: "pie",
        neuropathology: "pie",
        antibody_target: "typeahead_select",
        biosample: "typeahead_select",
        tissue: "tissue",
        biomarker: "select",
        genotype: "select",
    },
    filterGroups: [
        { label: "Experimental Design", columns: ["track_type_display", "feature_type", "assay", "antibody_target"], defaultOpen: true },
        { label: "Provenance", columns: ["data_source", "consortium"], defaultOpen: true},
        { label: "Phenotype", columns: ["population", "diagnosis", "biomarker", "genotype", "covariates"] },
        { label: "Biosample", columns: ["tissue", "biosample"]}
    ],
    hiddenColumns: [
        "assay",
        "population",
        "diagnosis",
        "neuropathology",
        "covariates",
        "gender",
        "genotype",
        "biomarker",
        "tissue",
        "anatomical_system",
        "biosample"
    ],
    requiredColumns: ["name", "track_type_display", "feature_type"],
    canFilter: true,
    canToggleColumns: true
};
