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
    Hidden,
    makeStyles,
    SvgIconProps,
    Typography,
    TypographyProps,
    useTheme,
    withStyles,
} from "@material-ui/core";

import Browser from "./../Visualizations/Igv/IgvBrowser";
import NiagadsGWASTrack from "../../../lib/igv/niagadsTrack";

interface SectionProps {
    webAppUrl: string;
}

const HomePage: React.FC<SectionProps> = (props) => {
    const { webAppUrl } = props;

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
            url: "http://localhost:8080/genomics_gus_4/service/track/gwas?track=NG00075_STAGE1",
            maxLogP: 25,
            autoscale: false,
            displayMode: "EXPANDED",
            visibilityWindow: 100000,
            snpField: "record_pk",
        });
    };
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
                            <DarkContrastCaption>
                                An interactive knowledgebase for AD genetics that provides a platform for data sharing,
                                discovery, and analysis to help advance the understanding of the complex genetic
                                underpinnings of AD neurodegeneration and accelerate the progress of research on AD and
                                AD related dementias.
                            </DarkContrastCaption>
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
                        <SmallDarkContrastCaption>
                            Examples - Gene: <SecondaryLink to={"record/gene/ENSG00000130203"}> APOE</SecondaryLink> -
                            Variant by RefSNP: <SecondaryLink to="record/variant/rs6656401">rs6656401</SecondaryLink> -
                            Variant:{" "}
                            <SecondaryLink to="record/variant/19:45411941:T:C_rs429358">19:45411941:T:C</SecondaryLink>
                        </SmallDarkContrastCaption>
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
            <Grid container item xs={12}>
                <WhiteBackgroundBox p={2}>
                    <Grid container justify="center" item xs={12}>
                        <Grid container alignItems="center" direction="column" item xs={10} lg={6}>
                            <Browser
                                searchUrl={`${window.location.origin}${webAppUrl}/service/track/feature?id=`}
                                defaultSpan="chr19:1,040,101-1,065,572"
                                onBrowserLoad={buildBrowser}
                            />
                            <Box m={1} />
                            <LightContrastCaption>
                                The NIAGADS genome browser enables researchers to visually inspect and browse GWAS
                                summary statistics datasets in a broader genomic context. Our genome browser can also be
                                used to compare NIAGADS GWAS summary statistics tracks to each other, against annotated
                                gene or variant tracks, or to the more than &gt;50,000 functional genomics tracks from
                                the NIAGADS <PrimaryLink to="#">FILER</PrimaryLink> functional genomics repository.
                            </LightContrastCaption>

                            <PrimaryActionButton onClick={goto.bind(null, `/visualizations/browser`)}>
                                Full Browser View
                            </PrimaryActionButton>
                            <Box m={1} />
                        </Grid>
                    </Grid>
                </WhiteBackgroundBox>
            </Grid>
            <Grid container item xs={12}>
                <GreyBackgroundBox p={2}>
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
                </GreyBackgroundBox>
            </Grid>
        </Grid>
    );
};

export const buildRouteFromResult = (result: SearchResult) => `/record/${result.record_type}/${result.primary_key}`,
    buildSummaryRoute = (searchTerm: string) => `/searchResults?searchTerm=${searchTerm}`;

export default connect<{ webAppUrl: string }, any, {}>((state: any) => ({
    webAppUrl: state.globalData.siteConfig.webAppUrl,
}))(HomePage);

const MainText = withStyles({
    root: {
        fontSize: 36,
        fontWeight: 600,
    },
})((props: TypographyProps) => <Typography {...props} variant="h4" color="secondary" />);

const WhiteBackgroundBox = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.grey[50],
        flexGrow: 1,
    },
}))(Box);

const GreyBackgroundBox = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.grey[200],
        flexGrow: 1,
    },
}))(Box);

const DarkContrastCaption = withStyles((theme) =>
    createStyles({
        caption: {
            color: theme.palette.primary.contrastText,
            opacity: ".7",
            fontSize: "16px",
            fontWeight: 300,
        },
    })
)((props: TypographyProps) => <Typography variant="caption" {...props} />);

const SmallDarkContrastCaption = withStyles((theme) =>
    createStyles({
        caption: {
            color: theme.palette.primary.contrastText,
            opacity: ".8",
            fontSize: "14px",
            fontWeight: 200,
        },
    })
)((props: TypographyProps) => <Typography variant="caption" {...props} />);

const LightContrastCaption = withStyles((theme) =>
    createStyles({
        caption: {
            color: theme.palette.grey[600],
            fontSize: "16px",
            fontWeight: 300,
        },
    })
)((props: TypographyProps) => <Typography variant="caption" {...props} />);

interface IconCard {
    Icon: React.ComponentType<SvgIconProps>;
    text: string;
    title: string;
}

const IconCard: React.FC<IconCard> = ({ Icon, text, title }) => {
    const theme = useTheme();

    return (
        <Box p={3} flexGrow={1}>
            <Grid container item>
                <Grid item container alignItems="center" xs={4}>
                    <Icon style={{ color: theme.palette.primary.light, fontSize: "124px" }} />
                </Grid>
                <Grid item container direction="column" xs={8}>
                    <IconCardTitle>{title}</IconCardTitle>
                    <IconCardText>{text}</IconCardText>
                </Grid>
            </Grid>
        </Box>
    );
};

const IconCardTitle = withStyles((theme) => ({ root: { color: theme.palette.grey[800], fontSize: "24px" } }))(
        Typography
    ),
    IconCardText = withStyles((theme) => ({ root: { color: theme.palette.grey[600], fontSize: "24px" } }))(Typography);
