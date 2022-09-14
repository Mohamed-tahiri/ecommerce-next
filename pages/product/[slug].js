/* eslint-disable @next/next/no-img-element */
import React, { useContext, useState } from 'react';
import { 
    AiFillStar,
    AiOutlineMinus, 
    AiOutlinePlus,
    AiOutlineStar
} from 'react-icons/ai'
import axios from 'axios';

import { Product } from '../../components';
import { client, urlFor } from '../../lib/client';
import { Store } from '../../context/StateContext';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const ProductDetails = ({ products, product }) => {

    const { image, name, details, price } = product;
    const [quantityToAdd, setQuantityToAdd] = useState(1);
    const [index, setIndex] = useState(0);
    const { 
        state: { cart , panier}, 
        dispatch 
    } = useContext(Store);

    const showPanier = () => {
        dispatch({type: panier ? 'PANIER_OFF' : 'PANIER_ON'});
        const newPanier = !panier;
        Cookies.set('panier', newPanier ? 'ON' : 'OFF' );
    }

    const onAddToCartHandler = async () => {
        const existItem = cart.cartItems.find((item) => item._key === product._id);
        
        const quantity = existItem ? existItem.quantity + quantityToAdd : quantityToAdd ;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if(data.countInStock < quantity ) {
            toast.error('Sorry, Product is out of stock');
        }

        dispatch({
            type:'CART_ADD_ITEM', 
            payload: {
                _key: product._id,
                name: product.name,
                countInStock: product.countInStock,
                slug: product.slug.current,
                price: product.price,
                image: product.image[0],
                quantity
            },
        });

        toast.success(`${quantityToAdd} ${product.name} added to the cart`);
    } 

    const handleBuyNow = () => {
        onAddToCartHandler();
        showPanier();
    }

    console.log(products);

    return (
        <div>
            <div className='product-detail-container'>
                <div>
                    <div className='image-container'>
                        <img 
                            src={
                                urlFor(
                                    image 
                                    && image[index]
                                )
                            }
                            alt="image"
                            className="product-detail-image"
                        />
                    </div>
                    <div className='small-images-container'>
                        {image?.map((item, i) =>(
                            <img
                                key={i}
                                src={urlFor(item)}
                                alt="image"
                                className={i === index ?
                                    'small-image selected-image' :
                                    'small-image'
                                }
                                onMouseEnter={() => setIndex(i)}
                            />
                        ))}
                    </div>
                </div>
                <div className='product-detail-desc'>
                    <h1>{name}</h1>
                    <h4>Details: </h4>
                    <p>{details}</p>
                    <p className='price'>${price}</p>
                    <div className='quantity'>
                        <h3>Quantity:</h3>
                        <p className='quantity-desc'>
                            <span 
                            className='minus' 
                            onClick={() => {
                                if(quantityToAdd - 1 < 1 ) { 
                                    setQuantityToAdd(1)
                                } else {
                                    setQuantityToAdd(quantityToAdd - 1 ) ; 
                                }
                            }}
                            >
                                <AiOutlineMinus />
                            </span>
                            <span className='num'>
                                {quantityToAdd}
                            </span>
                            <span 
                            className='plus'
                            onClick={() => {
                                setQuantityToAdd(quantityToAdd + 1 ) ; 
                            }}
                            >
                                <AiOutlinePlus />
                            </span>
                        </p>
                    </div>
                    <div className='buttons'>
                        <button 
                            className='add-to-cart'
                            type='button'
                            onClick={onAddToCartHandler}
                        >
                            Add to Cart
                        </button>
                        <button 
                            className='buy-now'
                            type='button'
                            onClick={handleBuyNow}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
            {products.length === 0 
                ? (
                    <></>
                ) : (
                    <div className='maylike-products-wrapper'>
                        <h2>You may also like</h2>
                        <div className='marquee'>
                            <div
                            className='maylike-products-container track'
                            >
                                {products.map((item) => (
                                    <Product 
                                    key={item._id} 
                                    product={item}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
        slug {
            current
        }
    }`;

    const products = await client.fetch(query);

    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({ params: {slug}}) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const product = await client.fetch(query);

  const productsQuery = `*[_type == "product" && category._ref match "${product.category._ref}" && _id != "${product._id}" ]`;
  const products = await client.fetch(productsQuery);
  
  return {
    props: { products, product }
  }

}

export default ProductDetails