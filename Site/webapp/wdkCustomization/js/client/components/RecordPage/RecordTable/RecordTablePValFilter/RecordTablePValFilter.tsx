import React from "react";
import * as d3 from "d3";
import { toString, chain, entries, groupBy, map, filter } from "lodash";
import { scientificToDecimal } from "../../../../util/util";
import { Filter } from "react-table";

interface PvalFilterProps {
  values: any[];
  onChange: { (pLow: number): void };
  filtered: Filter[];
  selectClass: string;
  defaultPVal: number;
}

interface PvalFilterState {
  filter: any;
}

const INITIAL_STATE: PvalFilterState = {
  filter: null
};

interface CanvasSpec {
  margin: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  width: number;
  height: number;
}

const canvasSpec: CanvasSpec = {
  margin: { left: 90, right: 20, top: 20, bottom: 65 },
  width: 700,
  height: 150
};

const PvalFilter = class extends React.Component<
  PvalFilterProps,
  PvalFilterState
> {
  //p refers to negative log, so maxP means lowest pVal to display (e.g., 15 =  e-15)
  private maxP = 15;
  constructor(props: PvalFilterProps) {
    super(props);
    this.state = INITIAL_STATE;
  }

  componentDidMount = () => {
    const smallestP = _getSmallestP(this.props.values),
      data = _transformData(this.props.values),
      svg = _drawFrame(this.props.selectClass, canvasSpec),
      xScale = _buildXScale(data, canvasSpec.width, this.maxP),
      unXScale = _buildUnXScale(data, canvasSpec.width, this.maxP),
      yScale = _buildYScale(data, canvasSpec.height),
      area = _buildAreaFunc(canvasSpec.height, xScale, yScale);
    _drawArea(svg, data, area);
    _drawAxes(
      svg,
      canvasSpec.height,
      _buildXAxis(xScale, this.maxP),
      _buildYAxis(yScale)
    );
    _drawLabels(svg, canvasSpec);
    _drawSlider(
      svg,
      xScale,
      unXScale,
      smallestP,
      this.props.defaultPVal,
      canvasSpec,
      this.props.onChange
    );
  };

  render = () => {
    const { values, onChange } = this.props;
    return (
      <div className="p-val-filter-chart control">
        <svg className={this.props.selectClass}></svg>
      </div>
    );
  };
};

export default PvalFilter;

const _buildYAxis = (yScale: any) => {
  return d3.svg
    .axis()
    .scale(yScale)
    .orient("left");
};

const _buildXAxis = (
  xScale: d3.scale.Ordinal<string, number>,
  maxP: number
) => {
  return d3.svg
    .axis()
    .scale(xScale)
    .tickFormat(tick => (+tick === maxP ? tick + "+" : tick))
    .orient("bottom");
};

interface ChartDatum {
  pValue: string;
  count: number;
}

const _buildXScale = (data: ChartDatum[], width: number, maxP: number) => {
  return (
    d3.scale
      .ordinal()
      //d3.range does not include max number in array, so need to increment
      .domain(d3.range(0, maxP + 1).map(item => item.toString()))
      .rangePoints([0, width])
  );
};

const _buildUnXScale = (data: ChartDatum[], width: number, maxP: number) => {
  return d3.scale
    .linear()
    .domain([0, width])
    .rangeRound([0, maxP]);
};

const _buildYScale = (data: ChartDatum[], height: number) => {
  return d3.scale
    .linear()
    .domain([
      0,
      d3.max(data, function(d) {
        return d.count;
      })
    ])
    .range([height, 0]);
};

const _drawFrame = (selectorClass: string, cs: CanvasSpec) => {
  return d3
    .select(`.${selectorClass}`)
    .attr("width", cs.width + cs.margin.left + cs.margin.right)
    .attr("height", cs.height + cs.margin.top + cs.margin.bottom)
    .append("g")
    .attr("class", "canvas")
    .attr(
      "transform",
      "translate(" + cs.margin.left + "," + cs.margin.top + ")"
    );
};

const _buildAreaFunc = (height: number, xScale: any, yScale: any) => {
  return d3.svg
    .area()
    .x((d: any) => xScale(d.pValue))
    .y0(height)
    .y1((d: any) => yScale(d.count));
};

const _drawArea = (svg: any, data: any, area: any) => {
  svg
    .append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area);
};

const _drawAxes = (svg: any, height: number, xAxis: any, yAxis: any) => {
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("dy", ".35em")
    .attr("font-size", "11px")
    .style("text-anchor", "center")
    .append("g");

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .selectAll("text")
    .attr("font-size", "11px")
    .append("g");
};

const _drawRectangle = (
  svg: d3.Selection<any>,
  xScale: d3.scale.Ordinal<string, number>,
  minXVal: number,
  height: number,
  classname: string = ""
) => {
  const xLimit = xScale(String(minXVal));
  svg
    .append("g")
    .append("rect")
    .attr("width", xScale.range()[xScale.range().length - 1] - xLimit)
    .attr("height", height)
    .attr("fill", "pink")
    .attr("opacity", 0.2)
    .attr("class", classname)
    .attr("transform", "translate(" + xLimit + ",0)");
};

const _buildDrag = (
  unXScale: d3.scale.Linear<number, number>,
  sizerClass: string,
  cb: Function
) => {
  return d3.behavior.drag().on("drag", function(d: any, i) {
    let event = d3.event as any;
    //@ts-ignore
    const cx =
      event.x >= d.extent[0] && event.x <= d.extent[1]
        ? event.x
        : //
          //@ts-ignore
          d3.select(this as any).attr("cx");
    const rectWidth = d.extent[1] - cx;
    d3.select("." + sizerClass)
      .attr("transform", "translate(" + cx + ",0)")
      .attr("width", rectWidth);
    //@ts-ignore
    d3.select(this).attr("cx", cx);
    cb(unXScale(cx));
  });
};

const _drawCircle = (
  svg: d3.Selection<any>,
  xScale: d3.scale.Ordinal<string, number>,
  xVal: number,
  hcp: number,
  height: number,
  drag: any
) => {
  svg
    .append("g")
    .append("circle")
    .attr("fill", "orange")
    .attr("r", 7)
    .attr("opacity", 0.5)
    .attr("cx", xScale(String(xVal)))
    .datum({ extent: [xScale(String(hcp)), xScale.rangeExtent()[1]] })
    .attr("cy", height)
    .call(drag);
};

const _drawSlider = (
  svg: d3.Selection<any>,
  xScale: d3.scale.Ordinal<string, number>,
  unXScale: d3.scale.Linear<number, number>,
  minP: number,
  defaultP: number,
  cs: CanvasSpec,
  cb: Function
) => {
  const sizerClass = "sizer-" + Math.random().toString(36).slice(3),
   drag = _buildDrag(unXScale, sizerClass, cb);
  _drawRectangle(svg, xScale, defaultP, cs.height, sizerClass);
  _drawCircle(svg, xScale, defaultP, minP, cs.height, drag);
};

const _drawLabels = (svg: d3.Selection<null>, cs: CanvasSpec) => {
  svg
    .select(".x.axis")
    .append("g")
    .append("text")
    .text("P-Value (-log 10)")
    .attr("x", cs.width / 2)
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0,30)");

  svg
    .select(".y.axis")
    .append("g")
    .append("text")
    .text("Count")
    .attr("x", 0)
    .attr("y", cs.height / 2)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(90) translate(70,-30)");
};

const _transformData = (data: { [key: string]: any }) => {
  const stodEntriesSort = ([k, v]: any, [l, w]: any) =>
    scientificToDecimal(k) > scientificToDecimal(l) ? 1 : -1;
  let count = 0;
  return (
    chain(data)
      //collapse all pvals less that e-15 into e-15
      .map(datum => {
        if (scientificToDecimal(datum.pvalue) <= scientificToDecimal("1e-15")) {
          datum.pvalue = "1e-15";
        }
        return datum;
      })
      .groupBy(datum => datum.pvalue)
      .entries()
      .sort(stodEntriesSort)
      .map(([k, v]) => ({
        pValue: String(Math.abs(+k.split("e")[1])),
        count: count += v.length
      }))
      .value()
  );
};

const _getSmallestP = (values: { [key: string]: any }[]) => {
  return Math.abs(d3.max(values, d => +toString(d.pvalue).split("e")[1]));
};
