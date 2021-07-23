import React from "react";
import { PageChangeFunction, PageSizeChangeFunction, DerivedDataObject } from "react-table";

export interface RenderPageJumpProps {
    onChange: { (e: React.ChangeEvent<HTMLInputElement>): void };
    value: number;
    onBlur: any;
    onKeyPress: any;
    inputType: string;
    pageJumpText: string;
}

export interface RenderPageSizeProps {
    pageSize: number;
    pageSizeOptions: number[];
    rowsSelectorText: string;
    onPageSizeChange: any;
    rowsText: string;
}

export interface PaginationProps {
    PreviousComponent: React.ReactType;
    NextComponent: React.ReactType;
    onPageChange: PageChangeFunction;
    pages: number;
    page: any;
    showPageSizeOptions: boolean;
    pageSizeOptions: number[];
    pageSize: number;
    showPageJump: boolean;
    canPrevious: boolean;
    canNext: boolean;
    onPageSizeChange: PageSizeChangeFunction;
    className: string;
    renderPageJump: { (props: any): React.ReactType };
    pageJumpText: string;
    style: React.CSSProperties;
    previousText: string;
    pageText: string;
    rowsSelectorText: string;
    rowsText: string;
    ofText: string;
    nextText: string;
    renderCurrentPage: { (page: number): React.ReactType };
    renderTotalPagesCount: { (pages: number): React.ReactType };
    renderPageSizeOptions: { (args: RenderPageSizeOptionsArgs): React.ReactType };
    sortedData: DerivedDataObject[];
}

interface RenderPageSizeOptionsArgs {
    pageSize: number;
    rowsSelectorText: string;
    pageSizeOptions: number[];
    onPageSizeChange: PageSizeChangeFunction;
    rowsText: string;
}

export interface PaginationState {
    page: any;
}
