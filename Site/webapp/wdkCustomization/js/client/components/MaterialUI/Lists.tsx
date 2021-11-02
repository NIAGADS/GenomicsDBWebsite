import React from "react";
import { ListItem, withStyles } from "@material-ui/core";

//https://github.com/mui-org/material-ui/pull/15049
export const UnpaddedListItem = withStyles({ root: { padding: 0 } })(ListItem) as any;
