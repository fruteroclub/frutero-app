import React from 'react'

import Navbar from './navbar'
import Footer from './footer'

const NAVBAR_HEIGHT = '96px' // 6rem / h-24 tw

export interface NavbarProps {
  title?: string
  navTitle?: string
}

const PageWrapper: React.FC<NavbarProps & { children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Navbar />
      <main
        className={`h-[calc(100vh-${NAVBAR_HEIGHT})] top-[96px] flex w-full flex-col items-center overflow-x-hidden`}
      >
        {children}
      </main>
      <Footer />
    </>
  )
}

export default PageWrapper
