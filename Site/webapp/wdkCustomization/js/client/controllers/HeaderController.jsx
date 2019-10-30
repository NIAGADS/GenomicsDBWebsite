import { WdkViewController } from 'wdk-client/Controllers';
import { SiteHeader } from '../components';

export default class HeaderController extends WdkViewController {
  renderView() {
    return <Header/>;
  }
}
