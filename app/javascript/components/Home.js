import React from "react"

class Home extends React.Component {
	render () {
		return (
			<div>
				Home Page
				<a href='/team'>Team Builder</a>
				<a href='/armies'>Armies</a>
			</div>
		);
	}
}

export default Home
