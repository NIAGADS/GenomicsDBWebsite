import React from "react";
import { useSelector } from "react-redux";

import { fade, makeStyles, Theme, createStyles, styled } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import HomeIcon from "@material-ui/icons/Home";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import CodeIcon from "@material-ui/icons/Code";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import MoreIcon from "@material-ui/icons/MoreVert";
import LineStyleIcon from "@material-ui/icons/LineStyle";

import { SiteSearch, SearchResult } from "../../Tools";
import { buildRouteFromResult, buildSummaryRoute } from "../../../util/util";
import { useGoto } from "../../../hooks";
import { RootState } from "wdk-client/Core/State/Types";

// apply material-ui spacing system to the buttons
const TextButton = styled(Button)(({ theme }) => ({
    hover: { color: theme.palette.secondary.main },
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
}));

//import logo from "./images/logo.png";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        logo: {
            maxWidth: 40,
            marginRight: "10px",
        },
        grow: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            display: "none",
            [theme.breakpoints.up("sm")]: {
                display: "block",
            },
        },
        search: {
            position: "relative",
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.primary.dark, 0.15),
            "&:hover": {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: "100%",
            [theme.breakpoints.up("sm")]: {
                marginLeft: theme.spacing(3),
                width: "auto",
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: "100%",
            position: "absolute",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        inputRoot: {
            color: "inherit",
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create("width"),
            width: "100%",
            [theme.breakpoints.up("md")]: {
                width: "20ch",
            },
        },
        sectionDesktop: {
            display: "none",
            [theme.breakpoints.up("md")]: {
                display: "flex",
            },
        },
        sectionMobile: {
            display: "flex",
            [theme.breakpoints.up("md")]: {
                display: "none",
            },
        },
    })
);

function PrimarySearchAppBar() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);
    const isGuest = useSelector((state: RootState) => state.globalData?.user?.isGuest);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const goto = useGoto();

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const accountMenuId = "primary-account-menu";
    const renderAccountMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={accountMenuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {isGuest ? (
                <MenuItem onClick={handleMenuClose}>Sign In</MenuItem>
            ) : (
                <MenuItem onClick={handleMenuClose}>Sign Out</MenuItem>
            )}
            {!isGuest && <MenuItem onClick={handleMenuClose}>My Account</MenuItem>}
            {!isGuest && <MenuItem onClick={handleMenuClose}>Favorites</MenuItem>}
        </Menu>
    );

    const mobileMenuId = "primary-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton aria-label="home" color="inherit" href={`${webAppUrl}`}>
                    <HomeIcon />
                </IconButton>
                <p>Home</p>
            </MenuItem>

            <MenuItem>
                <IconButton
                    aria-label="browse datasets"
                    color="inherit"
                    href={`${webAppUrl}/app/record/dataset/accessions`}
                >
                    <ImageSearchIcon />
                </IconButton>
                <p>Datasets</p>
            </MenuItem>

            <MenuItem>
                <IconButton
                    aria-label="genome browser"
                    color="inherit"
                    href={`${webAppUrl}/app/visualizations/browser`}
                >
                    <LineStyleIcon />
                </IconButton>
                <p>Genome Browser</p>
            </MenuItem>

            <MenuItem>
                <IconButton aria-label="API" color="inherit" href={`${webAppUrl}/app/api`}>
                    <CodeIcon />
                </IconButton>
                <p>API</p>
            </MenuItem>

            <MenuItem>
                <IconButton aria-label="Info" color="inherit" href={`${webAppUrl}`}>
                    <InfoOutlinedIcon />
                </IconButton>
                <p>About</p>
            </MenuItem>

            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls={accountMenuId}
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                {isGuest ? <p>Sign In</p> : <p>Profile</p>}
            </MenuItem>
        </Menu>
    );

    const desktopMenuid = "primary-menu-desktop";
    const renderDesktopMenu = (
        <div className={classes.sectionDesktop}>
            <TextButton
                aria-label="search datasets"
                color="inherit"
                href={`${webAppUrl}/app/record/dataset/accessions`}
            >
                Browse Datasets
            </TextButton>
            <TextButton
                aria-label="genome browser"
                color="inherit"
                href={`${webAppUrl}/app/visualizations/browser`}
            >
                Genome Browser
            </TextButton>
            <TextButton aria-label="api" color="inherit" href={`${webAppUrl}/app/api`}>
                API
            </TextButton>
            <TextButton aria-label="about" color="inherit" href={`${webAppUrl}/`}>
                About
            </TextButton>
            <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={accountMenuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
        </div>
    );

    return (
        <div className={classes.grow}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="open drawer">
                        <MenuIcon />
                    </IconButton>
                    {/*<img src={logo} alt="NIAGADS GenomicsDB" className={classes.logo} />*/}
                    <Typography className={classes.title} variant="h6" noWrap>
                        GenomicsDB
                    </Typography>
                    <IconButton aria-label="home" color="inherit" href={`${webAppUrl}`}>
                        <HomeIcon />
                    </IconButton>
                    <SiteSearch
                        onSelect={(value: SearchResult, searchTerm: string) =>
                            goto(
                                !value || value.type == "summary"
                                    ? buildSummaryRoute(searchTerm)
                                    : buildRouteFromResult(value)
                            )
                        }
                    />
                    {/* <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ "aria-label": "search" }}
                        />
                        </div> */}
                    <div className={classes.grow} />
                    {renderDesktopMenu}
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderAccountMenu}
        </div>
    );
}

export default PrimarySearchAppBar;
