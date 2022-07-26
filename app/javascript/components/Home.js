import React from 'react'

class Home extends React.Component {
	render () {
		return (
			<div className='Home'>
				<h1>Warhammer 40,000</h1>
				<menu>
					<li><a href='/open_plays'>Open Play</a></li>
					<li><a href='/armies'>Armies</a></li>
				</menu>
			</div>
		);
	}
}

export default Home
