import { RecordTableProperties as TableProperties } from "@components/Record/RecordTable";

export const _ontologyTableProperties: { [name: string]: TableProperties } = {
    terms: {
        filters: {
            annotation_type: "typeahead_select",
            annotation_subtype: "typeahead_select",
            biosample_type: "checkbox_select",
        },
        filterGroups: [
            {
                label: "Term Type",
                columns: ["annotation_type", "annotation_subtype", "biosample_type"],
                defaultOpen: true,
            },
        ],
        requiredColumns: ["term", "source_id", "annotation_type"],
        hiddenColumns: ["term_link"],
        sortedBy: [{ id: "term", descending: false }],
        defaultOpen: true,
        canFilter: true,
        canToggleColumns: true,
        accessors: {
            term_link: "Link",
        },
    },
};
