import React, { useEffect, useState, useRef } from "react";
import { useAppContext, deleteGroup } from "store";
import { ChatStop } from "./chatStop";
import { ChatStart } from "./chatStart";
import Search from "antd/lib/input/Search";
import {
  SendOutlined,
  MessageTwoTone,
  WomanOutlined,
  ManOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Avatar, Spin } from "antd";
import "./chat.scss";

export function Chat() {
  const {
    store: { jwtToken, group, pk },
    dispatch,
  } = useAppContext();
  const [chatSocket, setChatSocket] = useState({});
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [chatlog, setChatlog] = useState([
    <div key="0" ref={messagesEndRef}></div>,
  ]);
  const [key, setKey] = useState(1);
  const [waiters, setWaiters] = useState(0);

  useEffect(() => {
    if (jwtToken && group) {
      const ws = new WebSocket(`ws://localhost/ws/chat/?token=${jwtToken}`);
      setChatSocket(ws);
    }
  }, [jwtToken, group]);

  chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    if (pk === data.pk) {
      const ref = chatlog.pop();
      chatlog.push(
        <div key={key} className="bubble">
          {data.message}
        </div>
      );
      chatlog.push(ref);
      setChatlog(chatlog);
    } else {
      const ref = chatlog.pop();
      if (data.gender === "M") {
        chatlog.push(
          <div key={key} className="another">
            <div className="another-user">
              <Avatar
                icon={<ManOutlined />}
                style={{ marginLeft: "10px", backgroundColor: "skyblue" }}
              />
              <div className="another-bubble">{data.message}</div>
            </div>
          </div>
        );
      } else {
        chatlog.push(
          <div key={key} className="another">
            <div className="another-user">
              <Avatar
                icon={<WomanOutlined />}
                style={{ marginLeft: "10px", backgroundColor: "hotpink" }}
              />
              <div className="another-bubble">{data.message}</div>
            </div>
          </div>
        );
      }
      chatlog.push(ref);
      setChatlog(chatlog);
    }
    setKey((prevValue) => prevValue + 1);
  };

  chatSocket.onclose = function (e) {
    dispatch(deleteGroup());
    console.error(e, "클로즈 됐습니다.");
  };

  chatSocket.onerror = (e) => {
    console.error(e, "에러");
    // chatclose();
  };

  const chatclose = () => {
    if (chatSocket.close) {
      chatSocket.close();
      setChatSocket({});
    } else {
      return null;
    }
  };

  const chat_submit = () => {
    if (!message) {
      return null;
    }
    chatSocket.send(
      JSON.stringify({
        message,
      })
    );
    setMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(scrollToBottom, [key]);

  // const [maxHeight, setMaxHeight] = useState("100vh");

  // useEffect(() => {
  //   setMaxHeight(document.querySelector("#chat_log_window").offsetHeight);
  // }, [maxHeight]);

  // const useHeight = () => {
  //   const [height, setHeight] = useState(maxHeight);

  //   useEffect(() => {
  //     const onResize = () =>
  //       setHeight(document.querySelector("#chat_log_window").offsetHeight);
  //     window.addEventListener("resize", onResize);
  //     return () => window.removeEventListener("resize", onResize);
  //   }, []);

  //   return height;
  // };
  // const height = useHeight();
  return (
    <div className="chat-content">
      <div className="chat-log-window">
        {jwtToken && !group ? (
          <div className="spin">
            <Spin
              size="large"
              tip={
                waiters ? (
                  <div>내 앞의 대기자 수 : {waiters}</div>
                ) : (
                  <span>잠시후 매칭됩니다!</span>
                )
              }
              style={{ color: "white" }}
              indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
            />
          </div>
        ) : (
          chatlog
        )}
      </div>
      <div>
        <Search
          placeholder={
            group ? "메세지를 보내세요!" : "채팅시작 버튼을 클릭하세요!"
          }
          enterButton={<SendOutlined />}
          prefix={<MessageTwoTone />}
          size="large"
          value={message}
          disabled={!group}
          allowClear={true}
          maxLength="100"
          onChange={(e) => setMessage(e.target.value)}
          onSearch={chat_submit}
        />
        <ChatStart chatClose={chatclose} setWaiters={setWaiters} />
        <ChatStop chatClose={chatclose} />
      </div>
    </div>
  );
}
