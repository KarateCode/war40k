/* globals document */
import React from 'react'
const {useEffect, useState} = React;
const _ = require('lodash');
const axios = require('axios');

const Modal = require('components/Modal');
const {default: OpenPlayEditModal} = require('components/OpenPlayEditModal');

const Teams = () => {
	const [teams, setTeams] = useState([])
	const [showOpenPlayModal, setShowOpenPlayModal] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [editOpenPlay, setEditOpenPlay] = useState({})
	const [openPlayForDelete, setOpenPlayForDelete] = useState({})

	useEffect(async () => {
		const response = await axios.get(`/api/open_plays.json`)
		const teams = response.data
		setTeams(teams)
	}, [])

	function handleEditOpenPlay(openPlay) {
		return () => {
			setShowOpenPlayModal(true)
			setEditOpenPlay(openPlay)
		}
	}

	function handleShowDeleteModal(openPlay) {
		return () => {
			setShowDeleteModal(true)
			setOpenPlayForDelete(openPlay)
		}
	}
	function handleDeleteOpenPlay(openPlay) {
		return async () => {
			const token = document.querySelector('meta[name="csrf-token"]').content
			const headers = {headers: {'X-CSRF-Token': token}}
			await axios.delete(`/api/open_plays/${openPlay.id}.json`, headers)
			const newTeams = _.reject(teams, {id: openPlay.id})
			setTeams([...newTeams])

			setShowDeleteModal(false)
		}
	}

	function handleShowAddTeamModal() {
		setShowOpenPlayModal(true)
		setEditOpenPlay({})
	}

	function handleDismissOpenPlayEditModal() {
		setShowOpenPlayModal(false)
	}

	async function handleSaveOpenPlay(openPlay) {
		const token = document.querySelector('meta[name="csrf-token"]').content
		const headers = {headers: {'X-CSRF-Token': token}}
		if (openPlay.id) {
			await axios.put(`/api/open_plays/${openPlay.id}.json`, openPlay, headers)
			const index = _.findIndex(teams, {id: openPlay.id});
			teams[index] = openPlay;
			setTeams([...teams])
		} else {
			const newOpenPlay = await axios.post(`/api/open_plays.json`, openPlay, headers)
			setTeams([...teams, newOpenPlay.data])
		}

		setShowOpenPlayModal(false)
	}

	function handleHideDeleteModal() {
		setShowDeleteModal(false)
	}

	return (
		<div className='Teams'>
			<header>
				<span className='left'>
					<a className='btn btn-cancel left' href='/'>Home</a>
				</span>
				<span className='middle'>Open Play</span>
			</header>

			<div className='main-body'>
				<h2>Here is where you can quickly line up two teams. No detachments. It will show your points total though, so you can see if you are evenly matched.</h2>
				<table className='table has-clickable-rows'>
					<thead>
						<tr>
							<th> </th>
							<th> </th>
							<th>Name</th>
						</tr>
					</thead>
					<tbody>
						{teams.map((team) => (
							<tr key={`army-${team.id}`}>
								<td className='icon-field edit'><a onClick={handleEditOpenPlay(team)}>✎</a></td>
								<td className='icon-field delete'><a onClick={handleShowDeleteModal(team)}>✗</a></td>
								<td className='link-field'><a href={`/open_plays/${team.id}`}>{team.name}</a></td>
							</tr>
						))}
					</tbody>
				</table>

				<a className='btn' onClick={handleShowAddTeamModal}>
					Add Game
				</a>
			</div>

			<OpenPlayEditModal
				show={showOpenPlayModal}
				onDismiss={handleDismissOpenPlayEditModal}
				openPlay={editOpenPlay}
				onSaveOpenPlay={handleSaveOpenPlay} />

			<Modal
				headerText='Warning!'
				onDismiss={handleHideDeleteModal}
				show={showDeleteModal}>

				<h2>Are you sure you would like to delete this game?</h2>

				<div className='bottom-buttons'>
					<div className='bottom-buttons__left fix'>
						<a className='btn btn-cancel' onClick={handleHideDeleteModal}>Cancel</a>
					</div>
					<div className='bottom-buttons__right'>
						<button
							className='btn btn-cancel'
							autoFocus
							onClick={handleDeleteOpenPlay(openPlayForDelete)}>
							Delete
						</button>
					</div>
				</div>
			</Modal>
		</div>
	)
}

export default Teams
