import React, { useEffect, useState } from "react";
import { useAppContext } from "store";
import { Input, Button } from "antd";
import TextArea from "antd/lib/input/TextArea";

export function Chat() {
  const {
    store: { jwtToken },
  } = useAppContext();
  const [chatSocket, setChatSocket] = useState({});

  useEffect(() => {
    if (jwtToken) {
      setChatSocket(
        new WebSocket(
          "ws://" + "localhost" + "/ws/chat/" + `?token=${jwtToken}`
        )
      );
    }
  }, [jwtToken]);

  chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    document.querySelector("#chat-log").value += data.message + "\n";
  };

  chatSocket.onclose = function (e) {
    console.error("Chat socket closed unexpectedly");
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
        disabled={jwtToken.length === 0}
      />
      <Button
        disabled={jwtToken.length === 0}
        id="chat-message-submit"
        onClick={chat_submit}
      >
        SEND
      </Button>
    </div>
  );
}
