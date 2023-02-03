import React from "react";
import main from "../assets/images/main.svg";
import Wrapper from "../assets/wrappers/LandingPage.js";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext.js";
import Logo from "../components/Logo";

const Landing = () => {
  // const { user } = useAppContext();
  return (
    <>
      {/* {user && <Navigate to="/" />} */}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          {/* info */}
          <div className="info">
            <h1>
              job <span>tracking</span> app
            </h1>
            <p>
              I'm baby wayfarers hoodie next level taiyaki brooklyn cliche blue
              bottle single-origin coffee chia. Aesthetic post-ironic venmo,
              quinoa lo-fi tote bag adaptogen everyday carry meggings +1 brunch
              narwhal.
            </p>
            <Link to="/register" className="btn btn-hero">
              Login/Register
            </Link>
          </div>
          <img src={main} alt="job hunt" className="img main-img" />
        </div>
      </Wrapper>
    </>
  );
};

export default Landing;
