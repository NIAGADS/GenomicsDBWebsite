import React from "react";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { Link } from "wdk-client/Components";

interface FeatureItem {
    feature: {
        title: string;
        description: string;
        id: string;
    };
    className?: string;
    webAppUrl: string;
}

const FeatureItem: React.SFC<FeatureItem> = ({ feature }) => (
    <div className="card m-3" style={{ width: "18rem" }}>
        <div className="p-3 d-flex flex-grow-1 flex-column justify-between align-items-center">
            <h5 className="card-title">{feature.title}</h5>
            <p className="card-text">{safeHtml(feature.description)}</p>
            <Link className="btn btn-secondary feature-link-button" to={`record/dataset/${feature.id}`}>
                Explore this accession <i className="ml-1 fa fa-caret-right" />
            </Link>
        </div>
    </div>
);

export default FeatureItem;
