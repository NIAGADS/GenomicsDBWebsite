import React from "react";
import { Options } from "highcharts";
import HighchartsPlot, { HighchartsPlotProps } from "./HighchartsPlot";

import "./HighchartsTrellisPlot.scss";
import { Grid } from "@material-ui/core";

// https://jsfiddle.net/65mbxwc9/

export const HighchartsColumnTrellis: React.FC<HighchartsPlotProps> = ({ data, properties }) => {
    return data ? (
        <Grid container wrap="nowrap">
            {data.map((item: any, index: number) => {
                return (
                    <Grid item key={`col_${index}`}>
                        <HighchartsPlot data={item} properties={properties} />
                    </Grid>
                );
            })}
        </Grid>
    ) : null;
};

export const HighchartsTableTrellis: React.FC<HighchartsPlotProps> = (props) => {
    const { data, properties } = props;

    return data ? (
        <table className="table table-trellis-plot">
            <tbody>
                <tr>
                    {data.map((item: any, index: number) => {
                        const plotOptions: Options = {
                            legend: {
                                enabled: index == data.length - 1,
                                layout: "vertical",
                                align: "right",
                                verticalAlign: "middle",
                                itemStyle: { fontWeight: "10px", fontSize: "10px" },
                            },
                            chart: {
                                width: index == data.length - 1 ? 300 : 250,
                            },
                        };
                        return (
                            <td key={index}>
                                <HighchartsPlot data={item} properties={properties} plotOptions={plotOptions} />
                            </td>
                        );
                    })}
                </tr>
            </tbody>
        </table>
    ) : null;
};
