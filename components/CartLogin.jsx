import Cookies from 'js-cookie';
import React, { useContext, useRef, useState } from 'react';
import { AiOutlineLeft } from 'react-icons/ai';
import { Store } from '../context/StateContext';

import { Register , Login } from './';

const CartLogin = () => {
    const cartRef = useRef();
    
    const { state, dispatch} = useContext(Store);
    const {
        login,
        registerForm
    } = state;
  
    const showLogin = () => {
        dispatch({type: login ? 'LOGIN_OFF' : 'LOGIN_ON'});
        const newLogin = !login;
        Cookies.set('login', newLogin ? 'ON' : 'OFF' );
    }

    return (
        <div className='cart-wrapper' ref={cartRef}>
            <div className='cart-container'>
                <button
                    type='button'
                    className='cart-heading'
                    onClick={showLogin}
                    >
                    <AiOutlineLeft />
                    <span className='heading'>
                    {
                        registerForm 
                        ? 'Register'
                        : 'Login'
                    }
                    </span>
                </button>       
                { 
                    registerForm 
                    ? (
                        <Register />
                    ) : (
                        <Login />
                    )
                }
            </div>
        </div>
    )
}

export default CartLogin
