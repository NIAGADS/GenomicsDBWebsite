import React from "react";
import { filter } from 'lodash';
import { DatasetCard, DatasetRecord } from ".";
import { PanelProps } from "../../../MaterialUI";
import { _datasetReleases, _currentRelease } from "../../../../data/_datasetReleases";
import Carousel from 'react-material-ui-carousel';

export const DatasetReleases: React.FC<PanelProps> = ({ classes, webAppUrl }) => {
    const datasetSubset: DatasetRecord[] = filter(_datasetReleases, {'date': _currentRelease}); // first 3 results
    return (
        <Carousel>
            {datasetSubset.map((dataset) => (
                <DatasetCard key={dataset.accession} dataset={dataset} webAppUrl={webAppUrl} classes={classes} />
            ))}
        </Carousel>
    );
};
