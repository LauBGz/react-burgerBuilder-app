import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {updateObject, checkValidity} from '../../shared/utility';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
// import * as actions from '../../store/actions/index';
//tb vale sin index
import * as actions from '../../store/actions';

class Auth extends Component {
    //We the state in the container, not through redux because we are only talking about the local state, 
    //the values the user entered into their form inputs and so on and it makes more sense to use them 
    //and manage them inside the container with react's state property.
    state = {
        controls: {            
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail address'
                },
                value: "",
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignup: true
    };

    componentDidMount() {
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/'){
            this.props.onSetAuthRedirectPath();
        };
    };

    

    inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(this.state.controls, { 
            [controlName]: updateObject(this.state.controls[controlName], {
                value: event.target.value,
                valid: checkValidity(
                    event.target.value, 
                    this.state.controls[controlName].validation,
                ),
                touched: true
            })
        })
        // const updatedControls = {
        //     //Copy of the state controls
        //     ...this.state.controls,
        //     //Then overwrite some of the properties, that is, name or password
        //     [controlName]: {
        //         //Copy of the control state
        //         ...this.state.controls[controlName],
        //         value: event.target.value,
        //         //checkValidity gets 2 params (value, rules)
        //         valid: this.checkValidity(
        //             event.target.value, //value
        //             this.state.controls[controlName].validation, //rule --> required, mingLength, etc.
        //                 // validation: {
        //                 //     required: true,
        //                 //     minLength: 6
        //                 // },
        //         ),
        //         touched: true
        //     }
        // };
        this.setState({controls: updatedControls});
    };

   submitHandler = (event) => {
       event.preventDefault();
       this.props.onAuth(
           this.state.controls.email.value,
           this.state.controls.password.value,
           this.state.isSignup
       );
   };

   switchAuthModeHandler = () => {
       this.setState(prevState => {
           return {isSignup: !prevState.isSignup};
       })
   };

    render(){
        const formElementsArray = [];

        for (let key in this.state.controls){
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        };

        let form = formElementsArray.map(formElement => (
            <Input 
                key={formElement.id}
                elementType={formElement.config.elementType} 
                valueType={formElement.id}
                // We pass the elementType of each form element to input.js
                elementConfig={formElement.config.elementConfig}
                //We pass the whole config and value
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
     
        ));

        if(this.props.loading){
            form = <Spinner/>
        };

        let errorMessage = null;
        
        if(this.props.error){
            errorMessage = (
                <p>{this.props.error.message}</p>
                //.message es una propiedad de firebase
            );
        };

        let authRedirect = null;

        if(this.props.isAuthenticated){
            authRedirect = <Redirect to={this.props.authRedirectPath}/>
        };

        return (
            <div className={classes.Auth}>
                {authRedirect} 
                {/* So once we login we are redirect to home */}
                {errorMessage} 
                {/* In case there's an error with the signin/signup */}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button 
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger">SIWTCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        )
    };

};

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);