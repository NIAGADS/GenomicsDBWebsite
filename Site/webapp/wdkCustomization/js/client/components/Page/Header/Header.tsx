import React, { useState } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "@components/MaterialUI";
import SearchAppBar from "./ApplicationNavBar";

import CookieConsent, { Cookies, resetCookieConsentValue } from "react-cookie-consent";
import { _externalUrls } from "genomics-client/data/_externalUrls";

export const Header: React.FC<{}> = () => {

    return (
        <ThemeProvider theme={theme}>
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

