import React from "react";
import { withStyles } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";

export const UnpaddedListItem = withStyles({ root: { padding: 0 } })(ListItem) as any;