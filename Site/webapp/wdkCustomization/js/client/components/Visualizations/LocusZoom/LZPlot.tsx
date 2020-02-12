import React from 'react';
import locuszoom from './../../../../lib/locusZoom/locuszoom.app';
import './../../../../lib/locusZoom/locuszoom.css';
import { connect } from 'react-redux';

const lz = locuszoom as any; //typescript shim -- lz is already a global (see webpack) (needs to be global so tooltips work)

interface LzBaseProps {
	chromosome: string,
	population: string,
	dataset: string,
	selectClass: string,
	//from store
	endpoint?: string
}

export interface LzVariantProps extends LzBaseProps {
	variant?: string,
	location?: number,
}

export interface LzGeneProps extends LzBaseProps {
	start?: number,
	end?: number,
}

type LzPlotProps = LzGeneProps | LzVariantProps;

interface LzPlotState {
	loading: boolean;
}

const INITIAL_STATE: LzPlotState = {
	loading: false
}

const isVariantPlot = (item: LzVariantProps | LzGeneProps): item is LzVariantProps => {
	return (item as LzVariantProps).variant !== undefined;
}

class LzPlot extends React.Component<LzPlotProps, LzPlotState> {
	private int: any;
	constructor(props: LzPlotProps) {
		super(props);
		this.state = INITIAL_STATE;
	}

	componentDidMount = () => this._initPlot();

	componentDidUpdate = (oldProps: LzPlotProps) => {
		if (oldProps.dataset !== this.props.dataset || oldProps.population !== this.props.population) {
			this._initPlot();
		}
	}

	componentWillUnmount = (): void => clearInterval(this.int);

	_initPlot = () => {
		const { chromosome, dataset, population, endpoint, selectClass } = this.props,
			state = _buildState(this.props),
			plot = _buildPlot(selectClass, state, population, dataset, endpoint);
		this.setState({ loading: plot.loading_data });
		this._startPoll(plot)
	}

	//we have to poll b/c plot is outside of react and we can't show loading indicator otherwise
	_startPoll = (val: { loading_data: boolean }) => {
		const initVal = val.loading_data;
		this.int = setInterval(() => _checkVal(val), 50);
		const _checkVal = (val: { loading_data: boolean }) => {
			if (val.loading_data != initVal) {
				this.setState({ loading: val.loading_data })
				clearInterval(this.int);
				this._startPoll(val);
			}
		}
	}

	render = () => <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
		< LoadingIndicator loading={this.state.loading} />
		<div id={`${this.props.selectClass}`} />
	</div>
}

export default connect((state: any) => ({ endpoint: state.globalData.siteConfig.endpoint }))(LzPlot);


const _buildState = (props: LzPlotProps) => {
	return isVariantPlot(props) ?
		{ chr: props.chromosome, ldrefvar: props.variant, start: props.location - 100000, end: props.location + 100000 } :
		{ chr: props.chromosome, start: props.start, end: props.end };
}

interface LoadingIndicator {
	loading: boolean
}

const LoadingIndicator: React.SFC<LoadingIndicator> = props => {
	const { loading } = props;
	return loading ? <div className='alert alert-warning' style={{ position: 'absolute' }}>Loading!</div> : null;
}

const buildConstructorFunc = (url: string, idField: string) => {
	return function () {
		//@ts-ignore
		this.url = url;
		//@ts-ignore
		this.params = {
			id_field: idField,
		}
	}
}

const _buildPlot = (selector: string, state: any, population: string, dataset: string, endpoint: string) => {

	const dataSources = new lz.DataSources(),
		assocSource = lz.Data.Source.extend(buildConstructorFunc('/api/assoc', 'id'), 'assoc', "AssociationLZ"),
		ldSource = lz.Data.Source.extend(buildConstructorFunc('/api/ld', 'assoc:id'), 'ld', 'LDLZ');


	assocSource.prototype.getURL = function (state: any, chain: any, fields: any) {
		return `${endpoint}/locuszoom/gwas?dataset=${dataset}&chromosome=${state.chr}&locStart=${state.start}&locEnd=${state.end}`;
	}

	//probably better to use extractFields?
	ldSource.prototype.normalizeResponse = function (data: { value: number[], id2: string[] }) {
		return {
			id2: data.id2,
			position2: data.id2.map(datum => +/\:(\d+):/.exec(datum)[1]),
			rsquare: data.value
		}
	}

	ldSource.prototype.getURL = function (state: any, chain: any, fields: any) {
		const refVar = this.getRefvar(state, chain, fields);
		chain.header.ldrefvar = refVar;
		return `${endpoint}/locuszoom/linkage?population=${population}&variant=${refVar}`;
	}

	dataSources
		.add("assoc", new assocSource())
		.add("ld", new ldSource())

	return lz.populate(`#${selector}`, dataSources, _buildLayout(state));

}

const _buildLayout = (state: any) => {

	return lz.Layouts.merge({ state }, {
		id: 'association',
		width: 800,
		height: 225,
		min_width: 400,
		min_height: 200,
		proportional_width: 1,
		inner_border: 'rgb(210, 210, 210)',
		panels: [
			{
				axes: {
					x: {
						label: '{{assoc:chr}} (Mb)',
						label_offset: 32,
						tick_format: 'region',
						extent: 'ld:state'
					},
					y1: {
						label: 'neg log10(p-value)',
						label_offset: 32,
					}
				},
				margin: { top: 35, right: 50, bottom: 50, left: 50 },
				id: "association",
				interaction: {
					drag_background_to_pan: true,
					scroll_to_zoom: true,
					x_linked: true
				},
				data_layers: [
					{
						id: "association_pvalues",
						id_field: 'assoc:id',
						type: 'scatter',
						point_shape: {
							scale_function: 'if',
							field: 'ld:isrefvar',
							parameters: {
								field_value: 1,
								then: 'diamond',
								else: 'circle'
							}
						},
						point_size: {
							scale_function: 'if',
							field: 'ld:isrefvar',
							parameters: {
								field_value: 1,
								then: 80,
								else: 40
							}
						},
						color: [
							{
								scale_function: 'if',
								field: 'ld:isrefvar',
								parameters: {
									field_value: 1,
									then: '#9632b8'
								}
							},
							{
								scale_function: 'numerical_bin',
								field: 'ld:state',
								parameters: {
									breaks: [
										0,
										0.2,
										0.4,
										0.6,
										0.8
									],
									values: [
										'#357ebd',
										'#46b8da',
										'#5cb85c',
										'#eea236',
										'#d43f3a'
									]
								}
							},
							'#B8B8B8'
						],

						fields: [
							'assoc:id',
							'assoc:position',
							'assoc:pvalue',
							'assoc:testAllele',
							'assoc:neg_log10_pvalue',
							'ld:state',
							'ld:isrefvar',
						],
						z_index: 2,
						x_axis: { field: 'assoc:position' },
						y_axis: {
							axis: 1,
							field: 'assoc:neg_log10_pvalue',
							floor: 0,
							upper_buffer: .1,
							min_extent: [
								0,
								1
							]
						},
						behaviors: {
							onmouseover: [
								{ action: 'set', status: 'highlighted' }
							],
							onmouseout: [
								{ action: 'unset', status: 'highlighted' }
							],
							onclick: [
								{ action: 'toggle', status: 'selected', exclusive: true }
							],
							onshiftclick: [
								{ action: 'toggle', status: 'selected' }
							]
						},

						tooltip: {
							namespace: { 'assoc': 'assoc' },
							closable: true,
							show: { or: ['highlighted', 'selected'] },
							hide: { and: ['unhighlighted', 'unselected'] },
							html: '<strong>{{assoc:id}}</strong><br>'
								+ 'P Value: <strong>{{assoc:pvalue}}</strong><br>'
								+ 'Test Allele: <strong>{{assoc:testAllele}}</strong><br>'
								+ '<a href="javascript:void(0);" onclick="lz.getToolTipDataLayer(this).makeLDReference(lz.getToolTipData(this));">Make LD Reference</a><br>'
						}
					}
				]
			},

		]

	});
}