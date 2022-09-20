import React from 'react'

const Home  = () => {
	return (
		<div className='Home'>
			<h1>Warhammer 40,000</h1>
			<menu>
				<li><a href='/open_plays'>Open Play</a></li>
				<li><a href='/armies'>Armies</a></li>
				<li><a href='/matched_plays'>Matched Play</a></li>
			</menu>
		</div>
	);
};

export default Home
