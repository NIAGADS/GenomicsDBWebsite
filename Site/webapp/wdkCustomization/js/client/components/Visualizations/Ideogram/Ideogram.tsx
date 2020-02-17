import React, { useEffect, useState } from "react";
//@ts-ignore
import Ideogram from "ideogram";
import d3 from "d3";
import { connect } from "react-redux";
import { get } from "lodash";
import { isPlainObject } from "lodash";

import CorrelationModal from "./CorrelationModal";
import { webAppUrl } from "../../../config";

interface IdeogramProps {
  annotations: any;
  container: string;
  legend?: any;
  config?: any; // set options from the ideogram API
  tracks?: any; // maybe set in config/ this is for legacy support
  //connected prop
  webappUrl?: string;
}

interface Point {
  chr: string;
  chrIndex: number;
  color: string;
  displayName?: any;
  features: Feature | Feature[];
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
  config,
  container,
  legend,
  tracks
}) => {
  const [correlationModalOpen, setCorrelationModalOpen] = useState(false),
    [activePoint, setActivePoint] = useState<Point>();

  useEffect(() => {
    if (annotations) {
      let baseConfig: any = {
        organism: "human",
        dataDir: "https://unpkg.com/ideogram@1.16.0/dist/data/bands/native/",
        annotations: annotations,
        container: "#".concat(container),
        showAnnotTooltip: true,
        onWillShowAnnotTooltip: showToolTip,
        onLoad: () => {
          d3.selectAll(".annot path").on("click", d => {
            if (!activePoint && Array.isArray(get(d, "features"))) {
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
    //redraw on modal open and close to reload css
  }, [annotations, correlationModalOpen]);

  return (
    <>
      <div id={container} className="ideogram-plot"></div>
      {correlationModalOpen && (
        <CorrelationModal
          onClose={() => {
            setCorrelationModalOpen(false);
            setActivePoint(null);
          }}
          open={true}
          variants={(activePoint.features as Feature[]).map(
            f => f.record_primary_key
          )}
        />
      )}
    </>
  );
};

const showToolTip = (point: Point) => {
  if (isPlainObject(get(point, "features"))) {
    //this needs to be a plain url b/c callback expects html string
    //https://github.com/eweitz/ideogram/blob/d5a5402ed311ef6d3b85969c05be3db17c2bbb1e/src/js/annotations/events.js#L40
    const feature = point.features as Feature;
    const link = `${webAppUrl}/app/record/${feature.record_type}/${feature.record_primary_key}`;
    point.displayName = `<a href=${link}>${feature.display_label}</a>`;
  } else {
    const features = point.features as Feature[];
    point.displayName = `${features.length} ${features[0].record_type}${
      features.length > 1 ? "s" : ""
    }`;
  }
  return point;
};

export default connect<{ webAppUrl: string }, any, {}>((state: any) => ({
  webAppUrl: state.globalData.siteConfig.webAppUrl
}))(IdeogramPlot);
