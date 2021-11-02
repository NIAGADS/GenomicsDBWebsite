import React from "react";
import { Dialog } from "wdk-client/Components";
import { Link } from "wdk-client/Components";
import LinkagePlot from "../Linkage/Linkage";
export interface Feature {
    display_label: string;
    location_end: number;
    location_start: number;
    record_primary_key: string;
    record_type: string;
    span_length: number;
}
interface IdeogramDetailModal {
    open: boolean;
    onClose: () => void;
    features: Feature[];
    name: string;
}

const IdeogramDetailModal: React.FC<IdeogramDetailModal> = ({ onClose, open, name, features }) => {
    return (
        open && (
            <Dialog
                className="ideogram-detail-modal"
                open={true}
                title={`Variant Details for ${name}`}
                onClose={onClose}
            >
                <div>
                    {features.length < 5 ? (
                        <ul>
                            {features.map((f) => (
                                <li key={f.record_primary_key}>
                                    <Link to={`/record/variant/${f.record_primary_key}`}>{f.display_label}</Link>
                                </li>
                            ))}
                        </ul>
                    ) : features.length < 21 ? (
                        <LinkagePlot variants={features.map((f) => f.record_primary_key)} />
                    ) : features.length < 45 ? (
                        <div>
                            The number of results is too large to display here. Please click this&nbsp;
                            <Link
                                to={`/visualizations/linkage?name=${name}&variants=${features
                                    .map((f) => f.record_primary_key)
                                    .join(",")}`}
                            >
                                link
                            </Link>
                            &nbsp; to view the chart on a new page.
                        </div>
                    ) : (
                        <div>Unfortunately, the number of results is too large to be displayed.</div>
                    )}
                </div>
            </Dialog>
        )
    );
};

export default IdeogramDetailModal;
