import React from 'react'
import { client } from '../lib/client';
import Link from 'next/link';

import {
  Product,
  FooterBanner,
  HeroBanner
} from '../components';

const Home = ({ products, bannerData }) => {
  return (
    <>
      <HeroBanner heroBanner={bannerData && bannerData[0]} />  

      <div className='products-heading'>
        <h2>Last Products added</h2>
        <Link href='/product'>
          <p className='products-lien'>All Products</p>
        </Link>
        <div className='products-container'>
          {products?.map(
            (product) => <Product key={product._id} product={product} />
          )}
        </div>
      </div>

      <FooterBanner footerBanner={bannerData && bannerData[0]} />
    </>
  )
}

export const getServerSideProps = async () => {
  const query = '*[_type == "product"] | order(_createdAt desc) [0..3]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);
  
  return {
    props: { products, bannerData }
  }

}

export default Home;
