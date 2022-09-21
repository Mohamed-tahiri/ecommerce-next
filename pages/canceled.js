import Link from 'next/link'
import React from 'react'
import { BsBagCheckFill } from 'react-icons/bs'

const canceled = () => {
  return (
    <div className='success-wrapper'>
            <div className='success'>
                <p className='icon'>
                    <BsBagCheckFill />
                </p>
                <h2>Thank you for you order!</h2>
                <p className='email-msg'>
                    Check your email inbox for the receipt.
                </p>
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
