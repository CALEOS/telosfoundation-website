import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app';
//import registerServiceWorker from './registerServiceWorker';
import {unregister} from './registerServiceWorker';

import reducers from './reducers';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import promise from 'redux-promise';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
	<Provider store={createStoreWithMiddleware(reducers)}>
		<App />
	</Provider>,
	document.getElementById('root')
);

//registerServiceWorker();
unregister();