/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState, useEffect, useContext} from 'react';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';
import { runFireworks } from '../lib/utils';
import { Store } from '../context/StateContext';
const success = () => {
    const { dispatch} = useContext(Store);

    const hidePanier = () => {
        dispatch({ type: 'PANIER_OFF' })
    }

    const deleteCart = () => {
        dispatch({ type: 'CART_REMOVE' })
    }

    useEffect(() => {
        runFireworks();
        deleteCart();
        hidePanier();
    }, []);

    return (
         <div className='success-wrapper'>
            <div className='success'>
                <p className='icon'>
                    <BsBagCheckFill />
                </p>
                <h2>Thank you for you order!</h2>
                <p className='description'>
                    if you have any questions, send me an email
                    <a className='email' href='mailto:mhdtahiri01@gmail.com'>
                        mhdtahiri01@gmail
                    </a>
                </p>
                <Link href='/product'>
                    <button
                    type='button'
                    width='300px'
                    className='btn'
                    >
                        Continue Shopping
                    </button>
                </Link>
            </div>
        </div>

   )
}

export default success
