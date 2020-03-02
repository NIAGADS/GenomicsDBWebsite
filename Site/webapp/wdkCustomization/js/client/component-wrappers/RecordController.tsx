import { connect } from "react-redux";
import { RecordController as WdkRecordController } from "wdk-client/Controllers";
import { CategoryTreeNode } from "wdk-client/Utils/CategoryUtils";

export function RecordController(
  WdkRecordController: React.ComponentClass<any, any>
) {
  const enhance = connect((state: { globalData: any }) => ({
    globalData: state.globalData
  }));
  class ApiRecordController extends WdkRecordController {
    getRecordRequestOptions(recordClass: any, categoryTree: CategoryTreeNode) {
      //@ts-ignore
      const requestOptions = super.getRecordRequestOptions(
        recordClass,
        categoryTree
      );
      //we're going to lazy load tables, so returning only initialOptions and no additionalOptions
      return [
        {
          attributes: requestOptions[0].attributes,
          tables: requestOptions[0].tables
        }
      ];
    }
  }
  return enhance(ApiRecordController);
}
