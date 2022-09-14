import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { AiOutlineShopping , AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';

import Cookies from 'js-cookie';

import { Cart , CartLogin } from './';
import { Store } from '../context/StateContext';
 
const Navbar = () => {
  
  const { state, dispatch} = useContext(Store);

  const {
    userInfo,
    cart: {cartItems},
    panier,
    login
  } = state;

  const logoutHandler = () => {
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
  }
  
  const showPanier = () => {
    dispatch({type: panier ? 'PANIER_OFF' : 'PANIER_ON'});
    const newPanier = !panier;
    Cookies.set('panier', newPanier ? 'ON' : 'OFF' );
  }

  const showLogin = () => {
    dispatch({type: login ? 'LOGIN_OFF' : 'LOGIN_ON'});
    const newLogin = !login;
    Cookies.set('login', newLogin ? 'ON' : 'OFF' );
  }

  return (
    <div className='navbar-container'>
      <p className='logo'>
        <Link href="/">THR Store</Link>
      </p>

      <div
        style={{display: 'flex'}}
      >
        {userInfo
        ? (
          <>
            <h5 
              className='username'
              style={{marginRight: 10}}
            >
              <Link href="/profile">{userInfo.name}</Link>
            </h5>
          
            <button 
            type='button'
            className='navbar-icon'
            onClick={logoutHandler}
            style={{marginRight: 10}}
            >
              <AiOutlineLogout />
            </button>
          </>
          )
        : (
          <button 
          type='button'
          className='navbar-icon'
          onClick={showLogin}
          style={{marginRight: 10}}
          >
            <AiOutlineLogin />
          </button>
          )
        }
        

        <button 
        type='button'
        className='cart-icon'
        onClick={showPanier}
        >
          <AiOutlineShopping />
          <span className='cart-item-qty'>{cartItems.reduce((a, c) => a + c.quantity, 0)}</span>
        </button>
      </div>
      {panier && <Cart />}
      {login && <CartLogin />}
    </div>
  )
}

export default Navbar
