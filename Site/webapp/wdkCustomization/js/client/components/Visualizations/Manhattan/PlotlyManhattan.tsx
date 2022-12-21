import React, {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';

interface ManhattanPlot {
    accession: string;
    track: string;
    webAppUrl: string;
}

// https://stackoverflow.com/questions/60610256/what-is-the-proper-way-to-fetch-json-in-react-with-hooks
// https://plotly.com/javascript/react/


function _fetchDataFile(url: string) {
    return fetch(url) // fetch a response from the api
        .then((response) => { 
            let json = response.json(); // then assign the JSON'd response to a var
            return json; // return that bad boy
    });
}



export const PlotlyManhattan: React.SFC<ManhattanPlot> = ({ accession, track, webAppUrl }) => {
    const [plotData, setPlotData ] = useState<any>(null);

    const DATA_FILE_URL = webAppUrl + '/images/manhattan/' + accession + '/' + track + '-manhattan.json';

     
    const fetchPlotData = async() =>  {
        let json = await _fetchDataFile(DATA_FILE_URL);
        setPlotData(json.x);
    }


      useEffect(() => {
       fetchPlotData();
      }, []);

    return plotData && <Plot data={plotData.data} layout={plotData.layout} config={plotData.config} />

} 