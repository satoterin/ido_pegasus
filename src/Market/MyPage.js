import React, { useState,useEffect,useContext } from 'react';
import Web3 from 'web3';
import {abi as VipABI} from '../abi/vip.json'
import {abi as MarketABI} from '../abi/market.json'
import { MarketContext } from '../context';
import {Modal,Button} from 'react-bootstrap'


const web3 = new Web3(window.ethereum);
const NFTAddress = "0xc20fE2D53252d960aD7A9D3f5892Fe705dec8e53";
const marketAddress = "0xc3eC02F02aBf34a24de69e2003605065333f39dC";

const VipNFT = new web3.eth.Contract(VipABI,NFTAddress);


const vipMarketplace = new web3.eth.Contract(MarketABI,marketAddress);

const MyPage =  () => {
    const [list,setList] = useState([]);
    const [show, setShow] = useState(false);
    const [tokenId,setTokenId] = useState();
    const [price,setPrice] = useState();

    const { address,isConnect, setIsConnect} = useContext(MarketContext);
    

    useEffect(async() =>{
        await VipNFT.methods
        .getAllVips()
        .call()
        .then((res) => {
            console.log('this is res',res)
            setList(res);

        })
        .catch((err) => {
          console.log(err);
        });
    },[])


    const OpenTrade =(nftId) =>{
        setTokenId(nftId)
        setShow(true);
    }
    const handleChange =(e) =>{
        setPrice(e.target.value)
    }
    const handleSetPrice = async() =>{


        console.log('this is price ',price,address)
        await VipNFT.methods.approve(marketAddress, tokenId + '').send({from : address});

        const nftCost = web3.utils.toWei(price, "ether");
        const txReceipt2 = await vipMarketplace.methods.openTrade(tokenId, nftCost).send({ from: address});
        
        console.log("=== response of openTrade ===", txReceipt2);
    }

    return  (
        <section className="popular-collections-area">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="intro d-flex justify-content-between align-items-end m-0">
                            <div className="intro-content">
                                <span>{"Pegasus Vip Account "}</span>
                                <h3 className="mt-3 mb-0">{'Purchased My Vip Accounts'}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row items">
                    {list && list.map((item, index) => {
                        return item.owner === address && (
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
                                            <div className="form-group mt-3">
                                             {show ? <input type="number" className="form-control" name="price" placeholder="300 USDT" style={{background:'transparent'}} onChange ={(e) =>handleChange(e)}/>:""}
                                            </div>
                                           { !show ? <a className="btn btn-bordered-white btn-smaller mt-3" onClick={()=>OpenTrade(index)}><i className="icon-handbag mr-2" />{'Sell NFT'}</a>:""}
                                           { show ?  <a className="btn btn-bordered-white btn-smaller mt-3" onClick={handleSetPrice}><i className="icon-handbag mr-2" />{'Confirm'}</a> : ""}
                                        </div>

                                       
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>   
            </div>
            
        </section>
    );
}


export default MyPage;