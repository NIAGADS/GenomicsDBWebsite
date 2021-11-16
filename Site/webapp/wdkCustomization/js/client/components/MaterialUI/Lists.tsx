import React from "react";

import { withStyles } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";

import { resolveJsonInput } from "genomics-client/util/jsonParse";

//https://github.com/mui-org/material-ui/pull/15049
export const UnpaddedListItem = withStyles({ root: { padding: 0 } })(ListItem) as any;

export const LinkList: React.FC<{ list: string[] }> = ({ list }) => (
    <List>
        {list.map((item, i) => (
            <ListItem key={i}>{resolveJsonInput(item)}</ListItem>
        ))}
    </List>
);
