//@ts-nocheck
import React, { Component } from "react";

import classnames from "classnames";
import { debounce, get } from "lodash";
import { findDOMNode } from "react-dom";
import { getId } from "wdk-client/Utils/CategoryUtils";
import { addScrollAnchor } from "wdk-client/Utils/DomUtils";
import { postorderSeq } from "wdk-client/Utils/TreeUtils";
import "wdk-client/Views/Records/Record.css";
import RecordHeading from "wdk-client/Views/Records/RecordHeading";
import RecordMainSection from "wdk-client/Views/Records/RecordMain/RecordMainSection";
import RecordNavigationSection from "wdk-client/Views/Records/RecordNavigation/RecordNavigationSection";

import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import {
    RecordNavigationButton,
    RecordNavigationSection as RecordNavigationPanel,
} from "./Sections/RecordNavigationSection";
import { contentStyles as drawerPanelStyles } from "genomics-client/components/MaterialUI/Drawer/PersistentDrawerLeft";
/**
 * Renders the main UI for the WDK Record page.
 */

class RecordUI extends Component {
    constructor(props: any) {
        super(props);
        // bind event handlers
        this._updateActiveSection = debounce(this._updateActiveSection.bind(this), 100);
        this.monitorActiveSection = debounce(this.monitorActiveSection.bind(this), 100);

        //@ts-ignore
        this.recordMainSectionNode = null;
        //@ts-ignore
        this.activeSectionTop = null;
        //@ts-ignore
        this.state = { navigationIsOpen: true }; // default open
    }

    componentDidMount() {
        this._scrollToActiveSection();
        //@ts-ignore
        this.removeScrollAnchor = addScrollAnchor(
            //@ts-ignore
            this.recordMainSectionNode,
            document.getElementById(location.hash.slice(1))
        );
    }

    componentDidUpdate(prevProps: any) {
        //@ts-ignore
        let recordChanged = prevProps.record !== this.props.record;
        if (recordChanged) {
            this._scrollToActiveSection();
        }
    }

    componentWillUnmount() {
        this.unmonitorActiveSection();
        //@ts-ignore
        this.removeScrollAnchor();
        //@ts-ignore
        this._updateActiveSection.cancel();
        //@ts-ignore
        this.monitorActiveSection.cancel();
    }

    monitorActiveSection() {
        window.addEventListener("scroll", this._updateActiveSection, { passive: true });
    }

    unmonitorActiveSection() {
        //@ts-ignore
        window.removeEventListener("scroll", this._updateActiveSection, { passive: true });
    }

    _updateActiveSection() {
        //@ts-ignore
        let activeElement = postorderSeq(this.props.categoryTree)
            .map((node) => document.getElementById(getId(node)))
            .filter((el) => el != null)
            .find((el) => {
                let rect = el.getBoundingClientRect();
                return rect.top <= 50 && rect.bottom > 50;
            });
        let activeSection = get(activeElement, "id");
        console.debug(Date.now(), "updated activeSection", activeSection);
        let newUrl = location.pathname + location.search + (activeSection ? "#" + activeSection : "");
        history.replaceState(null, null, newUrl);
        //@ts-ignore
        this.activeSectionTop = activeElement && activeElement.getBoundingClientRect().top;
    }

    _scrollToActiveSection() {
        this.unmonitorActiveSection();
        let domNode = document.getElementById(location.hash.slice(1));
        if (domNode != null) {
            const rect = domNode.getBoundingClientRect();
            //@ts-ignore
            if (rect.top !== this.activeSectionTop) domNode.scrollIntoView(true);
            console.debug(Date.now(), "scrolled to active section", domNode, domNode.getBoundingClientRect().top);
        }
        this.monitorActiveSection();
    }

    _updateNavigationOpen(isOpen: boolean) {
        //@ts-ignore
        this.setState({ navigationIsOpen: isOpen });
    }

    _handleNavigationOpen() {
        this._updateNavigationOpen(true);
    }

    _handleNavigationClose() {
        this._updateNavigationOpen(false);
    }

    render() {
        //@ts-ignore
        let classes = this.props.classes; 
        let navigationStatusClassName = clsx(classes.content, { [classes.contentShift]: this.state.navigationIsOpen });
        let classNames = classnames(
            "wdk-RecordContainer",
            "wdk-RecordContainer__" + this.props.recordClass.fullName.replace('.', '_')
        ) + " " + navigationStatusClassName;

        return (
            <div className={classNames}>
                <RecordNavigationButton
                    isOpen={this.state.navigationIsOpen}
                    handleOpen={this._handleNavigationOpen.bind(this)}
                />
                <Grid item container direction="column">
                    <Grid item>
                        <RecordHeading
                            record={this.props.record}
                            recordClass={this.props.recordClass}
                            headerActions={this.props.headerActions}
                        />
                    </Grid>
                </Grid>
                <RecordNavigationPanel
                    isOpen={this.state.navigationIsOpen}
                    handleClose={this._handleNavigationClose.bind(this)}
                >
                    <RecordNavigationSection
                       // heading={this.props.record.displayName}
                        record={this.props.record}
                        recordClass={this.props.recordClass}
                        categoryTree={this.props.categoryTree}
                        collapsedSections={this.props.collapsedSections}
                        activeSection={this.props.activeSection}
                        navigationQuery={this.props.navigationQuery}
                        navigationExpanded={this.props.navigationExpanded}
                        navigationCategoriesExpanded={this.props.navigationCategoriesExpanded}
                        onSectionToggle={this.props.updateSectionVisibility}
                        onNavigationVisibilityChange={this.props.updateNavigationVisibility}
                        onNavigationCategoryExpansionChange={this.props.updateNavigationCategoryExpansion}
                        onNavigationQueryChange={this.props.updateNavigationQuery}
                        requestPartialRecord={this.props.requestPartialRecord}
                    />
                </RecordNavigationPanel>

                <div className="wdk-RecordMain">
                    <RecordMainSection
                        ref={(c) => (this.recordMainSectionNode = findDOMNode(c))}
                        record={this.props.record}
                        recordClass={this.props.recordClass}
                        categories={this.props.categoryTree.children}
                        collapsedSections={this.props.collapsedSections}
                        onSectionToggle={this.props.updateSectionVisibility}
                        requestPartialRecord={this.props.requestPartialRecord}
                    />
                </div>
            </div>
        );
    }
}

export default withStyles(drawerPanelStyles, { withTheme: true })(RecordUI);
