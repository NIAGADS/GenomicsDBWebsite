import React, { useState } from "react";
import { connect } from "react-redux";
import { RecordMainSection } from "wdk-client/Components";
import { getTableNames } from "wdk-client/Views/Records/RecordUtils";
import { setCollapsedSections } from "wdk-client/Actions/RecordActions";
import RecordMainCategorySection from "./MainCategorySection";
import { CategoryTreeNode, getId, getLabel } from "wdk-client/Utils/CategoryUtils";
import { RecordClass, RecordInstance } from "wdk-client/Utils/WdkModel";
import { flatMap, get, intersection, isEmpty } from "lodash";

interface RecordMainSection {
    categories: CategoryTreeNode[];
    depth: number;
    onSectionToggle: { (sectionName: string, isVisible: boolean): any };
    parentEnumeration: string;
    record: RecordInstance;
    recordClass: RecordClass;
    requestPartialRecord?: any;
    //connected
    collapsedSections: string[];
    setCollapsedSections: (sections: string[]) => any;
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
    setCollapsedSections,
}) => {
    //set all sections collapsed by default
    //using useState instead of useEffect b/c we need it to set collapsed *before* first render

    const [loaded, setLoaded] = useState(false),
        defaultOpen = (recordClass.tables || [])
            .filter((t) => 
                get(JSON.parse(get(t, "properties.flags[0]", '{}')), 'defaultOpen', false))
            .map((t) => t.name),
        defaultClosed = flatMap(categories, getTableNames).filter((n) => !defaultOpen.includes(n));
    if (!loaded) {
        if (isEmpty(intersection(defaultClosed, collapsedSections))) {
            setCollapsedSections([...defaultClosed, ...collapsedSections]);
        }
        setLoaded(true);
    }

    return categories == null ? null : (
        <div>
            {categories.map((category, index) => {
                const categoryName = getLabel(category),
                    categoryId = getId(category),
                    enumeration = String(parentEnumeration == null ? index + 1 : parentEnumeration + "." + (index + 1));

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

const mapStateToProps = (state: any) => ({
    collapsedSections: state.record.collapsedSections,
});

const NiagadsRecordMainSection = connect(mapStateToProps, {
    setCollapsedSections,
})(_NiagadsRecordMainSection);

export default NiagadsRecordMainSection;
