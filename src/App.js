import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

//Lazy loading: great improvement and one important step before we actually build our application for production
//though lazy loading is not always better. If the lazily loaded modules are very small, we might not really gain
//anything from adding lazy loading.

const asyncCheckout = asyncComponent(() => {
    return import('./containers/Checkout/Checkout');
});

const asyncOrders = asyncComponent(() => {
    return import('./containers/Orders/Orders');
});

const asyncAuth = asyncComponent(() => {
    return import('./containers/Auth/Auth');
});

class App extends Component {
//We should check if the user is logged in when the app loads so it's a good place to do it here
    componentDidMount(){
        this.props.onTryAutoSignup();
    };

    render() {
        //We use guards in front end to avoid users accessing routes they shouldn't
        //However, we must also prevent users from accessing data in the back end
        let routes = (
            <Switch>
                <Route path="/auth" component={asyncAuth} />
                <Route path="/" exact component={BurgerBuilder} /> 
                <Redirect to="/" />
            </Switch>
            );

        if(this.props.isAuthenticated){
            routes = (
                <Switch>
                    <Route path="/auth" component={asyncAuth} /> 
                    {/* We also need auth here in case users create a burger before sign in. Otherwise,
                     the code in the auth component which would redirect us correctly to the checkout page 
                     will never be used. */}
                    <Route path="/checkout" component={asyncCheckout} />
                    <Route path="/orders" component={asyncOrders} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/" exact component={BurgerBuilder} /> 
                    <Redirect to="/" />
                </Switch>
            );
        };

        return (    
        <div>
            <Layout>
            {routes}
            </Layout>
        </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState())
    };
};   

//export default connect(null, mapDispatchToProps)(App);
//If we do it like that, connect will break our react router. We have to import and use withRouter
//Reminder! HOC used to obtain the properties of the router in components that are not directly linked to one 
//path but are rendered within another (the properties of the router are not automatically passed to children)
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
