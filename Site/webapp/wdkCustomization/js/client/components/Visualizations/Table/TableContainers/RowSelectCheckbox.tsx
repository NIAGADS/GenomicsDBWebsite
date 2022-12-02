import React, { useRef, useEffect, forwardRef, useState, useImperativeHandle } from "react";
import Checkbox from "@material-ui/core/Checkbox";

// after https://github.com/TanStack/table/blob/06703a56890122cedf1b2fa4b82982999537774e/examples/row-selection/src/App.js#L36
//@ts-ignore
export const RowSelectCheckbox = forwardRef((props:any, ref) => {
    const defaultRef = useRef();
    const resolvedRef: any = ref || defaultRef;
    const [isChecked, setIsChecked] = useState<boolean>(props.checked ? props.checked : false);

    useEffect(() => {
        resolvedRef.current.props = props;
    }, [resolvedRef, props]);

    return (
        <>
            <Checkbox ref={resolvedRef} checked={props.checked} onChange={(e) => setIsChecked(!isChecked)} />
        </>
    );
});
