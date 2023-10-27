import React, { useState } from 'react'
import { TextField } from '@mui/material'
import styled from "@emotion/styled";
import style from './style.module.css';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect, updateProfile } from 'firebase/auth';
import database, { auth } from '../../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

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

const MyButtonWithIcon = ({ icon, children }) => {
    return (
        <button className={style.myIconButton} onClick={(e) => {
            const provider = new GoogleAuthProvider();
            signInWithRedirect(auth, provider);
        }}>
            <span style={{ fontSize: "30px" }}>{icon}</span>
            <span><b>{children}</b></span>
            <span><i className="fa-solid fa-angle-right" style={{ color: 'grey' }}></i></span>
        </button>
    )
}

const SignInPage = () => {
    let [name, setName] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let navigate = useNavigate();
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
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredentials) => {
                    toast.dark(userCredentials.user.displayName, 'welcome back');
                    navigate('/');
                })
                .catch((err) => {
                    const errorCode = err.code;
                    const message = errorCode.replace('/', ' error: ').split('-').join(' ');
                    toast.dark(message);
                })
        }
    }

    const signUpFunc = () => {
        const nameInput = document.getElementById('nameInput')
        const emailInput = document.getElementById('emailInput')
        const passwordInput = document.getElementById('passwordInput')
        if (!name) {
            toast.dark('Enter name!');
            nameInput.focus();
        }
        else {
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
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredentials) => {
                        toast.dark(userCredentials.user.displayName, 'welcome');
                        setDoc(doc(database, `users/${userCredentials.user.uid}`), {
                            displayName: name,
                            email: email,
                            uid: userCredentials.user.uid,
                            photoURL: userCredentials.user.photoURL
                        })
                    })
                    .catch((err) => {
                        const errorCode = err.code;
                        const message = errorCode.replace('/', ' error: ').split('-').join(' ');
                        toast.dark(message);
                    })
            }
        }
    }

    return (
        <div className='m-0 p-0' style={{ width: "100%", overflow: "hidden" }}>
            <img className={style.imageContainer} src="https://static.cdninstagram.com/rsrc.php/yb/r/iv-ercy-2_j.webp" alt="" />
            <div className='d-flex justify-content-center align-items-end w-100' style={{ height: "90vh" }}>
                <div style={{ padding: "10px", width: "400px", textAlign: "center" }}>
                    {
                        useSearchParams()[0].get('sign') !== 'up' ?
                            <small className='d-block mb-3' style={{ fontSize: "16px", textAlign: "center" }}><b>Sign in with Instagram account</b></small>
                            :
                            <small className='d-block mb-3' style={{ fontSize: "20px", textAlign: "center" }}><b>Sign up</b></small>
                    }
                    {
                        useSearchParams()[0].get('sign') === 'up' ?
                            <WhiteBorderTextField id='nameInput' variant='outlined' InputProps={{ style: { borderRadius: "12px", background: "transparent", backdropFilter: "blur(4px)", fontWeight: "bold" } }} style={{ display: "block", marginBottom: "10px", borderColor: "red" }} fullWidth onChange={(e) => {
                                setName(e.target.value);
                            }} placeholder='Name' />
                            :
                            <></>
                    }
                    <WhiteBorderTextField id='emailInput' variant='outlined' InputProps={{ style: { borderRadius: "12px", background: "transparent", backdropFilter: "blur(4px)", fontWeight: "bold" } }} style={{ display: "block", marginBottom: "10px", borderColor: "red" }} fullWidth onChange={(e) => {
                        setEmail(e.target.value);
                    }} placeholder='User name, number or email' />
                    <WhiteBorderTextField id='passwordInput' variant='outlined' type='password' InputProps={{ style: { borderRadius: "12px", background: "transparent", backdropFilter: "blur(4px)", fontWeight: "bold" } }} style={{ display: "block", marginBottom: "10px" }} fullWidth onChange={(e) => {
                        setPassword(e.target.value);
                    }} placeholder='Password' />
                    {
                        useSearchParams()[0].get('sign') === 'up' ?
                            <MyButton style={{ cursor: email && password && name ? "pointer" : "not-allowed", color: email && password && name ? '#fff' : 'grey' }} onClick={signUpFunc}>Sign up</MyButton>
                            :
                            <MyButton style={{ cursor: email && password ? "pointer" : "not-allowed", color: email && password ? '#fff' : 'grey' }} onClick={signInFunc}>Sign in</MyButton>
                    }
                    <Link to={'/reset-password'} style={{ color: "grey", textDecoration: "none", fontSize: "14px", display: "inline-block", margin: "12px 0" }}>Forgot password?</Link>
                    <div style={{ position: "relative", width: "100%", height: "30px", margin: "12px 0" }}>
                        <hr />
                        <span style={{ position: "absolute", top: "-12.5px", left: "50%", transform: "translateX(-50%)", background: "#fff", display: "inline-block", padding: "0 10px", color: "#9f9f9f" }}>or</span>
                    </div>
                    <MyButtonWithIcon icon={<i className="fa-brands fa-instagram"></i>}>Continue with Instagram</MyButtonWithIcon>
                    <div style={{ textAlign: "left", margin: "10px 0" }}><small style={{ color: "grey" }}>{useSearchParams()[0].get('sign') !== 'up' ? 'No account?' : 'Already have an account?'}</small> <Link to={useSearchParams()[0].get('sign') === 'up' ? '/login?sign=in' : '/login?sign=up'} style={{ textDecoration: "none", fontSize: "14px" }}>Sign {useSearchParams()[0].get('sign') === 'up' ? 'in' : 'up'}</Link></div>
                </div>

                <div style={{ position: 'absolute', bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", justifyContent: "space-between", alignItems: "center", width: "400px", padding: "0 10px" }}>
                    <small style={{ fontSize: "12px" }}>@ 2023</small>
                    <Link className={style.links} to={'/threads-conditions'} style={{ fontSize: "11px", color: "grey", opacity: "0.8", textDecoration: "none" }}>Threads Conditions</Link>
                    <Link className={style.links} to={'/privacy-policy'} style={{ fontSize: "11px", color: "grey", opacity: "0.8", textDecoration: "none" }}>Privacy Policy</Link>
                    <Link className={style.links} to={'/cookies-policy'} style={{ fontSize: "11px", color: "grey", opacity: "0.8", textDecoration: "none" }}>Cookies Policy</Link>
                    <Link className={style.links} to={'/report'} style={{ fontSize: "11px", color: "grey", opacity: "0.8", textDecoration: "none" }}>Report Problem</Link>
                </div>
            </div>
        </div>
    )
}

export default SignInPage