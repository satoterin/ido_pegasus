import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { UserContext } from "contexts/Context";
import Web3 from "web3";
import { abi as DepositContractAbi } from "../../abi/deposit.json";
import { abi as PegasusContractAbi } from "../../abi/pegasus.json";
import { Web3Context } from "contexts/Web3Context";
import { Modal, Button } from "react-bootstrap";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";



const token =  sessionStorage.getItem('jwt');

const initialData = {
  pre_heading: "Deposit and WithDraw",
  heading: "You can Deposit and Withdraw about Pegasus Token",
  content: "Customer can exchange between Pegasus token and donation token",
};


const depositContractAddress = '0xcd2F2107b5B550f084821dA89e71b28d930A22AC';
const pegasusContractAddress ='0x181Fd6E17715e2a817B0e7420e3b895beF6Db3B1';
const web3 = new Web3(window.ethereum);

const DepositContract = new web3.eth.Contract(
  DepositContractAbi,
  depositContractAddress
);
const PegasusContract = new web3.eth.Contract(
  PegasusContractAbi,
  pegasusContractAddress
);

const Deposit = () => {
  const [initData, setInitData] = useState({});
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectCharacter] = useState();
  const [donationTokenAmount, setDonationTokenAmount] = useState();
  const { connectWeb3, providerChainId, account } = useContext(Web3Context);
  const [pegasusTokenAmount, setPegasusTokenAmount] = useState();
  const [depositAmount, setDepositAmount] = useState();
  const [withdrawAmount, setWithdrawAmount] = useState();
  const [characterId, setCharacterId] = useState();
  const [show, setShow] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [isAction, setIsAction] = useState(false);

  useEffect(() => {
    setInitData(initialData);
    setCharacters(JSON.parse(sessionStorage.getItem("characters")));
  }, []);

  const handleSelectCharacter = async (id, name) => {
    setShow(true);
    setCharacterId(id);
    setSelectCharacter(name);
  };

  const handleSetDepositTokenAmount = (e) => {
    setDepositAmount(e.target.value);
  };
  const handleSetWithdrawTokenAmount = (e) => {
    setWithdrawAmount(e.target.value);
  };
  const handleClose = () => setShow(false);


  const depositAction = async () => {
    if (account === undefined) {
      alert("Please connect Metamask");
    } else {
      if (parseFloat(pegasusTokenAmount) < parseFloat(depositAmount)) {
        alert(
          `You can not dopsit ${depositAmount}. Current Owned pegasus token amount is ${pegasusTokenAmount}.`
        );
      } else {
        try {
          setIsAction(true);
          const amount = web3.utils.toWei(depositAmount, "ether");
          await PegasusContract.methods
            .approve(depositContractAddress, amount)
            .send({ from: account });
          const depositResult = await DepositContract.methods
            .deposit(amount)
            .send({ from: account });
          axios
            .get("http://localhost:5000/api/deposit/", {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              },
              params: {
                user :characters[0].account_name,
                character_id: characterId,
                amount: parseFloat(donationTokenAmount) + parseFloat(depositAmount),
                despositAmount :  parseFloat(depositAmount),
                itemId: 9511,
                hash: depositResult.transactionHash,
                blockHash: depositResult.blockHash,
              },
            })
            .then(async (res) => {
              if (res.data.msg) {
                alert("failed deposit");
              } else {
                axios
                  .get("http://localhost:5000/api/character/" + characterId,{
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + token
                    },
                    params: {
                      user :characters[0].account_name
                    }
                  })
                  .then((res) => {
                    setDonationTokenAmount(res.data.data[0].count);
                  });
              }
            })
            .catch((err) => {});
          setIsAction(false);
        } catch (err) {}
      }
    }
  };

  const withdrawAction = async () => {
    setIsAction(true);
    try {
        await axios.get("http://localhost:5000/api/withdraw", {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
            params: {
              user :characters[0].account_name,
              address: account,
              amount: withdrawAmount,
              character_id: characterId,
              itemId: 9511,
            },
          });
          axios.get("http://localhost:5000/api/character/" + characterId,{
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            params: {
              user :characters[0].account_name
            }
          })
          .then((res) => {
              setDonationTokenAmount(res.data.data[0].count);
          });
          setIsAction(false);

    }
    catch(err) {
        alert ('failed withdraw.');
        setIsAction(false);
    }

  };

  const handleDeposit = async () => {
    console.log(characters[0].account_name)
    setIsDeposit(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/character/" + characterId,{
          
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            params: {
              user :characters[0].account_name
            }
          
        }
      );
      const token_amount = await PegasusContract.methods
        .balanceOf(account)
        .call();
      const amount = web3.utils.fromWei(token_amount);
      setPegasusTokenAmount(amount);
      setDonationTokenAmount(res.data.data[0].count);
      setIsWithdraw(false);
      setShow(false);
    } catch (err) {
      alert("Check network");
      setIsWithdraw(false);
      setShow(false);
      setIsDeposit(false);
    }
  };

  const handleWidthdraw = async () => {
    setIsWithdraw(true);
    try {
        const res = await axios.get(
          "http://localhost:5000/api/character/" + characterId,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            params: {
              user :characters[0].account_name
            }
          }
        );
        const token_amount = await DepositContract.methods
          .currentBalance().call();
        const amount = web3.utils.fromWei(token_amount);
        setPegasusTokenAmount(amount);
        setDonationTokenAmount(res.data.data[0].count);
        setIsDeposit(false);
        setShow(false);
      } catch (err) {
        alert("Check network");
        setIsWithdraw(false);
        setShow(false);
        setIsDeposit(false);
      }
  };


  //console.log('aaaaaavbvv',characters[0].account_name)

  return (
    <section className="deposit-area">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-7">
            <div className="intro text-center">
              <span>{initData.pre_heading}</span>
              <h3 className="mt-3 mb-0">{initData.heading}</h3>
              <p>{initData.content}</p>
            </div>
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-12 col-md-6 col-lg-6">
            <div className="intro mt-5 mt-lg-0 mb-4 mb-lg-5">
              <div className="intro-content">
                <span>Owned Your Characters</span>
              </div>
            </div>
            <TableContainer component={Paper}>
              <Table
                stickyHeader
                striped
                bordered
                hover
                aria-label="sticky  table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center">no</TableCell>
                    <TableCell align="center"> Character ID</TableCell>
                    <TableCell align="center">Character Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {characters &&
                    characters.map((item, index) => (
                      <TableRow
                        key={item.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        onClick={() =>
                          handleSelectCharacter(item.obj_Id, item.char_name)
                        }
                      >
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">
                          <span className="character_id">{item.obj_Id}</span>
                        </TableCell>
                        <TableCell align="center">
                          <span className="character">{item.char_name}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="col-12 col-md-6 col-lg-6">
            {isDeposit && (
              <div className="col-12">
                <div className="intro mt-5 mt-lg-0 mb-4 mb-lg-5">
                  <div className="intro-content">
                    <span>Deposit Pegasus Token</span>
                  </div>
                </div>
                <div className="item-form card no-hover mb-4">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-6">
                      <label
                        className="form-check-label availableBalance my-3 "
                        htmlFor="Amount"
                      >
                        Character Name:
                        {selectedCharacter && (
                          <span className="mx-2 text-white character">
                            {" "}
                            {selectedCharacter}
                          </span>
                        )}
                      </label>
                    </div>

                    <div className="col-12 col-md-6 col-lg-6">
                      <label
                        className="form-check-label availableBalance my-3"
                        htmlFor="Amount"
                      >
                        Donation Amount:{" "}
                        {donationTokenAmount && (
                          <span className="mx-2 text-white character_id">
                            {donationTokenAmount}
                          </span>
                        )}
                      </label>
                    </div>
                    <div className="col-12 mb-3">
                      <div>
                        Current Pegasus Token Amount :
                        {pegasusTokenAmount && (
                          <span className="mx-2 text-white token">
                            {pegasusTokenAmount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-12 ">
                      <div className="form-group">
                        <input
                          type="number"
                          className="form-control"
                          name="amount"
                          placeholder="100"
                          required="required"
                          onChange={(e) => handleSetDepositTokenAmount(e)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn w-100 mt-3 mt-sm-4"
                        onClick={depositAction}
                        disabled={isAction}
                      >
                        Deposit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isWithdraw && (
              <div className="col-12">
                <div className="intro mt-5 mt-lg-0 mb-4 mb-lg-5">
                  <div className="intro-content">
                    <span>Withdraw Pegasus Token</span>
                  </div>
                </div>
                <div className="item-form card no-hover mb-5">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-6">
                      <label
                        className="form-check-label availableBalance my-3 "
                        htmlFor="Amount"
                      >
                        Character Name:
                        {selectedCharacter && (
                          <span className="mx-2 text-white character">
                            {" "}
                            {selectedCharacter}
                          </span>
                        )}
                      </label>
                    </div>

                    <div className="col-12 col-md-6 col-lg-6">
                      <label
                        className="form-check-label availableBalance my-3"
                        htmlFor="Amount"
                      >
                        Donation Amount:{" "}
                        {donationTokenAmount && (
                          <span className="mx-2 text-white character_id">
                            {donationTokenAmount}
                          </span>
                        )}
                      </label>
                    </div>
                    <div className="col-12 mb-3">
                      <div>
                        Amount You can withdraw :
                        {pegasusTokenAmount && (
                          <span className="mx-2 text-white token">
                            {pegasusTokenAmount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-12 ">
                      <div className="form-group">
                        <input
                          type="number"
                          className="form-control"
                          name="Amount"
                          placeholder="100"
                          required="required"
                          onChange={(e) => handleSetWithdrawTokenAmount(e)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn w-100 mt-3 mt-sm-4"
                        onClick={withdrawAction}
                        disabled={isAction}
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <div className="d-flex-column w-100 align-content-between">
            <div>
              <div className="row d-flex-row align-items-center justify-content-around w-100 mb-3">
                <div>
                  <img src="assets/image/bnb.png" style={{ width: "5vw" }} />
                </div>
                <div>
                  <div
                    className="btn ml-lg-auto btn-bordered-white"
                    onClick={handleDeposit}
                  >
                    Deposit
                  </div>
                </div>
                <div>
                  <img src="assets/image/dollar.png" style={{ width: "5vw" }} />
                </div>
              </div>
            </div>
            <div>
              <div className="row d-flex-row align-items-center justify-content-around w-100">
                <div>
                  <img src="assets/image/dollar.png" style={{ width: "5vw" }} />
                </div>
                <div>
                  <div
                    className="btn ml-lg-auto btn-bordered-white"
                    onClick={handleWidthdraw}
                  >
                    Withdraw
                  </div>
                </div>
                <div>
                  <img src="assets/image/bnb.png" style={{ width: "5vw" }} />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* <ToastContainer /> */}
    </section>
  );
};

export default Deposit;
