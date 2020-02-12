import React, { useEffect } from "react";
//@ts-ignore
import Ideogram from "ideogram";

interface IdeogramProps {
  annotations: any;
  container: string;
  legend?: any;
  config?: any; // set options from the ideogram API
  tracks?: any; // maybe set in config/ this is for legacy support
}

interface Point {
  chr: string;
  chrIndex: number;
  color: string;
  features: Feature[];
  length: number;
  name: string; //span
  px: number;
  shape: string;
  start: number;
  startPx: number;
  stop: number;
  stopPx: number;
  trackIndex: number;
  trackIndexOriginal: number;
}

interface Feature {
  display_label: string;
  location_end: number;
  location_start: number;
  record_primary_key: string;
  record_type: string;
  span_length: number;
}

const IdeogramPlot: React.SFC<IdeogramProps> = props => {
  const { annotations, container, legend, tracks, config } = props;

  useEffect(() => {
    if (annotations) {
      let baseConfig: any = {
        organism: "human",
        dataDir: "https://unpkg.com/ideogram@1.16.0/dist/data/bands/native/",
        annotations: annotations,
        container: '#'.concat(container),
        onWillShowAnnotTooltip: (point: Point) => {
          return point;
        }
      };

      if (legend) {
        baseConfig["legend"] = legend;
      }

      if (tracks) {
        baseConfig["tracks"] = tracks;
      }

      new Ideogram(Object.assign({}, baseConfig, config));
    }
  }, [annotations]);

  return <div id={container} className="ideogram-plot"></div>;
};

export default IdeogramPlot;
