import { WdkViewController } from 'wdk-client/Controllers';
import { Header } from '../components';

export default class HeaderController extends WdkViewController {
  renderView() {
    return <Header/>;
  }
}
