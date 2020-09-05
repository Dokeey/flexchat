import React from "react";
import "./appLayout.scss";
import { UserInfo } from "components/userInfo";

export function AppLayout({ children }) {
  return (
    <div className="app">
      <div className="header">
        {/* <div className="total-user">현재 접속자 : 23명</div> */}
        <div className="logo">
          <img alt="Flex 주사위 Chat" />
          {/* Flex 주사위 Chat */}
        </div>
        <div className="topnav">
          <UserInfo />
        </div>
      </div>
      <div className="contents">{children}</div>
      <div className="left-sidebar">sidenar</div>
      <div className="right-sidebar">sidenar</div>
      <div className="footer">&copy; 2020. flexchatp</div>
    </div>
  );
}
