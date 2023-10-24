import React, { useState } from 'react'
import { TextField } from '@mui/material'
import styled from "@emotion/styled";
import style from './style.module.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const WhiteBorderTextField = styled(TextField)`
'& label.Mui-focused': {
    color: red,
  },
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #dfdfdf;
    }
  },
`;

const MyButton = styled.button`
  background: #000;
  color: #fff;
  border-radius: 12px;
  width: 100%;
  padding: 14px 0;
  border: none;
  &:hover{
    opacity: 0.9;
  }
`;

const MyButtonWithIcon = ({icon, children}) => {
    return (
        <button className={style.myIconButton}>
            <span style={{fontSize: "30px"}}>{icon}</span>
            <span><b>{children}</b></span>
            <span><i className="fa-solid fa-angle-right" style={{color: 'grey'}}></i></span>
        </button>
    )
}

const SignInPage = () => {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    const signInFunc = () => {
        const emailInput = document.getElementById('emailInput')
        const passwordInput = document.getElementById('passwordInput')
        if (!email && !password) {
            toast.dark('Enter user name, phone number or email!');
            emailInput.focus();
        }
        else if (email && !password) {
            toast.dark('Enter password!');
            passwordInput.focus();
        }
        else if (!email && password) {
            toast.dark('Enter email!');
            emailInput.focus();
        }

        else {
            console.log('giriş')
        }
    }

    return (
        <div className='m-0 p-0' style={{ width: "100%", overflow: "hidden" }}>
            <img src="https://static.cdninstagram.com/rsrc.php/yb/r/iv-ercy-2_j.webp" alt="" style={{ width: "115%", transform: "translate(-100px)", position: "fixed", top: "0", zIndex: "-1" }} />
            <div className='d-flex justify-content-center align-items-end w-100' style={{ height: "80vh" }}>
                <div style={{ padding: "10px", width: "400px", textAlign: "center" }}>
                    <small className='d-block mb-3' style={{fontSize: "16px", textAlign: "center"}}><b>Sign in with Instagram account</b></small>
                    <WhiteBorderTextField id='emailInput' variant='outlined' InputProps={{ style: { borderRadius: "12px", background: "#efefef" } }} style={{ display: "block", marginBottom: "10px", borderColor: "red" }} fullWidth onChange={(e) => {
                        setEmail(e.target.value);
                    }} placeholder='User name, number or email' />
                    <WhiteBorderTextField id='passwordInput' variant='outlined' type='password' InputProps={{ style: { borderRadius: "12px", background: "#efefef" } }} style={{ display: "block", marginBottom: "10px" }} fullWidth onChange={(e) => {
                        setPassword(e.target.value);
                    }} placeholder='Password' />
                    <MyButton style={{ cursor: email && password ? "pointer" : "not-allowed", color: email && password ? '#fff' : 'grey' }} onClick={signInFunc}>Sign up</MyButton>
                    <Link to={'/reset-password'} style={{color: "grey", textDecoration: "none", fontSize: "14px", display: "inline-block", margin: "10px 0"}}>Forgot password?</Link>
                    <div style={{position: "relative", width: "100%", height: "30px"}}>
                        <hr />
                        <span style={{position: "absolute", top: "-12.5px", left: "50%", transform: "translateX(-50%)", background: "#fff", display: "inline-block", padding: "0 10px", color: "#9f9f9f"}}>or</span>
                    </div>
                    <MyButtonWithIcon icon={<i className="fa-brands fa-instagram"></i>}>Continue with Instagram</MyButtonWithIcon>
                </div>
            </div>
        </div>
    )
}

export default SignInPage