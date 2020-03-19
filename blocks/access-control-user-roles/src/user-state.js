import { __ } from '@wordpress/i18n';
import { Card, CardBody, RadioControl } from '@wordpress/components';
import { IN as USER_STATE_IN, OUT as USER_STATE_OUT } from './user-roless';

const UserRoles = ( props ) => {
	const { className, setAttributes, attributes: { value } } = props;
	/**
	 * If accessing the block for first time, value will be undefined. Then set it as default to "in"
	 * Can't use the `registerBlockType` configuration to set a default for `value`, because whenever the default value is selected,
	 * Gutenberg doesn't save it to the DB, however we need the value explicitly when extracting the rules from the CPT, that function doesn't know default cases
	 */
	if ( value == undefined ) {
		setAttributes( {
			value: USER_STATE_IN,
		} )
	}
	const options = [
		{
			label: __('Logged-in users', 'graphql-api'),
			value: USER_STATE_IN,
		},
		{
			label: __('Not logged-in users', 'graphql-api'),
			value: USER_STATE_OUT,
		},
	];
	return (
		<div className={ className+'__user_state' }>
			<Card { ...props }>
				<CardBody>
					<RadioControl
						{ ...props }
						// label={ __('User is...', 'graphql-api') }
						options={ options }
						selected={ value }
						onChange={ value => (
							setAttributes( {
								value
							} )
						)}
					/>
				</CardBody>
			</Card>
		</div>
	);
}

export default UserRoles;
