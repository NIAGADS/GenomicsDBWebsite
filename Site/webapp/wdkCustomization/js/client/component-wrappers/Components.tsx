import React from "react";
import { Header as SiteHeader } from "../components/Page/Header/Header";
import SiteFooter from "../components/Page/Footer";
import QuestionForm from "../components/QuestionForm/QuestionForm";
import CustomPageLayout from "../components/Page/CustomPageLayout";

export const Page = () => CustomPageLayout;

export const DefaultQuestionForm = () => QuestionForm;
export const Footer = () => () =>
    (
      //  <ThemeProvider theme={theme}>
            <SiteFooter />
     //   </ThemeProvider>
    );

/**
 * Wrap Header component with state from store and configured actionCreators
 */
export const Header = () => () =>
    (
        <React.Fragment>
            <SiteHeader />
        </React.Fragment>
    );
