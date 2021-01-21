import React from "react";
import { connect } from "react-redux";
import {
    PrimaryExternalLink,
    MultiSearch,
    PrimaryActionButton,
    PrimaryLink,
    SearchResult,
    SecondaryLink,
    BoldPrimaryLink,
} from "../../components/Shared";
import { useGoto } from "../../hooks";
import DownArrow from "@material-ui/icons/ArrowDropDown";
import Explore from "@material-ui/icons/FindReplace";
import Analyze from "@material-ui/icons/ScatterPlot";
import Share from "@material-ui/icons/GetApp";
import {
    Box,
    createStyles,
    Grid,
    GridProps,
    Hidden,
    makeStyles,
    SvgIconProps,
    Typography,
    TypographyProps,
    useTheme,
    withStyles,
} from "@material-ui/core";

import Browser from "./../Visualizations/Igv/IgvBrowser";
import { NiagadsGwasTrack } from "../../../lib/igv/NiagadsTracks";
import {
    DarkContrastText,
    LightContrastCaptionTextItalic,
    LightContrastText,
    LightContrastTextBold,
    LightContrastTextHeading,
    LightContrastTextSubheading,
} from "../Shared/Typography";

interface HomePage {
    webAppUrl: string;
    endpoint: string;
}

const HomePage: React.FC<HomePage> = ({ endpoint, webAppUrl }) => {
    const goto = useGoto();

    const buildBrowser = (b: any) => {
        b.addTrackToFactory("niagadsgwas", (config: any, browser: any) => new NiagadsGwasTrack(config, browser));
        b.loadTrack({
            name: "NG00075 Stage 1",
            type: "niagadsgwas",
            url: `${endpoint}/track/gwas?track=NG00075_STAGE1`,
            maxLogP: 25,
            autoscale: false,
            displayMode: "EXPANDED",
            visibilityWindow: 100000,
            snpField: "record_pk",
        });
    };

    const MemoBrowser = React.memo(Browser);

    return (
        <Grid justify="center" container item>
            {/* header */}
            <BlueBackgroundSection>
                <WiderWidthRow>
                    {/* chart and search bar */}
                    <Grid item container spacing={10} direction="row">
                        {/* heading and search bar column */}
                        <Grid item direction="row" container xs={12} md={6}>
                            <Grid item container spacing={2} direction="column">
                                <Grid item>
                                    <MainText>
                                        NIAGADS <br /> Alzheimer's Genomics Database
                                    </MainText>
                                </Grid>
                                <Grid item>
                                    <DarkContrastText>
                                        An interactive knowledgebase for AD genetics that provides a platform for data
                                        sharing, discovery, and analysis to help advance the understanding of the
                                        complex genetic underpinnings of AD neurodegeneration and accelerate the
                                        progress of research on AD and AD related dementias.
                                    </DarkContrastText>
                                </Grid>
                                <Grid item>
                                    <MultiSearch
                                        onSelect={(result: SearchResult & { searchTerm: string }) =>
                                            goto(
                                                result.type == "summary"
                                                    ? buildSummaryRoute(result.searchTerm)
                                                    : buildRouteFromResult(result)
                                            )
                                        }
                                    />
                                </Grid>
                                <Grid item>
                                    <DarkContrastText variant="caption">
                                        Examples - Gene:{" "}
                                        <SecondaryLink to={"record/gene/ENSG00000130203"}> APOE</SecondaryLink> -
                                        Variant by RefSNP:{" "}
                                        <SecondaryLink to="record/variant/rs6656401">rs6656401</SecondaryLink> -
                                        Variant:{" "}
                                        <SecondaryLink to="record/variant/19:45411941:T:C_rs429358">
                                            19:45411941:T:C
                                        </SecondaryLink>
                                    </DarkContrastText>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* chart column */}
                        <Hidden mdDown>
                            <Grid item justify="center" alignItems="center" container md={6}>
                                <img height={300} src={`${webAppUrl}/images/genomicsdb-tally-donut.svg`} />
                            </Grid>
                        </Hidden>
                    </Grid>
                    {/* down arrow row */}
                    <Grid direction="row" container item xs={12} justify="center">
                        <DownArrow style={{ fontSize: 65 }} color="secondary" />
                    </Grid>
                </WiderWidthRow>
            </BlueBackgroundSection>
            {/* genome browser section */}
            <WhiteBackgroundSection>
                <WiderWidthRow>
                    <Grid container alignItems="center" item direction="column" spacing={6}>
                        <LightContrastTextHeading>Explore the genomic context of AD variants</LightContrastTextHeading>
                        <Grid item container spacing={4} direction="row">
                            <Grid item xs={12} md={8}>
                                <MemoBrowser
                                    searchUrl={`${window.location.origin}${webAppUrl}/service/track/feature?id=`}
                                    defaultSpan="ABCA7"
                                    onBrowserLoad={buildBrowser}
                                    serviceUrl={endpoint}
                                />
                            </Grid>
                            <Grid container item xs={12} md={4} alignContent="space-between" justify="center">
                                <LightContrastText>
                                    The NIAGADS genome browser enables researchers to visually inspect and browse GWAS
                                    summary statistics datasets in a broader genomic context. Our genome browser can
                                    also be used to compare NIAGADS GWAS summary statistics tracks to each other,
                                    against annotated gene or variant tracks, or to the more than &gt;50,000 functional
                                    genomics tracks from the NIAGADS <PrimaryLink to="#">FILER</PrimaryLink> functional
                                    genomics repository.
                                </LightContrastText>
                                <PrimaryActionButton onClick={goto.bind(null, `/visualizations/browser?locus=ABCA7`)}>
                                    Full Browser View
                                </PrimaryActionButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </WiderWidthRow>
            </WhiteBackgroundSection>
            <GreyBackgroundSection>
                <NarrowerWidthRow>
                    <Grid container item justify="center">
                        <LightContrastTextHeading>About the Project</LightContrastTextHeading>
                        <LightContrastText>
                            The Genomics Database is developed by a team of researchers at the University of
                            Pennsylvania as part of the{" "}
                            <PrimaryExternalLink href="https://www.niagads.org/">
                                National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site
                            </PrimaryExternalLink>{" "}
                            (NIAGADS), a national genetics repository created by NIA to facilitate access to genotypic
                            data for the study of the genetics of late-onset Alzheimer's disease. We welcome the
                            involvement of interested researchers.{" "}
                            <PrimaryExternalLink href="#">Click here to learn more</PrimaryExternalLink> about
                            contributing data or making formal data access requests. Or{" "}
                            <PrimaryExternalLink href="#">contact us</PrimaryExternalLink> for more information. The
                            GenomicsDB is a collaboration among the following organizations which may also provide
                            funding or governance:
                        </LightContrastText>
                    </Grid>
                    <Grid container item spacing={4} direction="row" justify="center" alignItems="center">
                        <Grid item>
                            <img height="30px" src={`${webAppUrl}/images/nih-logo.svg`} />
                        </Grid>
                        <Grid item>
                            <img height="30px" src={`${webAppUrl}/images/psom_logo_blue.png`} />
                        </Grid>
                        <Grid item>
                            <img height="50px" src={`${webAppUrl}/images/adsp-logo.svg`} />
                        </Grid>
                    </Grid>
                </NarrowerWidthRow>
            </GreyBackgroundSection>
            <WhiteBackgroundSection>
                <NarrowerWidthRow>
                    <Grid item container justify="center">
                        <LightContrastTextHeading>ADSP Collaboration</LightContrastTextHeading>
                        <LightContrastText>
                            The NIAGADS Genomics Database has an ongoing collaboration with the{" "}
                            <PrimaryExternalLink href="#">Alzheimer's Disease Sequencing Project</PrimaryExternalLink>{" "}
                            (ADSP). The GenomicsDB allows browsing, searching, and analysis of variants and genes linked
                            to the risk of developing late-onset Alzheimer's disease that were identified through the
                            ADSP's sequencing efforts and downstream meta-analyses.
                        </LightContrastText>
                    </Grid>
                    <Grid container item direction="row" justify="flex-start">
                        <Grid item xs={12}>
                            <LightContrastTextSubheading>ADSP Variants</LightContrastTextSubheading>
                        </Grid>
                        <Grid container item spacing={5} direction="row">
                            <Grid item xs={12} sm={6}>
                                <LightContrastText>
                                    Annotated variants in the NIAGADS GenomicsDB include SNPs and short-indels
                                    identified during the ADSP Discovery Phase whole-genome (WGS) and whole-exome
                                    sequencing (WES) efforts. These variants are highlighted in variant and dataset
                                    reports and their quality control status is provided. Annotated tracks are available
                                    for both the WES and WGS variants on the genome browser.
                                </LightContrastText>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Grid item container direction="column" wrap="nowrap">
                                    <img width={"100%"} src={`${webAppUrl}/images/NG00061.png`} />
                                    <LightContrastCaptionTextItalic>
                                        From Butkiewicz et al. (2018) Functional annotation of genomic variants in
                                        studies of late-onset Alzheimer's disease. Bioinformatics 34(16):2724-2731
                                        (after Table 1). PMID:{" "}
                                        <PrimaryExternalLink href="#">29590295</PrimaryExternalLink>
                                    </LightContrastCaptionTextItalic>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" justify="flex-start">
                        <LightContrastTextSubheading>ADSP Annotation</LightContrastTextSubheading>
                        <LightContrastText>
                            As part of their sequencing effort, the ADSP developed an annotation pipeline that
                            efficiently integrates standard annotations and ranks potential variant impacts according to
                            predicted effect (such as codon changes, loss of function, and potential deleteriousness)
                            (PMID: <PrimaryExternalLink href="#">29590295</PrimaryExternalLink>). All variants in the
                            GenomicsDB have been annotated using this pipeline. Lists of user uploaded variants are
                            annotated in real-time.
                        </LightContrastText>
                    </Grid>
                    <Grid container item direction="column">
                        <LightContrastTextSubheading>ADSP Meta-analysis Results</LightContrastTextSubheading>
                        <LightContrastText>
                            The GenomicsDB provides access to summary statistics from the following ADSP meta-analyses:
                        </LightContrastText>
                        <Box mt={1}></Box>
                        <Box display="flex">
                            <Typography>
                                <BoldPrimaryLink to="#">NG00065:&nbsp;</BoldPrimaryLink>
                            </Typography>
                            <LightContrastTextBold>
                                ADSP Discovery Case/Control Association Results{" "}
                            </LightContrastTextBold>
                        </Box>
                        <Box>
                            <LightContrastText>
                                These datasets contain results from <PrimaryLink to="#">single variant</PrimaryLink> and{" "}
                                <PrimaryLink to="#">gene-based rare variant</PrimaryLink>
                                aggregation tests, performed separately by ancestry (European ancestry, Caribbean
                                Hispanic) and meta-analyzed.
                            </LightContrastText>
                        </Box>
                    </Grid>
                </NarrowerWidthRow>
            </WhiteBackgroundSection>
            {/*  <GreyBackgroundSection>
                <Grid container direction="row" item justify="center" alignItems="center">
                    <Grid container item xs={12} md={4} lg={3}>
                        <IconCard title="Explore" text="lorem ipsum lorem ipsum lorem ipsum" Icon={Explore} />
                    </Grid>
                    <Grid container item xs={12} md={4} lg={3}>
                        <IconCard title="Analyze" text="lorem ipsum lorem ipsum lorem ipsum" Icon={Analyze} />
                    </Grid>
                    <Grid container item xs={12} md={4} lg={3}>
                        <IconCard title="Share" text="lorem ipsum lorem ipsum lorem ipsum" Icon={Share} />
                    </Grid>
                </Grid>
            </GreyBackgroundSection> */}
            <GreyBackgroundSection>
                <NarrowerWidthRow>
                    <Grid item container direction="row" spacing={4}>
                        <Grid container item justify="center" xs={12} md={6}>
                            <Grid item container spacing={3} xs={12}>
                                <Grid item>
                                    <QuickStat
                                        type="variants"
                                        mainText="250+ million"
                                        captionText="annotated by AD/ADRD GWAS summary statistics"
                                    />
                                </Grid>
                                <Grid item>
                                    <QuickStat
                                        title="including"
                                        type="variants"
                                        mainText="29+ million"
                                        captionText="flagged by the Alzheimer’s Disease Sequencing Project (ADSP)"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" item xs={12} md={6}>
                            <LightContrastText>
                                As of December 2020, the GenomicsDB provides unrestricted access to genome-wide summary
                                statistics p-values from >70 GWAS and ADSP meta-analysis. Variants in these datasets are
                                consistently annotated using the ADSP Annotation pipeline and linked to gene and
                                functional genomics data to help not only make these data accessible, but also
                                interpretable in the broader genomic context.
                            </LightContrastText>
                        </Grid>
                    </Grid>
                </NarrowerWidthRow>
            </GreyBackgroundSection>
            <WhiteBackgroundSection>
                <WiderWidthRow>
                    <Grid direction="column" alignItems="center" container>
                        <Grid item>
                            <Box p={3}>
                                <LightContrastTextHeading>Latest Updates</LightContrastTextHeading>
                            </Box>
                        </Grid>
                        <Grid item container spacing={10} justify="center" direction="row">
                            <Grid container item xs={12} md={4}>
                                <NewsItem
                                    date="January 1 2021"
                                    title="News #1"
                                    content="Big-data optimized relational database and interactive graphical workflows make it easy to interactively browse, compare, and mine AD-related summary statistics datasets."
                                    target="#"
                                />
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <NewsItem
                                    date="January 1 2021"
                                    title="News #2"
                                    content="Big-data optimized relational database and interactive graphical workflows make it easy to interactively browse, compare, and mine AD-related summary statistics datasets."
                                    target="#"
                                />
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <NewsItem
                                    date="January 1 2021"
                                    title="News #3"
                                    content="Big-data optimized relational database and interactive graphical workflows make it easy to interactively browse, compare, and mine AD-related summary statistics datasets."
                                    target="#"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </WiderWidthRow>
            </WhiteBackgroundSection>
        </Grid>
    );
};

export const buildRouteFromResult = (result: SearchResult) => `/record/${result.record_type}/${result.primary_key}`,
    buildSummaryRoute = (searchTerm: string) => `/searchResults?searchTerm=${searchTerm}`;

export default connect((state: any) => ({
    webAppUrl: state.globalData.siteConfig.webAppUrl,
    endpoint: state.globalData.siteConfig.endpoint,
}))(HomePage);

const MainText = withStyles({
    root: {
        fontSize: 36,
        fontWeight: 600,
    },
})((props: TypographyProps) => <Typography {...props} variant="h4" color="secondary" />);

const useInnerSectionStyles = makeStyles((theme) =>
    createStyles({
        root: {
            maxWidth: theme.breakpoints.width("lg"),
        },
    })
);

const Section = (props: GridProps) => {
    const innerClasses = useInnerSectionStyles(),
        theme = useTheme();

    return (
        <Grid
            container
            style={{ paddingTop: theme.spacing(5), paddingBottom: theme.spacing(5) }}
            item
            xs={12}
            justify="center"
            classes={props.classes}
        >
            <Grid
                alignContent="center"
                alignItems="center"
                item
                container
                classes={innerClasses}
                direction="column"
                wrap="nowrap"
            >
                {props.children}
            </Grid>
        </Grid>
    );
};

const WhiteBackgroundSection = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.grey[50],
    },
}))(Section);

const GreyBackgroundSection = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.grey[200],
    },
}))(Section);

const BlueBackgroundSection = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.dark,
    },
}))(Section);

const NarrowerWidthRow = (props: GridProps) => (
    <Grid {...props} spacing={3} container direction="row" item alignItems="center" justify="center" xs={12} md={10}>
        {props.children}
    </Grid>
);

const WiderWidthRow = (props: GridProps) => (
    <Grid {...props} spacing={3} container direction="row" item alignItems="center" justify="center" xs={12} md={12}>
        {props.children}
    </Grid>
);

interface IconCard {
    Icon: React.ComponentType<SvgIconProps>;
    text: string;
    title: string;
}

const IconCard: React.FC<IconCard> = ({ Icon, text, title }) => (
    <Box p={3} flexGrow={1}>
        <Grid container item>
            <Grid item container justify="flex-end" alignItems="center" xs={4}>
                <IconCardIcon Icon={Icon} />
            </Grid>
            <Grid item container direction="column" xs={8}>
                <LightContrastTextSubheading>{title}</LightContrastTextSubheading>
                <LightContrastText>{text}</LightContrastText>
            </Grid>
        </Grid>
    </Box>
);

const IconCardIcon: React.FC<{ Icon: React.ComponentType<SvgIconProps> }> = ({ Icon }) => {
    const StyledIcon = withStyles((theme) =>
        createStyles({
            root: {
                color: theme.palette.primary.light,
                fontSize: "124px",
                [theme.breakpoints.down("lg")]: { fontSize: "90px" },
            },
        })
    )(Icon);

    return <StyledIcon />;
};

interface QuickStat {
    captionText: string;
    mainText: string;
    title?: string;
    type: "variants";
}

const QuickStat: React.FC<QuickStat> = ({ captionText, mainText, title, type }) => (
    <Box>
        <LightContrastText>{title}</LightContrastText>
        <QuickStatMainText>{mainText}</QuickStatMainText>
        <Box>
            <LightContrastText>{type}&nbsp;</LightContrastText>
            <LightContrastTextBold>{captionText}</LightContrastTextBold>
        </Box>
    </Box>
);

const QuickStatMainText = withStyles((theme) => ({
    root: {
        fontSize: 42,
        fontWeight: 600,
        paddingTop: ".5px",
        paddingBottom: ".5px",
        color: theme.palette.primary.light,
    },
}))((props: TypographyProps) => <Typography {...props} variant="h4" />);

interface NewsItem {
    content: string;
    date: string;
    target: string;
    title: string;
}

const NewsItem: React.FC<NewsItem> = ({ content, date, target, title }) => {
    const goto = useGoto();

    return (
        <Grid alignItems="flex-start" container item direction="column" spacing={2}>
            <Grid item container direction="column" spacing={2}>
                <Grid item>
                    <LightContrastText>{date}</LightContrastText>
                </Grid>
                <Grid item>
                    <LightContrastTextSubheading>{title}</LightContrastTextSubheading>
                </Grid>
                <Grid item>
                    <LightContrastText variant="body2">{content}</LightContrastText>
                </Grid>
            </Grid>
            <Box pl={1} pr={1} pt={5} pb={5}>
                <PrimaryActionButton onClick={goto.bind(null, target)}>Learn More</PrimaryActionButton>
            </Box>
        </Grid>
    );
};
