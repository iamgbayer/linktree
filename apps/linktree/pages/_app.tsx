import type { AppProps } from 'next/app';
import RootLayout from '../src/app/layout';
import '../src/styles/globals.css';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp; 