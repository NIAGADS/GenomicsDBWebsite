import React from "react";
import { useLocation } from "react-router-dom";
import LinkagePlot from "@viz/Linkage/Linkage";

interface LinkagePlotPage {}

const LinkagePlotPage: React.FC<LinkagePlotPage> = ({}) => {
    const query = new URLSearchParams(useLocation().search);
    return (
        <div className="linkage-plot-page wdk-PageContent">
            <h1>Linkage for {query.get("name")}</h1>

            <LinkagePlot variants={query.get("variants").split(",")} />
        </div>
    );
};

export default LinkagePlotPage;
