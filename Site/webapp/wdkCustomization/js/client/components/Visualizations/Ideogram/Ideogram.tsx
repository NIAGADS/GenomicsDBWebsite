import React, { useEffect, useState } from "react";
import Ideogram from "ideogram";
import { selectAll } from "d3";
import { connect } from "react-redux";
import { get } from "lodash";
import { isPlainObject } from "lodash";
import DetailModal from "./IdeogramDetailModal";
import { webAppUrl } from "../../../config";
import { LayersOutlined } from "@material-ui/icons";

import { _externalUrls } from "../../../data/_externalUrls";

interface IdeogramProps {
    annotations: any;
    container: string;
    config?: any; // set options from the ideogram API
    //connected prop
    webappUrl?: string;
}

interface Point {
    feature_primary_key: string;
    chr: string;
    chrIndex: number;
    color: string;
    displayName?: any;
    length: number;
    name: string; //span
    px: number;
    shape: string;
    start: number;
    startPx: number;
    stop: number;
    stopPx: number;
    trackIndex?: number;
    trackIndexOriginal?: number;
    filters?: any;
}

const IdeogramPlot: React.FC<IdeogramProps> = ({ annotations, config, container }) => {

    useEffect(() => {
        if (annotations) {
            const baseConfig: any = {
                organism: "human",
                dataDir: _externalUrls.IDEOGRAM_CYTOBAND_URL,
                annotations: annotations,
                container: "#".concat(container),
                showAnnotTooltip: true,
                //onWillShowAnnotTooltip: showToolTip,
            };

            new Ideogram(Object.assign({}, baseConfig, config));
        }
        //redraw on modal open and close to reload css
    }, [annotations]);

    return (
        <>
            <div id={container} className="ideogram-plot"></div>
        </>
    );
};

export default connect<{ webAppUrl: string }, any, {}>((state: any) => ({
    webAppUrl: state.globalData.siteConfig.webAppUrl,
}))(IdeogramPlot);
