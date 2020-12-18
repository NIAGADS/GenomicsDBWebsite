import React from "react";
import { webAppUrl } from "ebrc-client/config";

const Footer: React.FC = () => {
    return (
        <footer className="niagads-site-footer mt-4">
            <div className="footer-lower">
                <div className="niagads-section">
                    <div className="niagads-logo">
                        <a href="https://www.niagads.org/" rel="noopener noreferrer" target="_blank">
                            <figure className="niagads-logo">
                                <img src={`${webAppUrl}/images/niagads_logo.svg`} height="50px" />
                                <figcaption>
                                    The National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site
                                </figcaption>
                            </figure>
                        </a>
                    </div>
                    <div className="copyright">
                        <span>©2018-2020 University of Pennsylvania, School of Medicine. All rights reserved.</span>
                    </div>
                    <div className="policies-menu">
                        <ul className="inline-list">
                            <li>
                                <a href="https://www.niagads.org/privacy-policy">Privacy policy</a>
                            </li>
                            <li>
                                <a href="https://www.niagads.org/contact">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
