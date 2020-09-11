import React, { useEffect, useState, useRef } from "react";
import { useAppContext, deleteGroup, setIsMatch } from "store";
import { ChatStart } from "./chatStart";
import Search from "antd/lib/input/Search";
import {
  SendOutlined,
  MessageTwoTone,
  WomanOutlined,
  ManOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Avatar, Spin, notification } from "antd";
import "./chat.scss";

export function Chat({ chatSocket, setChatSocket }) {
  const {
    store: { group, pk, is_match, waiterSocket },
    dispatch,
  } = useAppContext();
  const [message, setMessage] = useState("");
  const [key, setKey] = useState(0);
  const [waiters, setWaiters] = useState(0);
  const messagesEndRef = useRef(null);
  const [chatlog, setChatlog] = useState([]);

  if (waiterSocket) {
    waiterSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setWaiters(data.waiters_count);
    };
  }

  chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    if (pk === data.pk) {
      chatlog.push(
        <div key={key} className="bubble">
          {data.message}
        </div>
      );
      setChatlog(chatlog);
    } else {
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
      setChatlog(chatlog);
    }
    setKey((prevValue) => prevValue + 1);
  };

  chatSocket.onclose = function (e) {
    setChatlog([<div key="0" ref={messagesEndRef}></div>]);
    dispatch(deleteGroup());
    setChatSocket({});
    dispatch(setIsMatch(false));
    // console.error(e, "클로즈 됐습니다.");
    notification.open({
      message: "채팅이 종료되었습니다.",
      description: "새로운 채팅을 시작하세요",
      icon: <CloseCircleOutlined style={{ color: "red" }} />,
    });
  };

  const chatclose = () => {
    if (chatSocket.close) {
      chatSocket.close();
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

  useEffect(() => {
    document.querySelector(
      ".chat-log-window"
    ).scrollTop = document.querySelector(".chat-log-window").scrollHeight;
  }, [key]);

  return (
    <div className="chat-content">
      <div className="chat-log-window">
        {!is_match ? (
          <div className="flex-center">
            <ChatStart chatClose={chatclose} setWaiters={setWaiters} />
          </div>
        ) : !group ? (
          <div className="flex-center">
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
      </div>
    </div>
  );
}
