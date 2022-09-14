import React, { useEffect, useState } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

import { Layout } from '../components';
import { /*StateContext, */StoreProvider } from '../context/StateContext';
import { Toaster } from 'react-hot-toast'

const clientSideEmotionCache = createCache({ key: 'css' });

import '../styles/globals.css';

function MyApp({ 
  Component, 
  pageProps,
  emotionCache = clientSideEmotionCache,
}) {

  return (
    <CacheProvider value={emotionCache}>
      <StoreProvider>
        <Layout>
          <Toaster />
          <Component {...pageProps} />
        </Layout>
      </StoreProvider>
    </CacheProvider>
  )
  
}

export default MyApp
