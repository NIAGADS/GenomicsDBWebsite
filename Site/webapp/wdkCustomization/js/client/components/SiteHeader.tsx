import React from 'react';
import ClassicSiteHeader from './GlobalLayout/Header/ClassicSiteHeader';
import makeMainMenuItems from '../data/mainMenuItems';
import makeSmallMenuItems from '../data/smallMenuItems';

const placeholder = () => false;

export default () => {
  return <ClassicSiteHeader
    makeMainMenuItems={makeMainMenuItems}
    makeSmallMenuItems={makeSmallMenuItems}
    showLoginForm={placeholder}
    showLoginWarning={placeholder}
    showLogoutWarning={placeholder}
    loadBasketCounts={placeholder}
  />
}
