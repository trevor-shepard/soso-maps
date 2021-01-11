import React from 'react'
import './styles/App.css'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Map from 'features/Map'
import CreateTouch from 'features/touch/Create'

import store from 'store'

export const persistor = persistStore(store)

function App() {
	return (
		<div className="App">
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<Router>
						<Switch>
							<Route path="/create-touch/:coords" component={CreateTouch} />
							<Route path="/" component={Map} />
						</Switch>
					</Router>
				</PersistGate>
			</Provider>
		</div>
	)
}

export default App
