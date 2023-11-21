import React, { useState, useEffect } from 'react';
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { setStatusMessageData } from "../../store/actions";
import { debounce, responseMessage } from '../../utils/others';
import { signupUser, goodUserDetails } from '../../services/user';
import LoadingSpinner from "../../component/loading/loading";
import logo from "../../images/img1.jpg";
import { MdKeyboardArrowDown } from 'react-icons/md';
import CountryCodeModal from './codes';

const SignUpPage = () => {

    const [input, setInput] = useState({});
    const navigate = useNavigate();
    const [position, setPosition] = useState("middle");
    const [loading, setLoading] = useState(false);
    const [loadingChange, setLoadingChange] = useState(false);
    const [sticky, setSticky] = useState(false);
    const inputsKeys = ["firstName","lastName","userName","email","phoneNumber","password"];
    const dispatch = useDispatch();
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const [notValid, setNotvalid] = useState({});
    const [countryCode, setCountryCode] = useState({ code: '+234' });
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { value } = e.target;
        const eName = e.target.name;
        if(eName === 'userName' || eName === 'email' || eName === 'phoneNumber') {
            setLoadingChange(eName);
            debounce(
                goodUserDetails, `${eName}=${value}`, 
                setLoadingChange, setStatusMessage, 
                (res) => setNotvalid({ ...notValid, [eName]: res.status!=='success'?eName:false }),
            );
        }
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        const inputsUnfilled = inputsKeys.find(objKey => !input[objKey]);
        if(!inputsUnfilled) setPosition("middle");
    }, [input]);

    const handleHover = () => {
        if(window.innerWidth < 1000) return setPosition("middle");
        if(input.email && input.password) setPosition("middle");
        else {
            if(position==="left") setPosition("right");
            else setPosition("left");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(loading) return;
        const inValid = notValid.email||notValid.userName||notValid.phoneNumber;
        if(inValid) {
            return setStatusMessage({
                type:'error', text:`${inValid} not available. Try another one`
            });
        }
        setLoading(true);
        let phoneNumber = ''+countryCode.code;
        const input_phone = String(input.phoneNumber - 0);
        if(input_phone.length < 10) {
            setLoading(false);
            return setStatusMessage({type:'error',text:'Number cannot be less than 10'});
        }
        let i = 0, j;
        for(j = 0; j < Math.floor(input_phone.length / 3); j += 3) {
            phoneNumber += ` ${input_phone.slice(i, i + 3)}`;
        }
        phoneNumber += ` ${input_phone.slice(i)}`;
        const inputData = { ...input, phoneNumber };

        signupUser(inputData).then(res => {
            setLoading(false);
            responseMessage(res.data.status, setStatusMessage, res);
            if(res.data.status === "failed") return setStatusMessage({
                type: 'error', text: res.data.message
            });

            setTimeout(() => {
                navigate(`/verify-account/${res.data.token}`)
            }, 1000);
        }).catch(err => {
            console.log(err)
            setLoading(false);
            responseMessage('error', setStatusMessage, err);
        })
    }

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 40) setSticky(true);
            else setSticky(false);
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="signup">
            <div className="signup__Content">
                <div className={`signup__Top ${sticky?"sticky":""}`}>
                    <img src={logo} />
                    <div className="lT__Left">
                        <div onClick={() => navigate("/login")}>Sign in</div>
                        <a href="https://www.linkedin.com/in/osatohanmen-ogbeide-94377719a" 
                        className="founder">Founder</a>
                    </div>
                </div>
                <div className="signup__Main"
                style={{marginTop: sticky?"75px":"15px"}}>
                    <div className="sM__Content">
                        <h1>Create Your Account</h1>
                        <span className="signup__Med"
                        style={{textAlign: "center"}}>
                            Hey, Enter your details to set up your account
                        </span>
                        <form onSubmit={handleSubmit}>
                            <input placeholder="Enter First Name" required
                            name="firstName" onChange={handleChange} />
                            <input placeholder="Enter Last Name" required
                            name="lastName" onChange={handleChange} />
                            <div className='signup-div'>
                                <input placeholder="Enter User Name" required
                                name="userName" onChange={handleChange} />
                                {loadingChange === 'userName' && <LoadingSpinner 
                                width={'12px'} height={'12px'} />}
                            </div>
                            <div className='signup-div'>
                                <input placeholder="Enter Email" required type="email"
                                name="email" onChange={handleChange} />
                                {loadingChange === 'email' && <LoadingSpinner 
                                width={'12px'} height={'12px'} />}
                            </div>
                            <input placeholder="Enter password" required 
                            name="password" type="password" onChange={handleChange} />

                            <div className='signup-phone'>
                                <div className='countryCode' 
                                onClick={() => setShowModal(true)}>
                                    <span className='country-code'>
                                        {countryCode?.code || '+234'}
                                    </span>
                                    <MdKeyboardArrowDown className='country-code-icon' />
                                </div>
                                <input placeholder="Enter Phone Number" required
                                name="phoneNumber" type="number" onChange={handleChange} />
                            </div>

                            <div className={`signup__Button ${position}`}
                            onMouseEnter={handleHover} onMouseLeave={() => setPosition(position)}>
                                {!loading ?
                                    <input type="submit" value="Sign in" /> :
                                    <LoadingSpinner width={"14px"} height={"14px"} />
                                }
                            </div>
                        </form>
                        <div className="requestSignup">
                            <span>Already have an account</span>
                            <span className="signup__SmallThick cursor"
                            onClick={() => navigate("/login")}>
                                Log in
                            </span>
                        </div>
                    </div>
                </div>
                <span className="signup__Small">
                    Copyright @ GAB {new Date().getFullYear()}
                </span>
            </div>

            <span>{showModal && <CountryCodeModal 
            setter={setCountryCode} closeModal={() => setShowModal(false)} />}</span>

        </div>
    )
}
export default SignUpPage;