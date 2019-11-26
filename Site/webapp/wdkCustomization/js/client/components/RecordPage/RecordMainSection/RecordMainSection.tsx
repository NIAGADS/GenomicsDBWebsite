import React from 'react';
import { RecordMainSection } from 'wdk-client/Components';
import RecordMainCategorySection from '../RecordMainCategorySection/RecordMainCategorySection';
import { getId, getLabel } from 'wdk-client/Utils/CategoryUtils';
import * as GR from '../types';
import { RecordClass } from 'wdk-client/Utils/WdkModel';

interface RecordMainSection {
    depth: number;
    record: GR.GeneRecord;
    recordClass: RecordClass;
    categories: any[];
    collapsedSections: any;
    parentEnumeration: string;
    onSectionToggle: { (sectionName: string, isVisible: boolean): any };
}

const NiagadsRecordMainSection: React.SFC<RecordMainSection> = ({
    depth = 0,
    record,
    recordClass,
    categories,
    collapsedSections,
    parentEnumeration,
    onSectionToggle,
}) =>
    categories == null ? null : (
        <div>
            {categories.map((category, index) => {
                let categoryName = getLabel(category);
                let categoryId = getId(category);
                let enumeration = String(parentEnumeration == null ? index + 1 : parentEnumeration + '.' + (index + 1));

                return (
                    <RecordMainCategorySection
                        key={categoryName}
                        category={category}
                        depth={depth}
                        enumeration={enumeration}
                        isCollapsed={collapsedSections.includes(categoryId)}
                        onSectionToggle={onSectionToggle}
                        record={record}
                        recordClass={recordClass}
                    >
                        <NiagadsRecordMainSection
                            depth={depth + 1}
                            record={record}
                            recordClass={recordClass}
                            categories={category.children}
                            collapsedSections={collapsedSections}
                            parentEnumeration={enumeration}
                            onSectionToggle={onSectionToggle}
                        />
                    </RecordMainCategorySection>
                );
            })}
        </div>
    );

export default NiagadsRecordMainSection;
