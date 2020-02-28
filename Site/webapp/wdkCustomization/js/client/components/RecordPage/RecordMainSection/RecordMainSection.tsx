import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RecordMainSection } from "wdk-client/Components";
import { getTableNames } from "wdk-client/Views/Records/RecordUtils";
import { setCollapsedSections } from "wdk-client/Actions/RecordActions";
import RecordMainCategorySection from "../RecordMainCategorySection/RecordMainCategorySection";
import {
  CategoryTreeNode,
  getId,
  getLabel
} from "wdk-client/Utils/CategoryUtils";
import * as GR from "../types";
import { RecordClass } from "wdk-client/Utils/WdkModel";
import { flatMap } from "lodash";

interface RecordMainSection {
  categories: CategoryTreeNode[];
  collapsedSections: any;
  depth: number;
  onSectionToggle: { (sectionName: string, isVisible: boolean): any };
  parentEnumeration: string;
  record: GR.GeneRecord;
  recordClass: RecordClass;
  requestPartialRecord: any;
  //connected
  setCollapsedSections?: (sections: string[]) => any;
}

const _NiagadsRecordMainSection: React.SFC<RecordMainSection> = ({
  categories,
  collapsedSections,
  depth = 0,
  onSectionToggle,
  record,
  recordClass,
  requestPartialRecord,
  parentEnumeration,
  setCollapsedSections
}) => {
  useEffect(() => {
    setCollapsedSections(flatMap(categories, getTableNames));
  }, []);

  return categories == null ? null : (
    <div>
      {categories.map((category, index) => {
        const categoryName = getLabel(category),
          categoryId = getId(category),
          enumeration = String(
            parentEnumeration == null
              ? index + 1
              : parentEnumeration + "." + (index + 1)
          );

        return (
          <RecordMainCategorySection
            category={category}
            depth={depth}
            enumeration={enumeration}
            isCollapsed={collapsedSections.includes(categoryId)}
            key={categoryName}
            onSectionToggle={onSectionToggle}
            record={record}
            recordClass={recordClass}
            requestPartialRecord={requestPartialRecord}
          >
            <NiagadsRecordMainSection
              categories={category.children}
              collapsedSections={collapsedSections}
              depth={depth + 1}
              onSectionToggle={onSectionToggle}
              parentEnumeration={enumeration}
              record={record}
              recordClass={recordClass}
              requestPartialRecord={requestPartialRecord}
            />
          </RecordMainCategorySection>
        );
      })}
    </div>
  );
};

const NiagadsRecordMainSection = connect(null, { setCollapsedSections })(
  _NiagadsRecordMainSection
);

export default NiagadsRecordMainSection;
