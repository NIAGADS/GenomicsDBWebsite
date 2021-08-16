import React, { useEffect } from "react";
import { FilterValue } from "react-table";
import {
    area,
    drag,
    event as D3Event,
    format,
    max,
    scaleLinear,
    select,
    selectAll,
    axisLeft,
    axisBottom,
    Area,
    AxisScale,
    ScaleLinear,
    Selection,
} from "d3";
import { debounce } from "lodash";
import { useDynamicWidth } from "../../../../hooks";
import { styled } from "@material-ui/core";

const X_RANGE = [2, 15];

interface Point {
    value: number;
    count: number;
}

interface PvalFilterProps {
    defaultValue: number;
    filterValue: number;
    target: string;
    data: Point[];
    setFilter: (value: number) => void;
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

const PValueChartFilter: React.FC<PvalFilterProps> = ({ defaultValue, filterValue, target, data, setFilter }) => {
    const width = useDynamicWidth("body") * 0.33;

    const canvasSpec: CanvasSpec = {
        margin: { left: 90, right: 20, top: 20, bottom: 65 },
        width,
        height: 150,
    };

    useEffect(() => {
        const svg = _drawFrame(target, canvasSpec),
            xScale = _buildXScale(canvasSpec.width, X_RANGE[0], X_RANGE[1]),
            yScale = _buildYScale(data, canvasSpec.height),
            area = _buildAreaFunc(canvasSpec.height, xScale, yScale);
        _drawArea(svg, data, area);
        _drawAxes(svg, canvasSpec.height, _buildXAxis(xScale), _buildYAxis(yScale));
        _drawLabels(svg, canvasSpec); 
        _drawSlider(svg, xScale, defaultValue, canvasSpec, setFilter);
        //this component is uncontrolled and holds its own state after initialization; it never rerenders...
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    return (
        <ChartContainer>
            <svg className={target}></svg>
        </ChartContainer>
    );
};

const ChartContainer = styled("div")({
    fill: "none",
    stroke: "#000",
});

//never rerender!
export default React.memo(PValueChartFilter, () => true);

const _buildYAxis = (yScale: AxisScale<any>) =>
    axisLeft(yScale)
        .ticks(5)
        .tickFormat((d) => formatNumber(+d))
        .tickPadding(15);

const formatNumber = (n: number) => {
    if (n > 999) {
        return format(".2s")(n);
    } else return String(n);
};

const _buildXAxis = (xScale: AxisScale<number>) =>
    axisBottom(xScale)
        .tickFormat((tick) => {
            return +tick == xScale.domain()[1] ? "≥ " + Math.abs(+tick) : String(Math.abs(+tick));
        })
        .tickPadding(15);

const _buildXScale = (width: number, min: number, max: number) => {
    return scaleLinear().range([0, width]).domain(X_RANGE);
};

const _buildYScale = (data: Point[], height: number) => {
    return scaleLinear()
        .domain([0, max(data, (d) => d.count)])
        .range([height, 0]);
};

const _drawFrame = (selectorClass: string, cs: CanvasSpec) => {
    return select(`.${selectorClass}`)
        .attr("width", cs.width + cs.margin.left + cs.margin.right)
        .attr("height", cs.height + cs.margin.top + cs.margin.bottom)
        .append("g")
        .attr("class", "canvas")
        .attr("transform", "translate(" + cs.margin.left + "," + cs.margin.top + ")");
};

const _buildAreaFunc = (height: number, xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>) => {
    return area()
        .x((d: any) => xScale(+d.value))
        .y0(height)
        .y1((d: any) => yScale(d.count));
};

const _drawArea = (svg: any, data: Point[], area: Area<[number, number]>) => {
    svg.append("path").datum(data).attr("class", "area").attr("d", area).style("fill", "#f2dfde");
};

const _drawAxes = (svg: any, height: number, xAxis: any, yAxis: any) => {
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    selectAll("text").attr("dy", ".35em").attr("font-size", "11px").style("text-anchor", "center").append("g");

    svg.append("g").attr("class", "y axis").call(yAxis).selectAll("text").attr("font-size", "11px").append("g");
};

const _drawRectangle = (
    svg: Selection<any, any, any, any>,
    xScale: ScaleLinear<number, number>,
    defaultPvalue: number,
    height: number,
    classname = ""
) => {
    const xStart = xScale(defaultPvalue);
    svg.append("g")
        .append("rect")
        .attr("width", xScale.range()[1] - xStart)
        .attr("height", height)
        .attr("fill", "pink")
        .attr("opacity", 0.2)
        .attr("class", classname)
        .attr("transform", "translate(" + xStart + ",0)");
};

function _buildDrag(this: any, xScale: ScaleLinear<number, number>, sizerClass: string, cb: (val: number) => void) {
    return drag().on("drag", function () {
        const x = D3Event.x;
        if (x >= xScale.range()[0] && x <= xScale.range()[1]) {
            //move slider
            select(this).attr("cx", x);
            //shift rectangle
            select("." + sizerClass)
                .attr("width", xScale.range()[1] - x)
                .attr("transform", "translate(" + x + ",0)");
            debounce(() => cb(Number(xScale.invert(x).toFixed(2))), 100)();
        }
    });
}


const _drawCircle = (
    svg: Selection<any, any, any, any>,
    xScale: ScaleLinear<number, number>,
    defaultP: number,
    height: number,
    drag: any
) =>
    svg
        .append("g")
        .append("circle")
        .attr("fill", "orange")
        .attr("r", 7)
        .attr("opacity", 0.5)
        .attr("cx", xScale(defaultP))
        .attr("cy", height)
        .call(drag);

const _drawSlider = (
    svg: Selection<any, any, any, any>,
    xScale: ScaleLinear<number, number>,
    defaultP: number,
    cs: CanvasSpec,
    cb: (val: number) => void
) => {
    const sizerClass = "sizer-" + Math.random().toString(36).slice(3),
        drag = _buildDrag(xScale, sizerClass, cb);
    _drawRectangle(svg, xScale, defaultP, cs.height, sizerClass);
    _drawCircle(svg, xScale, defaultP, cs.height, drag);
};

const _drawLabels = (svg: Selection<any, any, any, any>, cs: CanvasSpec) => {
    select(".x.axis")
        .append("g")
        .append("text")
        .text("-log10 p-value")
        .attr("x", cs.width / 2)
        .attr("text-anchor", "middle")
        .attr("transform", "translate(0,40)");

    select(".y.axis")
        .append("g")
        .append("text")
        .text("No. Variants")
        .attr("x", 0)
        .attr("y", cs.height / 2)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(90) translate(70,-20)");
};
