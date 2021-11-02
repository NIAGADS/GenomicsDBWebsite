import { WdkViewController } from 'wdk-client/Controllers';
import { Page } from '../component-wrappers/Components';

export default class PageController extends WdkViewController {
  renderView() {
    return <Page/>;
  }
}
