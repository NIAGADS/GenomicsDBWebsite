import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { UserActions } from 'wdk-client/Actions';
import { formatReleaseDate } from 'ebrc-client/util/formatters';
import { makeMenuItems } from 'ebrc-client/util/menuItems';
import { loadBasketCounts, loadQuickSearches } from 'ebrc-client/actioncreators/GlobalActionCreators';
import Announcements from 'ebrc-client/components/Announcements';
import QuickSearchMulti from '../../QuickSearchMulti';
import SmallMenu from 'ebrc-client/components/SmallMenu';
import ResponsiveMenu from './Menu/ResponsiveMenu';
import { Loading, Link } from 'wdk-client/Components';


//todo:type out
interface StateProps {
  isPartOfEuPathDB: boolean;
  location: any;
  user: any;
  siteConfig: {
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
const waitFor = (item: any, func: { (): React.ReactElement<any> }) => item ? func() : <Loading>
  <div className="wdk-LoadingData">Loading data...</div>
</Loading>;

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
  }
}

interface BuildInfo {
  buildNumber: string;
}
const BuildInfo: React.SFC<BuildInfo> = props => {
  const { buildNumber } = props;
  return <span>Build Number: {buildNumber}</span>
}

const UserSection: React.SFC<{ user: User, webAppUrl: string }> = props => {
  const { user, webAppUrl } = props;
  return <div className='user-action-section'>
    {user.isGuest ?
      <GuestMenu webAppUrl={webAppUrl} /> : <UserMenu user={user} />}
  </div>;
}

const GuestMenu: React.SFC<{ webAppUrl: string }> = props => {
  const { webAppUrl } = props;
  return <div>
    <div className="login-section">
      Welcome Guest
      <a className='btn btn-blue'
        onClick={() => window.location.assign(`${webAppUrl}/user/login`)}>Login
      </a>
    </div>
  </div>
}

const UserMenu: React.SFC<{ user: User }> = props => {
  const { user } = props;
  return <div>
    <span>Welcome, {user.properties.firstName} {user.properties.lastName}!</span>
    <span><Link to={"/favorites"}><span className="fa fa-star" />Favorites</Link></span>
    <span><Link to={"/logout"}><span className="fa fa-user-times" />Logout</Link></span>
  </div>;
}


const CBILSiteHeader: React.ComponentClass<CBILSH.props, CBILSH.state> = class extends React.Component<CBILSH.props & StateProps, CBILSH.state> {

  constructor(props: CBILSH.props & StateProps) {
    super(props);
    this.state = { responsiveMenuToggled: false };
  }

  componentDidMount() {
    this.props.loadBasketCounts();
  }

  render() {
    const {
      siteConfig,
      user,
      showLoginWarning,
      location = window.location,
      makeSmallMenuItems,
      makeMainMenuItems,
      isPartOfEuPathDB = false,
    } = this.props;

    const {
      announcements,
      buildNumber,
      projectId,
      releaseDate,
      webAppUrl,
    } = siteConfig;

    const menuItems = makeMenuItems(this.props);
    const mainMenuItems = makeMainMenuItems && makeMainMenuItems(this.props, menuItems);
    const smallMenuItems = makeSmallMenuItems && makeSmallMenuItems(this.props, menuItems);

    return (
      <div className="container-fluid">
        <div id="header" className="row">
          <div className="header2 col-sm-12">
            <div className="header_lt">
              <BuildInfo buildNumber={buildNumber} />
            </div>
            <div className="header_rt">
              {waitFor(user, () => <UserSection user={user} webAppUrl={webAppUrl} />)}
            </div>
          </div>
          <div className="col-sm-12 menu-container">
            <div className="menu-inner-container">
              {/*<div className="brand">
                              <img src={`${webAppUrl}/images/niagads_logo.svg`} height="25px" />
                            </div>*/}
              <HamburgerToggle
                className="d-md-none"
                onToggle={() => this.setState({ responsiveMenuToggled: !this.state.responsiveMenuToggled })}
              />
              <ResponsiveMenu
                responsiveMenuToggled={this.state.responsiveMenuToggled}
                webAppUrl={webAppUrl}
                projectId={projectId}
                showLoginWarning={showLoginWarning}
                isGuest={user ? user.isGuest : true}
                items={mainMenuItems}>
              </ResponsiveMenu>
              <QuickSearchMulti
                webappUrl={webAppUrl}
                showTooltip={true}
                className="d-none d-lg-flex" />
            </div>
          </div>
        </div>
       {/* <div className="row">
          <div className="col-sm-12">
            <Announcements projectId={projectId} webAppUrl={webAppUrl} location={location} announcements={announcements} />
          </div>
        </div>*/}
      </div>
    );
  }
}

interface HamburgerToggle {
  onToggle: { (): void };
  className: string;
}

const HamburgerToggle: React.SFC<HamburgerToggle> = props => {
  return <a className={"hamburger " + props.className} onClick={props.onToggle}>
    <i className="fa fa-2x fa-bars" />
  </a>
}

export default connect<StateProps, any, CBILSH.props, CBILSH.state>(
  (state: any) => state.globalData,
  { ...UserActions, loadBasketCounts, loadQuickSearches }
)(CBILSiteHeader);
