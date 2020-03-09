import React from 'react';
import { Link } from 'wdk-client/Components';
import { safeHtml } from 'wdk-client/Utils/ComponentUtils';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

interface FeatureItem {
    feature: {
        title: string,
        description: string,
        id: string
    },
    className?: string
}

const FeatureItem: React.SFC<FeatureItem> = props => {
    const { feature, className } = props;
    return (
        <Card style={{ width: "18rem" }}>
            <Card.Body>
                <Card.Title>{feature.title}</Card.Title>
                <Card.Text >
                    {safeHtml(feature.description)}
                </Card.Text>
                <Button className="feature-link-button" variant="secondary" href={`record/dataset/${feature.id}`}>
                    Explore this dataset <i className="ml-1 fa fa-caret-right" />
                </Button>
            </Card.Body>
        </Card>
    );

}

export default FeatureItem;