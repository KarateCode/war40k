import React from 'react'
const {useEffect, useState} = React;

const Modal = require('components/Modal');
const {handleInputChange} = require('lib/hook-helper')

const OpenPlayEditModal = ({openPlay, show, onSaveOpenPlay, onDismiss}) => {
	const [name, handleNameChange] = useState(openPlay.name);
	const [desc, handleDescChange] = useState(openPlay.desc);

	function handleSaveOpenPlay(event) {
		event.preventDefault(); // form submission attempts to change url
		onSaveOpenPlay(Object.assign({}, openPlay, {name, desc}))
	}

	useEffect(() => {
		handleNameChange(openPlay.name || '')
		handleDescChange(openPlay.desc || '')
	}, [openPlay])

	return (
		<Modal
			headerText={(openPlay.id) ? 'Edit Game' : 'Add Game'}
			onDismiss={onDismiss}
			show={show}>

			<form onSubmit={handleSaveOpenPlay}>
				<div className='form-group'>
					<label htmlFor='name-input'>Name:</label>
					<input type='text'
						className='form-control'
						id='name-input'
						autoFocus
						onChange={handleInputChange(handleNameChange)}
						value={name} />
				</div>
				<div className='form-group'>
					<label htmlFor='name-input'>Description:</label>
					<textarea
						className='form-control'
						id='name-input'
						onChange={handleInputChange(handleDescChange)}
						value={desc} />
				</div>

				<div className='bottom-buttons'>
					<div className='bottom-buttons__left fix'>
						<a className='btn btn-cancel' onClick={onDismiss}>Cancel</a>
					</div>
					<div className='bottom-buttons__right'>
						<input className='btn' type='submit' value={(openPlay.id) ? 'Update Game' : 'Create Game'} />
					</div>
				</div>
			</form>
		</Modal>
	)
}

export default OpenPlayEditModal
