import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index'

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
                <Route path="/auth" component={Auth} />
                <Route path="/" exact component={BurgerBuilder} /> 
                  {/* If we don't use exact, the non-logged in user can access to /orders even though
                  they only see the home component (http://localhost:3000/orders doesnt change)*/}
                <Redirect to="/" />
            </Switch>
            );

        if(this.props.isAuthenticated){
            routes = (
                <Switch>
                    <Route path="/auth" component={Auth} /> 
                    {/* We also need auth here in case users create a burger before sign in */}
                    <Route path="/checkout" component={Checkout} />
                    <Route path="/orders" component={Orders} />
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
