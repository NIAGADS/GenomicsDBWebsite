import { WdkViewController } from "wdk-client/Controllers";
import { Footer } from "../components";

export default class FooterController extends WdkViewController {
    renderView() {
        return <Footer />;
    }
}
