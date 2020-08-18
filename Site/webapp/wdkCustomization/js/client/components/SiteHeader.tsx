import React from "react";
import Header from "./GlobalLayout/Header/Header";
import makeMainMenuItems from "../data/mainMenuItems";
import makeSmallMenuItems from "../data/smallMenuItems";

const placeholder = () => false;

export default () => {
    return (
        <Header
            makeMainMenuItems={makeMainMenuItems}
            makeSmallMenuItems={makeSmallMenuItems}
            showLoginForm={placeholder}
            showLoginWarning={placeholder}
            showLogoutWarning={placeholder}
            loadBasketCounts={placeholder}
        />
    );
};
