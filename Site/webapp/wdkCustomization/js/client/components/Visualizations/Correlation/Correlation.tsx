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
        top: 50,
        right: 50,
        bottom: 75,
        left: 100
      };

      //draw canvas

      const xScale = d3.scale
        .ordinal()
        .rangeBands([height, 0])
        .domain(chartData.variants.map(v => v.display_label).reverse());

      const yScale = d3.scale
        .ordinal()
        .rangeBands([height, 0])
        .domain(chartData.variants.map(v => v.display_label).reverse());

      const xAxis = d3.svg
        .axis()
        .scale(xScale)
        .orient("bottom");

      const yAxis = d3.svg
        .axis()
        .scale(yScale)
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
            .attr("class", "block")
            .attr("width", xScale.rangeBand())
            .attr("height", yScale.rangeBand())
            .attr("fill", d => (d.value < 0.2 ? "gray" : "red"))
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
    }
  }, [chartData]);

  return <div id="correlation-plot" />;
};

export default CorrelationPlot;
