import React from "react";
import { isObject } from "lodash";
import List from "@material-ui/core/List";
import { UnpaddedListItem as ListItem } from "@components/MaterialUI";
import { LinkAccessor, DefaultTextAccessor, ColumnAccessor } from "@viz/Table/ColumnAccessors";

export const LinkAttribute: React.FC<{value:string}> = ({value}) => {
    return <LinkAccessor value={JSON.parse(value)}/>
}

// json array of [{url: , value: , tooltip?: }, ...]
// asString returns it as a " // " separated list
export const LinkAttributeList: React.FC<{ value: string; asString?: boolean }> = ({ value, asString = false }) => {
    if (!value || value === null || value === '') {
        return <DefaultTextAccessor value={value}/>
    }

    const list: any = JSON.parse(value);
    return asString ? (
        list.map((item: any, i: number) => (
            <span key={i}>
                {i > 0 && " // "}
                <LinkAccessor value={item} />
            </span>
        ))
    ) : (
        <List>
            {list.map((item: any, i: number) => (
                <ListItem key={i}>
                    <LinkAccessor value={item} />
                </ListItem>
            ))}
        </List>
    );
};
