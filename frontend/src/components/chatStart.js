import React from "react";
import { Button } from "antd";
import { useAppContext } from "store";
import { setIsLogin } from "store";
import { CommentOutlined } from "@ant-design/icons";
import { setIsMatch } from "store";
import { axiosInstance } from "api";
import { SOCKET_HOST } from "Constants";
import { setWaiterSocket } from "store";

export function ChatStart({ chatClose, setWaiters }) {
  const {
    store: { pk, jwtToken, userSocket, waiterSocket },
    dispatch,
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };

  const startMatching = async () => {
    chatClose();
    if (!jwtToken) {
      dispatch(setIsLogin(false));
      return null;
    }
    dispatch(setIsMatch(true));
    if (waiterSocket) {
      waiterSocket.send(JSON.stringify({}));
    }
    try {
      const response = await axiosInstance.get(`/chat/match/${pk}/`, {
        headers,
      });
      if (response.data.group) {
        userSocket.send(
          JSON.stringify({
            group: response.data.group,
          })
        );
      } else {
        const ws = new WebSocket(SOCKET_HOST + `/ws/waiter/?token=${jwtToken}`);
        ws.onmessage = (e) => {
          const data = JSON.parse(e.data);
          setWaiters(data.waiters_count);
        };
        dispatch(setWaiterSocket(ws));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        shape="round"
        onClick={startMatching}
        size="large"
        style={{ border: "2px solid white" }}
      >
        <CommentOutlined />
        &nbsp;채팅시작
      </Button>
    </div>
  );
}
