import React, { Component, useContext,useEffect,useState} from "react";
import axios from "axios";
import { UserContext } from "contexts/Context";
import { useHistory } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

function Login() {
  const initialData = {
    pre_heading: "Login",
    heading: "Login to your Account",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum obcaecati dignissimos quae quo ad iste ipsum officiis deleniti asperiores sit.",
  };

  const socialData = [
    {
      id: "1",
      link: "facebook",
      icon: "fab fa-facebook-f",
    },
    {
      id: "2",
      link: "twitter",
      icon: "fab fa-twitter",
    },
    {
      id: "3",
      link: "google-plus",
      icon: "fab fa-google-plus-g",
    },
  ];

  const [initData, setInitData] = useState({});
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});

  const {characters,setCharacters}  = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    setInitData(initialData);
    setData(socialData);
    
  }, []);

  const handleLogin = () => {
    axios
      .get("http://localhost:5000/api/user/sign", { params: userData })
      .then((res) => {
        console.log("this is responsive data", res.data);
        setCharacters(res.data.data);
        sessionStorage.setItem('characters',JSON.stringify(res.data.data));
        sessionStorage.setItem('jwt',res.data.token);

        // toast.error("Login failed", {
        //   autoClose: 2000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: false,
        //   });


        history.push('/characters')

      })
      .catch((err) => {});
  };

  const handleChange = (e) => {
    Object.assign(userData, { [e.target.name]: e.target.value });
  };

  return (
    <section className="author-area">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-7">
            {/* Intro */}
            <div className="intro text-center">
              <span>{initData.pre_heading}</span>
              <h3 className="mt-3 mb-0">{initData.heading}</h3>
              <p>{initData.content}</p>
            </div>
            {/* Item Form */}
            <div className="item-form card no-hover">
              <div className="row">
                <div className="col-12">
                  <div className="form-group mt-3">
                    <input
                      type="email"
                      className="form-control"
                      name="name"
                      placeholder="Enter your name"
                      required="required"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group mt-3">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Enter your Password"
                      required="required"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group mt-3">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio1"
                        defaultValue="option1"
                        defaultChecked
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio1"
                      >
                        Remember Me
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <button
                    className="btn w-100 mt-3 mt-sm-4"
                    onClick={() => handleLogin()}
                  >
                    Sign In
                  </button>
                </div>
                <div className="col-12">
                  <hr />
                  <div className="other-option">
                    <span className="d-block text-center mb-4">Or</span>
                    {/* Social Icons */}
                    <div className="social-icons d-flex justify-content-center">
                      {data.map((item, idx) => {
                        return (
                          <a key={`lsd_${idx}`} className={item.link} href="#">
                            <i className={item.icon} />
                            <i className={item.icon} />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </section>
  );
}

export default Login;
