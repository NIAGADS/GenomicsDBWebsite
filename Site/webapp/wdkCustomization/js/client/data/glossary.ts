export interface Term {
    abbrev?: string;
    term?: string;
    definition?: string;
    category?: Category;
}

enum Category {
    NEUROPATHOLOGY = "neuropathology",
    DIAGNOSIS = "diagnosis",
    BIOMARKER = "biomarker"
}


export const Glossary: Term[] = [
    {
        abbrev: "AD",
        term: "Alzheimer's disease",
        category: Category.DIAGNOSIS
    },
    {
        abbrev: "LOAD",
        term: "Late-onset Alzheimer's disease",
        category: Category.DIAGNOSIS
    },
    {
        abbrev: "VBI",
        term: "Vascular brain injury",
        category: Category.NEUROPATHOLOGY
    },
    {
        abbrev: "PSP",
        term: "Progressive supranuclear palsy",
        category: Category.DIAGNOSIS
    },
    {
        abbrev: "FTD",
        term: "Fronto-termporal dementia",
        category: Category.DIAGNOSIS
    },
    {
        abbrev: "DEM",
        term: "dementia",
        category: Category.DIAGNOSIS
    },
    {
        abbrev: "AB42",
        term: "beta-amyloid protein 42",
        definition: "the quantification of Beta-amyloid 1-42 in CSF or plasma, typically used as a biomarker for Alzheimer's Disease",
        category: Category.BIOMARKER
    },
    {
        abbrev: "pTau181",
        term: "phosphorylated-tau 181 protein",
        definition: "the quantification of phosphorylated tau protein in CSF, used as a biomarker for Alzheimer's disease",
        category: Category.BIOMARKER
    },
    {
        abbrev: "tau",
        term: "total tau (t-tau) protein",
        definition: "total levels of tau protein in CSF, used as a biomarker for Alzheimer's disease",
        category: Category.BIOMARKER
    },
    {
        abbrev: "LDB",
        term: "Lewy-body disease",
        category: Category.DIAGNOSIS
    },
    {
        abbrev: "Braak",
        term: "Braak stages",
        definition: "stages marking evolution of PD-related pathology and distribution of neurofibrillary tangles in the brain (Braak 2003)",
        category: Category.NEUROPATHOLOGY
    },
    {
        abbrev: "CAA",
        term: "cerebral amyloid angiopathy",
        definition: "A disorder characterized by the deposition of amyloid in the wall of the vessels in the brain.",
        category: Category.NEUROPATHOLOGY
    },
    {
        abbrev: "CERAD",
        term: "CERAD score",
        definition: "Consortium to establish a Registry for Alzheimer's disease (CERAD) score for density of euritic plaques in the brain: none, sparse (A), moderate (B), frequent (C)",
        category: Category.NEUROPATHOLOGY
    },
    {
        abbrev: "Hs-aging",
        term: "hippocampal sclerosis of aging",
        definition: "age-related neuropathological condition with severe neuronal cell loss and gliosis in the hippocampus",
        category: Category.NEUROPATHOLOGY
    },
    {
        abbrev: "LB",
        term: "Lewy-body",
        category: Category.NEUROPATHOLOGY
    },
    {
        abbrev: "NP",
        term: "Neuritic plaques",
        category: Category.NEUROPATHOLOGY
    },

];

