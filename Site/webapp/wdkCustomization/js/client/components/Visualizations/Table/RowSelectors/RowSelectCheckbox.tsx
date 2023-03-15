import React, { useRef, useEffect, forwardRef, useState, useImperativeHandle } from "react";
import Checkbox from "@material-ui/core/Checkbox";

// after https://github.com/TanStack/table/blob/06703a56890122cedf1b2fa4b82982999537774e/examples/row-selection/src/App.js#L36
//@ts-ignore
export const RowSelectCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef: any = ref || defaultRef;

    React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])
  
    return (
        <>
             <Checkbox ref={resolvedRef} {...rest} style={{padding: "0px"}}/>
        </>
    );
});
