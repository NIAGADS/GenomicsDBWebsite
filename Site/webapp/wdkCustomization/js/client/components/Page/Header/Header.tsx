import React, { useState } from "react";
import { ThemeProvider } from "@material-ui/styles";
import { theme } from "../../MaterialUI";
import SearchAppBar from "./ApplicationNavBar";
import Banner from "./Banner";

interface Header {
    isGuest: boolean;
}

const Header: React.FC<Header> = ({ isGuest }) => {
    //const goto = useGoto();
    return (
        <ThemeProvider theme={theme}>
            <Banner />
            <SearchAppBar />
        </ThemeProvider>
    );
};

export default Header;
