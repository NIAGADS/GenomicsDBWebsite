import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { RootState } from 'wdk-client/Core/State/Types';
import StateProps, { webAppUrl, isGuest, wdkModelBuildNumber } from '../../StateProps';
import { ThemeProvider } from "@material-ui/styles";
import { theme } from "../../MaterialUI";
import Typography from '@material-ui/core/Typography';



const Banner: React.FC<any> = ({ isGuest }) => {
    const buildNumber = useSelector((state: RootState) => state.globalData?.config?.buildNumber);
    return (
        <Typography>{buildNumber}</Typography>
    )
}

const mapStateToProps = (state: RootState, props: any): StateProps => ({
    webAppUrl: webAppUrl(state),
    isGuest: isGuest(state)
  });

export default connect(mapStateToProps)(Banner);