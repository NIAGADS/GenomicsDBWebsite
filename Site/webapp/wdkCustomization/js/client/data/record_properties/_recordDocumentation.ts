import { RecordSectionDocumentation } from "@components/Record/Types";
import { _geneDocumentation } from "./_geneRecordProperties";

const _recordDocumentation: { [recordClass: string]: { [category: string]: RecordSectionDocumentation[] } } = {
    Gene: _geneDocumentation,
};

export default _recordDocumentation;