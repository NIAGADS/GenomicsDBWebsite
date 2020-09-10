import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { UserActions } from "wdk-client/Actions";
import { makeMenuItems } from "ebrc-client/util/menuItems";
import AutoCompleteSearch from "../../AutoCompleteSearch/AutoCompleteSearch";
import ResponsiveMenu from "./Menu/ResponsiveMenu";
import UserSection from "./Menu/UserMenu";

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

interface HeaderProps {
    showLoginWarning: any;
    showLoginForm: any;
    showLogoutWarning: any;
    makeSmallMenuItems: any;
    loadBasketCounts: any;
    makeMainMenuItems: any;
}

interface BuildInfo {
    buildNumber: string;
}

const BuildInfo: React.SFC<BuildInfo> = (props) => {
    const { buildNumber } = props;
    return <span className="build-info ml-2">Build Number: {buildNumber}</span>;
};

const Header: React.FC<HeaderProps & StoreProps> = (props) => {
    const [responsiveMenuToggled, setResponsiveMenuToggled] = useState(false);

    const autoCompleteContainerRef = useRef();

    const { siteConfig, user, showLoginWarning, makeMainMenuItems } = props,
        { buildNumber, projectId, webAppUrl } = siteConfig,
        menuItems = makeMenuItems(props),
        mainMenuItems = makeMainMenuItems && makeMainMenuItems(props, menuItems);

    return (
        <div className="container-fluid" id="header">
            <div className="row justify-content-between mt-2 no-gutters">
                <div className="col-sm-6">
                    <BuildInfo buildNumber={buildNumber} />
                </div>
                <div className="col-sm-6 d-flex justify-content-end">
                    <UserSection user={user} webAppUrl={webAppUrl} />
                </div>
            </div>
            <div className="row no-gutters menu-outer-container mt-2">
                <div className="col-sm-12 menu-container" ref={autoCompleteContainerRef}>
                    <div className="menu-inner-container">
                        <HamburgerToggle
                            className="d-md-none"
                            onToggle={setResponsiveMenuToggled.bind(null, !responsiveMenuToggled)}
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
                </div>
            </div>
        </div>
    );
};

interface HamburgerToggle {
    onToggle: { (): void };
    className: string;
}

const HamburgerToggle: React.SFC<HamburgerToggle> = (props) => {
    return (
        <a className={"hamburger " + props.className} onClick={props.onToggle}>
            <i className="fa fa-2x fa-bars" />
        </a>
    );
};

export default connect((state: any) => state.globalData, {
    ...UserActions,
})(Header);
