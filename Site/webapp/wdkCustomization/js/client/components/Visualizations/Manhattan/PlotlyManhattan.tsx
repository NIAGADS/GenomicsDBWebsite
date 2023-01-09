import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

import CircularProgress  from "@material-ui/core/CircularProgress";
import { InfoAlert } from "@components/MaterialUI";


interface ManhattanPlot {
    accession: string;
    track: string;
    webAppUrl: string;
}

// https://stackoverflow.com/questions/60610256/what-is-the-proper-way-to-fetch-json-in-react-with-hooks
// https://plotly.com/javascript/react/

function _fetchDataFile(url: string) {
    return fetch(url)
        .then((response) => {
            let responseJson = response.json();
            return responseJson;
        })
        .catch((error) => {
            return null;
        });
}

function _correctNewLines(data: any) {
    const dataStr = JSON.stringify(data.x);
    dataStr.replace(/\\n/g, "\\n");
    return JSON.parse(dataStr);
}

export const PlotlyManhattan: React.SFC<ManhattanPlot> = ({ accession, track, webAppUrl }) => {
    const [plotData, setPlotData] = useState<any>(null);
    const [fetchError, setFetchError] = useState<boolean>(false);

    const DATA_FILE_URL = webAppUrl + "/images/manhattan/" + accession + "/" + track + "-manhattan.json";

    const fetchPlotData = async () => {
        const responseJson = await _fetchDataFile(DATA_FILE_URL);
        if (responseJson) {
            setPlotData(responseJson.x);
         }
         else {
            setPlotData(null);
            setFetchError(true);
         }
    };

    useEffect(() => {
        fetchPlotData();
    }, []);

    return plotData  ?  (
        <Plot data={plotData.data} layout={plotData.layout} config={plotData.config} />
    ) : fetchError ? (
        <InfoAlert
            title={"Coming soon"}
            message={"An interactive Manhattan plot is still being prepared for this dataset.  Please check back soon."}
        />
    ) : <CircularProgress />
};
