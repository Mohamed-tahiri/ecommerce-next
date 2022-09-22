/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Product } from '../../components';
import { client } from '../../lib/client';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

const index = () => {
    const ITEMS_PER_PAGE = 16;
    const [pageIndex, setPageIndex] = useState(0);
    const [pagination, setPagination] = useState(false);
    const [products, setProducts] = useState([]);
    const [productsOn, setProductsOn] = useState(false);
    const [count, setCount] = useState(0);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('all');
    const [brand, setBrand] = useState('all');
    const [brands, setBrands] = useState([]);
    const [price, setPrice] = useState('all');
    const [sort, setSort] = useState('default');




    useEffect(() => {

      const fetchCategories = async () => {
        try {
          const queryCategory = '*[_type == "category"] ';
          const data = await client.fetch(queryCategory);
          
          setCategories(data);
        } catch (err) {
          toast.error(err.message);
        }
      };
      fetchCategories();

      const fetchBrands = async () => {
        try {
          const queryBrand = '*[_type == "brand"] ';
          const data = await client.fetch(queryBrand);
          
          setBrands(data);
        } catch (err) {
          toast.error(err.message);
        }
      };

      fetchBrands();
      
      const fetchData = async () => {
        try {
          let queryProducts = '*[_type == "product"';
          let queryCountProducts = 'count(*[_type == "product"'
          if (category !== 'all') {
            queryProducts += ` && category._ref match "${category}" `;
            queryCountProducts += ` && category._ref match "${category}" `;
          }

          if (brand !== 'all') {
            queryProducts += ` && brand._ref match "${brand}" `;
            queryCountProducts += ` && brand._ref match "${brand}" `;
          }
          
          if (price !== 'all') {
            const minPrice = Number(price.split('-')[0]);
            const maxPrice = Number(price.split('-')[1]);
            queryProducts += ` && price >= ${minPrice} && price <= ${maxPrice}`;
            queryCountProducts += ` && price >= ${minPrice} && price <= ${maxPrice}`;
          }
          
          let order = '';
          if (sort !== 'default') {
            if (sort === 'lowest') order = '| order(price asc)';
            if (sort === 'highest') order = '| order(price desc)';
          }

          queryProducts += `] ${order}`;
          queryCountProducts += `] ${order}`;
          
          queryProducts += ` [(${pageIndex} * ${ITEMS_PER_PAGE})...(${pageIndex} + 1) * ${ITEMS_PER_PAGE}]`
          queryCountProducts += `)`;
          
          const products = await client.fetch(queryProducts);
          const countProducts = await client.fetch(queryCountProducts);
          setProducts(products);

          if((countProducts % ITEMS_PER_PAGE) !== 0 ) {
            setCount(parseInt(countProducts/ITEMS_PER_PAGE) + 1 );
          } else {
            setCount(parseInt(countProducts/ITEMS_PER_PAGE));
          }
        } catch (err) {
          toast.error(err);
        }
      };
      fetchData();

      if(count>1){
        setPagination(true);
      }

      if(products.length > 0) {
        setProductsOn(true);
      }else {
        setProductsOn(false);
      }

    }, [category, products, price, sort, brand, pageIndex, count]);

    const categoryHandler = (e) => {
      setCategory(e.target.value);
    }

    const brandHandler = (e) => {
      setBrand(e.target.value);
    }

    const priceHandler = (e) => {
      setPrice(e.target.value);
    }

    const sortHandler = (e) => {
      setSort(e.target.value);
    }

    const paginateItem = (item) => {
      setPageIndex(item.page - 2);
    }

    return <div>  
      <div className='products-heading'>
        <h2 className='products-title'>Products</h2>
        <p className='products-title'>Your Welcome!</p>
      </div>


      <div className='product-filter'>
        
        <div className='filter'>
          <p>Categories</p>
          <select value={category} onChange={categoryHandler}>
            <option value="all">All</option>
            {categories &&
              categories.map((category) => (
                <option key={category._id} value={category._id} >
                  {
                    category.name
                  }
                </option>
              ))
            }
          </select>
        </div>
        
        <div className='filter'>
          <p>Brands</p>
          <select value={brand} onChange={brandHandler}>
            <option value="all">All</option>
            {brands &&
              brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))
            }  
          </select>
        </div>

        <div className='filter'>
          <p>Prices</p>
          <select value={price} onChange={priceHandler}>
            <option value='all'>All</option>
            {prices.map((price) => (
              <option key={price.value} value={price.value}>
                {price.name}
              </option>
            ))}
          </select>
        </div>

        <div className='filter'>
          <p>Sort by</p>
          <select value={sort} onChange={sortHandler}>
            <option value="default">Default</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
          </select>
        </div>

      </div>
      <div className='products-container'>
        { productsOn ?
            (
              products.map((product, index ) => 
                <Product key={index} product={product} />
              )
            )
            :
            (
              <h2>Products not found !</h2>
            )

        }
      </div>
      {pagination &&
        <Pagination
          className='pagination'
          count={count}
          renderItem={(item) => (
            <PaginationItem
              onChange={paginateItem(item)}
              {...item}
            />
          )}
        />
      }
    </div>
    
}

export default index
