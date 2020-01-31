import React, { useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import { UserActions } from "wdk-client/Actions";
import { makeMenuItems } from "ebrc-client/util/menuItems";
import {
  loadBasketCounts,
  loadQuickSearches
} from "ebrc-client/actioncreators/GlobalActionCreators";
import AutoCompleteSearch from "../../AutoCompleteSearch/AutoCompleteSearch";
import ResponsiveMenu from "./Menu/ResponsiveMenu";
import { Loading, Link } from "wdk-client/Components";

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

declare namespace CBILSH {
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

//todo: put in utils, use radius setting for size
const waitFor = (item: any, func: { (): React.ReactElement<any> }) =>
  item ? (
    func()
  ) : (
    <Loading radius={5}>
      <div className="wdk-LoadingData">Loading data...</div>
    </Loading>
  );

//todo: move this when appropriate
interface User {
  isGuest: boolean;
  id: number;
  email: string;
  properties: {
    firstName: string;
    lastName: string;
    organization: string;
    middleName: string;
  };
}

interface BuildInfo {
  buildNumber: string;
}
const BuildInfo: React.SFC<BuildInfo> = props => {
  const { buildNumber } = props;
  return <span>Build Number: {buildNumber}</span>;
};

const UserSection: React.SFC<{ user: User; webAppUrl: string }> = props => {
  const { user, webAppUrl } = props;
  return (
    <div className="user-action-section">
      {user.isGuest ? (
        <GuestMenu webAppUrl={webAppUrl} />
      ) : (
        <UserMenu user={user} />
      )}
    </div>
  );
};

const GuestMenu: React.SFC<{ webAppUrl: string }> = props => {
  const { webAppUrl } = props;
  return (
    <div>
      <div className="login-section">
        Welcome Guest
        <a
          className="btn btn-blue"
          onClick={() => window.location.assign(`${webAppUrl}/user/login`)}
        >
          Login
        </a>
      </div>
    </div>
  );
};

const UserMenu: React.SFC<{ user: User }> = props => {
  const { user } = props;
  return (
    <div>
      <span>
        Welcome, {user.properties.firstName} {user.properties.lastName}!
      </span>
      <span>
        <Link to={"/favorites"}>
          <span className="fa fa-star" />
          Favorites
        </Link>
      </span>
      <span>
        <Link to={"/logout"}>
          <span className="fa fa-user-times" />
          Logout
        </Link>
      </span>
    </div>
  );
};

const CBILSiteHeader: React.FC<CBILSH.props & StoreProps> = props => {
  const [responsiveMenuToggled, setResponsiveMenuToggled] = useState(false);

  useEffect(() => {
    loadBasketCounts();
  }, []);

  const autcoompleteContainerRef = useRef();

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
    <div className="container-fluid mb-2">
      <div id="header" className="row">
        <div className="header2 col-sm-12">
          <div className="header_lt">
            <BuildInfo buildNumber={buildNumber} />
          </div>
          <div className="header_rt">
            {waitFor(user, () => (
              <UserSection user={user} webAppUrl={webAppUrl} />
            ))}
          </div>
        </div>
        <div
          className="col-sm-12 menu-container"
          ref={autcoompleteContainerRef}
        >
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
            ></ResponsiveMenu>
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

const HamburgerToggle: React.SFC<HamburgerToggle> = props => {
  return (
    <a className={"hamburger " + props.className} onClick={props.onToggle}>
      <i className="fa fa-2x fa-bars" />
    </a>
  );
};

export default connect<StoreProps, any, CBILSH.props, CBILSH.state>(
  (state: any) => state.globalData,
  { ...UserActions, loadBasketCounts, loadQuickSearches }
)(CBILSiteHeader);
