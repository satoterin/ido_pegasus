import React, { useState,useEffect,useContext } from 'react';
import Web3 from 'web3';
import {abi as MarketABI} from '../abi/market.json';
import { abi as usdtABI } from "../abi/usdt.json";
import { MarketContext } from '../context';
import {Modal,Button} from 'react-bootstrap';



const web3 = new Web3(window.ethereum);
const marketAddress = "0xc3eC02F02aBf34a24de69e2003605065333f39dC";
const USDTAdress = "0xaEfb284a02a3E97eE0Aba10ee79a4F9De5551051";

const vipMarketplace = new web3.eth.Contract(MarketABI,marketAddress);

const USDTContract = new web3.eth.Contract(
    usdtABI,
    USDTAdress //usdt  address
  );

const Market =  () => {
    const [list,setList] = useState([]);


    const { address,isConnect, setIsConnect} = useContext(MarketContext);
    

    useEffect(async() =>{
        var result = {};
       await vipMarketplace.methods.getAllVips().call().then((res) => {
            console.log('this is res data',res)
           //
            setList(res);

        })
        .catch((err) => {
          console.log(err);
        });


        console.log('this is result',result)
    },[])

    const handleBuy = async(item) =>{

        console.log(item.price,item.tokenID)
        let len = item.price.length;

       var tmp = item.price;
       var NFT_price =  tmp.substring(0,len-18);
       var tokenId = item.tokenID;
 
        try {
            // USDTContract.methods.approve()
            const usdtBalance = await USDTContract.methods
              .balanceOf(address)
              .call();
            const usdtBalanceWithDec = web3.utils.fromWei(usdtBalance, "ether");
      
            console.log("balance of FT", usdtBalanceWithDec);
      
            if (usdtBalanceWithDec < parseFloat(NFT_price)) {
              alert("USDT balance is not sufficient.");
              return;
            }
      
            const nftCost = web3.utils.toWei(NFT_price, "ether");
      
            const approveResult = await USDTContract.methods
              .approve(marketAddress, nftCost)
              .send({ from: address });
            if (!approveResult) {
              alert("USDT consuming is not approved.");
              return;
            }
      
            console.log("approveResult :", approveResult);
 
      
            const buyNFTResult = await vipMarketplace.methods
              .buyNFT(tokenId)
              .send({ from: address });
            console.log("nftMint Result", buyNFTResult);
      

          } catch (e) {
            console.log(e);
          }
   
    }

    return  (
        <section className="popular-collections-area">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="intro d-flex justify-content-between align-items-end m-0">
                            <div className="intro-content">
                                <span>{"Market Place "}</span>
                                <h3 className="mt-3 mb-0">{'You can buy Vip Accounts.'}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row items">
                    {list && list.map((item, index) => {
                        console.log('this is item',item.marketData)

                        let len = item.marketData.price.length;

                        var tmp = item.marketData.price;
                        var NFT_price =  tmp.substring(0,len-18);
                        return item.marketData.marketStatus ? (
                            <div key={index} className="col-12 col-sm-6 col-lg-3 item">
                                <div className="card no-hover text-center">
                                    <div className="image-over">
                                        <a >
                                            <img className="card-img-top" src={"img/vip-0.gif"} alt="" />
                                        </a>
                                        <a className="seller">
                                            <div className="seller-thumb avatar-lg">
                                                <img className="rounded-circle" src={"img/mark.png"} alt="" />
                                            </div>
                                        </a>
                                    </div>
                                    <div className="card-caption col-12 p-0">
                                        
                                        <div className="card-body mt-4">
                                            <a>
                                                <h5 className="mb-2">{'Vip Account'}</h5>
                                            </a>
                                            <div>
                                                <h5 className="mb-2">{NFT_price} USDT</h5>
                                            </div>
                                            <div className="form-group mt-3">
                                            </div>
                                          <div className="btn btn-bordered-white btn-smaller mt-3" onClick={() =>handleBuy(item.marketData)}><i className="icon-handbag mr-2" />{'Buy'}</div>
                                        </div>
                                       
                                    </div>
                                </div>
                            </div>
                        ) :"";
                    })}
                </div>   
            </div>
            
        </section>
    );
}


export default Market;