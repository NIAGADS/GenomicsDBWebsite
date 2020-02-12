import React, { useEffect, useState } from "react";
//@ts-ignore
import Ideogram from "ideogram";
import d3 from "d3";

import CorrelationModal from "./CorrelationModal";

interface IdeogramProps {
  annotations: any;
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

const IdeogramPlot: React.SFC<IdeogramProps> = ({
  annotations,
  legend,
  tracks,
  config
}) => {
  const [correlationModalOpen, setCorrelationModalOpen] = useState(false),
    [activePoint, setActivePoint] = useState<Point>();

  useEffect(() => {
    if (annotations) {
      let baseConfig: any = {
        organism: "human",
        container: "#ideogram-container",
        dataDir: "https://unpkg.com/ideogram@1.16.0/dist/data/bands/native/",
        annotations: annotations,
        showAnnotTooltip: false,
        onLoad: () => {
          d3.selectAll(".annot path").on("click", d => {
            if (!activePoint) {
              setActivePoint(d);
              setCorrelationModalOpen(true);
            }
          });
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
    //force redraw on modal close so embedded css reloads
  }, [correlationModalOpen]);

  return (
    <>
      <div id="ideogram-container" className="ideogram-plot"></div>
      {correlationModalOpen && (
        <CorrelationModal
          onClose={() => {
            setCorrelationModalOpen(false);
            setActivePoint(null);
          }}
          open={true}
          variants={activePoint.features.map(f => f.record_primary_key)}
        />
      )}
    </>
  );
};

export default IdeogramPlot;
