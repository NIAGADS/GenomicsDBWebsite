import { connect } from "react-redux";
import { CategoryTreeNode } from "wdk-client/Utils/CategoryUtils";
import { RecordClass } from "wdk-client/Utils/WdkModel";

export function RecordController(WdkRecordController: React.ComponentClass<any, any>) {
    const enhance = connect((state: { globalData: any }) => ({
        globalData: state.globalData,
    }));
    class ApiRecordController extends WdkRecordController {
        getRecordRequestOptions = (recordClass: RecordClass, categoryTree: CategoryTreeNode) => {
            //@ts-ignore
            const requestOptions = super.getRecordRequestOptions(recordClass, categoryTree);
            //we're going to lazy load tables (minus those that don't implement standard partialRecord fetch, like locuszoom)
            //so we need only initialOptions and no additionalOptions
            return [
                {
                    attributes: requestOptions[0].attributes,
                    tables: requestOptions[0].tables /*.concat(
                        recordClass.fullName === "VariantRecordClasses.VariantRecordClass"
                            ? ["locuszoom_gwas_datasets"]
                    : [] 
                    ), */
                },
            ];
        };
    }
    return enhance(ApiRecordController);
}
