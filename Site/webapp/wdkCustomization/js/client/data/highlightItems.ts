export {
	igapHighlights,
	adspHighlights
}

interface caption {
	pmid: string;
	link: string;
}

interface highlightAction {
	anchorText: string;
	link: string;
	title: string;
	icon: 'download' | 'link' | 'jbrowse' | 'search';
}

export interface DatasetHighlightConfig {
	id: string;
	summary: string;
	description: string;
	imgUrl: string;
	imgCaption: string;
	imgCaptionLink: caption;
	actions: highlightAction[]
}

const igapHighlights: DatasetHighlightConfig[] = [
	{
		id: 'NG00036',
		summary: 'Summary statistics from the International Genomics of Alzheimer\'s Project (IGAP) 2013 meta-analysis of genome-wide association (GWAS) data in Alzheimer\'s disease',
		description: 'IGAP 2013',
		imgUrl: 'images/NG00036.png',
		imgCaption: 'Top SNPs and associated loci (genes) as reported in Lambert et al. (2013) Extended meta-analysis of 74,046 individuals identifies 11 new susceptibility loci for Alzheimer\'s disease. Nat Gen 45(12):1452-1458 (after Table 1)',
		imgCaptionLink: {
			pmid: '24162737',
			link: 'http://www.ncbi.nlm.nih.gov/pubmed/24162737'
		},
		actions: [{
			anchorText: 'Browse the top SNPs',
			link: 'genomics/im.do?s=8370aa21091d529d',
			title: 'top AD risk-associated SNPS reported in Table 1 of Lambert et al. 2013',
			icon: 'link'
		}, {
			anchorText: 'Browse the associated loci (genes)',
			link: '/genomics/im.do?s=8370aa21091d529d',
			title: 'loci associated with the top SNPs by Lambert et al. 2013',
			icon: 'link'
		}, {
			anchorText: 'Search the IGAP 2013 summary statistics',
			link: '/genomics/showQuestion.do?questionFullName=VariantQuestions.VariantsByNiagadsDataset&niagads_accession=NG00036',
			title: '',
			icon: 'search'
		}, {
			anchorText: 'Search the ADGC subset',
			link: '/genomics/showQuestion.do?questionFullName=VariantQuestions.VariantsByNiagadsDataset&niagads_accession=NG00053',
			title: '',
			icon: 'search'
		}, {
			anchorText: 'View on the NIAGADS Genome Browser',
			link: 'genomics/jbrowse.jsp?tracks=ENSEMBL_GENE%2CNG00036_STAGE1%2CNG00036_STAGE12%2CNG00053&loc=chr19%3A981201..1146300&highlight=chr19%3A1063300..1064299',
			title: '',
			icon: 'jbrowse'
		}, {
			anchorText: 'Request access to the full IGAP dataset',
			link: 'https://www.niagads.org/datasets/ng00036',
			title: '',
			icon: 'download'
		}
		]
	}
]

const adspHighlights: DatasetHighlightConfig[] = [
	{
		id: 'NG00061',
		summary: 'Variants and annotations from the Discovery Phase of the Alzheimer\'s Disease Sequencing Project (ADSP)',
		description: 'ADSP Variant Annotation',
		imgUrl: 'images/NG00061.png',
		imgCaption: 'Overview of variants annotated from the Discovery Phase of the ADSP. 578 individuals from 111 families were whole-genome sequenced (WES), and 10,913 unrelated cases and controls were whole-exome (WES) sequenced. From Butkiewicz et al. (2018) Functional annotation of genomic variants in studies of late-onset Alzheimer\'s disease. Bioinformatics 34(16):2724-2731 (after Table 1).',
		imgCaptionLink: {
			pmid: '29590295',
			link: 'http://www.ncbi.nlm.nih.gov/pubmed/29590295'
		},
		actions: [
			{
				anchorText: 'Filter IGAP(2013) GWAS for ADSP variants',
				link: '/genomicsim.do?s=339d00c0f65ef4b0',
				title: '',
				icon: 'link'
			},
			{
				anchorText: 'Explore ADSP annotated variant records',
				link: '/genomics/showRecord.do?name=VariantRecordClasses.VariantRecordClass&source_id=2:127892810:C:T_rs6733839',
				title: '',
				icon: 'link'
			},
			{
				anchorText: 'View on the NIAGADS Genome Browser',
				link: 'genomics/jbrowse.jsp?tracks=ENSEMBL_GENE,ADSP_WES,ADSP_WGS&loc=chr19%3A981201..1146300',
				title: '',
				icon: 'jbrowse'
			},
			{
				anchorText: 'Download these annotations',
				link: 'https://www.niagads.org/datasets/ng00061',
				title: '',
				icon: 'download'
			}
		]
	},
	{
		id: 'NG00065',
		summary: 'Gene-level genetic evidence for AD based on analysis of exonic ADSP variants',
		description: 'ADSP Discovery Phase Case/Control Whole-Exome Sequencing',
		imgUrl: 'images/NG00065.png',
		imgCaption: '',
		imgCaptionLink: {
			pmid: '',
			link: ''
		},
		actions: [
			{
				anchorText: 'Search gene results',
				link: '/genomics/showQuestion.do?questionFullName=GeneQuestions.GeneRisk',
				title: '',
				icon: 'search'
			},
			{
				anchorText: 'View detailed gene-level results (e.g., TREM2)',
				link: '/genomics/showRecord.do?name=GeneRecordClasses.GeneRecordClass&source_id=ENSG00000095970#gene-trait',
				title: '',
				icon: 'link'
			}, {
				anchorText: 'Request access to the full dataset',
				link: 'https://www.niagads.org/datasets/ng00065',
				title: '',
				icon: 'download'
			}
		]
	}
]