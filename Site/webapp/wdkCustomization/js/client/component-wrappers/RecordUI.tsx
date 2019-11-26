import React from 'react';
import { connect } from 'react-redux';
import { isVariantRecord, BaseRecord } from '../components/RecordPage/types';
import { isTrue } from '../util/util';

//here we're wrapping the RecordUI component -- in case this is an unannotated variant record, we want to show only
//our header message and nothing
//we're wrapping here b/c header and main components are called by wrapper ui and so:
//	1. there will be bugs if we suppress the main section entirely
//  2. the categories tree will render anyway

const RecordUI = (DefaultComponent: React.ComponentType) => {
	return (props: any) => {
		const ResolvedComponent =
			isVariantRecord(props.record) && !isTrue(props.record.attributes.is_annotated)
				? UnannotatedVariantHeading
				: DefaultComponent;
		return <ResolvedComponent {...props} />;
	};
};

export { RecordUI };

interface UnannotatedVariantHeading {
	record: BaseRecord;
	recordClass: { name: string };
	DBSNP_URL: string;
}
const _UnannotatedVariantHeading: React.SFC<UnannotatedVariantHeading> = props => {
	const { record } = props,
		classNames = `wdk-RecordContainer wdk-RecordContainer__$
			{props.recordClass.name}`;
	return (
		<div className={classNames}>
			<h3>
				<strong>{record.attributes.ref_snp_id}</strong>
			</h3>
			<pre>
				<code className="html">
					Variant {record.attributes.ref_snp_id} is not annotated by the ADSP or a AD-related GWAS summary
					statistics dataset. See <a href={`${props.DBSNP_URL}/${record.attributes.ref_snp_id}`}>dbSNP</a> for
					details on this variant.
				</code>
			</pre>
		</div>
	);
};

const mapStateToProps = (state: any) => ({
	DBSNP_URL: state.globalData.siteConfig.externalUrls.DBSNP_URL,
});

const UnannotatedVariantHeading = connect(mapStateToProps)(_UnannotatedVariantHeading);