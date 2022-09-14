import Cookies from 'js-cookie';
import React, { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
    panier: Cookies.get('panier') === 'ON' ? true : false,
    cart: {
        cartItems: Cookies.get('cartItems')
            ? JSON.parse(Cookies.get('cartItems')) 
            : []

    },
    login: Cookies.get('login') === 'ON' ? true : false,
    registerForm: Cookies.get('registerForm') === 'ON' ? true : false,
    userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
}

function reducer(state, action) {
    switch (action.type) {
        case 'PANIER_ON' :
            return { ...state, panier: true};
        case 'PANIER_OFF' :
            return { ...state, panier: false};
        case 'LOGIN_ON' :
            return { ...state, login: true};
        case 'LOGIN_OFF' :
            return { ...state, login: false};
        case 'RegisterFORM_ON' :
            return { ...state, registerForm: true};
        case 'RegisterFORM_OFF' :
            return { ...state, registerForm: false};
        case 'CART_ADD_ITEM' : {
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find(
                (item) => item._key === newItem._key
            );
            const cartItems = existItem
                ? state.cart.cartItems.map((item) => item._key === existItem._key ? newItem: item)
                : [...state.cart.cartItems, newItem];
            Cookies.set('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        }
        case 'CART_REMOVE_ITEM' : 
            const cartItems = state.cart.cartItems.filter(
                (item) => item._key !== action.payload._key
            );
            Cookies.set('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        case 'CART_REMOVE' :
            Cookies.remove('cartItems');
            return { ...state, cart: { ...state.cart, cartItems: [] }};
        case 'USER_LOGIN' :
            return { ...state, userInfo: action.payload };
        case 'USER_LOGOUT' :
            return { ...state, userInfo: null };
        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state , dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch } ;
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}
