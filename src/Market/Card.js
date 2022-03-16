import React, { Component } from "react";
import Web3 from "web3";
import { abi as usdtABI } from "../abi/usdt.json";
import { abi as VipABI } from "../abi/vip.json";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@mui/styles";

const steps = ["Click mint Button", "Send 150 USDT", "Receive NFT "];

const Manual = () => {
  const useStyles = makeStyles(() => ({
    root: {
      "& .css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root.Mui-active": {
        color: "green",
      },
      "& .MuiStepIcon-root": { color: "green" },
      "& .Mui-disabled ": { color: "cyan" },
      "& .css-qivjh0-MuiStepLabel-label.Mui-active": { color: "cyan" },
    },
  }));

  const c = useStyles();

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper alternativeLabel className={c.root} >
        {steps.map((label) => (
          <Step key={label} classes="text-white">
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

const NFTAddress = "0xc20fE2D53252d960aD7A9D3f5892Fe705dec8e53";
const USDTAdress = "0xaEfb284a02a3E97eE0Aba10ee79a4F9De5551051";
const web3 = new Web3(window.ethereum);

const USDTContract = new web3.eth.Contract(
  usdtABI,
  USDTAdress //usdt  address
);

const VipNFT = new web3.eth.Contract(
  VipABI,
  NFTAddress //Cip contract address
);

class AuctionsOne extends Component {
  state = {
    initData: {
      pre_heading: "NFT Mint",
      heading: "NFT Purcharse",
    },
    pecent : 0,
    data: {
      img: "/img/vip-0.gif",
      date: "2021-12-09",
      title: "For Pegasus ",
      seller_thumb: "/img/mark.png",
      seller: "@Vip Account@",
      price: "150 USDT",
      btn: "NFT Mint",
    },

  };


componentDidMount =async()  =>{
    await VipNFT.methods
    .getAllVips()
    .call()
    .then((res) => {
        
        var tmp =  Math.round((res.length / 50) * 100);
        this.setState({pecent: tmp})

    })
    .catch((err) => {
      console.log(err);
    });
}



  handlePurcharse = async () => {
    console.log("this is handle purcharse");
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();

    try {
      // USDTContract.methods.approve()
      const usdtBalance = await USDTContract.methods
        .balanceOf(accounts[0])
        .call();
      const usdtBalanceWithDec = web3.utils.fromWei(usdtBalance, "ether");

      console.log("balance of FT", usdtBalanceWithDec);

      if (usdtBalanceWithDec < 150) {
        alert("USDT balance is not sufficient.");
        return;
      }

      const nftCost = web3.utils.toWei("150", "ether");

      const approveResult = await USDTContract.methods
        .approve(NFTAddress, nftCost)
        .send({ from: accounts[0] });
      if (!approveResult) {
        alert("USDT consuming is not approved.");
        return;
      }

      console.log("approveResult :", approveResult);

      const nftMintResult = await VipNFT.methods
        .mint()
        .send({ from: accounts[0] });
      console.log("nftMint Result", nftMintResult);

      const tokenId = nftMintResult.events.NFTMinted.returnValues.tokenId;

      console.log("tokenId", tokenId);
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    return (
      <section className="live-auctions-area">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* Intro */}
              <div className="intro d-flex justify-content-between align-items-end m-0">
                <div className="intro-content">
                  <span>{this.state.initData.pre_heading}</span>
                  <h3 className="mt-3 mb-0">{this.state.initData.heading}</h3>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-5">
              <div className="p-3 d-flex flex-sm-row flex-column align-items-center">
              <div className="d-flex justify-content-center flex-column align-items-center col-sm-8 col-12 mt-5">
                  <Manual />
                  <div className="mt-4">
                  <CircularProgressWithLabel
                    value={this.state.pecent}
                    thickness={4}
                    size={150}

                  />
                  </div>
                </div>
                <div className="card col-sm-4 col-12 ">
                  <div className="">
                    <img
                      className="card-img-top"
                      src={this.state.data.img}
                      alt=""
                    />
                  </div>
                  <div className="card-caption col-12 p-0">
                    <div className="card-body">
                      <div className="countdown-times mb-3">
                        <div
                          className="countdown d-flex justify-content-center"
                          data-date={this.state.data.date}
                        />
                      </div>
                      <div>
                        <h5 className="mb-0">{this.state.title}</h5>
                      </div>
                      <div className="seller d-flex align-items-center my-3">
                        <img
                          className="avatar-sm rounded-circle"
                          src={this.state.data.seller_thumb}
                          alt=""
                        />
                        <span className="ml-2">{this.state.data.seller}</span>
                      </div>
                      <div className="card-bottom d-flex justify-content-between">
                        <span>{this.state.data.price}</span>
                        <span
                          className="btn ml-lg-auto btn-bordered-white"
                          onClick={this.handlePurcharse}
                        >
                          {this.state.data.btn}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="text-white"
          style={{ fontSize: "40px", fontWeight: 600 }}
        >
         {props.value}%
        </div>
      </Box>
    </Box>
  );
}

export default AuctionsOne;
