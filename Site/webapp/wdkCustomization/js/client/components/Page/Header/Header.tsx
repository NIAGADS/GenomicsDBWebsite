import React, { useState } from "react";
import { ThemeProvider } from "@material-ui/styles";
import { theme } from "../../MaterialUI";
import SearchAppBar from "./ApplicationNavBar";
import GenomeBuildBanner from "./GenomeBuildBanner";
import CookieConsent, { Cookies, resetCookieConsentValue } from "react-cookie-consent";
import { _externalUrls } from "../../../data/_externalUrls";

const Header: React.FC<any> = ({}) => {
    //const goto = useGoto();
    return (
        <ThemeProvider theme={theme}>
            <GenomeBuildBanner />
            <SearchAppBar />
            <CookieConsent
                location="bottom"
                buttonText="Accept"
                cookieName="ngdb-accept-cookies"
                style={{ background: "#525b65", fontSize: "16px" }}
                buttonStyle={{ background: "#ffc665", fontSize: "16px" }}
                expires={150}
            >
                This website requires cookies &#38; limited processing of your personal data in order to function properly. 
                By clicking any link on this page you are giving your consent to this as outlined in our {" "}
                <a href={`${_externalUrls.NIAGADS_BASE_URL}/privacy-policy`}>Privacy Policy</a>.
            </CookieConsent>
        </ThemeProvider>
    );
};

export default Header;
