import NewWindowLink from 'ebrc-client/components/NewWindowLink';
import { formatReleaseDate } from 'ebrc-client/util/formatters';
import { buildNumber, releaseDate, displayName, projectId, webAppUrl } from 'ebrc-client/config';


/** Application footer */
export default function Footer() {
  return (
    <div className="wide-footer ui-helper-clearfix" id="fixed-footer">
      <div className="left">
        <div className="build-info">
          <span>
            <a href={'http://' + projectId.toLowerCase() + '.org'}>{displayName}</a>
            <span> {buildNumber} &nbsp;&nbsp; {formatReleaseDate(releaseDate)}</span>
          </span>
          <br/>
        </div>
        <div className="copyright">©{new Date().getFullYear()} CBIL Project Team</div>
        <div className="twitter-footer">Follow us on
          <a className="eupathdb-SocialMedia eupathdb-SocialMedia__twitter" href="https://twitter.com/niagads" target="_blank"></a>
        </div>
      </div>
      <div className="right">
        <ul className="attributions">
          <li>
            <a href="http://code.google.com/p/strategies-wdk/">
              <img width="120" src={webAppUrl + '/wdk/images/stratWDKlogo.png'} />
            </a>
          </li>
        </ul>
        <div className="contact">
          Please <NewWindowLink href={webAppUrl + '/contact.do'}>Contact Us</NewWindowLink> with any questions or comments
        </div>
      </div>
    </div>
  );
}
