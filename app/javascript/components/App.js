import React from "react"
import PropTypes from "prop-types"
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import TeamBuilder from './TeamBuilder'
import Home from './Home'

class App extends React.Component {
	render () {
		return (
			<BrowserRouter>
				<Switch>
					{/*
						<Route path="/hello" render={() => "Home"} />
					*/}
					<Route exact path="/" render={() => <Home />} />
					<Route path="/team" render={() => <TeamBuilder greeting="Friend" />} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App
