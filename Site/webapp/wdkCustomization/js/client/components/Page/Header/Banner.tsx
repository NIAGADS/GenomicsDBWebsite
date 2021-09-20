import React, { useState } from "react";
import { connect } from "react-redux";
import { ThemeProvider } from "@material-ui/styles";
import { theme } from "../../MaterialUI";
import Typography from '@material-ui/core/Typography';

const Banner: React.FC<any> = ({ buildNumber, isGuest }) => {
    return (
        <Typography>{buildNumber}</Typography>
    )
}

const mapStateToProps = (state: any) => {
    return {
        build: state.globalData.siteConfig.buildNumber,
        isGuest: state.globalData.siteConfig.isGuest
    };
};

export default connect(mapStateToProps)(Banner);