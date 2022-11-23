import {isObject} from "lodash";

export * from "./ColumnAccessorUtils";
export * from "./NASpan";
export * from "./TextAccessors";
export * from "./SparkPercentageBarAccessor";
export * from "./BooleanCheckAccessor";
export * from "./JSONAccessor";
export * from "./LinkAccessor";

export type ColumnAccessorType = 'PercentageBar' | 'Default' | "BooleanCheck" | "ScientificNotation" | "Float" | "ColoredSpan" ;

export interface ColumnAccessor {
    value?: any;
    object?: any;
    muiColor?: any; // one of 
    htmlColor?: string;
    className?: string;
    maxLength?: number
}


