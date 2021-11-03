import React from "react";
import { BaseText } from "../../../../../MaterialUI";

interface RecordAttributeItem {
    label: string;
    attribute: string | React.ReactElement;
}

const RecordAttributeItem: React.FC<RecordAttributeItem> = ({ label, attribute }) => (
    <BaseText>
        <strong>{label}&nbsp;</strong>
        {attribute}
    </BaseText>
);

export default RecordAttributeItem;
