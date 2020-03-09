import React, { useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import { UserActions } from "wdk-client/Actions";
import { makeMenuItems } from "ebrc-client/util/menuItems";
import AutoCompleteSearch from "../../AutoCompleteSearch/AutoCompleteSearch";
import ResponsiveMenu from "./Menu/ResponsiveMenu";
import UserSection from './Menu/UserMenu';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface StoreProps {
    isPartOfEuPathDB?: boolean;
    location?: any;
    user?: any;
    siteConfig?: {
        announcements: any;
        buildNumber: string;
        projectId: string;
        releaseDate: string;
        webAppUrl: string;
    };
}

declare namespace HeaderProps {
    interface props {
        showLoginWarning: any;
        showLoginForm: any;
        showLogoutWarning: any;
        makeSmallMenuItems: any;
        loadBasketCounts: any;
        makeMainMenuItems: any;
    }
    interface state {
        responsiveMenuToggled: boolean;
    }
}

interface BuildInfo {
    buildNumber: string;
}

const BuildInfo: React.SFC<BuildInfo> = props => {
    const { buildNumber } = props;
    return <span className="build-info ml-2">Build Number: {buildNumber}</span>;
};


const Header: React.FC<HeaderProps.props & StoreProps> = props => {
    const [responsiveMenuToggled, setResponsiveMenuToggled] = useState(false);

    const autoCompleteContainerRef = useRef();

    const {
        loadBasketCounts,
        siteConfig,
        user,
        showLoginWarning,
        makeMainMenuItems
    } = props,
        { buildNumber, projectId, webAppUrl } = siteConfig,
        menuItems = makeMenuItems(props),
        mainMenuItems = makeMainMenuItems && makeMainMenuItems(props, menuItems);

    return (
        <Container id="header" fluid={true}>
            <Row className="justify-content-between mt-2 no-gutters" >
                <Col sm={4}>
                    <BuildInfo buildNumber={buildNumber} />
                </Col>
                <Col sm={4}>
                    <UserSection user={user} webAppUrl={webAppUrl} />
                </Col>
            </Row>
            <Row className="no-gutters menu-outer-container mt-2">            
                <Col sm={12} className="menu-container" ref={autoCompleteContainerRef}>
                    <div className="menu-inner-container">
                        <HamburgerToggle
                            className="d-md-none"
                            onToggle={setResponsiveMenuToggled.bind(
                                null,
                                !responsiveMenuToggled
                            )}
                        />
                        <ResponsiveMenu
                            responsiveMenuToggled={responsiveMenuToggled}
                            webAppUrl={webAppUrl}
                            projectId={projectId}
                            showLoginWarning={showLoginWarning}
                            isGuest={user ? user.isGuest : true}
                            items={mainMenuItems}
                        />
                        <AutoCompleteSearch canGrow={true} />
                    </div>
                </Col>
            </Row>
        </Container >
    );
};

interface HamburgerToggle {
    onToggle: { (): void };
    className: string;
}

const HamburgerToggle: React.SFC<HamburgerToggle> = props => {
    return (
        <a className={"hamburger " + props.className} onClick={props.onToggle}>
            <i className="fa fa-2x fa-bars" />
        </a>
    );
};

export default connect<StoreProps, any, HeaderProps.props, HeaderProps.state>(
    (state: any) => state.globalData,
    { ...UserActions }
)(Header);
