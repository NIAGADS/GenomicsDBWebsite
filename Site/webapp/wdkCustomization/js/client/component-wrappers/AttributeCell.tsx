import React from "react";
import { truncate } from "lodash";
import { RecordInstance, AttributeField } from "wdk-client/Utils/WdkModel";

interface AttributeCellProps {
  attribute: AttributeField;
  recordInstance: RecordInstance;
}

export const AttributeCell = (Comp: React.ComponentType) => ({
  attribute,
  recordInstance
}: AttributeCellProps) => {
  const value = recordInstance.attributes[attribute.name];

  if (value == null) return null;

  if (typeof value === "string") {
    const truncatedValue = truncateValue(value, attribute.truncateTo);
    return (
      <div
        title={truncatedValue !== value ? value : undefined}
        dangerouslySetInnerHTML={{
          __html: truncatedValue
        }}
      />
    );
  }

  if (React.isValidElement(value)) {
    return <div>{value}</div>;
  }

  const { url, displayText } = value;
  const display = displayText || url;
  const truncatedDisplay = truncateValue(display, attribute.truncateTo);
  return (
    <div title={truncatedDisplay !== display ? display : undefined}>
      <a
        href={url}
        dangerouslySetInnerHTML={{
          __html: truncatedDisplay
        }}
      />
    </div>
  );
};

function truncateValue(value: string, length: number) {
  return length ? truncate(value, { length }) : value;
}
