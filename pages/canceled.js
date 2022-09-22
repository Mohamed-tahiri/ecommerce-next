/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import Link from 'next/link'
import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { BsXSquareFill } from 'react-icons/bs'
import { Store } from '../context/StateContext';

const canceled = () => {
    const { dispatch} = useContext(Store);

    const hidePanier = () => {
        dispatch({ type: 'PANIER_OFF' })
    }

    const deleteCart = () => {
        dispatch({ type: 'CART_REMOVE' })
    }

    useEffect(() => {
        deleteCart();
        hidePanier();
    }, [deleteCart, hidePanier]);

    return (
        <div className='cancel-wrapper'>
            <div className='cancel'>
                <p className='icon'>
                    <BsXSquareFill />
                </p>
                <h2>Cancel your order!</h2>
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

export default canceled
