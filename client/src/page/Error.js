import React from "react";
import { Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/ErrorPage";
import img from "../assets/images/not-found.svg";
const Error = () => {
  return (
    <Wrapper>
      <div>
        <img src={img} alt="not found" />
        <h3>text</h3>
        <p>text</p>
        <Link to="/">back home</Link>
      </div>
    </Wrapper>
  );
};

export default Error;
