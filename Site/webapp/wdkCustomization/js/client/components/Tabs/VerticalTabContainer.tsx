import React, { useEffect } from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { TabPanel } from "./TabPanel";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: "flex",
       // height: 224,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

// for propogating aria-controls
function a11yProps(index: any) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

interface TabContainerProps {
    children: React.ReactNode;
    labels: string[];
}

const VerticalTabContainer: React.FC<TabContainerProps> = ({ labels, children }) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="data-table"
                className={classes.tabs}
            >
                {labels.map((label: string, index: number) => {
                    return <Tab key={index} label={label} {...a11yProps(index)} />;
                })}
            </Tabs>

            {React.Children.map(children, ((child: React.ReactNode, index: number) =>  {
                return <TabPanel value={value} index={index}>
                    {child}
                </TabPanel>
            }))}
    
        </div>
    );
};

export default VerticalTabContainer;