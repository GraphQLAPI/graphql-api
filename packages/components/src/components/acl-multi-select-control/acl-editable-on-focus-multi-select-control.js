/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AccessControlListMultiSelectControl from './acl-multi-select-control';
import AccessControlListPrintout from './acl-printout';

const AccessControlListEditableOnFocusMultiSelectControl = ( props ) => {
	const { setAttributes, isSelected, attributes: { accessControlLists } } = props;
	const className = 'graphql-api-access-control-list-select';
	const componentClassName = `nested-component editable-on-focus is-selected-${ isSelected }`;
	return (
		<div className={ className }>
			<div className={ componentClassName }>
				{ isSelected &&
					<AccessControlListMultiSelectControl
						{ ...props }
						selectedItems={ accessControlLists }
						setAttributes={ setAttributes }
						className={ className }
					/>
				}
				{ !isSelected && (
					<AccessControlListPrintout
						{ ...props }
						selectedItems={ accessControlLists }
						className={ className }
					/>
				) }
			</div>
		</div>
	);
}

export default AccessControlListEditableOnFocusMultiSelectControl;