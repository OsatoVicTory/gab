import React, { useState } from "react";
import "./styles.css";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { setStatusMessageData } from "../../store/actions";
import { verifyAccount } from "../../services/user";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../component/loading/loading";
import { responseMessage } from "../../utils/others";

const VerifyAccount = () => {

    const navigate = useNavigate();
    const { token } = useParams();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);

    const handleVerify = () => {
        setLoading(true);

        verifyAccount(token).then(res => {
            setStatusMessage({type:'success', text:res.data.message});
            setLoading(false);
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        }).catch(err => {
            setLoading(false);
            responseMessage('error', setStatusMessage, err);
        })
    }

    return (
        <div className="verifyAccount">
            <div className="vA__Top">
                <h1>MY CHAT</h1>
            </div>
            <div className="vA__Content">
                <h1>Verify Your Account</h1>
                <span className="vA__Span">
                    Weldone, All you need to do now is verify your account.
                    Click the button below to do so and get off to a flying start
                </span>
                <div className="vA__Button" onClick={handleVerify}>
                    {!loading ? 
                        <span>Verify Account</span> :
                        <LoadingSpinner width={"20px"} height={"20px"} />
                    } 
                </div>
            </div>
            <span className="vA__Med">
                Copyright @ GAB {new Date().getFullYear()}
            </span>
        </div>
    )
}

export default VerifyAccount;