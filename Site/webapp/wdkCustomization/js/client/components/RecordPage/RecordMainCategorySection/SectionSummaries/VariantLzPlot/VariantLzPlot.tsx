import React, { useState } from "react";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import LZPlot from "../../../../Visualizations/LocusZoom/LZPlot";

interface VariantLzPlotProps {
    chromosome: string;
    datasetChoices: { [key: string]: string }[];
    populationChoices: { [key: string]: string }[];
    selectClass: string;
    variant: string;
}

const VariantLzPlot: React.FC<VariantLzPlotProps> = ({
    chromosome,
    datasetChoices,
    populationChoices,
    selectClass,
    variant,
}) => {
    const [dataset, setDataset] = useState<string>(Object.keys(datasetChoices[0])[0]),
        [population, setPopulation] = useState<string>(Object.keys(populationChoices[0])[0]);

    return (
        <div className="variant-plot">
            <form>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label>Select a Dataset</label>
                            <select className="form-control" onChange={(e) => setDataset(e.currentTarget.value)}>
                                {datasetChoices.map((item) => {
                                    return safeHtml(
                                        Object.values(item)[0],
                                        { key: Object.keys(item)[0], value: Object.keys(item)[0] },
                                        "option"
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label>Select a Population</label>
                            <select className="form-control" onChange={(e) => setPopulation(e.currentTarget.value)}>
                                {populationChoices.map((item) => {
                                    return (
                                        <option key={Object.keys(item)[0]} value={Object.keys(item)[0]}>
                                            {Object.values(item)[0]}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            </form>
            <LZPlot
                selectClass={selectClass}
                chromosome={chromosome}
                refVariant={variant}
                track={dataset}
                population={population}
            />
        </div>
    );
};

export default VariantLzPlot;
