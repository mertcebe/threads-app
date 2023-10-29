import styled from '@emotion/styled';
import { TextareaAutosize } from '@mui/material'
import React from 'react'

const MyButton = styled.button`
  background: #b075e6;
  color: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 8px 0;
  border: none;
  transition: all 0.2s ease;
  &:hover{
    opacity: 0.9;
    border-radius: 0;
  };
  margin-top: 10px;
`;

const CreatePage = () => {
  return (
    <div style={{width: "calc(100% - 534.28px)", boxSizing: "border-box", padding: "40px 30px"}}>
        <h3 style={{color: "#fff"}}><b>Create Thread</b></h3>
        <p style={{color: "grey", marginTop: "30px"}}>Content</p>
        <textarea style={{width: "100%", height: "400px", resize: "none", outline: "none", border: "none", background: "#222", color: "#fff", padding: "10px"}} placeholder='Text something...'></textarea>
        <MyButton>asd</MyButton>
    </div>
  )
}

export default CreatePage