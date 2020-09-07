import React from "react";
import "./appLayout.scss";
import Logo from "assets/flexchatlogo.png";

export function AppLayout({ children, right_sidebar, user_info }) {
  return (
    <div className="app">
      <div className="header">
        <div className="logo">
          <img src={Logo} alt="Flex 주사위 Chat" />
        </div>
        <div className="topnav">{user_info}</div>
      </div>
      <div className="contents">{children}</div>
      <div className="left-sidebar"></div>
      <div className="right-sidebar">{right_sidebar}</div>
      <div className="footer">&copy; 2020. flexchat</div>
    </div>
  );
}
