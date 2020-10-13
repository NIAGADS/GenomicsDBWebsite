import React, { useEffect, useState } from "react";
import d3 from "d3";
import { chain, clone, groupBy, toString } from "lodash";

interface PvalFilterProps {
    values: { [key: string]: any; pvalue: string }[];
    setFilter: (id: string, value: any) => void;
    selectClass: string;
    defaultPVal: number;
}

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
    height: 150,
};

const PvalFilter: React.FC<PvalFilterProps> = ({ defaultPVal, setFilter, selectClass, values }) => {
    const [dragFilter, setDragFilter] = useState(15);

    useEffect(() => {
        const data = _transformData(values),
            svg = _drawFrame(selectClass, canvasSpec),
            xScale = _buildXScale(canvasSpec.width, maxP),
            unXScale = _buildUnXScale(canvasSpec.width, maxP),
            yScale = _buildYScale(data, canvasSpec.height),
            area = _buildAreaFunc(canvasSpec.height, xScale, yScale);
        _drawArea(svg, data, area);
        _drawAxes(svg, canvasSpec.height, _buildXAxis(xScale, maxP), _buildYAxis(yScale));
        _drawLabels(svg, canvasSpec);
        _drawSlider(
            svg,
            xScale,
            unXScale,
            data[data.length - 1].pValueLog10,
            defaultPVal,
            canvasSpec,
            setDragFilter /* (val: number) =>
            setFilter("pvalue", val) */
        );
        //this component is uncontrolled and holds its own state after initialization; it never rerenders
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    //p refers to negative log, so maxP means lowest pVal to display (e.g., 15 =  e-15)
    const maxP = 15;

    return (
        <div className="p-val-filter-chart control">
            <svg className={selectClass}></svg>
        </div>
    );
};

//never rerender!
export default React.memo(PvalFilter, () => true);

const _buildYAxis = (yScale: any) => d3.svg.axis().scale(yScale).orient("left");

const _buildXAxis = (xScale: d3.scale.Linear<number, number>, maxP: number) =>
    d3.svg
        .axis()
        .scale(xScale)
        .tickFormat((tick) => (+tick === maxP ? tick + "+" : tick))
        .orient("bottom");

interface ChartDatum {
    pValueLog10: number;
    count: number;
}

const _buildXScale = (width: number, maxP: number) =>
    d3.scale
        .linear()
        .range([0, width])
        .domain([1, Math.log10(Number(`1e-${maxP}`))]);

const _buildUnXScale = (width: number, maxP: number) => {
    return d3.scale
        .linear()
        .domain([0, width])
        .range([Math.log10(Number(`1e-${maxP}`)), 1]);
};

const _buildYScale = (data: ChartDatum[], height: number) => {
    return d3.scale
        .linear()
        .domain([0, d3.max(data, (d) => d.count)])
        .range([height, 0]);
};

const _drawFrame = (selectorClass: string, cs: CanvasSpec) => {
    return d3
        .select(`.${selectorClass}`)
        .attr("width", cs.width + cs.margin.left + cs.margin.right)
        .attr("height", cs.height + cs.margin.top + cs.margin.bottom)
        .append("g")
        .attr("class", "canvas")
        .attr("transform", "translate(" + cs.margin.left + "," + cs.margin.top + ")");
};

const _buildAreaFunc = (height: number, xScale: d3.scale.Linear<number, number>, yScale: any) => {
    return d3.svg
        .area()
        .x((d: any) => xScale(+d.pValueLog10))
        .y0(height)
        .y1((d: any) => yScale(d.count));
};

const _drawArea = (svg: any, data: ChartDatum[], area: d3.svg.Area<[number, number]>) => {
    svg.append("path").datum(data).attr("class", "area").attr("d", area);
};

const _drawAxes = (svg: any, height: number, xAxis: any, yAxis: any) => {
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dy", ".35em")
        .attr("font-size", "11px")
        .style("text-anchor", "center")
        .append("g");

    svg.append("g").attr("class", "y axis").call(yAxis).selectAll("text").attr("font-size", "11px").append("g");
};

const _drawRectangle = (
    svg: d3.Selection<any>,
    xScale: d3.scale.Linear<number, number>,
    minPVal: number,
    height: number,
    classname = ""
) => {
    const xStart = xScale(minPVal);
    svg.append("g")
        .append("rect")
        .attr("width", xScale.range()[1] - xStart)
        .attr("height", height)
        .attr("fill", "pink")
        .attr("opacity", 0.2)
        .attr("class", classname)
        .attr("transform", "translate(" + xStart + ",0)");
};

const _buildDrag = (
    xScale: d3.scale.Linear<number, number>,
    unXScale: d3.scale.Linear<number, number>,
    sizerClass: string,
    maxExtantP: number,
    cb: (val: number) => void
) => {
    return d3.behavior.drag().on("drag", function (d: any) {
        //note that the right hand x value of the rectangle is static
        const event = d3.event as any;

        if (event.x > xScale(maxExtantP) && event.x < xScale.range()[1]) {
            //move slider
            //@ts-ignore
            d3.select(this).attr("cx", event.x);
            //shift rectangle
            d3.select("." + sizerClass)
                .attr("width", xScale.range()[1] - event.x)
                .attr("transform", "translate(" + event.x + ",0)");
            //note that this will lag while table is rerendering after callback, ReactTable seems to be the culprit
        }
        cb(unXScale(event.x));
    });
};

const _drawCircle = (
    svg: d3.Selection<any>,
    xScale: d3.scale.Linear<number, number>,
    defaultP: number,
    height: number,
    drag: any
) => {
    svg.append("g")
        .append("circle")
        .attr("fill", "orange")
        .attr("r", 7)
        .attr("opacity", 0.5)
        .attr("cx", xScale(-defaultP))
        .attr("cy", height)
        .call(drag);
};

const _drawSlider = (
    svg: d3.Selection<any>,
    xScale: d3.scale.Linear<number, number>,
    unXScale: d3.scale.Linear<number, number>,
    maxRepresentedP: number,
    defaultP: number,
    cs: CanvasSpec,
    cb: (val: number) => void
) => {
    const sizerClass = "sizer-" + Math.random().toString(36).slice(3),
        drag = _buildDrag(xScale, unXScale, sizerClass, maxRepresentedP, cb);
    _drawRectangle(svg, xScale, -defaultP, cs.height, sizerClass);
    _drawCircle(svg, xScale, defaultP, cs.height, drag);
};

const _drawLabels = (svg: d3.Selection<null>, cs: CanvasSpec) => {
    svg.select(".x.axis")
        .append("g")
        .append("text")
        .text("P-Value (log 10)")
        .attr("x", cs.width / 2)
        .attr("text-anchor", "middle")
        .attr("transform", "translate(0,30)");

    svg.select(".y.axis")
        .append("g")
        .append("text")
        .text("Count")
        .attr("x", 0)
        .attr("y", cs.height / 2)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(90) translate(70,-30)");
};

const _transformData = (data: { [key: string]: any; pvalue: string }[]): ChartDatum[] => {
    let count = 0;
    return chain(data)
        .map((datum) => {
            if (+datum.pvalue <= 1e-15) {
                datum.pvalue = "1e-15";
            }
            return Math.log10(+datum.pvalue);
        })
        .groupBy()
        .entries()
        .sort(([a], [b]) => (+a > +b ? 1 : -1))
        .map((vals) => ({
            pValueLog10: +vals[0],
            count: count += vals[1].length,
        }))
        .value();
};
