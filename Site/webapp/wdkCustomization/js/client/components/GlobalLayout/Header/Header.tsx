import React, { useState } from "react";
import { Box, Grid, Hidden, Menu, MenuItem, Typography, TypographyProps, withStyles } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../../../theme";
import { useGoto } from "../../../hooks";
import { MultiSearch, PrimaryActionButton, SearchResult } from "../../Shared";
import { Home } from "@material-ui/icons";
import { BaseText } from "../../Shared/Typography";
import { buildRouteFromResult, buildSummaryRoute } from "../../HomePage/HomePage";

interface Header {
    isLoggedIn: boolean;
}

const menuConfig: MenuElement[] = [
    { title: "Home", target: "/" },
    { title: "Search Datasets", target: "/search/gwas_summary/browse" },
    { title: "Workspace", target: "/workspace/strategies" },
    {
        title: "Genome Browser",
        target: "/visualizations/browser",
    },
    { title: "Documentation", target: "#" }, //this could also be a dropdown with various kinds of documentation
    { title: "About", target: "#" },
];

const Header: React.FC<Header> = ({ isLoggedIn }) => {
    const goto = useGoto();
    return (
        <ThemeProvider theme={theme}>
            <Box borderBottom={1} borderColor="grey.500">
                <Grid container className="p-2">
                    <Hidden smDown>
                        <Grid container alignItems="center" item xs={3}>
                            <SiteTitle>GenomicsDB</SiteTitle>
                        </Grid>
                    </Hidden>
                    <Grid item container direction="row" xs={12} lg={9}>
                        <Grid item spacing={2} direction="column" container>
                            <Grid direction="row" wrap="nowrap" item container justify="flex-end" alignItems="center">
                                <Grid item className="mr-2" container alignItems="center" wrap="nowrap">
                                    <Hidden mdUp>
                                        <Grid container justify="flex-start" item>
                                            <SiteTitle>GenomicsDB</SiteTitle>
                                        </Grid>
                                    </Hidden>
                                    <Grid item alignItems="center" container spacing={3} justify="flex-end">
                                        <Grid item>
                                            <BaseText variant="body2">
                                                <strong>Build Number: GRCh37.p13/hg19</strong>
                                            </BaseText>
                                        </Grid>
                                        <Grid item>|</Grid>
                                        <Grid item>
                                            <BaseText>Welcome, Guest</BaseText>
                                        </Grid>
                                        <Grid item>
                                            <PrimaryActionButton>User Login</PrimaryActionButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid direction="row" item justify="space-between" container>
                                <Grid item container justify="center" xs={6} md={3}>
                                    <MultiSearch
                                        onSelect={(value: SearchResult, searchTerm: string) =>
                                            goto(
                                                !value || value.type == "summary"
                                                    ? buildSummaryRoute(searchTerm)
                                                    : buildRouteFromResult(value)
                                            )
                                        }
                                    />
                                </Grid>
                                <Grid
                                    alignItems="center"
                                    container
                                    item
                                    xs={12}
                                    md={9}
                                    wrap="nowrap"
                                    justify="space-evenly"
                                >
                                    {menuConfig.map((conf, i) => (
                                        <React.Fragment key={i}>
                                            <MenuElement {...conf} />
                                        </React.Fragment>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
};

interface MenuElement {
    items?: MenuItemConfig[];
    target?: string;
    title: string;
}

interface MenuItemConfig {
    title: string;
    target: string;
}

const MenuElement: React.FC<MenuElement> = ({ items, target, title }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null),
        goto = useGoto(),
        onClick = items
            ? (e: React.MouseEvent<HTMLSpanElement>) => setAnchorEl(e.currentTarget)
            : goto.bind(null, target);

    return (
        <Box pl={1}>
            <MenuTitle onClick={onClick}>
                {title === "Home" && <Home />}
                {title}
                {items ? (
                    <>
                        &nbsp;
                        <span className={anchorEl ? "fa fa-caret-down" : "fa fa-caret-up"} />
                    </>
                ) : null}
            </MenuTitle>
            {items && (
                <Menu
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    getContentAnchorEl={null}
                    anchorEl={anchorEl}
                    keepMounted
                    open={!!anchorEl}
                    onClose={() => setAnchorEl(null)}
                >
                    {items.map((i) => (
                        <MenuItem key={i.target} onClick={goto.bind(null, i.target)}>
                            <MenuTitle>{i.title}</MenuTitle>
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </Box>
    );
};

const MenuTitleStyles = (Theme: typeof theme) => ({
    root: {
        fontWeight: Theme.typography.fontWeightLight,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        "&:hover": {
            color: theme.palette.grey[500],
        },
    },
});

const MenuTitle = withStyles(MenuTitleStyles)(Typography);

const SiteTitle = withStyles((theme) => ({
    root: { cursor: "pointer", fontWeight: theme.typography.fontWeightBold },
}))((props: TypographyProps) => {
    const goto = useGoto();
    return <Typography {...props} color="primary" onClick={goto.bind(null, "/")} variant="h4" />;
});

export default Header;
