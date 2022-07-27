import React from "react";
import { filter } from 'lodash';
import { DatasetCard, DatasetRecord } from ".";
import { PanelProps } from "@components/MaterialUI";
import { _datasetReleases, _currentRelease } from "genomics-client/data/_datasetReleases";
import Carousel from 'react-material-ui-carousel';

export const DatasetReleases: React.FC<PanelProps> = ({ classes, webAppUrl, projectId }) => {
    const datasetSubset: DatasetRecord[] = _datasetReleases.filter(dataset => {return dataset.genomeBuild === projectId || dataset.genomeBuild === 'both'});
    return (
        <Carousel stopAutoPlayOnHover={true} interval={8000} animation="slide">
            {datasetSubset.slice(0,3).map((dataset) => (
                <DatasetCard key={dataset.accession} dataset={dataset} webAppUrl={webAppUrl} classes={classes} />
            ))}
        </Carousel>
    );
};
