import React, {useState} from 'react';
import Plot from 'react-plotly.js';

interface ManhattanPlot {
    accession: string;
    track: string;
    webAppUrl: string;
}

// https://stackoverflow.com/questions/60610256/what-is-the-proper-way-to-fetch-json-in-react-with-hooks
// https://plotly.com/javascript/react/
/*
function fetchData(track,) {
    return fetch('https://programming-quotes-api.herokuapp.com/quotes/random') // fetch a response from the api
        .then((response) => { 
            let json = response.json(); // then assign the JSON'd response to a var
            return json; // return that bad boy
    });
}

export const PlotlyManhattan: React.SFC<ManhattanPlot> = ({ accession, track, webAppUrl }) => {
    const [data, setData ] = useState<any>(null);

    const DATA_FILE = webAppUrl + '/images/manhattan/' + accession + '/' + track + '-manhattan.json';
    
    const fetchFile() {
        return fetch()
    }

    const fetchData = async () => {
        let json = await fetchQuote();
        setAuthor(json.author);
        setQuote(json.quote);
      }
  
      useEffect(() => {
       fetchMyAPI();
      }, []);

    return <Plot data={data}

    return (null);
} */