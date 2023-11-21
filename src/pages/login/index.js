import React, { useState, useEffect } from 'react';
import "./login.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { setStatusMessageData, setUserData } from "../../store/actions";
import { loginUser } from '../../services/user';
import LoadingSpinner from "../../component/loading/loading";
import { BsGoogle } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import logo from "../../images/img1.jpg";
import { SERVER } from '../../config';
import { responseMessage } from '../../utils/others';
import Token from '../../services/token';

const LogInPage = () => {

    const [input, setInput] = useState({});
    const navigate = useNavigate();
    const [position, setPosition] = useState("middle");
    const [loading, setLoading] = useState(false);
    const [sticky, setSticky] = useState(false);
    const dispatch = useDispatch();
    const { statusMessage } = useSelector(state => state.statusMessage);
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const setUser = bindActionCreators(setUserData, dispatch);

    useEffect(() => {
        if(input.email && input.password) setPosition("middle");
    }, [input])

    const handleChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    const handleHover = () => {
        if(window.innerWidth < 1000) return setPosition("middle");
        if(input.email && input.password) setPosition("middle");
        else {
            if(position==="left") setPosition("right");
            else setPosition("left");
        }
    }

    const handleOpen = (provider) => {
        window.open(`${SERVER}/api/v1/${provider}`, "_self");
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(loading) return;
        setLoading(true);
        // if(input.email === 'osato9@gmail.com') setUser({ 
        //     userName: 'Osato', _id: '123456789', phoneNumber: '09039221615', userColor: 'green',
        //     contacts: [
        //         {userName: 'Tory', userId: '987654321', phoneNumber: '09065352839'},
        //         {userName: 'Torhee_', userId: '9876543210', phoneNumber: '09099999909'}
        //     ],
        //     pinned: ['987654321'] 
        // });
        // else setUser({ userName: 'Tory', _id: '987654321', phoneNumber: '09065352839' })
        // setStatusMessage({type:'success',text:'Logged in'});
        // return navigate("/app/chats");

        loginUser(input).then(res => {
            setLoading(false);
            responseMessage('use-server', setStatusMessage, res);
            if(res.data.status === "failed") {
                setTimeout(() => {
                    navigate(`/verify-account/${res.data.token}`)
                }, 1000);
                return;
            }
            
            setUser({...res.data.user, lastSeen: 'now'});
            Token.setToken(res.data.token);
            localStorage.setItem('GAB', res.data.token);
            navigate("/app/chats");
        }).catch(err => {
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
        <div className="login">
            <div className="login__Content">

                <div className={`login__Top ${sticky?"sticky":""}`}>
                    <img src={logo} />
                    <div className="lT__Left">
                        <div onClick={() => navigate("/signup")}>Sign up</div>
                        <a href="https://www.linkedin.com/in/osatohanmen-ogbeide-94377719a" 
                        className="founder">Founder</a>
                    </div>
                </div>
                <div className="login__Main"
                style={{marginTop: sticky?"75px":"30px"}}>
                    <div className="lM__Content">
                        <h1>Login To Your Account</h1>
                        <span className="login__Med"
                        style={{textAlign: "center"}}>
                            Hey, Enter your details to get signed into your account
                        </span>
                        <form onSubmit={handleSubmit}>
                            <input placeholder="Enter Email" required
                            name="email" onChange={handleChange} />
                            <input placeholder="Enter password" required 
                            name="password" type="password" onChange={handleChange} />
                            <span className="login__Small cursor"
                            onClick={() => navigate("/password-recovery")}>
                                Having trouble signing in?
                            </span>
                            <div className={`login__Button ${position}`}
                            onMouseEnter={handleHover} onMouseLeave={() => setPosition(position)}>
                                {/* <Button label={"Sign in"} loading={loading} 
                                handleClick={handleSubmit} /> */}
                                {!loading ?
                                    <input type="submit" value="Sign in" /> :
                                    <LoadingSpinner width={"14px"} height={"14px"} />
                                }
                            </div>
                        </form>
                        <span className="login__Small">
                            --Or Sign in with --
                        </span>
                        <div className="login__Providers">
                            <div onClick={() => handleOpen("google")}>
                                <BsGoogle className="lg-svg" />
                                <span className="login__SmallThick">Google</span>
                            </div>
                            <div onClick={() => handleOpen("linkedin")}>
                                <BsLinkedin className="lg-svg" /> 
                                <span className="login__SmallThick">LinkedIn</span>
                            </div>
                        </div>
                        <div className="requestSignup">
                            <span>Don't have an account ?</span>
                            <span className="login__SmallThick cursor"
                            onClick={() => navigate("/signup")}>
                                Create one now
                            </span>
                        </div>
                    </div>
                </div>
                <span className="login__Small">
                    Copyright @ GAB {new Date().getFullYear()}
                </span>
            </div>
        </div>
    )
}
export default LogInPage;