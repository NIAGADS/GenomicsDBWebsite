import React, { useState } from "react";
import { ThemeProvider } from "@material-ui/styles";
import { theme } from "../../MaterialUI";
import SearchAppBar from "./ApplicationNavBar";
import GenomeBuildBanner from "./GenomeBuildBanner";

interface Header {
    isGuest: boolean;
}

const Header: React.FC<Header> = ({ isGuest }) => {
    //const goto = useGoto();
    return (
        <ThemeProvider theme={theme}>
            <GenomeBuildBanner />
            <SearchAppBar />
        </ThemeProvider>
    );
};

export default Header;
