import React, { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { groupBy, noop } from "lodash";

import { Link, IconAlt } from "wdk-client/Components";
import { useWdkService } from "wdk-client/Hooks/WdkServiceHook";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";

const stopIcon = (
    <span className="fa-stack" style={{ fontSize: "1.2em" }}>
        <i className="fa fa-circle fa-stack-2x" style={{ color: "darkred" }} />
        <i className="fa fa-times fa-stack-1x" style={{ color: "white" }} />
    </span>
);

const warningIcon = (
    <span className="fa-stack" style={{ fontSize: "1.2em" }}>
        <i className="fa fa-exclamation-triangle fa-stack-2x" style={{ color: "#ffeb3b" }} />
        <i className="fa fa-exclamation fa-stack-1x" style={{ color: "black", fontSize: "1.3em", top: 2 }} />
    </span>
);

const infoIcon = (
    <span className="fa-stack" style={{ fontSize: "1.2em" }}>
        <i className="fa fa-circle fa-stack-2x" style={{ color: "#004aff" }} />
        <i className="fa fa-info fa-stack-1x" style={{ color: "white" }} />
    </span>
);

// Array of announcements to show. Each element of the array is an object which specifies
// a unique id for the announcement, and a function that takes props and returns a React Element.
// Use props as an opportunity to determine if the message should be displayed for the given context.
const siteAnnouncements = [
    {
        id: "live-beta",
        renderDisplay: (props: any) => {
            if (param("beta", window.location) === "true" || /^(beta|b1|b2)/.test(window.location.hostname)) {
                return (
                    <div key="live-beta">
                        Welcome to NIAGADS Alzheimer's GenomicsDB ({props.projectId}) <i>beta</i> where you will find
                        the newest versions of our interface, features, tools and data. While we transition to making
                        this beta site permanent,{" "}
                        <a target="_blank" href="https://www.niagads.org/genomics">
                            www.niagads.org/genomics
                        </a>{" "}
                        is still available (to be retired by Fall 2021). Please feel free to provide us with your
                        feedback using this{" "}
                        <a target="_blank" href="https://upenn.co1.qualtrics.com/jfe/form/SV_869ZYgJgalnKUCi">
                            beta-site feedback form
                        </a>
                        .
                    </div>
                );
            }
            return null;
        },
    },
];

//@ts-ignore
const fetchAnnouncementsData = async (wdkService) => {
    const [config, announcements] = await Promise.all([wdkService.getConfig(), wdkService.getSiteMessages()]);

    return {
        config,
        announcements,
    };
};

/**
 * Info boxes containing announcements.
 */
export default function Announcements({
    //@ts-ignore
    closedBanners = [],
    setClosedBanners = noop,
}) {
    const location = useLocation();
    const data = useWdkService(fetchAnnouncementsData, []);

    const onCloseFactory = useCallback(
        (id) => () => {
            setClosedBanners([...closedBanners, id]);
        },
        [closedBanners]
    );

    if (data == null) return null;

    const { down = [], degraded = [], information = [] } = groupBy(data.announcements, "category");

    return (
        <div>
            {[...down, ...degraded, ...information, ...siteAnnouncements].map((announcementData) => {
                const category = announcementData.category || "page-information";

                // Currently, only announcements of category "information" are dismissible
                const dismissible = category === "information";
                const isOpen = dismissible ? !closedBanners.includes(`${announcementData.id}`) : true;
                const onClose = dismissible ? onCloseFactory(`${announcementData.id}`) : noop;

                const display =
                    typeof announcementData.renderDisplay === "function"
                        ? announcementData.renderDisplay({ ...data.config, location })
                        : category !== "information" || location.pathname === "/"
                        ? toElement(announcementData)
                        : null;

                return (
                    <AnnouncementContainer
                        key={announcementData.id}
                        category={category}
                        dismissible={dismissible}
                        isOpen={isOpen}
                        onClose={onClose}
                        display={display}
                    />
                );
            })}
        </div>
    );
}

/**
 * Container for a single announcement banner.
 */
function AnnouncementContainer(props: any) {
    const icon = props.category === "down" ? stopIcon : props.category === "degraded" ? warningIcon : infoIcon;

    return <AnnouncementBanner {...props} icon={icon} />;
}

/**
 * Banner for a single announcement.
 */
//@ts-ignore
function AnnouncementBanner({ isOpen, onClose, icon, display, dismissible }) {
    if (display == null) {
        return null;
    }

    return (
        <div
            className="eupathdb-Announcement"
            style={{
                margin: "3px",
                padding: ".5em",
                borderRadius: "0.5em",
                borderWidth: "1px",
                borderColor: "lightgrey",
                borderStyle: "solid",
                background: "#E3F2FD",
                display: isOpen ? "block" : "none",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                }}
            >
                {icon}
                <div
                    style={{
                        marginLeft: "1em",
                        display: "inline-block",
                        width: "calc(100% - 5.5em)",
                        padding: "8px",
                        verticalAlign: "middle",
                        color: "black",
                        fontSize: "1.2em",
                    }}
                >
                    {display}
                </div>
                {dismissible && (
                    <div style={{ marginLeft: "auto" }}>
                        <button
                            onClick={onClose}
                            className="link"
                            style={{
                                color: "#7c7c7c",
                                alignSelf: "flex-start",
                                fontSize: "0.8em",
                            }}
                        >
                            <IconAlt fa="times" className="fa-2x" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Convert html string to a React Element
 *
 * @param {string} html
 * @return {React.Element}
 */
//@ts-ignore
function toElement({ message }) {
    return safeHtml(message, { key: message }, "div");
}

/**
 * Join elements with <hr/>
 *
 * @param {React.Element[]|null} previous
 * @param {React.Element} next
 * @return {React.Element[]}
 */
//@ts-ignore
function injectHr(previous, next) {
    return previous == null ? [next] : previous.concat(<hr />, next);
}

/**
 * Returns a function that takes another function and calls it with `args`.
 * @param {any[]} ...args
 * @return {(fn: Function) => any}
 */
//@ts-ignore
function invokeWith(...args) {
    //@ts-ignore
    return (fn) => fn(...args);
}

/**
 * Find the value of the first param in the location object.
 *
 * @param {string} name The param name
 * @param {Location} location
 * @return {string?}
 */
//@ts-ignore
function param(name, { search = "" }) {
    return search
        .slice(1)
        .split("&")
        .map((entry) => entry.split("="))
        .filter((entry) => entry[0] === name)
        .map((entry) => entry[1])
        .map(decodeURIComponent)
        .find(() => true);
}

//@ts-ignore
function isGenomicSite(projectId) {
    return !/ClinEpiDB|MicrobiomeDB/i.test(projectId);
}
function isBetaSite() {
    return param("beta", window.location) === "true" || /^(beta|b1|b2)/.test(window.location.hostname);
}
//@ts-ignore
function isGalaxy(routerLocation) {
    return routerLocation.pathname.startsWith("/galaxy-orientation");
}
//@ts-ignore
function isApollo(routerLocation) {
    return routerLocation.pathname.startsWith("/static-content/apollo");
}
//@ts-ignore
function isStrategies(routerLocation) {
    return routerLocation.pathname.startsWith("/workspace/strategies");
}
//@ts-ignore
function isBasket(routerLocation) {
    return routerLocation.pathname.startsWith("/workspace/basket");
}
//@ts-ignore
function isFavorites(routerLocation) {
    return routerLocation.pathname.startsWith("/workspace/favorites");
}
//@ts-ignore
function isGenomicHomePage(projectId, routerLocation) {
    return isGenomicSite(projectId) && routerLocation.pathname === "/";
}
