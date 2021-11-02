import React from "react";
import PropTypes from "prop-types";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";

interface ElevationScrollProps {
    children: React.ReactElement;
}

export function ElevationScroll(props: ElevationScrollProps) {
    const { children } = props;

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

