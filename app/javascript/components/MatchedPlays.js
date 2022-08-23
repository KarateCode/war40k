/* globals document */
import React from 'react'
const {useEffect, useState} = React;
const _ = require('lodash');
const axios = require('axios');

const Modal = require('components/Modal');
const {default: MatchedPlayEditModal} = require('components/MatchedPlayEditModal');

const MatchedPlays = () => {
	const [games, setGames] = useState([])
	const [showOpenPlayModal, setShowOpenPlayModal] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [editOpenPlay, setEditOpenPlay] = useState({})
	const [matchedPlayForDelete, setMatchedPlayForDelete] = useState({})

	useEffect(async () => {
		const response = await axios.get(`/api/matched_plays.json`)
		const teams = response.data
		setGames(teams)
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
			setMatchedPlayForDelete(openPlay)
		}
	}
	function handleDeleteMatchedPlay(openPlay) {
		return async () => {
			const token = document.querySelector('meta[name="csrf-token"]').content
			const headers = {headers: {'X-CSRF-Token': token}}
			await axios.delete(`/api/matched_plays/${openPlay.id}.json`, headers)
			const newGames = _.reject(games, {id: openPlay.id})
			setGames([...newGames])

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

	async function handleSaveMatchedPlay(game) {
		const token = document.querySelector('meta[name="csrf-token"]').content
		const headers = {headers: {'X-CSRF-Token': token}}
		if (game.id) {
			await axios.put(`/api/matched_plays/${game.id}.json`, game, headers)
			const index = _.findIndex(games, {id: game.id});
			games[index] = game;
			setGames([...games])
		} else {
			const newGame = await axios.post(`/api/matched_plays.json`, game, headers)
			setGames([...games, newGame.data])
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
				<span className='middle'>Matched Play</span>
			</header>

			<div className='main-body'>
				<table className='table has-clickable-rows'>
					<thead>
						<tr>
							<th> </th>
							<th> </th>
							<th>Name</th>
						</tr>
					</thead>
					<tbody>
						{games.map((team) => (
							<tr key={`army-${team.id}`}>
								<td className='icon-field edit'><a onClick={handleEditOpenPlay(team)}>✎</a></td>
								<td className='icon-field delete'><a onClick={handleShowDeleteModal(team)}>✗</a></td>
								<td className='link-field'><a href={`/matched_plays/${team.id}`}>{team.name}</a></td>
							</tr>
						))}
					</tbody>
				</table>

				<a className='btn' onClick={handleShowAddTeamModal}>
					Add Game
				</a>
			</div>

			<MatchedPlayEditModal
				show={showOpenPlayModal}
				onDismiss={handleDismissOpenPlayEditModal}
				openPlay={editOpenPlay}
				onSaveMatchedPlay={handleSaveMatchedPlay} />

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
							onClick={handleDeleteMatchedPlay(matchedPlayForDelete)}>
							Delete
						</button>
					</div>
				</div>
			</Modal>
		</div>
	)
}

export default MatchedPlays
