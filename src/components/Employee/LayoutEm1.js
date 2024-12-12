// Layout.js
import React from 'react';

import NavbarEm from './NavbarEm';
import FooterEm from './FooterEm';

const LayoutEm1 = ({ children }) => {
  return (
    <>
      
      <NavbarEm />
      {children}
      <FooterEm />
    </>
  );
};

export default LayoutEm1;