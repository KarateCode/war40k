import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import TeamBuilder from './TeamBuilder'
import OpenPlays from './OpenPlays'
import Armies from './Armies'
import Army from './Army'
import Detachment from './Detachment'
import Home from './Home'
import OpenPlay from './OpenPlay'

class App extends React.Component {
	render () {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path='/' component={Home} />
					<Route path='/team' component={TeamBuilder} />
					<Route path='/open_plays/:id' component={OpenPlay} />
					<Route path='/open_plays' component={OpenPlays} />
					<Route path='/armies/:id' component={Army} />
					<Route path='/armies' component={Armies} />
					<Route path='/detachments/:id' component={Detachment} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App
