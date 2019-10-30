import React from 'react';
import { DatasetHighlightConfig } from '../../../data/highlightItems';


interface DatasetHighlightSummary  {
  project: string,
  descriptions: DatasetHighlightConfig[];
  target: React.RefObject<any>;
}

let DatasetHighlightSummary: React.SFC<DatasetHighlightSummary> = props => {
  const scrollToRef = (ref: React.RefObject<any>) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: "smooth"
    })
  }

  const exploreText = props.descriptions.length > 1 ? "Explore these datasets" : "Explore this dataset";

  return <div className="dataset-highlight-summary">
    <h2 className="highlight-name">{props.project}</h2>
    {props.descriptions.map(description => <p key={description.id} className="summary-text">{description.id}: {description.summary}</p>)}
    <a className="badge" onClick={() => scrollToRef(props.target)}>{exploreText}</a>
  </div>
}

export default DatasetHighlightSummary;