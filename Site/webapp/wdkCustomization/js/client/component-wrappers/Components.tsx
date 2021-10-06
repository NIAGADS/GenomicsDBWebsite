import React from 'react';
import SiteHeader from "../components/Page/Header/Header";
import Announcements from "../components/Page/Announcements";
import SiteFooter from "../components/Page/Footer";
import QuestionForm from "../components/QuestionForm/QuestionForm";

export const DefaultQuestionForm = () => QuestionForm;
export const Footer = () => SiteFooter;

/**
 * Wrap Header component with state from store and configured actionCreators
 */
export const Header = () => () =>
  <React.Fragment>
    <Announcements/>
    <SiteHeader/>
  </React.Fragment>

