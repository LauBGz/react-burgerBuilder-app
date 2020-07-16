import React, { Component } from 'react';
 
const asyncComponent = (importComponent) => {// function with takes a function as an input
    return class extends Component {
        state = {
            component: null// the state will change according the content to load   
        };
 
        componentDidMount() {
            //The input (fuction) will use this dynamic import syntax and then give us a promise where 
            //we eventually get the component we want it to load and where we then render this component.
            importComponent().then(cmp => {
                this.setState({component: cmp.default});//Default is the component we load dinamically
            });
        };
 
        render() {
            const C = this.state.component;
 
            return C ? <C {...this.props} /> : null;
        };
    };
};
 
export default asyncComponent;
