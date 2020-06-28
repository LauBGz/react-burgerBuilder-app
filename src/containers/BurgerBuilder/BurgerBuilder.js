import React, { Component } from 'react';
import { connect } from 'react-redux';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionType from './../../store/actions';

class BurgerBuilder extends Component {
    state = {
        // purchasable: false, --> we don't manage it here anymore, though we keep the logic from updatePurchaseState
        //We could also manage purchasable in the reducer. In this case, we are doing it like this because it manages
        //ui elements. That's the reason we also leave in state purchasing, loading & error (ui elements)
        purchasing: false,
        loading: false,
        error: false
    };

    // componentDidMount() {
    //     axios.get("https://react-first-app-19e3e.firebaseio.com/ingredients.json")
    //     .then(response => {
    //         this.setState({ingredients: response.data});
    //     })
    //     .catch(error => {
    //         this.setState({error: true});
    //     });
    // };

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0;
        // We adjust the logic so we get the boolean value here
        // this.setState({purchasable: sum > 0})
    };

    // addIngredientHandler = (type) => {
    //     const oldCount =  this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
        
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState(
    //         {   
    //             ingredients: updatedIngredients,
    //             totalPrice: newPrice
    //         }
    //     );
    //     this.updatePurchaseState(updatedIngredients);
    // };

    // removeIngredientHandler = (type) => {
    //     const oldCount =  this.state.ingredients[type];

    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
        
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
 
    //     this.setState(
    //         {   
    //             ingredients: updatedIngredients,
    //             totalPrice: newPrice
    //         }
    //     );
    //     this.updatePurchaseState(updatedIngredients);
    // };

    purchaseHandler = () => {
        this.setState({purchasing: true});
    };

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    };

    //Introducing redux makes unnecessary using queryParams
    purchaseContinueHandler = () => {
        // const queryParams = [];
        // for (let i in this.state.ingredients){
        //     queryParams.push(encodeURIComponent(i) + "=" + encodeURIComponent(this.state.ingredients[i]));
        // };
        // queryParams.push("price=" + this.state.totalPrice);
        // const queryString = queryParams.join("&");
        this.props.history.push("/checkout");
    };

    render () {
        const disabledInfo = {
            ...this.props.ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        };

        let orderSummary = null;
        
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

        if(this.props.ings){
            burger = (
                <Auxiliary>
                    <Burger ingredients={this.props.ings}/>
                    {/* BuildControls pasa a BuildControl 1 arg con el tipo de ingrediente         
                        added={() => props.ingredientAdded(ctrl.type)}
                        removed={() => props.ingredientRemoved(ctrl.type)}*/}
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        // Other option would be to change the var ingredients for this.props.ings in the fuction updatePurchaseState 
                        ordered={this.purchaseHandler}
                    />
                </Auxiliary>);
            orderSummary = 
                <OrderSummary
                    ingredients={this.props.ings}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    price={this.props.price}
                />      
        };

        if(this.state.loading){
            orderSummary = <Spinner/>
        };

        return (
            <Auxiliary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>
        );
    }

};

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionType.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionType.REMOVE_INGREDIENT, ingredientName: ingName})
    };
};

export default  connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
//withErrorHandler(BurgerBuilder, axios) is an arg for the function that connect calls