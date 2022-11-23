import React from "react";
import toJson from "lodash";
import { withStyles } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";

import { ColumnAccessor, DefaultTextAccessor } from "@viz/Table/ColumnAccessors";

export const LinkAttribute: React.SFC<ColumnAccessor> = ({ value }) => {
    return <DefaultTextAccessor value={value} />;
};

export const UnpaddedListItem = withStyles({ root: { padding: 0 } })(ListItem) as any;

// json array of [{url: , value: , tooltip?: }, ...]
export const LinkAttributeList: React.FC<{ values: string }> = ({ values }) => {
    const list: any = toJson(values);
    return (
        <List>
            {list.map((item: any, i: number) => (
                <ListItem key={i}>
                    <LinkAttribute value={item} />
                </ListItem>
            ))}
        </List>
    );
};
