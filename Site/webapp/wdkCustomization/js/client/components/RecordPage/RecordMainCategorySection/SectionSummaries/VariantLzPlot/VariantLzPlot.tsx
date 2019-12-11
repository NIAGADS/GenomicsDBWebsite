import React from 'react';
import LzPlot, { LzVariantProps } from './../../Visualizations/LocusZoom/LZPlot';
import LzLegend from './../../Visualizations/LocusZoom/LZLegend/LZLegend';
import { safeHtml } from 'wdk-client/Utils/ComponentUtils';


interface VariantLzPlotProps {
  selectClass: string,
  chromosome: string,
  variant: string,
  location: number,
  datasetChoices: { [key: string]: string }[],
  populationChoices: { [key: string]: string }[],
}

interface VariantLzPlotState {
  dataset: string,
  population: string
}

const INITIAL_STATE: VariantLzPlotState = {
  dataset: '',
  population: ''
}

class VariantLzPlot extends React.Component<VariantLzPlotProps, VariantLzPlotState>{
  constructor(props: VariantLzPlotProps) {
    super(props);
    this.state = INITIAL_STATE;
  }

  render = () => {
    const { datasetChoices, populationChoices, children, ...rest } = this.props,
      plotProps: LzVariantProps = {
        dataset: this.state.dataset ? this.state.dataset : Object.keys(datasetChoices[0])[0],
        population: this.state.population ? this.state.population : Object.keys(this.props.populationChoices[0])[0],
        ...rest
      }
    return <div className='variant-plot'>
      <form>
        <div className='row'>
          <div className='col'>
            <div className="form-group">
              <label>Select a Dataset</label>
              <select className="form-control" onChange={(e) => this.setState({ dataset: e.currentTarget.value })}>
                {datasetChoices.map(item => {
                  return safeHtml(Object.values(item)[0], { key: Object.keys(item)[0], value: Object.keys(item)[0] }, 'option');
                })}
              </select>
            </div>
          </div>
          <div className='col'>
            <div className="form-group">
              <label>Select a Population</label>
              <select className="form-control" onChange={(e) => this.setState({ population: e.currentTarget.value })}>
                {populationChoices.map(item => {
                  return <option key={Object.keys(item)[0]} value={Object.keys(item)[0]}>{Object.values(item)[0]}</option>
                })}
              </select>
            </div>
          </div>
        </div>
        {/*jsx doesn't like union types for props, so we'll use a constructor instead*/}
      </form >
      <LzLegend />
      {React.createElement(LzPlot, plotProps)}
    </div >
  }
}

export default VariantLzPlot;