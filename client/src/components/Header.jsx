import React from "react";
import main from "../images/main1.svg";
import "../styles/header.css";

const Header = () => {
  return (
    <>
      <br />
      <br />
      <div className="head_sec max_width m_auto">
        <div className="heading_left">
          <h1>Multipurpose Blog</h1>
          <br />
          <p>
            MBlog is a platform where an individual can share their experience,
            knowledge, interest at free of cost. MBlog offers a secure and
            reliable way to create a blog who wants to start blogging as a hobby
            or are already serious about it. In the present time where people
            have access to anything and everything with just clicking a button,
            MBlog provides a way where people can connect. Go on start blogging by registering yourself...!
          </p>
        </div>
        <div className="heading_right">
          <img src={main} alt="" />
        </div>
      </div>

      <br />
      <br />
      <hr className="max_width m_auto" />

      <div className="max_width m_auto">
        <br />
      </div>
    </>
  );
};

export default Header;
