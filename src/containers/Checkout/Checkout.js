import React, {Component} from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route} from 'react-router-dom';
import {connect} from 'react-redux';
import ContactData from './ContactData/ContactData'

class Checkout extends Component {
    //Introducing redux makes unnecessary to manage the state here
    // state = {
    //     ingredients: null,
    //     totalPrice: 0
    // };

    // componentWillMount() {    
    //     const query = new URLSearchParams(this.props.location.search);
    //     const ingredients = {};
    //     let price = 0;
     
    //     for (let param of query.entries()){
    //         if(param[0] === "price"){
    //             price =  param[1]
    //         } else {
    //             ingredients[param[0]] = +param[1];
    //         }
    //     };
    //     this.setState({ingredients: ingredients, totalPrice: price});
    // };

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    };

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    };

    render() {
        return(
            <div>
                <CheckoutSummary 
                    ingredients={this.props.ings}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}
                />
  
                <Route 
                    path={this.props.match.path + "/contact-data"} 
                    //We don't need state.totalPrice because we don't need this kind of render anymore
                    //We don't need to pass the props because we can take it in the component from the reducer
                    // render={(props) => (<ContactData 
                    //     ingredients={this.props.ings} 
                    //     price={this.state.totalPrice}
                    //     {...props}/>)}
                    component={ContactData}
                />
            </div>
        );
    };
}

 
const mapStateToProps = state => {
    return {
        ings: state.ingredients
    }
};

//We don't need mapDispatchToProps because we are not dispatchin anything in this container

export default connect(mapStateToProps)(Checkout);