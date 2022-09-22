/* eslint-disable @next/next/no-img-element */
import React, { useContext, useRef } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

import { AiOutlineLeft, AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai';
import { TiDelete, TiDeleteOutline } from 'react-icons/ti';
import { toast } from 'react-hot-toast';

import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';
import { Store } from '../context/StateContext';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

const Cart = () => {
  const cartRef = useRef();
  const { state, dispatch} = useContext(Store);
  const {
    login,
    userInfo,
    cart: {cartItems},
    panier
  } = state;


  

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
  

  

  const handleCheckout = async () => {
    if(userInfo) {
      const stripe = await getStripe();

      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItems),
      });
      console.log(cartItems);
  
      if(response.statusCode === 500) return;
      
      const data = await response.json();
      console.log(data);
      toast.loading('Redirecting...');
  
      stripe.redirectToCheckout({ sessionId: data.id });
    } else {
      showPanier();
      showLogin();
      toast.error('Please login !');
    }
  }

  const addItemCartHandler = async (item) => {
    const { data } = await axios.get(`/api/products/${item._key}`);
        if(data.countInStock < item.quantity + 1 ) {
            toast.error('Sorry, Product is out of stock');
        }

        dispatch({
            type:'CART_ADD_ITEM', 
            payload: {
                _key: item._key,
                name: item.name,
                countInStock: item.countInStock,
                slug: item.slug,
                price: item.price,
                image: item.image,
                quantity: item.quantity + 1
            },
        });

        toast.success(`${item.name} updated in the cart`);
  };

  const minusItemCartHandler = async (item) => {
    const { data } = await axios.get(`/api/products/${item._key}`);
        if( item.quantity - 1 < 1 ) {
            toast.error('You need minimum to get 1');
        } else {
          dispatch({
            type:'CART_ADD_ITEM', 
            payload: {
                _key: item._key,
                name: item.name,
                countInStock: item.countInStock,
                slug: item.slug,
                price: item.price,
                image: item.image,
                quantity: item.quantity - 1
            },
          });

          toast.success(`${item.name} updated in the cart`);
        }
  };

  const removeItemHandler = async (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  return (
    <div className='cart-wrapper' ref={cartRef}>
      <div className='cart-container'>
        <button
        type='button'
        className='cart-heading'
        onClick={showPanier}
        >
          <AiOutlineLeft />
          <span className='heading'>Your Cart</span>
          <span className='cart-num-items'>{cartItems.reduce((a, c) => a + c.quantity, 0)} items</span>
        </button>

        {cartItems.length < 1 && (
          <div className='empty-cart'>
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/product">
              <button
              type='button'
              onClick={showPanier}
              className='btn'
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}


        <div className='product-container'>
          {cartItems.length >=1 && cartItems.map((item) => (
            <div className='product' key={item._key}>
              {<img
                src={urlFor(item?.image)}
                alt='product'
                className='cart-product-image'
              />}
              <div className='item-desc'>
                <div className='flex top'>
                  <h5>{item.name}</h5>
                  <h4>${item.price}</h4>
                </div>
                <div className='flex bottom'>
                  <div>
                    <p className='quantity-desc'>
                        <span 
                          className='minus' 
                          onClick={() => minusItemCartHandler(item)}
                        >
                            <AiOutlineMinus />
                        </span>
                        <span className='num'>
                            {item.quantity}
                        </span>
                        <span 
                          className='plus' 
                          onClick={() => addItemCartHandler(item) } 
                        >
                            <AiOutlinePlus />
                        </span>
                    </p>
                  </div>
                  <button
                    type='button'
                    className='remove-item'
                    onClick={() => removeItemHandler(item)}
                  >
                    <TiDeleteOutline />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cartItems.length >= 1 && (
          <div className='cart-bottom'>
            <div className='total'>
              <h3>Subtotal:</h3>
              <h3>$ {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}</h3>
            </div>
            <div className='btn-container'>
              <button
              type='button'
              className='btn'
              onClick={handleCheckout}
              >
                Pay with Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
