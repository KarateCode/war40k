/* globals document */
import React from 'react'

const _ = require('lodash');
const axios = require('axios');
const bindReactClass = require('lib/bind-react-class');
const {default: DetachmentEditModal} = require('components/DetachmentEditModal');

class Army extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			army: {},
			showAddDetachmentModal: false,
			detachmentDefs: [],
			newDetachment: {},
			detachments: [],
			editDetachment: {},
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

	handleAddDetachmentModal() {
		this.setState({showAddDetachmentModal: true, editDetachment: {army_id: this.props.match.params.id}})
	}

	handleToggleDetachmentModal(event) {
		this.setState({showAddDetachmentModal: !this.state.showAddDetachmentModal})
	}

	async handleSaveDetachment(detachment) {
		const token = document.querySelector('meta[name="csrf-token"]').content
		const headers = {headers: {'X-CSRF-Token': token}}

		if (detachment.id) {
			await axios.put(`/api/detachments/${detachment.id}.json`, detachment, headers)
		} else {
			await axios.post(`/api/detachments.json`, detachment, headers)
		}

		const response2 = await axios.get(`/api/armies/${this.props.match.params.id}/detachments.json`)
		const detachments = response2.data
		this.setState({detachments, showAddDetachmentModal: false})
	}

	handleEditDetachment(editDetachment) {
		return () => {
			this.setState({showAddDetachmentModal: true, editDetachment})
		}
	}

	render () {
		const {
			army,
			detachmentDefs,
			detachmentDefById,
			detachments,
			editDetachment,
			showAddDetachmentModal,
		} = this.state
		const total = _(detachments)
			.map('points')
			.sum() || 0

		return (
			<div className='Detachments'>
				<header>
					<span className='left'><a className='btn btn-cancel left' href='/armies'>Dashboard</a></span>
					<span className='middle'>{army.name}</span>
					<span className='right'>Total: {total}</span>
				</header>

				<div className='main-body'>
					<table className='table has-clickable-rows'>
						<thead>
							<tr>
								<th> </th>
								<th>Name</th>
								<th>Type</th>
								<th>Points</th>
							</tr>
						</thead>
						<tbody>
							{detachments.map((detachment) => (
								<tr key={`detachment-${detachment.id}`}>
									<td className='icon-field edit'><a onClick={this.handleEditDetachment(detachment)}>✎</a></td>
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
									<td className='link-field'>
										<a href={`/detachments/${detachment.id}`}>
											{detachment.points || 0}
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<a className='btn' onClick={this.handleAddDetachmentModal}>
						Add Detachment
					</a>
				</div>

				<DetachmentEditModal
					show={showAddDetachmentModal}
					onDismiss={this.handleToggleDetachmentModal}
					detachment={editDetachment}
					detachmentDefs={detachmentDefs}
					onSaveDetachment={this.handleSaveDetachment} />
			</div>
		);
	}
}

export default bindReactClass(Army)
