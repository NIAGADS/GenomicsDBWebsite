import React from "react";
import { Options } from "highcharts";
import HighchartsPlot, { HighchartsPlotProps } from "./HighchartsPlot";

import "./HighchartsTrellisPlot.scss";
import { Grid } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { theme } from "genomics-client/components/MaterialUI";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: "auto",
        },
        marginRight: {
            marginRight: theme.spacing(8),
        },
    })
);

// https://jsfiddle.net/65mbxwc9/

export const HighchartsColumnTrellis: React.FC<HighchartsPlotProps> = ({ data, properties }) => {
    const classes = useStyles();
    return data ? (
        <Grid container wrap="nowrap">
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
                    <Grid
                        item
                        key={`col_${index}`}
                        className={index < data.length - 1 ? classes.marginRight : classes.root}
                    >
                        <HighchartsPlot data={item} properties={properties} plotOptions={plotOptions} />
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
