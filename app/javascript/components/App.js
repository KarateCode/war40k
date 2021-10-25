import React from "react"
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import TeamBuilder from './TeamBuilder'
import Home from './Home'

class App extends React.Component {
	goHome() {
		return <Home />
	}

	goTeamBuilder() {
		return <TeamBuilder greeting='Friend' />
	}

	render () {
		return (
			<BrowserRouter>
				<Switch>
					{/*
						<Route path="/hello" render={() => "Home"} />
					*/}
					<Route exact path='/' render={this.goHome} />
					<Route path='/team' render={this.goTeamBuilder} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App
