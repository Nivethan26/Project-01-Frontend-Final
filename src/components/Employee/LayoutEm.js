// Layout.js
import React from 'react';
import HeroSectionEm from './HeroSectionEm';
import NavbarEm from './NavbarEm';
import FooterEm from './FooterEm';

const LayoutEm = ({ children }) => {
  return (
    <>
      <HeroSectionEm />
      <NavbarEm />
      {children}
      <FooterEm />
    </>
  );
};

export default LayoutEm;