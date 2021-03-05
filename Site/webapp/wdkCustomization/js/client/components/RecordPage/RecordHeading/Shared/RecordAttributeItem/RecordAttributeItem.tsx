import React from "react";
import { BaseTextSmall } from "../../../../Shared";

interface RecordAttributeItem {
    label: string;
    attribute: string | React.ReactElement;
}

const RecordAttributeItem: React.FC<RecordAttributeItem> = ({ label, attribute }) => (
    <BaseTextSmall>
        <strong>{label}&nbsp;</strong>
        {attribute}
    </BaseTextSmall>
);

export default RecordAttributeItem;
