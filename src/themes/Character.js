import React, { useState, useEffect } from "react";
import { UserContext } from "contexts/Context";
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ModalMenu from '../components/Modal/ModalMenu';
import ModalSearch from '../components/Modal/ModalSearch';
import Scrollup  from '../components/Scrollup/Scrollup';
import Deposit from "components/Deposite/Deposit";

const Character = () => {
  return (
    <div className="main">
      <Header />
      <Deposit />
      <Footer />
      <ModalSearch />
      <ModalMenu />
      <Scrollup />
    </div>
  );
};
export default Character;
