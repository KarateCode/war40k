/* globals document */

const _ = require('lodash');
const PropTypes = require('prop-types');

/* eslint-disable jsx-a11y/no-static-element-interactions */

const bindReactClass = require('lib/bind-react-class');
const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
// const {bindActionCreators} = require('redux');
// const {CSSTransitionGroup} = require('react-transition-group');
const {bool, func, string} = PropTypes;

const displayName = 'Modal';

const propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]),
	className: string,
	// dismissable: bool,
	hasCloseEx: bool,
	hasBody: bool,
	headerText: string,
	modalType: string,
	onDismiss: func,
	portalId: string,
	show: bool,
	// isModalStateTrackerDisabled: bool,
};
const defaultProps = {
	children: undefined,
	className: undefined,
	hasBody: true,
	hasCloseEx: false,
	modalType: 'DEFAULT',
	// dismissable: false,
	headerText: undefined,
	onDismiss: () => {},
	portalId: undefined,
	show: false,
	// isModalStateTrackerDisabled: false,
};

class Modal extends React.Component {
	constructor(props) {
		super(props);

		if (!_.includes(['DEFAULT', 'WARNING', 'COLORLESS'], props.modalType)) {
			throw new Error('Invalid modalType passed. Valid values are DEFAULT, WARNING, and COLORLESS');
		}

		this.handleClickOff = this.handleClickOff.bind(this)
	}

	//modalOpen css class handling
	// UNSAFE_componentWillReceiveProps(newProps) { //eslint-disable-line camelcase
	//     if (!this.props.isModalStateTrackerDisabled && newProps.show !== this.props.show) {
	//         modalStateTracker.isOpen = Boolean(newProps.show);
	//         if (newProps.show) {
	//             modalStateTracker.setOpen();
	//         } else if (!this.props.isModalStateTrackerDisabled) {
	//             modalStateTracker.setClose();
	//         }
	//     }
	// }

	componentDidMount() {
		/* eslint-disable scanjs-rules/call_addEventListener */
		document.addEventListener('keydown', this.escFunction, false);
		/* eslint-enable scanjs-rules/call_addEventListener */
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.escFunction, false);
	}

	escFunction(event) {
		if (event.keyCode === 27) {
			this.props.onDismiss();
		}
	}

	handleDismiss(e) {
		e.preventDefault();
		this.props.onDismiss();
	}

	handleClickOff(e) {
		if (e.target.className === 'modal') {
			this.props.onDismiss();
		}
	}

	handleKeyDown() {
		return;
	}

	handlePortal(element) {
		if (this.props.portalId) {
			return ReactDOM.createPortal(element, document.querySelector(`#${this.props.portalId}`));
		} else {
			return element;
		}
	}

	render() {
		const {
			className,
			hasBody,
			headerText,
			show,
			hasCloseEx,
			modalType,
		} = this.props;

		let closeEl;
		if (hasCloseEx) {
			closeEl = (
				<a
					className='modal-content__close-ex icon icon-delete-x2x'
					onClick={this.handleDismiss} />
			);
		}

		let headerEl;
		if (headerText || hasCloseEx) {
			headerEl = (
				<div className='modal-content__header'>
					<div className='modal-content__header-text'>{headerText}</div>
					{hasCloseEx ? closeEl : ''}
				</div>
			);
		}

		const topClasses = classNames(
			'awt-modal',
			'awt-modal-react',
			className,
			{
				'is-colorless': modalType === 'COLORLESS',
				'warning': modalType === 'WARNING',
			}
		);

		let modalEl;
		if (show) {
			modalEl = (
				<div className={topClasses} key={1}>
					<div className='modal-backdrop' />
					<div onMouseDown={this.handleClickOff}
						onKeyDown={this.handleKeyDown}
						tabIndex={0}
						role='Button'
						className='modal'>
						<div className='modal-dialog'>
							{hasBody && (
								<div className='modal-content clearfix'>
									{headerEl}
									<div className='modal-content__body'>
										{this.props.children}
									</div>
								</div>
							)}
							{!hasBody && this.props.children}
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}

		// const returnElem = (
		//     this.handlePortal(
		//         <CSSTransitionGroup
		//             transitionName='ani'
		//             transitionEnterTimeout={250}
		//             transitionLeaveTimeout={250}>
		//             {modalEl}
		//         </CSSTransitionGroup>
		//     )
		// );
		return modalEl;
	}
}

Modal.displayName = displayName;
Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

module.exports = bindReactClass(Modal);
