/**
 * Page wrapper used by view controllers. Customized to handle drawer
 */
import React from "react";
import { RouteComponentProps } from "react-router";
import { makeClassNameHelper } from "wdk-client/Utils/ComponentUtils";
import Header from "wdk-client/Components/Layout/Header";
import Footer from "wdk-client/Components/Layout/Footer";
import ErrorBoundary from "wdk-client/Core/Controllers/ErrorBoundary";
import { useScrollUpOnRouteChange } from "wdk-client/Hooks/Page";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "@components/MaterialUI";
import Announcements from "./Announcements";

// import clsx from "clsx";
//import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

//import { DrawerState } from "../Page";
//import { DRAWER_WIDTH } from "@components/MaterialUI";

/* const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            flexGrow: 1,
            //padding: theme.spacing(3),
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: 0 //-DRAWER_WIDTH,
        },
        contentShift: {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: DRAWER_WIDTH, //0
        },
    })
); */

type Props = RouteComponentProps<any> & {
    classNameModifier?: string;
    children: React.ReactChild;
};

const cx = makeClassNameHelper("wdk-RootContainer");

function CustomPageLayout(props: Props) {
    //const classes = useStyles();

    useScrollUpOnRouteChange();
    let contentClass = cx("", props.classNameModifier); // + " " + clsx(classes.content, {[classes.contentShift]: drawerIsOpen,})

    return (
        <ThemeProvider theme={theme}>
            <div className={contentClass}>
                <ErrorBoundary>
                    <Header />
                </ErrorBoundary>
                <div className="wdk-PageContent">
                    <Announcements />
                    {props.children}
                </div>
                <ErrorBoundary>
                    <Footer />
                </ErrorBoundary>
            </div>
        </ThemeProvider>
    );
}

export default CustomPageLayout;
