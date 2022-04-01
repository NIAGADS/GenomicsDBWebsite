import React, { useEffect } from "react";
import * as d3 from "d3";

export interface d3ChartProps {
    data: any;
    width?: number;
    height?: number;
    margin?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    fill?: string;
    className?: string;
}
export const CumulativeHistogram: React.FC<d3ChartProps> = ({ data, className, width, margin, fill, height }) => {
    useEffect(() => {});

    return (
        <>
            <svg height={height + margin.top + margin.bottom} width={width + margin.left + margin.right}>
                <g className="histogram_d3chart" transform={`translate(${margin.left},${margin.top})`} />
            </svg>
        </>
    );
};
