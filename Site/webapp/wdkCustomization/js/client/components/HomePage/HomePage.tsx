import React from "react";
import { connect } from "react-redux";
import { MultiSearch, PrimaryActionButton, PrimaryLink, SearchResult, SecondaryLink } from "../../components/Shared";
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
    List,
    makeStyles,
    SvgIconProps,
    Typography,
    TypographyProps,
    withStyles,
} from "@material-ui/core";

import Browser from "./../Visualizations/Igv/IgvBrowser";
import NiagadsGWASTrack from "../../../lib/igv/niagadsTrack";

interface SectionProps {
    webAppUrl: string;
    endpoint: string;
}

const HomePage: React.FC<SectionProps> = ({ endpoint, webAppUrl }) => {
    const useBackgroundStyles = makeStyles((theme) =>
        createStyles({
            root: {
                backgroundColor: theme.palette.primary.dark,
            },
        })
    );

    const classes = useBackgroundStyles(),
        goto = useGoto();

    //should probably add the track too, shouldn't pass as default
    const buildBrowser = (b: any) => {
        b.addTrackToFactory("niagadsgwas", (config: any, browser: any) => new NiagadsGWASTrack(config, browser));
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
        <Grid justify="center" container item classes={{ root: classes.root }}>
            <Grid container direction="column" item xs={12} md={6} lg={4}>
                <Box p={1} pt={5} pb={4}>
                    <Grid item>
                        <MainText>
                            NIAGADS <br /> Alzheimer's Genomics Database
                        </MainText>
                    </Grid>
                    <Grid item>
                        <Box pt={1} pb={2}>
                            <DarkContrastText>
                                An interactive knowledgebase for AD genetics that provides a platform for data sharing,
                                discovery, and analysis to help advance the understanding of the complex genetic
                                underpinnings of AD neurodegeneration and accelerate the progress of research on AD and
                                AD related dementias.
                            </DarkContrastText>
                        </Box>
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
                        <SmallDarkContrastText>
                            Examples - Gene: <SecondaryLink to={"record/gene/ENSG00000130203"}> APOE</SecondaryLink> -
                            Variant by RefSNP: <SecondaryLink to="record/variant/rs6656401">rs6656401</SecondaryLink> -
                            Variant:{" "}
                            <SecondaryLink to="record/variant/19:45411941:T:C_rs429358">19:45411941:T:C</SecondaryLink>
                        </SmallDarkContrastText>
                    </Grid>
                </Box>
            </Grid>
            <Hidden mdDown={true}>
                <Grid justify="center" alignItems="center" container item xs={12} md={4}>
                    <Box pt={4}>
                        <img height={300} src={`${webAppUrl}/images/genomicsdb-tally-donut.svg`} />
                    </Box>
                </Grid>
            </Hidden>
            <Grid container item xs={12} justify="center">
                <Box>
                    <DownArrow style={{ fontSize: 65 }} color="secondary" />
                </Box>
            </Grid>
            <WhiteBackgroundSection>
                <Grid container justify="center" item xs={12}>
                    <Grid container alignItems="center" direction="column" item xs={10} lg={6}>
                        <MemoBrowser
                            searchUrl={`${window.location.origin}${webAppUrl}/service/track/feature?id=`}
                            //defaultSpan="chr19:1,040,101-1,065,572"
                            defaultSpan="ABCA7"
                            onBrowserLoad={buildBrowser}
                        />
                        <Box m={1} />
                        <LightContrastText>
                            The NIAGADS genome browser enables researchers to visually inspect and browse GWAS summary
                            statistics datasets in a broader genomic context. Our genome browser can also be used to
                            compare NIAGADS GWAS summary statistics tracks to each other, against annotated gene or
                            variant tracks, or to the more than &gt;50,000 functional genomics tracks from the NIAGADS{" "}
                            <PrimaryLink to="#">FILER</PrimaryLink> functional genomics repository.
                        </LightContrastText>
                        <Box m={1}>
                            <PrimaryActionButton onClick={goto.bind(null, `/visualizations/browser`)}>
                                Full Browser View
                            </PrimaryActionButton>
                        </Box>
                    </Grid>
                </Grid>
            </WhiteBackgroundSection>
            <GreyBackgroundSection>
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
            </GreyBackgroundSection>
            <WhiteBackgroundSection>
                <Grid container direction="column" item justify="center" alignItems="center">
                    <Grid item>
                        <LightBackgroundHeading>Alzheimer's Disease Sequencing Project</LightBackgroundHeading>
                    </Grid>
                    <Grid item container direction="row" justify="center">
                        <Grid container item alignContent="flex-start" xs={12} sm={4} lg={3}>
                            <LightContrastTextSubheading>ADSP Variants</LightContrastTextSubheading>
                            <SmallLightContrastText>
                                Variants in the NIAGADS GenomicsDB include the >29 million SNPs and ~50,000 short-indels
                                identified during the ADSP Discovery Phase whole-genome (WGS) and whole-exome sequencing
                                (WES) efforts (PMID: 29590295). These variants are highlighted in variant and dataset
                                reports and their quality control status is provided. Annotated tracks are available for
                                both the WES and WGS variants on the genome browser.
                            </SmallLightContrastText>
                        </Grid>
                        <Grid
                            container
                            item
                            alignContent="flex-start"
                            justify="space-between"
                            direction="row"
                            xs={12}
                            sm={4}
                            lg={3}
                        >
                            <LightContrastTextSubheading>Annotation</LightContrastTextSubheading>
                            <SmallLightContrastText>
                                Variants in the NIAGADS GenomicsDB include the >29 million SNPs and ~50,000 short-indels
                                identified during the ADSP Discovery Phase whole-genome (WGS) and whole-exome sequencing
                                (WES) efforts (PMID: 29590295). These variants are highlighted in variant and dataset
                                reports and their quality control status is provided. Annotated tracks are available for
                                both the WES and WGS variants on the genome browser.
                            </SmallLightContrastText>
                            <Box>
                                <LightContrastTextBold>GenomicsDB&nbsp;</LightContrastTextBold>
                                <SmallLightContrastText>
                                    provides access to the following ADSP meta-analysis summary statistics datasets:
                                </SmallLightContrastText>
                                <Box ml={1}>
                                    <List>
                                        <LightContrastTextBold>NG00065:&nbsp;</LightContrastTextBold>
                                        <SmallLightContrastText>
                                            Gene-level genetic evidence for AD based on analysis of exonic ADSP variants
                                        </SmallLightContrastText>
                                    </List>
                                    <List>
                                        <LightContrastTextBold>NG00065:&nbsp;</LightContrastTextBold>
                                        <SmallLightContrastText>
                                            Single-variant analysis for AD-risk association using exonic ADSP variants
                                        </SmallLightContrastText>
                                    </List>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" justify="center">
                        <Box maxWidth={"800px"}>
                            <img width={"100%"} src={`${webAppUrl}/images/NG00061.png`} />
                            <SmallLightContrastText>
                                Overview of variants annotated from the Discovery Phase of the ADSP. 578 individuals
                                from 111 families were whole-genome sequenced (WES), and 10,913 unrelated cases and
                                controls were whole-exome (WES) sequenced. From Butkiewicz et al. (2018) Functional
                                annotation of genomic variants in studies of late-onset Alzheimer's disease.
                                Bioinformatics 34(16):2724-2731 (after Table 1). PMID: 29590295
                            </SmallLightContrastText>
                        </Box>
                    </Grid>
                </Grid>
            </WhiteBackgroundSection>
            <GreyBackgroundSection>
                <Grid spacing={2} container alignItems="center" justify="center">
                    <Grid container item justify="center" xs={12} sm={6} md={4}>
                        <Grid item xs={12}>
                            <QuickStat
                                title="yielding"
                                type="variants"
                                mainText="250+ million"
                                captionText="annotated by AD/ADRD GWAS summary statistics"
                            />
                            <QuickStat
                                title="including"
                                type="variants"
                                mainText="29+ million"
                                captionText="flagged by the Alzheimer’s Disease Sequencing Project (ADSP)"
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <SmallLightContrastText>
                            As of December 2020, the GenomicsDB provides unrestricted access to genome-wide summary
                            statistics p-values from >70 GWAS and ADSP meta-analysis. Variants in these datasets are
                            consistently annotated using the ADSP Annotation pipeline and linked to gene and functional
                            genomics data to help not only make these data accessible, but also interpretable in the
                            broader genomic context.
                        </SmallLightContrastText>
                    </Grid>
                </Grid>
            </GreyBackgroundSection>
            <WhiteBackgroundSection>
                <Grid direction="column" alignItems="center" container>
                    <Grid item>
                        <LightBackgroundHeading>Latest News</LightBackgroundHeading>
                    </Grid>
                    <Grid item container justify="center" direction="row">
                        <Grid item xs={12} sm={4} lg={3}>
                            <NewsItem
                                date="January 1 2021"
                                title="News #1"
                                content="Big-data optimized relational database and interactive graphical workflows make it easy to interactively browse, compare, and mine AD-related summary statistics datasets."
                                target="#"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} lg={3}>
                            <NewsItem
                                date="January 1 2021"
                                title="News #2"
                                content="Big-data optimized relational database and interactive graphical workflows make it easy to interactively browse, compare, and mine AD-related summary statistics datasets."
                                target="#"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} lg={3}>
                            <NewsItem
                                date="January 1 2021"
                                title="News #3"
                                content="Big-data optimized relational database and interactive graphical workflows make it easy to interactively browse, compare, and mine AD-related summary statistics datasets."
                                target="#"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </WhiteBackgroundSection>
        </Grid>
    );
};

export const buildRouteFromResult = (result: SearchResult) => `/record/${result.record_type}/${result.primary_key}`,
    buildSummaryRoute = (searchTerm: string) => `/searchResults?searchTerm=${searchTerm}`;

export default connect<{ webAppUrl: string; endpoint: string }, any, {}>((state: any) => ({
    webAppUrl: state.globalData.siteConfig.webAppUrl,
    endpoint: state.globalData.siteConfig.endpoint,
}))(HomePage);

const MainText = withStyles({
    root: {
        fontSize: 36,
        fontWeight: 600,
    },
})((props: TypographyProps) => <Typography {...props} variant="h4" color="secondary" />);

const WhiteBackgroundSection = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.grey[50],
        padding: theme.spacing(3),
    },
}))((props: GridProps) => <Grid container item xs={12} {...props} />);

const GreyBackgroundSection = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.grey[200],
    },
}))(WhiteBackgroundSection);

const baseLineHeight = { lineHeight: 1.4 };

const DarkContrastText = withStyles((theme) =>
    createStyles({
        caption: {
            color: theme.palette.primary.contrastText,
            opacity: ".7",
            fontSize: "16px",
            fontWeight: 300,
            ...baseLineHeight,
        },
    })
)((props: TypographyProps) => <Typography variant="caption" {...props} />);

const SmallDarkContrastText = withStyles((theme) =>
    createStyles({
        caption: {
            color: theme.palette.primary.contrastText,
            opacity: ".8",
            fontSize: "14px",
            fontWeight: 200,
            ...baseLineHeight,
        },
    })
)((props: TypographyProps) => <Typography variant="caption" {...props} />);

const LightContrastText = withStyles((theme) =>
    createStyles({
        caption: {
            color: theme.palette.grey[600],
            fontSize: "16px",
            fontWeight: 200,
            ...baseLineHeight,
        },
    })
)((props: TypographyProps) => <Typography variant="caption" {...props} />);

const LightContrastTextBold = withStyles((theme) =>
    createStyles({
        caption: {
            color: theme.palette.grey[600],
            fontSize: "16px",
            fontWeight: 600,
            ...baseLineHeight,
        },
    })
)((props: TypographyProps) => <Typography variant="caption" {...props} />);

const LightContrastTextSubheading = withStyles((theme) =>
    createStyles({
        caption: {
            color: theme.palette.grey[600],
            fontSize: "18px",
            fontWeight: 600,
            ...baseLineHeight,
        },
    })
)((props: TypographyProps) => <Typography variant="caption" {...props} />);

const SmallLightContrastText = withStyles((theme) =>
    createStyles({
        caption: {
            color: theme.palette.grey[600],
            fontSize: "14px",
            fontWeight: 200,
            ...baseLineHeight,
        },
    })
)((props: TypographyProps) => <Typography variant="caption" {...props} />);

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
                <LightBackgroundHeading>{title}</LightBackgroundHeading>
                <IconCardText>{text}</IconCardText>
            </Grid>
        </Grid>
    </Box>
);

const LightBackgroundHeading = withStyles((theme) => ({
    root: { color: theme.palette.grey[700], paddingBottom: "10px", fontSize: "24px" },
}))(Typography);

const IconCardText = withStyles((theme) => ({ root: { color: theme.palette.grey[500], fontSize: "20px" } }))(
    Typography
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
    title: string;
    type: "variants";
}

const QuickStat: React.FC<QuickStat> = ({ captionText, mainText, title, type }) => (
    <Box p={1}>
        <LightContrastText>{title}</LightContrastText>
        <QuickStatMainText>{mainText}</QuickStatMainText>
        <Box>
            <LightContrastTextBold>{type}&nbsp;</LightContrastTextBold>
            <LightContrastText>{captionText}</LightContrastText>
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
        <Box>
            <Grid alignItems="flex-start" container direction="column">
                <LightContrastText>{date}</LightContrastText>
                <LightContrastTextSubheading>{title}</LightContrastTextSubheading>
                <SmallLightContrastText>{content}</SmallLightContrastText>
                <Box pb={1} pt={1}>
                    <PrimaryActionButton onClick={goto.bind(null, target)}>Learn More</PrimaryActionButton>
                </Box>
            </Grid>
        </Box>
    );
};
