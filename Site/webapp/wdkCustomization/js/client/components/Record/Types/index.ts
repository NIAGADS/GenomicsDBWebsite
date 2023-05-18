import { RecordInstance, RecordClass, AttributeValue } from 'wdk-client/Utils/WdkModel';

export interface HeaderActions {
    iconClassName: string;
    onClick: any;
    label: string;
}

export interface RecordHeading {
    headerActions: HeaderActions[];
    record: RecordInstance;
    recordClass: RecordClass;
    categoryTree: any;
    webAppUrl?: string;
}

export type RecordAttributes = Record<string, AttributeValue>;

export const isVariantRecord = (item: any) => {
    return item.recordClassName === "VariantRecordClasses.VariantRecordClass"
};

export interface RecordSectionDocumentation {
    text: string;
    image?: string;
    dataSourceKey?: string;
    comingSoon?: string;
}

