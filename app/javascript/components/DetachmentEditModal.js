import React from 'react'
const {useEffect, useState} = React;
const _ = require('lodash');

const Modal = require('components/Modal');
const {handleInputChange} = require('lib/hook-helper')
const Selectimus = require('components/Selectimus');

const DetachmentEditModal = ({detachment, show, detachmentDefs, onSaveDetachment, onDismiss}) => {
	const [name, handleNameChange] = useState(detachment.name || '');
	const [detachment_def_id, handleDefChange] = useState(detachment.detachment_def_id || '');
	const detachmentDefsById = _.keyBy(detachmentDefs, 'id')

	function handleSaveArmy(event) {
		event.preventDefault(); // form submission attempts to change url
		const {id, army_id} = detachment
		onSaveDetachment({name, detachment_def_id, id, army_id})
	}

	function handleDetachmentDefChange(detachmentDef) {
		handleDefChange(detachmentDef.id)
	}

	useEffect(() => {
		handleNameChange(detachment.name || '')
		handleDefChange(detachment.detachment_def_id || '')
	}, [detachment])

	const detachmentDefIdValue = detachmentDefsById[detachment_def_id] || null

	return (
		<Modal
			headerText={(detachment.id) ? 'Edit Detachment' : 'Add Detachment'}
			onDismiss={onDismiss}
			show={show}>

			<form onSubmit={handleSaveArmy}>
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
					<label htmlFor='name-input'>Choose Detachment Type:</label>
					<Selectimus
						options={detachmentDefs}
						onChange={handleDetachmentDefChange}
						valueKey='id'
						labelKey='name'
						value={detachmentDefIdValue} />
				</div>

				<div className='bottom-buttons'>
					<div className='bottom-buttons__left fix'>
						<a className='btn btn-cancel' onClick={onDismiss}>Cancel</a>
					</div>
					<div className='bottom-buttons__right'>
						<input className='btn' type='submit' value={(detachment.id) ? 'Update Detachment' : 'Create Detachment'} />
					</div>
				</div>
			</form>
		</Modal>
	)
}

export default DetachmentEditModal
