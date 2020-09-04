import React, { useEffect, useState } from "react";
import { useAppContext } from "store";
import { Input, Button } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ChatStop } from "./chatStop";
import { deleteGroup } from "store";
import { ChatStart } from "./chatStart";

export function Chat() {
  const {
    store: { jwtToken, group },
    dispatch,
  } = useAppContext();
  const [chatSocket, setChatSocket] = useState({});

  useEffect(() => {
    console.log("이펙");
    if (jwtToken && group) {
      const ws = new WebSocket(
        "ws://" + "localhost" + "/ws/chat/" + `?token=${jwtToken}`
      );
      setChatSocket(ws);
    }
  }, [jwtToken, group]);

  chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    document.querySelector("#chat-log").value += data.message + "\n";
  };

  chatSocket.onclose = function (e) {
    dispatch(deleteGroup());
    console.error(e, "클로즈 됐습니다.");
  };

  chatSocket.onerror = (e) => {
    console.error(e, "에러 뜸");
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

  let textInput = null;
  useEffect(() => {
    textInput.focus();
  }, [textInput]);

  const chat_enter = (e) => {
    if (e.keyCode === 13) {
      // enter, return
      chat_submit();
    }
  };

  const chat_submit = () => {
    const messageInputDom = document.querySelector("#chat-message-input");
    const message = messageInputDom.value;
    chatSocket.send(
      JSON.stringify({
        message,
      })
    );
    messageInputDom.value = "";
  };
  return (
    <div>
      <TextArea id="chat-log" cols="100" rows="20"></TextArea>
      <br />
      <Input
        id="chat-message-input"
        type="text"
        size="100"
        ref={(button) => {
          textInput = button;
        }}
        onKeyUp={chat_enter}
        disabled={group.length === 0}
      />
      <Button
        disabled={group.length === 0}
        id="chat-message-submit"
        onClick={chat_submit}
      >
        SEND
      </Button>
      <ChatStart chatClose={chatclose} />
      <ChatStop chatClose={chatclose} />
    </div>
  );
}
