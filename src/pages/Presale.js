import React, { useContext, useEffect, useState } from "react";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styled, { keyframes } from "styled-components";
import Progressbar from "../components/Progressbar";
import Web3 from "web3";
import { Web3Context } from "contexts/Web3Context";
import { useSwitchChain } from "hooks/useSwitchChain";
import { abi as PresaleAbi } from "../abi/presale.json";
import { useHistory } from "react-router-dom";
import { abi as UsdtAbi } from "../abi/usdt.json";

const presaleContractAddress = "0x571D594A48b6D38C668CD7EB264A0b58Ee5a26C2";
const usdtContractAddress = "0x55d398326f99059fF775485246999027B3197955";

const Container = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-image: url("assets/images/background.png");
  background-size: 100%;
  background-position: revert;
  background-repeat: no-repeat;
  position: relative;
  @media (max-width: 768px) {
    background-image: url("assets/images/sm-bg.png");
  }
`;
const PresaleContainer = styled.div`
  width: 87.4vw;
  background: linear-gradient(
    to bottom right,
    rgb(24 1 1 / 80%),
    rgba(255, 0, 0, 0)
  );
  border-radius: 8px;
  padding: 1% 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    width: 92vw;
  }
`;
const ConnectButton = styled.div`
  position: absolute;
  padding: 12px 29px;
  right: 3%;
  top: 3%;
  background: #000000;
  font-size: 18px;
  border-radius: 6px;
  z-index: 1;
  cursor: pointer;
  &:hover {
    background: #3e0a0a;
  }
  @media (max-width: 768px) {
    padding: 6.5px 15px;
    font-size: 16px;
  }
`;
const Mark = styled.img`
  width: 6%;
  @media (max-width: 768px) {
    width: 92px;
  }
`;
const PriceText = styled.div`
  margin-top: 1%;
  font-size: 30px;
  @media (max-width: 768px) {
    font-size: 25px;
  }
`;
const Text = styled.div`
  margin-top: 1%;
  margin-bottom: ${(props) => props.marginBottom}px;
  font-size: 18px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;
const BoldText = styled.div`
  margin-top: 1%;
  font-size: 18px;
  font-weight: 700;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;
const PresaleTime = styled.div`
  margin-top: 1%;
  font-size: 30px;
`;
const StateText = styled.div`
  font-size: 20px;
  margin-top: 12px;
  @media (max-width: 768px) {
    margin-top: 5px;
    font-size: 7px;
  }
`;
const CenterContainer = styled.div`
  margin-top: 1%;
  background: linear-gradient(
    to bottom right,
    rgba(24 1 1 / 80%),
    rgba(41 10 12)
  );
  height: 35vh;
  width: 60vw;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    width: 88vw;
  }
`;
const ProcessStatusText = styled.div`
  margin-top: ${(props) => props.marginTop}%;
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const InputArea = styled.div`
  margin-top: ${(props) => props.marginTop}%;
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const TokenInput = styled.input`
  width: 50%;
  height: 30px;
  font-family: "Roboto";
  font-size: 20px;
  @media (max-width: 768px) {
    margin-top: 10px;
    width: 100%;
  }
`;
const BottomContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const LeftContent = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const RightContent = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const RowContent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;
const ButtonArea = styled.div`
  display: flex;
  width: 60%;
  flex-direction: row;
  justify-content: space-between;
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const BuyButton = styled.div`
  padding: 12px 29px;
  background: #670000;
  font-size: 18px;
  border-radius: 6px;
  z-index: 1;
  text-align: center;
  cursor: pointer;
  &:hover {
    background: #3e0a0a;
  }
  @media (max-width: 768px) {
    padding: 10px 10px;
    font-size: 12px;
  }
`;

const web3 = new Web3(window.ethereum);

const PreSale = () => {
  const { connectWeb3, providerChainId, account } = useContext(Web3Context);
  const switchChain = useSwitchChain();
  const chainId = Number(process.env.REACT_APP_CHAIN_ID);
  const [percentRate, setPercentRate] = useState(100);
  const [paidAmount, setPaidAmount] = useState(0);
  const history = useHistory();
  const [referralLink, setReferralLink] = useState();
  const [remainTime, setRemainTime] = useState();
  const [endTime, setEndTime] = useState(0);
  const [amount, setAmount] = useState(0);
  const [displayedBNB, setDisplayBNB] = useState(0);
  const [displayedUSDT, setDisplayUSDT] = useState(0);
  
  const [show, setShow] = useState(false);
       
  const handleModalShow = () => setShow(true);
  const handleModalClose = () => setShow(false);

  useEffect(() => {
    const path = history.location.pathname.slice(1);
    setReferralLink(path);
    if (!window.ethereum) alert("Please install MetaMask wallet!");
  }, []);

  useEffect(() => {
    if (account != null && providerChainId != chainId) {
      switchChain(chainId);
    }
  }, [providerChainId]);

  const PresaleContract = new web3.eth.Contract(
    PresaleAbi,
    presaleContractAddress
  );

  const usdtContract = new web3.eth.Contract(UsdtAbi, usdtContractAddress);

  useEffect(async () => {
    if (window.ethereum) {
      var tAmount = await PresaleContract.methods.totalSaleAmount().call();
      var presaleEndTime = await PresaleContract.methods
        .presaleEndTime()
        .call();
      setEndTime(new Date(presaleEndTime * 1000));
      var amount = parseFloat(web3.utils.fromWei(tAmount));
      let rate = (50000 - amount) / 500;
      setPercentRate(rate);
    }
  }, []);

  const handleInput = (e) => {
    const tokenAmount = parseFloat(e.target.value);
    if(tokenAmount > 0) {
      setAmount(tokenAmount);
      setDisplayUSDT(tokenAmount / 2.5);
      setDisplayBNB(tokenAmount / 1000);
      const bnb = (tokenAmount / 1000).toString();
      setPaidAmount(web3.utils.toWei(bnb, "ether"));
    }
    else {
      alert('please input token amount')
    }
  };
  const handleSecondClaim = async () => {
    try {
      const result = await PresaleContract.methods.claimTokenThird().call();

      alert("successfully");
    } catch (err) {
      alert("You can't receive pegasus token yet");
    }
  };
  const handleThirdClaim = async () => {
    try {
      const result = await PresaleContract.methods.claimTokenThird().call();

      alert("successfully");
    } catch (err) {
      alert("You can't receive pegasus token yet");
    }
  };

  const makeDigits = (timeObject) => {
    for (let key in timeObject) {
      if (parseInt(timeObject[key]) <= 9) {
        timeObject[key] = "0" + timeObject[key];
      } else if (parseInt(timeObject[key]) == 0) {
        timeObject[key] = "00";
      }
    }

    return timeObject;
  };

  const calculateTimeLeft = () => {
    let timeLeft = {};
    let difference = endTime - new Date();

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(makeDigits(calculateTimeLeft()));
  const timerComponents = [];
  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span style={{ fontSize: 25 }}>
        {timeLeft[interval]}
        {interval !== "seconds" ? ":" : ""}
      </span>
    );
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(makeDigits(calculateTimeLeft()));
    }, 1000);
    return () => clearTimeout(timer);
  });

  const handleBuyToken = async () => {
    handleModalShow();
    console.log("pad", paidAmount);
    if (paidAmount === 0) {
      alert("please input token amount");
      
    }
    const actionResult = null;
    if (referralLink.length === 0) {
      try {
        actionResult = await PresaleContract.methods
          .deposit("0x086c51dA2c1786A72BB2255B586d5a9FF187fB5F")
          .send({
            value: paidAmount,
            from: account,
          });
          
          
      } catch (err) {
        console.log(err);
      }
    } else if (referralLink.length == 42) {
      console.log("this is bnb amount", paidAmount);
      try {
        actionResult = await PresaleContract.methods
          .deposit(referralLink)
          .send({
            value: paidAmount,
            from: account,
          });
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleBuyTokenByToken = async () => {
    console.log(amount);
    if (amount < 300) {
      alert("Please input token amount.");
    } else {
      console.log("amount", displayedUSDT);

      const usdtAmount = web3.utils.toWei(displayedUSDT.toString(), "ether");
      console.log("usdtAmount", usdtAmount);

      try {
        const approve_result = await usdtContract.methods
          .approve(presaleContractAddress, usdtAmount)
          .send({from:account});
          if (referralLink.length === 0) {
            const buyTokenWithUSDT =  await PresaleContract.methods.buyTokenWithUsdt(usdtAmount,'0x086c51dA2c1786A72BB2255B586d5a9FF187fB5F').send({from:account})
          }
          else {
            const buyTokenWithUSDT =  await PresaleContract.methods.buyTokenWithUsdt(usdtAmount,referralLink).send({from:account});
          }
          handleModalShow();
        console.log(approve_result);
      } catch (err) {
        console.log(err)
      }
    }
  };

  return (
    <Container>
      <ConnectButton onClick={connectWeb3}>
        {account ? "Connected Wallet" : "Connect Wallet"}
      </ConnectButton>
      <PresaleContainer>
        <Mark src={"assets/images/mark.png"} />
        <PriceText>Price per Token = 0.4 $</PriceText>
        <Text>PRESALE TIMER</Text>
        {/* <PresaleTime> {'24'} : {'00'} : {'00'}</PresaleTime> */}
        <div style={{ display: "flex", direction: "row" }}>
          {timerComponents.length ? (
            timerComponents
          ) : (
            <span>Presale hasn't started yet.</span>
          )}
        </div>
        <CenterContainer>
          <Text marginBottom={10}>HURRY UP {percentRate}% Token LIVE</Text>
          <Progressbar progress={percentRate} height={15} />
          <ProcessStatusText>
            <StateText>SOFT</StateText>
            <StateText>DYNAMIC</StateText>
            <StateText>HARD</StateText>
          </ProcessStatusText>
          <InputArea marginTop={1}>
            <Text>How many tokens You want to Buy?</Text>
            <TokenInput
              type="number"
              onChange={(e) => handleInput(e)}
              placeholder={1000}
            />
          </InputArea>
          <Text>
            Total : {displayedBNB} BNB &nbsp; USDT : {displayedUSDT} USDT
          </Text>
        </CenterContainer>

        <BottomContent>
          <LeftContent>
            <BoldText>Projected mannual token profit:</BoldText>
            <RowContent>
              <Text>First Time:</Text>
              <Text>30%</Text>
            </RowContent>
            <RowContent>
              <Text>Second Time:</Text>
              <Text>30%</Text>
            </RowContent>
            <RowContent>
              <Text>Third Time:</Text>
              <Text>40%</Text>
            </RowContent>
          </LeftContent>
          <RightContent>
            <BoldText>Coditions</BoldText>
            <RowContent>
              <Text>Min Buy :</Text>
              <Text>0.1 BNB</Text>
            </RowContent>
            <RowContent>
              <Text>Max Buy:</Text>
              <Text>3 BNB</Text>
            </RowContent>
          </RightContent>
        </BottomContent>
        <ButtonArea>
          <BuyButton onClick={handleBuyToken}>Buy Token by BNB</BuyButton>
          <BuyButton onClick={handleBuyTokenByToken}>
            Buy Token By USDT
          </BuyButton>
        </ButtonArea>
      </PresaleContainer>

      <Modal size="sm" show={show} onHide={handleModalClose} animation="true" centered>
        <Modal.Header closeButton>
          <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>Purchased successfully.</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>      

    </Container>
  );
};

export default PreSale;
