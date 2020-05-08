/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { compose, withState } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SelectCard, getLabelForNotFoundElement } from '../../../packages/components/src';
import {
	ATTRIBUTE_VALUE_SCHEMA_CONFIGURATION_DEFAULT,
	ATTRIBUTE_VALUE_SCHEMA_CONFIGURATION_NONE,
	ATTRIBUTE_VALUE_SCHEMA_CONFIGURATION_INHERIT,
} from './schema-configuration-meta-values'

const SchemaConfigurationSelectCard = ( props ) => {
	const { queryPostParent, schemaConfigurations, attributes: { schemaConfiguration } } = props;
	/**
	 * React Select expects an object with this format:
	 * { value: ..., label: ... },
	 * Convert the schemaConfigurations array to this structure:
	 * [{label:"schemaConfiguration.title",value:"schemaConfiguration.id"},...]
	 */
	const schemaConfigurationOptions = schemaConfigurations.map( schemaConfiguration => (
		{
			// label: `→ ${ schemaConfiguration.title }`,
			label: schemaConfiguration.title,
			value: schemaConfiguration.id,
		}
	) );
	/**
	 * If this query has a parent, then add option "Inherit from parent"
	 */
	const metaOptions = ( schemaConfiguration == ATTRIBUTE_VALUE_SCHEMA_CONFIGURATION_INHERIT || queryPostParent ?
		[
			{
				label: `🛑 ${ __('Inherit from parent', 'graphql-api') }`,
				value: ATTRIBUTE_VALUE_SCHEMA_CONFIGURATION_INHERIT,
			}
		]
		: []
	).concat([
		{
			label: `⭕️ ${ __('Default', 'graphql-api') }`,
			value: ATTRIBUTE_VALUE_SCHEMA_CONFIGURATION_DEFAULT,
		},
		{
			label: `❌ ${ __('None', 'graphql-api') }`,
			value: ATTRIBUTE_VALUE_SCHEMA_CONFIGURATION_NONE,
		},
	])

	const options = metaOptions.concat(
		schemaConfigurationOptions
	);
	const groupedOptions = [
		{
		  label: '',
		  options: metaOptions,
		},
		{
		  label: '',
		  options: schemaConfigurationOptions,
		},
	  ];
	/**
	 * React Select expects to pass the same elements from the options as defaultValue,
	 * including the label: { value: ..., label: ... }
	 * Retrieve this object from the options
	 */
	let defaultValue = null;
	if (schemaConfiguration != null) {
		const selectedOptions = options.filter( option => option.value == schemaConfiguration );
		if (selectedOptions.length) {
			/**
			 * React Select expects to pass the same elements from the options as defaultValue,
			 * including the label: { value: ..., label: ... }
			 */
			defaultValue = selectedOptions[0];
		} else {
			/**
			 * If the defaultValue is not part of the options, it's a stranded ID
			 * (eg: from a deleted custom post)
			 */
			defaultValue = {
				label: getLabelForNotFoundElement(schemaConfiguration),
				value: schemaConfiguration,
			}
		}
	}
		
	/**
	 * Check if the schema configurations have not been fetched yet,
	 * or if there are selected items (for which we need the data to know the label),
	 * then show the spinner
	 */
	const maybeShowSpinnerOrError = !schemaConfigurations?.length || schemaConfiguration != null;
	return (
		<SelectCard
			{ ...props }
			isMulti={ false }
			attributeName="schemaConfiguration"
			options={ groupedOptions/*options*/ }
			defaultValue={ defaultValue }
			getLabelForNotFoundValueCallback={ getLabelForNotFoundElement }
			maybeShowSpinnerOrError={ maybeShowSpinnerOrError }
		/>
	);
}

// const WithSpinnerSchemaConfiguration = compose( [
// 	withSpinner(),
// 	withErrorMessage(),
// ] )( SchemaConfigurationSelectCard );

// /**
//  * Check if the schema configurations have not been fetched yet,
//  * or if there are selected items (for which we need the data to know the label),
//  * then show the spinner
//  *
//  * @param {Object} props
//  */
// const MaybeWithSpinnerSchemaConfiguration = ( props ) => {
// 	const { schemaConfigurations, attributes: { schemaConfiguration } } = props;
// 	if ( !schemaConfigurations?.length || schemaConfiguration != null ) {
// 		return (
// 			<WithSpinnerSchemaConfiguration { ...props } />
// 		)
// 	}
// 	return (
// 		<SchemaConfigurationSelectCard { ...props } />
// 	);
// }

export default compose( [
	withState( {
		label: __('Schema configuration', 'graphql-api'),
		tooltipLink: 'https://graphql-api.com/documentation/#schema-configuration',
		tooltip: __('Select a schema configuration, or "Default" (use the one defined in Settings), "None" or "Inherit from parent" (available when defining parent query in "Document -> Page Attributes")', 'graphql-api')
	} ),
	withSelect( ( select ) => {
		const {
			getSchemaConfigurations,
			hasRetrievedSchemaConfigurations,
			getRetrievingSchemaConfigurationsErrorMessage,
		} = select ( 'graphql-api/schema-configuration' );
		return {
			schemaConfigurations: getSchemaConfigurations(),
			hasRetrievedItems: hasRetrievedSchemaConfigurations(),
			errorMessage: getRetrievingSchemaConfigurationsErrorMessage(),
		};
	} ),
	withSelect( ( select ) => {
		const { getEditedPostAttribute } = select(
			'core/editor'
		);
		return {
			queryPostParent: getEditedPostAttribute( 'parent' ),
		};
	} ),
] )( SchemaConfigurationSelectCard/*MaybeWithSpinnerSchemaConfiguration*/ );
