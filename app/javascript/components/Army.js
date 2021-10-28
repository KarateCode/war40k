/* globals document */
import React from 'react'

const _ = require('lodash');
const axios = require('axios');
const bindReactClass = require('lib/bind-react-class');
const Selectimus = require('components/Selectimus');
const Modal = require('components/Modal');

class Army extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			army: {},
			showAddDetachmentModal: false,
			detachmentDefs: [],
			newDetachment: {
				name: '',
				'army_id': this.props.match.params.id,
			},
			detachments: [],
		}
	}

	async componentDidMount() {
		const response = await axios.get(`/api/detachment_defs.json`)
		const detachmentDefs = response.data
		const detachmentDefById = _.keyBy(detachmentDefs, 'id')
		this.setState({detachmentDefs, detachmentDefById})

		const response2 = await axios.get(`/api/armies/${this.props.match.params.id}/detachments.json`)
		const detachments = response2.data
		this.setState({detachments})

		const response3 = await axios.get(`/api/armies/${this.props.match.params.id}.json`)
		const army = response3.data
		this.setState({army})
	}

	handleDefChange(def) {
		// Do I need an 'index' field on the detachment table?
		const newDetachment = Object.assign({}, this.state.newDetachment, {'detachment_def_id': def.id})
		this.setState({newDetachment})
	}

	handleToggleDetachmentModal(event) {
		this.setState({showAddDetachmentModal: !this.state.showAddDetachmentModal})
	}

	async handleCreateDetachment() {
		const token = document.querySelector('meta[name="csrf-token"]').content
		const headers = {headers: {'X-CSRF-Token': token}}
		await axios.post(`/api/detachments.json`, this.state.newDetachment, headers)
		this.setState({showAddDetachmentModal: false})
	}

	handleNameChange(event) {
		const newDetachment = Object.assign({}, this.state.newDetachment, {name: event.target.value})
		this.setState({newDetachment})
	}

	render () {
		const {
			army,
			detachmentDefs,
			detachmentDefById,
			detachments,
			newDetachment,
			showAddDetachmentModal,
		} = this.state

		return (
			<div className='Detachments'>
				<header>{army.name}</header>

				<div className='main-body'>
					<table className='table has-clickable-rows'>
						<thead>
							<tr>
								<th>Name</th>
								<th>Type</th>
							</tr>
						</thead>
						<tbody>
							{detachments.map((detachment) => (
								<tr key={`detachment-${detachment.id}`}>
									<td className='link-field'>
										<a href={`/detachments/${detachment.id}`}>
											{detachment.name}
										</a>
									</td>
									<td className='link-field'>
										<a href={`/detachments/${detachment.id}`}>
											{detachmentDefById[detachment.detachment_def_id].name}
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<a className='btn' onClick={this.handleToggleDetachmentModal}>
						Add Detachment
					</a>
				</div>


				<Modal
					headerText='Add Detachment'
					show={showAddDetachmentModal}
					onDismiss={this.handleToggleDetachmentModal}>

					<div className='form-group'>
						<label htmlFor='name-input'>Name:</label>
						<input type='text'
							className='form-control'
							id='name-input'
							autoFocus
							onChange={this.handleNameChange}
							value={newDetachment.name} />
					</div>

					<div className='form-group'>
						<label htmlFor='name-input'>Choose Detachment Type:</label>
						<Selectimus
							options={detachmentDefs}
							onChange={this.handleDefChange}
							valueKey='id'
							labelKey='name' />
					</div>

					<div className='bottom-buttons'>
						<div className='bottom-buttons__left' />
						<div className='bottom-buttons__right'>
							<a className='btn'
								onClick={this.handleCreateDetachment}>
								Create Detachment
							</a>
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}

export default bindReactClass(Army)
