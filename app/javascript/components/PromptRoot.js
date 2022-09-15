import React from 'react'
import {useState, useEffect} from 'react';

import Prompt from './Prompt';

const Modal = require('components/Modal');

export default function ModalRoot() {
	const [show, setShow] = useState(false)
	const [question, setQuestion] = useState('')

	useEffect(() => {
		Prompt.on('open', ({props}) => {
			setShow(true)
			setQuestion(props.question)
		});
	}, []);

	function handleHideModal() {
		setShow(false)
		Prompt.close(false)
	}

	function handleConfirm() {
		setShow(false)
		Prompt.close(true)
	}

	return (
		<Modal
			show={show}
			onDismiss={handleHideModal} >

			<h2>{question}</h2>

			<div className='bottom-buttons'>
				<div className='bottom-buttons__left fix'>
					<a className='btn btn-cancel' onClick={handleHideModal}>Cancel</a>
				</div>
				<div className='bottom-buttons__right'>
					<button
						className='btn btn-cancel'
						autoFocus
						onClick={handleConfirm}>
						Delete
					</button>
				</div>
			</div>
		</Modal>
	)
}
