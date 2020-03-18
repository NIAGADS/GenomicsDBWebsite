import React from "react";

const LZLegend: React.SFC = props => {
  return (
    <div>
      <div className="col-md-12">
        <ul style={{ display: "flex", justifyContent: "center" }}>
          <li style={{ display: "inlineBlock", marginRight: "10px" }}>
            Linkage disequilibrium (r<sup>2</sup>) with the reference variant:
          </li>
          <li style={{ display: "inlineBlock", marginRight: "10px" }}>
            <i className="fa fa-circle" style={{ color: "#d43f3a" }}></i> 1 -
            0.8
          </li>
          <li style={{ display: "inlineBlock", marginRight: "10px" }}>
            <i className="fa fa-circle" style={{ color: "#eea236" }}></i> 0.8 -
            0.6
          </li>
          <li style={{ display: "inlineBlock", marginRight: "10px" }}>
            <i className="fa fa-circle" style={{ color: "#5cb85c" }}></i> 0.6 -
            0.4
          </li>
          <li style={{ display: "inlineBlock", marginRight: "10px" }}>
            <i className="fa fa-circle" style={{ color: "#46b8da" }}></i> 0.4 -
            0.2
          </li>
          <li style={{ display: "inlineBlock", marginRight: "10px" }}>
            <i
              className="fa fa-circle"
              style={{ color: "rgb(184, 184, 184)" }}
            ></i>{" "}
            0.2 - 0 / no information
          </li>
          <li style={{ display: "inlineBlock" }}>
            <svg height="20" width="15">
              <path
                fill="#9632b8"
//                fill-opacity="1"
                d="M0,-8.323582900575635L4.805622828269509,0 0,8.323582900575635 -4.805622828269509,0Z"
                style={{ transform: "translate(5px, 10px)" }}
              ></path>
            </svg>{" "}
            reference variant
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LZLegend;
