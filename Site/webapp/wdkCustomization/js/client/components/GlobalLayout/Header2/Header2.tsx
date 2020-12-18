import React, { useState } from "react";
import { Box, Grid, Hidden, Menu, MenuItem, Typography, withStyles } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./../../../theme";
import { useGoto } from "./../../../hooks";
import { PrimaryActionButton } from "./../../Shared";

interface Header {
    isLoggedIn: boolean;
}

const menuConfig: MenuElement[] = [
    { title: "Home", target: "/" },
    { title: "Search Datasets", target: "/search/gwas_summary/browse" },
    { title: "Workspace", target: "/workspace/strategies" },
    {
        title: "Tools",
        items: [{ title: "Genome Browser", target: "/visualizations/browser" }],
    },
    { title: "Documentation", target: "#" },
    { title: "News", target: "#" },
];

const Header: React.FC<Header> = ({ isLoggedIn }) => {
    return (
        <ThemeProvider theme={theme}>
            <Grid container className="p-2">
                <Hidden mdDown>
                    <Grid container item md={6}>
                        <Typography color="primary" variant="h4">
                            <Box fontWeight={"fontWeightBold"}>GenomicsDB</Box>
                        </Typography>
                    </Grid>
                </Hidden>
                <Grid item spacing={2} direction="column" container xs={12} md={6}>
                    <Grid item container>
                        <Grid item container justify="flex-end" alignItems="center">
                            <Grid item className="mr-2" alignItems="center">
                                <Typography>
                                    <strong>Build Number: GRCh37.p13/hg19</strong>
                                    <span className="m-3">|</span>
                                    <span>Welcome, Guest</span>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <PrimaryActionButton>User Login</PrimaryActionButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item justify="flex-end" container>
                        <Grid container item xs={12} xl={9} justify="space-evenly">
                            {menuConfig.map((conf, i) => (
                                <>
                                    <MenuElement key={i} {...conf} />
                                    {i === menuConfig.length - 1 ? null : "|"}
                                </>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
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
        <div>
            <MenuTitle onClick={onClick}>
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
                            {i.title}
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </div>
    );
};

const MenuTitleStyles = (Theme: typeof theme) => ({
    root: {
        fontWeight: Theme.typography.fontWeightLight,
        opacity: 0.7,
        cursor: "pointer",
    },
});

const MenuTitle = withStyles(MenuTitleStyles)(Typography);

export default Header;
