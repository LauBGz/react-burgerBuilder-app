import React, {Component} from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    };

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    };

    render() {
    //If we load ContactData and there are no ingredients, there's an error. Since the user shouldn't be able to
    //access this page if there are no ingredients, we make a redirect just in case
        let summary = <Redirect to="/"/>

        if (this.props.ings){
            const purchasedRedirect = this.props.purchased ? <Redirect to="/"/> : null;
            summary = (
                <div>
                    {purchasedRedirect}
                    <CheckoutSummary 
                    ingredients={this.props.ings}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}/>
                    <Route 
                    path={this.props.match.path + "/contact-data"} 
                    component={ContactData}/>
                </div>
            );
        };
        return summary;
    };
}

 
const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients, 
        purchased: state.order.purchased
    }
};

export default connect(mapStateToProps)(Checkout);