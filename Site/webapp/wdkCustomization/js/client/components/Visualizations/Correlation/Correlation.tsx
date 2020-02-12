import React, { useLayoutEffect, useState } from "react";
import { useWdkEffect } from "wdk-client/Service/WdkService";
import { CompositeService as WdkService } from "wdk-client/Service/ServiceMixins";
import d3 from "d3";

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

const CorrelationPlot: React.FC<CorrelationPlot> = ({
  variants,
  population
}) => {
  const [chartData, setChartData] = useState<ChartData>();

  const sendRequest = (variants: string[]) => (service: WdkService) => {
    service
      ._fetchJson<ChartData>(
        "get",
        `/variant/linkage?population=${population ? population : "EUR"}
      &variants=${variants.join(",")}`
      )
      .then((res: ChartData) => setChartData(res))
      .catch(err => console.log(err));
  };

  useWdkEffect(sendRequest(variants), [variants]);

  useLayoutEffect(() => {
    if (chartData) {
      const width = 500,
        height = 500;

      const margin = {
        top: 250,
        right: 150,
        bottom: 75,
        left: 100
      };

      const xScale = d3.scale
        .ordinal()
        .rangeBands([height, 0])
        .domain(chartData.variants.map(v => v.display_label).reverse());

      const yScale = d3.scale
        .ordinal()
        .rangeBands([height, 0])
        .domain(chartData.variants.map(v => v.display_label).reverse());

      const zScale = d3.scale
        .ordinal()
        .rangeBands([
          height - yScale.rangeBand() / 4,
          -(yScale.rangeBand() / 4)
        ])
        .domain(chartData.variants.map(v => v.display_label).reverse());

      const yContScale = d3.scale
        .linear()
        .range([-yScale.rangeBand(), height])
        .domain([0, chartData.variants.length - 1]);

      const xContScale = d3.scale
        .linear()
        .range([0, width + xScale.rangeBand()])
        .domain([0, chartData.variants.length - 1]);

      const xAxis = d3.svg
        .axis()
        .scale(xScale)
        .tickValues([])
        .orient("bottom");

      const yAxis = d3.svg
        .axis()
        .scale(yScale)
        .tickValues([])
        .orient("left");

      //margin convention
      const svg = d3
        .select("#correlation-plot")
        .append("svg")
        .attr("transform", "rotate(-45)")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg
        .append("g")
        .attr("classed", "x-axis")
        .call(yAxis);

      d3.selectAll("path")
        .style("fill", "none")
        .style("stroke", "black");

      const data: {
        variant: Variant;
        correlate: Variant;
        value: number;
      }[][] = [];

      chartData.variants.forEach(outerVariant => {
        const ret: {
          variant: Variant;
          correlate: Variant;
          value: number;
        }[] = [];
        chartData.variants.forEach(innerVariant => {
          //don't duplicate correlations
          if (
            data.find(datum =>
              datum.find(
                item =>
                  item.correlate.record_pk === outerVariant.record_pk &&
                  innerVariant.record_pk === item.variant.record_pk
              )
            )
          )
            return;

          const correlate = chartData.variants.find(
              vari => vari.record_pk === innerVariant.record_pk
            ),
            variant = chartData.variants.find(
              vari => vari.record_pk === outerVariant.record_pk
            );

          //if it's itself, give a 1
          if (outerVariant.record_pk === innerVariant.record_pk) {
            ret.push({
              variant,
              correlate,
              value: 1
            });
            return;
          }

          ret.push({
            variant,
            correlate,
            value: chartData.data.find(
              datum =>
                datum.variant1 === outerVariant.record_pk &&
                datum.variant2 === innerVariant.record_pk
            )
              ? chartData.data.find(
                  datum =>
                    datum.variant1 === outerVariant.record_pk &&
                    datum.variant2 === innerVariant.record_pk
                ).value
              : 0
          });
        });
        data.push(ret);
      });

      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar")
        .each(function(block) {
          //@ts-ignore
          d3.select(this)
            .selectAll(".block")
            .data(block)
            .enter()
            .append("rect")
            .attr("class", (d, i) => `block-${i}`)
            .attr("width", xScale.rangeBand())
            .attr("height", yScale.rangeBand())
            .attr("fill", d => (d.value < 0.2 ? "white" : "red"))
            .attr("stroke", "black")
            .attr("opacity", d => (d.value < 0.2 ? 1 : d.value))
            .attr("x", d => xScale(d.variant.display_label))
            .attr("y", d => yScale(d.correlate.display_label));
        });

      svg.selectAll("text").attr("transform", "rotate(45)");
      svg
        .selectAll(".x-axis")
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("dy", "0")
        .attr("x", "5");

      svg.selectAll(".bar").each(function(d: Datum[]) {
        const last = d[0];
        const x = xScale(last.variant.display_label);
        const y = zScale(last.correlate.display_label);
        //@ts-ignore
        d3.select(this)
          .append("g")
          .attr("transform", "translate(" + xScale.rangeBand() * 1.33 + ", 0)")
          .append("text")
          .attr("transform", "rotate(-45," + x + "," + y + ")")
          .attr("x", x)
          .attr("y", y)
          .style("font-size", 16)
          .text(() => last.variant.display_label);
      });

      const line = d3.svg
        .line()
        .x((d: any, i) => xContScale(i) + 20)
        .y((d: any, i) => yContScale(i));

      svg
        .append("path")
        .attr("class", "line")
        .style("stroke", "black")
        .attr("d", (d: any) => line(data as any));
    }
  }, [chartData]);

  return <div id="correlation-plot" />;
};

export default CorrelationPlot;
