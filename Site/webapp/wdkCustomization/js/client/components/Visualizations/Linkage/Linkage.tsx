import React, { useLayoutEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useWdkEffect } from "wdk-client/Service/WdkService";
import { CompositeService as WdkService } from "wdk-client/Service/ServiceMixins";
import { get } from "lodash";
import { axisBottom, axisLeft, extent, line, range, scaleBand, scaleLinear, select, selectAll } from "d3";

interface CorrelationPlot {
    variants: string[];
    population?: string;
}

interface Variant {
    display_label: string;
    record_pk: string;
    refsnp_id: string;
    request_id: string;
}

interface Correlation {
    variant2: string;
    variant1: string;
    value: number;
}

interface ChartData {
    data: Correlation[];
    variants: Variant[];
}

interface Datum {
    variant: Variant;
    correlate: Variant;
    value: number;
}

const CorrelationPlot: React.FC<CorrelationPlot> = ({ variants, population }) => {
    const [chartData, setChartData] = useState<ChartData>(),
        [loading, setLoading] = useState(false),
        pop = population ? population : "EUR";

    const sendRequest = (variants: string[]) => (service: WdkService) => {
        setLoading(true);
        service
            ._fetchJson<ChartData>("get", `/variant/linkage?population=${pop}&variants=${variants.join(",")}`)
            .then((res: ChartData) => setChartData(res))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    };

    useWdkEffect(sendRequest(variants), [variants]);

    const history = useHistory();

    //todo: use a clamped scale for better sensitivity and clearer logic here and use it to control margins as well
    const blockSize = get(chartData, "variants.length", 0) > 20 ? 20 : 30;

    useLayoutEffect(() => {
        if (chartData) {
            const width = chartData.variants.length * blockSize,
                height = chartData.variants.length * blockSize;

            const margin = {
                top: width < 200 ? 115 : width / 1.75,
                right: width < 200 ? 115 : width / 1.75,
                bottom: width / 7,
                left: width / 5,
            };

            const xScale = scaleBand()
                .range([height, 0])
                .domain(chartData.variants.map((v) => v.display_label).reverse());

            const yScale = scaleBand()
                .range([height, 0])
                .domain(chartData.variants.map((v) => v.display_label).reverse());

            const zScale = scaleBand([height - yScale.bandwidth() / 4, -(yScale.bandwidth() / 4)]).domain(
                chartData.variants.map((v) => v.display_label).reverse()
            );

            const yContScale = scaleBand()
                .range([-yScale.bandwidth(), height])
                .domain(range(chartData.variants.length - 1).map((s) => s.toString()));

            const xContScale = scaleLinear()
                .range([0, width + xScale.bandwidth()])
                .domain([0, chartData.variants.length - 1]);

            const ryScale = scaleLinear()
                .range([-yScale.bandwidth(), height - yScale.bandwidth()])
                .domain(extent(chartData.variants.map((vari) => +vari.record_pk.split(":")[1])));

            const rxScale = scaleLinear()
                .range([xScale.bandwidth(), width + xScale.bandwidth()])
                .domain(extent(chartData.variants.map((vari) => +vari.record_pk.split(":")[1])));

            const xAxis = axisBottom(xScale).tickValues([]);

            const yAxis = axisLeft(yScale).tickValues([]);

            //margin convention
            const svg = select("#correlation-plot")
                .append("svg")
                .attr("transform", "rotate(-45)")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g").attr("classed", "x-axis").call(yAxis);

            selectAll("path").style("fill", "none").style("stroke", "black");

            const data: {
                variant: Variant;
                correlate: Variant;
                value: number;
            }[][] = [];

            chartData.variants.forEach((outerVariant) => {
                const ret: {
                    variant: Variant;
                    correlate: Variant;
                    value: number;
                }[] = [];
                chartData.variants.forEach((innerVariant) => {
                    //don't duplicate correlations
                    if (
                        data.find((datum) =>
                            datum.find(
                                (item) =>
                                    item.correlate.record_pk === outerVariant.record_pk &&
                                    innerVariant.record_pk === item.variant.record_pk
                            )
                        )
                    )
                        return;

                    const correlate = chartData.variants.find((vari) => vari.record_pk === innerVariant.record_pk),
                        variant = chartData.variants.find((vari) => vari.record_pk === outerVariant.record_pk);

                    //if it's itself, give a 1
                    if (outerVariant.record_pk === innerVariant.record_pk) {
                        ret.push({
                            variant,
                            correlate,
                            value: 1,
                        });
                        return;
                    }

                    ret.push({
                        variant,
                        correlate,
                        value: chartData.data.find(
                            (datum) =>
                                datum.variant1 === outerVariant.record_pk && datum.variant2 === innerVariant.record_pk
                        )
                            ? chartData.data.find(
                                  (datum) =>
                                      datum.variant1 === outerVariant.record_pk &&
                                      datum.variant2 === innerVariant.record_pk
                              ).value
                            : 0,
                    });
                });
                data.push(ret);
            });

            const colorScale = scaleLinear()
                .domain([0, 0.2, 0.2, 0.6, 1])
                //http://colorbrewer2.org/#type=sequential&scheme=OrRd&n=3
                .range(["white" as any, "white" as any, "#fee8c8" as any, "#fdbb84" as any, "#e34a33" as any]);

            svg.selectAll(".bar")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "bar")
                .each(function (block) {
                    select(this)
                        .selectAll(".block")
                        .data(block)
                        .enter()
                        .append("rect")
                        .attr("class", (d, i) => `block-${i}`)
                        .attr("width", xScale.bandwidth())
                        .attr("height", yScale.bandwidth())
                        .attr("fill", (d) => colorScale(d.value))
                        .attr("stroke", "black")
                        .attr("x", (d) => xScale(d.variant.display_label))
                        .attr("y", (d) => yScale(d.correlate.display_label));
                });

            svg.selectAll("text").attr("transform", "rotate(45)");
            svg.selectAll(".x-axis").selectAll("text").style("text-anchor", "start").attr("dy", "0").attr("x", "5");

            //@ts-ignore
            svg.selectAll(".bar").each(function (d: Datum[]) {
                const last = d[0];
                const x = xScale(last.variant.display_label);
                const y = zScale(last.correlate.display_label);
                select(this)
                    .append("g")
                    .attr("transform", "translate(" + xScale.bandwidth() * 1.33 + ", 0)")
                    .append("text")
                    .attr("class", "variant-label")
                    .attr("transform", "rotate(-45," + x + "," + y + ")")
                    .attr("x", x)
                    .attr("y", y)
                    .style("font-size", 16)
                    .style("cursor", "pointer")
                    .style("fill", "blue")
                    .style("text-decoration", "underline")
                    .on("click", () => history.push(`/record/variant/${last.variant.record_pk}`))
                    .text(() => last.variant.display_label);
            });

            const lineFn = line()
                .x((d: any, i) => xContScale(i) + 5)
                .y((d: any, i) => yContScale(i.toString()) - 5);

            svg.append("path")
                .attr("class", "line")
                .style("stroke", "black")
                .attr("d", (d: any) => lineFn(data as any));

            const labelLine = line()
                .x(
                    (d: any, i) =>
                        (i % 2
                            ? rxScale(+d.record_pk.split(":")[1]) + 5
                            : xScale(d.display_label) + xScale.bandwidth() * 1.25) + 65
                )
                .y((d: any, i) => (i % 2 ? ryScale(+d.record_pk.split(":")[1]) - 5 : zScale(d.display_label)) - 65);

            svg.selectAll(".label-line")
                .data(chartData.variants.map((v) => [v, v]))
                .enter()
                .append("g")
                .attr("class", "label-line")
                .append("path")
                .style("stroke", "black")
                .attr("d", (d) => labelLine(d as any));

            const cLine1 = line()
                .x((d: any, i) => rxScale(+d.record_pk.split(":")[1]) + 70)
                .y((d: any, i) => ryScale(+d.record_pk.split(":")[1]) - 70);

            const cLine2 = line()
                .x((d: any, i) => rxScale(+d.record_pk.split(":")[1]) + 75)
                .y((d: any, i) => ryScale(+d.record_pk.split(":")[1]) - 75);

            const bandLine = line()
                .x((d: any, i) =>
                    i % 2 ? rxScale(+d.record_pk.split(":")[1]) + 70 : rxScale(+d.record_pk.split(":")[1]) + 75
                )
                .y((d: any, i) =>
                    i % 2 ? ryScale(+d.record_pk.split(":")[1]) - 70 : ryScale(+d.record_pk.split(":")[1]) - 75
                );

            svg.selectAll(".band-line")
                .data(chartData.variants.map((v) => [v, v]))
                .enter()
                .append("g")
                .attr("class", "band-line")
                .append("path")
                .style("stroke", "black")
                .attr("d", (d) => bandLine(d as any));

            svg.append("path")
                .attr("class", "cline-1")
                .style("stroke", "black")
                .attr("d", (d: any) => cLine1(chartData.variants as any));

            svg.append("path")
                .attr("class", "cline-2")
                .style("stroke", "black")
                .attr("d", (d: any) => cLine2(chartData.variants as any));
        }
    }, [chartData]);

    return (
        <>
            {loading && <span>Loading...</span>}
            <div
                id="correlation-plot"
                style={{
                    marginTop:
                        //negative margin to 'center' in container after rotating (todo: hide overflow here rather than in stylesheet?)
                        get(chartData, "variants.length", 0) * -blockSize + 105 /* margin, labels */ + "px",
                    marginBottom: get(chartData, "variants.length", 0) * 3.5, //rough estimate for now...
                }}
            />
        </>
    );
};

export default CorrelationPlot;
