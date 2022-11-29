import React from "react";
import { InfoAlert } from "@components/MaterialUI"


export const ZeroFilterChoicesMsg: React.SFC<{ label: string }> = ({ label }) => {
    return (
        <InfoAlert title={label} message="No choices (or only NAs) available with selected filters." />    
    );
};
