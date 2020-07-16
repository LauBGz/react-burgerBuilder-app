import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware, compose} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import burgerBuilderReducer from './store/reducers/burgerBuilder';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';

//Only set this extension in development mode to keep "locked" our js code
const composeEnhancers = process.env.NODE_ENV === 'development' ? (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) : null || compose;
//We check if this is equal to development and if it is, we'll use the redux dev tools as we did before
//if it's not, we'll set it to null and then we have the "||" comparation so if the first part is null, we'll use
// the default compose function. 
const rootReducer = combineReducers({
    burgerBuilder: burgerBuilderReducer,
    order: orderReducer,
    auth: authReducer
});


const burgerStore = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

const app = (
    //Provider should wrap everything so it has to be out of browser router
    <Provider store={burgerStore}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
