export interface HeaderActions {
    iconClassName: string;
    onClick: any;
    label: string;
}

export const isVariantRecord = (item: any) => {
    return item.recordClassName === "VariantRecordClasses.VariantRecordClass"
};
