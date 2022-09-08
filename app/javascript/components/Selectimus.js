/* globals document */

const _ = require('lodash');
const bindReactClass = require('lib/bind-react-class');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const Select = require('react-select').default;
const {components} = require('react-select');

const {any, array, bool, func, string} = PropTypes;

const displayName = 'Selectimus';
const propTypes = {
	autoFocus: bool,
	blurInputOnSelect: bool,
	className: string,
	clearable: bool,
	closeMenuOnSelect: bool,
	compactLabel: string, //see useCompact
	disabled: bool,
	forceClose: bool,
	inputId: string,
	inputName: string,
	isSearchable: bool,
	onOptionDisabled: func, //which options are disabled
	labelKey: string,
	menuIsOpen: bool,
	menuSuffix: any,
	multiple: bool,
	onChange: func.isRequired,
	onBlur: func,
	onFocus: func,
	onInputChange: func,
	onKeyDown: func,
	onMenuOpen: func,
	optionRenderer: func,
	options: array,
	placeholder: string,
	portalId: string,
	required: bool,
	searchKeys: PropTypes.arrayOf(string),
	searchOnly: bool, //with multi-select, shows no results in the input, only search text
	useCompact: bool, //show only compactLabel in the input when values are selected
	value: any,
	valueKey: string.isRequired,
	valueRenderer: func,
};
const defaultProps = {
	autoFocus: false,
	blurInputOnSelect: false,
	className: 'Selectimus__root',
	clearable: true,
	closeMenuOnSelect: true,
	compactLabel: 'Selected',
	disabled: false,
	forceClose: false,
	inputId: undefined,
	inputName: undefined,
	isSearchable: true,
	onOptionDisabled: () => {},
	labelKey: undefined,
	menuIsOpen: undefined,
	menuSuffix: undefined,
	multiple: false,
	onBlur: _.noop,
	onFocus: _.noop,
	onInputChange: undefined,
	onKeyDown: _.noop,
	onMenuOpen: _.noop,
	optionRenderer: undefined,
	options: undefined,
	placeholder: undefined,
	portalId: undefined,
	required: false,
	searchKeys: undefined,
	searchOnly: false,
	useCompact: false,
	value: undefined,
	valueRenderer: undefined,
};

// react-select uses css-in-js, refer to https://react-select.com/styles
const standardStyles = {
	//outermost element, contains the input
	container: (provided, state) => ({
		...provided,
	}),
	input: (provided, state) => ({
		...provided,
	}),
	menuPortal: (provided) => ({
		...provided,
		zIndex: 2,
	}),
};

const OPTION_LOAD_LIMIT = 40;

class Selectimus extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			inputValue: '',
			isFocused: false,
			scrollerEnd: OPTION_LOAD_LIMIT,
		};

	}

	componentDidUpdate(props) {
		if (this.props.forceClose && this.props.forceClose !== props.forceClose) {
			this.ref.blur();
		}
	}

	ClearIndicator(props) {
		const {children = <span className='Selectimus__clear-all-button icon btn-icon icon-delete-x-selected2x' />, innerProps: {ref, ...restInnerProps}} = props;
		return (
			<div {...restInnerProps} ref={ref}>
				{children}
			</div>
		);
	}

	SearchDropdownIndicator(props) {
		return (
			<components.DropdownIndicator {...props}>
				<span className='icon icon-search2x' />
			</components.DropdownIndicator>
		);
	}


	MultiValueCompactInput(props) {
		const {
			compactLabel,
			value,
		} = this.props;

		const newProps = Object.assign({}, props, {value: `${compactLabel} (${value.length})`});
		return (
			<components.Input {...newProps} />
		);
	}

	MultiValueLabel(props) {
		const {data} = props;
		const {valueRenderer} = this.props;
		return (
			<components.MultiValueLabel {...props}>
				{valueRenderer(data, this.props.valueKey)}
			</components.MultiValueLabel>
		);
	}

	Option(props) {
		const {data} = props;
		const {optionRenderer} = this.props;
		return (
			<components.Option {...props}>
				{optionRenderer(data, this.props.labelKey)}
			</components.Option>
		);
	}

	CompactOption(props) {
		const {data} = props;
		const optionRenderer = this.props.optionRenderer
			? this.props.optionRenderer
			: this.onGetOptionLabel;
		return (
			<components.Option {...props}>
				<span className={`icon left-icon ${props.isSelected ? 'text-branded icon-checkbox-selected2x' : 'icon-a-checkbox2x'}`} />
				{` `}
				{optionRenderer(data, this.props.labelKey)}
			</components.Option>
		);
	}

	SingleValue(props) {
		const {data} = props;
		const {valueRenderer} = this.props;
		return (
			<components.SingleValue {...props}>
				{valueRenderer(data, this.props.valueKey)}
			</components.SingleValue>
		);
	}

	SingleValueUnformatted({children, ...props}) {
		return (
			<components.SingleValue {...props}>
				{children}
			</components.SingleValue>
		);
	}

	InfiniteMenuList({children, ...props}) {
		const limitedChildren = (children && children.length > OPTION_LOAD_LIMIT)
			? _.slice(children, 0, this.state.scrollerEnd)
			: children;
		return (
			<>
				<div className='infinite-container' ref={this.handleSetRef}>
					<components.MenuList {...props}>
						{limitedChildren}
					</components.MenuList>
				</div>
				{this.props.menuSuffix}
			</>
		);
	}

	MenuSuffix({children, ...props}) {
		return (
			<components.Menu {...props}>
				<>
					{children}
					{this.props.menuSuffix}
				</>
			</components.Menu>
		);
	}

	handleSetRef(element) {
		this.menuListRef = element;
	}

	handleBlur(event) {
		this.props.onBlur(event);
		this.setState({inputValue: '', isFocused: false, scrollerEnd: OPTION_LOAD_LIMIT});
		if (this.ref) {
			/* eslint-disable scanjs-rules/call_setTimeout */
			setTimeout(() => this.ref.blur(), 0);
			/* eslint-enable scanjs-rules/call_setTimeout */
		}
	}

	handleFocus() {
		this.props.onFocus();
		this.setState({isFocused: true});
		if (this.ref) {
			/* eslint-disable scanjs-rules/call_setTimeout */
			setTimeout(() => this.ref.focus(), 0);
			/* eslint-enable scanjs-rules/call_setTimeout */
		}
	}

	handleOnChange(props, changeDetails) {
		/* eslint-disable scanjs-rules/call_setTimeout */
		if (this.props.multiple) {
			setTimeout(() => this.ref.focus(), 0);
		}
		/* eslint-enable scanjs-rules/call_setTimeout */

		this.props.onChange(props, changeDetails);
	}

	handleKeyDown(e) {
		this.props.onKeyDown(e);
	}

	filterOption({label, value, data}, inputText) {
		if (inputText) {
			const searchKeys = this.props.searchKeys ? this.props.searchKeys : [this.props.labelKey];
			return _.some(searchKeys, (searchKey) => {
				const value = _.toLower(_.get(data, searchKey));
				return _.includes(value, _.toLower(inputText));
			});
		} else {
			return data;
		}
	}

	onGetOptionLabel(option) {
		return option[this.props.labelKey];
	}

	onGetOptionValue(option) {
		return option[this.props.valueKey];
	}

	onGetNoOptionsMessage() {
		return 'No results found';
	}

	handleInputChange(inputValue, e) {
		if (!this.props.useCompact || (this.props.useCompact && e.action === 'input-change')) {
			this.setState({inputValue});
		}
	}

	handleMenuOpen() {
		this.props.onMenuOpen();
	}

	handleRef(input) {
		this.ref = input;
	}

	handleInfiniteScroll(scrollerEnd) {
		this.setState({scrollerEnd});
	}

	render() {
		const {
			autoFocus,
			blurInputOnSelect,
			className,
			clearable,
			closeMenuOnSelect,
			disabled,
			inputId,
			inputName,
			isSearchable,
			onOptionDisabled,
			menuIsOpen,
			menuSuffix,
			multiple,
			options,
			optionRenderer,
			placeholder,
			portalId,
			required,
			searchOnly,
			useCompact,
			value,
			valueRenderer,
		} = this.props;

		const {inputValue, isFocused} = this.state;

		const portalElement = portalId
			? document.getElementById(portalId)
			: undefined;

		const isInvalid = (
			required &&
			!value &&
			value !== 0 // a raw number of `0` should be considered valid
		);
		const computedClassName = classNames(
			displayName,
			{'Selectimus--is-invalid': isInvalid}
		);

		const components = {
			ClearIndicator: clearable ? this.ClearIndicator : null,
			IndicatorSeparator: null,
		};

		if (optionRenderer) {
			components.Option = this.Option;
		}

		if (multiple && useCompact) {
			if (value && value.length && !isFocused) {
				components.Input = this.MultiValueCompactInput;
				components.Placeholder = () => null;
			}
			components.MultiValueContainer = () => null;
			components.Option = this.CompactOption;
		}

		if (valueRenderer && multiple && !useCompact) {
			components.MultiValueLabel = this.MultiValueLabel;
		}

		if (valueRenderer && !multiple) {
			components.SingleValue = this.SingleValue;
		}

		if (!valueRenderer && multiple && searchOnly) {
			components.MultiValueContainer = () => null;
		}

		if (!valueRenderer && !multiple) {
			components.SingleValue = this.SingleValueUnformatted;
		}

		if (searchOnly) {
			components.DropdownIndicator = this.SearchDropdownIndicator;
		}

		if (options && options.length > OPTION_LOAD_LIMIT) {
			components.MenuList = this.InfiniteMenuList;
		}

		if (menuSuffix) {
			components.Menu = this.MenuSuffix;
		}

		return (
			<div className={computedClassName}>
				<Select
					aria-label="select"
					autoFocus={autoFocus}
					backspaceRemovesValue={!(useCompact && multiple)}
					blurInputOnSelect={blurInputOnSelect}
					className={className}
					classNamePrefix='Selectimus'
					closeMenuOnSelect={multiple ? false : closeMenuOnSelect}
					components={components}
					controlShouldRenderValue={!(useCompact && multiple && isFocused)}
					filterOption={this.filterOption}
					getOptionLabel={this.onGetOptionLabel}
					getOptionValue={this.onGetOptionValue}
					hideSelectedOptions={(multiple && !useCompact)}
					id={inputId}
					ignoreAccents={false} //performance saver!
					inputValue={inputValue}
					isDisabled={disabled}
					isMulti={multiple}
					isOptionDisabled={onOptionDisabled}
					isSearchable={isSearchable}
					menuIsOpen={menuIsOpen} //will not allow any closing if true and will not allow opening if false
					menuPortalTarget={portalElement}
					name={inputName}
					noOptionsMessage={this.onGetNoOptionsMessage}
					onBlur={this.handleBlur}
					onChange={this.handleOnChange}
					onFocus={this.handleFocus}
					onKeyDown={this.handleKeyDown}
					onMenuOpen={this.handleMenuOpen}
					onInputChange={this.handleInputChange}
					options={options}
					placeholder={placeholder || 'Type to Search'}
					ref={this.handleRef}
					required={required}
					styles={standardStyles}
					value={value} />
			</div>
		);
	}
}

Selectimus.displayName = displayName;
Selectimus.propTypes = propTypes;
Selectimus.defaultProps = defaultProps;

module.exports = bindReactClass(Selectimus);
