import { RecordTableProperties as TableProperties } from "@components/Record/RecordTable";

import { _geneTableProperties as _geneRecordTableProperties } from "./_geneRecordProperties";
import { _variantTableProperties as _variantRecordTableProperties } from "./_variantRecordProperties";
import { _trackTableProperties as _trackRecordTableProperties } from "./_trackRecordProperties";
import { _datasetTableProperties as _datasetRecordTableProperties } from "./_datasetRecordProperties";

export const _tableProperties: { [table: string]: { [name: string]: TableProperties } } = {
    Gene: _geneRecordTableProperties,
    Variant: _variantRecordTableProperties,
    Track: _trackRecordTableProperties,
    Dataset: _datasetRecordTableProperties
};
