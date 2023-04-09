import Document, { Html, Head, Main, NextScript } from 'next/document'

import { s } from '../styles/theme'
import React from 'react'
import { APP_NAME } from '../constants'



export default class MyDocument extends Document {

  render() {
    return (
      <Html lang={'en'}>
        <Head>
          <meta name='application-name' content={APP_NAME} />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='apple-mobile-web-app-status-bar-style' content='default' />
          <meta name='apple-mobile-web-app-title' content={APP_NAME} />
          <meta name='format-detection' content='telephone=no' />
          <meta name='mobile-web-app-capable' content='yes' />
          <meta name='theme-color' content={s['main']} />
          <meta
            name='viewport'
            content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover'
          />
          {/* <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
          <link 
            href='https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400600700&display=swap' 
            rel='stylesheet'
          /> */}

          <link rel='icon' href='/img/favicon.png'/>

          <noscript>
            {/*
              Here we ignore the following recommendation to solve possible SSR problems with noscript browsers/visitors
              https://nextjs.org/docs/messages/no-css-tags
            */}
            {/* eslint-disable-next-line @next/next/no-css-tags */}
            <link href='./styles/aos-noscript.css' rel='stylesheet' />
          </noscript>

          {/* <link rel='manifest' href='/manifest.json' /> */}
        </Head>
        <body>
          {/* Not needed now since we are wrapping our main component with our custom Chakra wrapper */}
          {/* <ColorModeScript initialColorMode={config.initialColorMode} /> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}