import React, { useEffect, useState, useContext } from "react";
import Web3 from "web3";
import { MarketContext } from "../../context";
import { Link } from "react-router-dom";
import { Web3Context } from "contexts/Web3Context";
import {useSwitchChain} from "hooks/useSwitchChain"

const web3 = new Web3(window.ethereum);
const Header = () => {

  const {connectWeb3, providerChainId, account} = useContext(Web3Context);
  const switchChain = useSwitchChain();
  const chainId = Number(process.env.REACT_APP_CHAIN_ID);

  console.log('web3', providerChainId, account);

  useEffect(() =>{
    if (account != null && providerChainId != chainId) {
    
       console.log('switch chain');
      switchChain(chainId); // if the network is not main change it
    }
  },[providerChainId])

  const {
    setAddress,
    setIsConnect,
    connectionButtonName,
    setConnectionButtonName,
  } = useContext(MarketContext);

  console.log("connectionButtonName", connectionButtonName);

  const ConnectWallet = async () => {
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    var tmpAddress = accounts[0].slice(0, 7) + "..." + accounts[0].slice(-4);
    setConnectionButtonName(tmpAddress);
    setAddress(account);
    setIsConnect(true);
  };

  return (
    <header id="header">
      {/* Navbar */}
      <nav
        data-aos="zoom-out"
        data-aos-delay={800}
        className="navbar navbar-expand"
      >
        <div className="container header">
          {/* Navbar Brand*/}
          <Link to="/">
            <div className="navbar-brand">
              <img
                className="navbar-brand-sticky"
                src="img/logo.png"
                alt="sticky brand-logo"
              />
            </div>
          </Link>
          <div className="ml-auto" />
          {/* Navbar */}
          <ul className="navbar-nav items mx-auto">
            <li className="nav-item dropdown">
                
              <Link to="/">
                <div className="nav-link">Home</div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/activity">
                <div className="nav-link">Activity</div>
              </Link>
            </li>
            <li className="nav-item ">
                <Link to="/market">
              <div className="nav-link">
                Market Place
              </div>
              </Link>
            </li>
            <li className="nav-item">
            <Link to="/characters">
              <div className="nav-link">
                Deposite
              </div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/account">
                <div className="nav-link">My Account</div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login">
                <div className="nav-link">Login</div>
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav toggle">
            <li className="nav-item">
              <div
                className="nav-link"
                data-toggle="modal"
                data-target="#menu"
              >
                <i className="fas fa-bars toggle-icon m-0" />
              </div>
            </li>
          </ul>
          {/* Navbar Action Button */}
          <ul className="navbar-nav action" onClick={connectWeb3}>
            <li className="nav-item ml-3">
              <div className="btn ml-lg-auto btn-bordered-white">
                <i className="icon-wallet mr-md-2" />
                {connectionButtonName}
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
