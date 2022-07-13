import React from 'react'
const {useEffect, useState} = React;

const Modal = require('components/Modal');
const {handleInputChange, handleIntegerChange} = require('lib/hook-helper')

const ArmyEditModal = ({army, show, onSaveArmy, onDismiss}) => {
	const [name, handleNameChange] = useState(army.name || '');
	const [command_points, handleCommandPointChange] = useState(army.command_points || '');
	const [point_battle, handlePointBattleChange] = useState(army.point_battle || '');

	function handleSaveArmy(event) {
        event.preventDefault(); // form submission attempts to change url
		onSaveArmy({name, command_points, point_battle, id: army.id})
	}

	useEffect(() => {
		handleNameChange(army.name || '')
		handleCommandPointChange(army.command_points || '')
		handlePointBattleChange(army.point_battle || '')
	}, [army])

	return (
		<Modal
			headerText={(army.id) ? 'Edit Army' : 'Add Army'}
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
					<label htmlFor='name-input'>Command Points:</label>
					<input type='number'
						className='form-control'
						id='name-input'
						onChange={handleIntegerChange(handleCommandPointChange)}
						value={command_points} />
				</div>
				<div className='form-group'>
					<label>Choose Number of Points in Battle:</label>

					<div className='radio-group'>
						<input
							type='radio'
							onChange={handleIntegerChange(handlePointBattleChange)}
							name='point-battle'
							id='point-battle-500'
							checked={point_battle === 500}
							value='500' />
						<label htmlFor='point-battle-500' className='point-battle-label'>
							500 1 Detachment (3 Command Points)
						</label>
					</div>
					<div className='radio-group'>
						<input
							type='radio'
							onChange={handleIntegerChange(handlePointBattleChange)}
							name='point-battle'
							id='point-battle-1000'
							checked={point_battle === 1000}
							value='1000' />
						<label htmlFor='point-battle-1000' className='point-battle-label'>
							1,000 2 Detachments (6 Command Points)
						</label>
					</div>
					<div className='radio-group'>
						<input
							type='radio'
							onChange={handleIntegerChange(handlePointBattleChange)}
							name='point-battle'
							id='point-battle-2000'
							checked={point_battle === 2000}
							value='2000' />
						<label htmlFor='point-battle-2000' className='point-battle-label'>
							2,000 3 Detachments (12 Command Points)
						</label>
					</div>
					<div className='radio-group'>
						<input
							type='radio'
							onChange={handleIntegerChange(handlePointBattleChange)}
							name='point-battle'
							id='point-battle-3000'
							checked={point_battle === 3000}
							value='3000' />
						<label htmlFor='point-battle-3000' className='point-battle-label'>
							3,000 4 Detachments (18 Command Points)
						</label>
					</div>
				</div>

				<div className='bottom-buttons'>
					<div className='bottom-buttons__left fix'>
						<a className='btn btn-cancel' onClick={onDismiss}>Cancel</a>
					</div>
					<div className='bottom-buttons__right'>
						<input className='btn' type='submit' value={(army.id) ? 'Update Army' : 'Create Army'} />
					</div>
				</div>
			</form>
		</Modal>
	)
}

export default ArmyEditModal
