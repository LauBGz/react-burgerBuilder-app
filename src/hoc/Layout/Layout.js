import React, {Component} from 'react';
import {connect} from 'react-redux';

import Auxiliary from '../Auxiliary/Auxiliary';
import classes from './Layout.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

//We choose this container to make the change in the navbar because actually loads navigation items and here 
//we have a class-based component where we implement the toolbar and the side drawer which are of course the 
//components which use navigation items in the end. So it would make sense to connect the layout here to 
//our store so that we can pass the auth information down to toolbar and side drawer which then in turn
//could pass it to navigation items.

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    }

    sideDrawerToggledHandler = () => {
        this.setState( prevState => {
           return {showSideDrawer: !prevState.showSideDrawer}
        });
    }

    render() {
        return (
            <Auxiliary>
                <Toolbar 
                    isAuth={this.props.isAuthenticated}
                    drawerToggleClicked={this.sideDrawerToggledHandler}/>
                <SideDrawer 
                    isAuth={this.props.isAuthenticated}
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler}
                    />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Auxiliary>
        );
    };

};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
        //If the user is logged in the toke won't be null
    };
};

export default connect(mapStateToProps)(Layout);