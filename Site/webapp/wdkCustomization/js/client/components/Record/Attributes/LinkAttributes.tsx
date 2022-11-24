import React from "react";
import toJson from "lodash";

import List from "@material-ui/core/List";
import { UnpaddedListItem as ListItem } from "@components/MaterialUI";
import { ColumnAccessor, DefaultTextAccessor } from "@viz/Table/ColumnAccessors";

export const LinkAttribute: React.SFC<ColumnAccessor> = ({ value }) => {
    // if array / then we have a list
    return Array.isArray(toJson(value)) ? (
        <LinkAttributeList value={value} asString={true} />
    ) : (
        <DefaultTextAccessor value={value} />
    );
};



// json array of [{url: , value: , tooltip?: }, ...]
// asString returns it as a " // " separated list
export const LinkAttributeList: React.FC<{ value: string; asString?: boolean }> = ({ value, asString=false }) => {
    const list: any = toJson(value);
    return asString ? (
        list.map((item: any, i: number) => (
            <span key={i}>
                {i > 0 && " // "}
                <LinkAttribute value={item} />
            </span>
        ))
    ) : (
        <List>
            {list.map((item: any, i: number) => (
                <ListItem key={i}>
                    <LinkAttribute value={item} />
                </ListItem>
            ))}
        </List>
    );
};
