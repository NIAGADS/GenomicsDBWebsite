import React from 'react';
import { formatReleaseDate } from 'ebrc-client/util/formatters';
import { buildNumber, releaseDate, displayName, projectId, webAppUrl } from 'ebrc-client/config';
import NewWindowLink from 'ebrc-client/components/NewWindowLink';

const Footer: React.SFC = props => {
	return <footer className="niagads-site-footer mt-4">
		<div className="footer-lower">
			<div className='niagads-section'>
				<div className="policies-menu">
					<ul className="inline-list">
						<li><a href="https://dss.niagads.org/disclaimer">Disclaimer</a></li>
						<li><a href="https://dss.niagads.org/privacy-policy">Privacy policy</a></li>
						<li><a href="https://dss.niagads.org/acknowledgment">Acknowledgment</a></li>
						<li><a href="https://dss.niagads.org/contact">Contact</a></li>
					</ul>
				</div>
				<div className='niagads-logo'>
					<a href="https://www.niagads.org/" target="_blank">
						<figure className="niagads-logo">
							<img src={`${webAppUrl}/images/niagads_logo.svg`} height="50px" />
							<figcaption>The National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site</figcaption>
						</figure>
					</a>
				</div>
				<div className="copyright">
					<span>©2018-2019 University of Pennsylvania, School of Medicine. All rights reserved.</span>
				</div>
			</div>
		</div>
	</footer>
}

export default Footer;