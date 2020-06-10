import React, { Component} from "react";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.css";
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm: {//Se podría crear una función para no repetir continuamente lo mismo
            name: {//los nombres de las claves pueden ser otros
                elementType: 'input',//tipo de elemento, como html pero sin <>
                elementConfig: {//configuración del elemento html
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: "",//valor inicial,
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: "",
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zipcode'
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: "",
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-mail'
                },
                value: "",
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options:[
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: "fastest",
                validation: {},
                valid: true,
            },
        },
        formIsValid: false,
        loading: false //Para el spinner
    }

    orderHandler = (event) => {
        event.preventDefault();//Para evitar el comportamiento por defecto del formulario 
        //que es que envíe la petición y recargue la página. Primero es necesario extraer los datos

        const formData = {};

        for(let formElementIndentifier in this.state.orderForm){
            formData[formElementIndentifier] = this.state.orderForm[formElementIndentifier]["value"];
        };
  
        this.setState({loading: true});

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,//En una aplicación real el precio se calcularía en el servidor
            orderData: formData
        };
        axios.post("/orders.json", order)
            .then(response => {
                 this.setState({loading: false});
                 this.props.history.push("/");
            })
            .catch(error => {
                this.setState({loading: false});
           })

    }

    checkValidity(value, rules){
        let isValid = true;
    
        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        };

        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        };

        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        };


        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        }

        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        }

        updatedFormElement.value = event.target.value;

        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)

        updatedFormElement.touched =  true;

        updatedOrderForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier]["valid"] && formIsValid;
        }
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    };

    render() {
        const formElementsArray = [];

        for (let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        };

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType} 
                        valueType={formElement.id}
                        // Pasamos para el switch de Input.js el elementType de cada elemento del formulario
                        elementConfig={formElement.config.elementConfig}
                        //Pasamos toda la configuración y el valor
                        value={formElement.config.value}
     
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
                    {/* Hay que pasar la propiedad disabled al componente button o no funcionará */}
            </form>
        );

        if(this.state.loading){
            form = <Spinner/>
        };

        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;