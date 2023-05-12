import { RecordSectionDocumentation } from "@components/Record/Types";
import { _geneDocumentation } from "./_geneRecordProperties";
import { _variantDocumentation } from "./_variantRecordProperties";
import { _trackDocumentation } from "./_trackRecordProperties";


const _recordDocumentation: { [recordClass: string]: { [category: string]: RecordSectionDocumentation[] } } = {
    Gene: _geneDocumentation,
    Variant: _variantDocumentation,
    Track: _trackDocumentation,

};

export default _recordDocumentation;