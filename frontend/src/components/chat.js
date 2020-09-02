import React, { useEffect, useState } from "react";
import { useAppContext } from "store";

export function Chat() {
  const {
    store: { token },
  } = useAppContext();
  console.log(token);
  const [chatSocket, setChatSocket] = useState({});

  useEffect(() => {
    setChatSocket(
      new WebSocket("ws://" + "localhost" + "/ws/chat/" + `?token=${token}`)
    );
  }, [token]);

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
      <textarea id="chat-log" cols="100" rows="20"></textarea>
      <br />
      <input
        id="chat-message-input"
        type="text"
        size="100"
        ref={(button) => {
          textInput = button;
        }}
        onKeyUp={chat_enter}
      />
      <br />
      <input
        id="chat-message-submit"
        type="button"
        value="Send"
        onClick={chat_submit}
      />
    </div>
  );
}
