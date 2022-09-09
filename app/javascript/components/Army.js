/* globals document */
import React from 'react'
const {useEffect, useState} = React;
import {useParams} from 'react-router-dom';

const _ = require('lodash');
const axios = require('axios');
const bindReactClass = require('lib/bind-react-class');
const {default: DetachmentEditModal} = require('components/DetachmentEditModal');

const Army = () => {
	const [army, setArmy] = useState()
	const [detachmentDefs, setDetachmentDefs] = useState()
	const [detachmentDefById, setDetachmentDefById] = useState()
	const [detachments, setDetachments] = useState()
	const [editDetachment, setEditDetachment] = useState()
	const [showAddDetachmentModal, setShowAddDetachmentModal] = useState()
	const {id} = useParams()

	useEffect(async () => {
		const response = await axios.get(`/api/detachment_defs.json`)
		const detachmentDefs = response.data
		const detachmentDefById = _.keyBy(detachmentDefs, 'id')
		setDetachmentDefs(detachmentDefs)
		setDetachmentDefById(detachmentDefById)

		const response2 = await axios.get(`/api/armies/${id}/detachments.json`)
		const detachments = response2.data
		setDetachments(detachments)

		const response3 = await axios.get(`/api/armies/${id}.json`)
		const army = response3.data
		setArmy(army)
	}, [])

	function handleAddDetachmentModal() {
		setShowAddDetachmentModal(true)
		setEditDetachment({army_id: id})
	}

	function handleToggleDetachmentModal(event) {
		setShowAddDetachmentModal(!showAddDetachmentModal)
	}

	async function handleSaveDetachment(detachment) {
		const token = document.querySelector('meta[name="csrf-token"]').content
		const headers = {headers: {'X-CSRF-Token': token}}

		if (detachment.id) {
			await axios.put(`/api/detachments/${detachment.id}.json`, detachment, headers)
		} else {
			await axios.post(`/api/detachments.json`, detachment, headers)
		}

		const response2 = await axios.get(`/api/armies/${id}/detachments.json`)
		const detachments = response2.data
		setDetachments(detachments)
		setShowAddDetachmentModal(false)
	}

	function handleEditDetachment(editDetachment) {
		return () => {
			setShowAddDetachmentModal(true)
			setEditDetachment(editDetachment)
		}
	}

	const total = _(detachments)
		.map('points')
		.sum() || 0

	return (army) ? (
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
								<td className='icon-field edit'><a onClick={handleEditDetachment(detachment)}>✎</a></td>
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

				<a className='btn' onClick={handleAddDetachmentModal}>
					Add Detachment
				</a>
			</div>

			<DetachmentEditModal
				show={showAddDetachmentModal}
				onDismiss={handleToggleDetachmentModal}
				detachment={editDetachment}
				detachmentDefs={detachmentDefs}
				onSaveDetachment={handleSaveDetachment} />
		</div>
	) : null
}

export default bindReactClass(Army)
