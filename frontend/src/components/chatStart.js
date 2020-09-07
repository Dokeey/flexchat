import React from "react";
import { Button } from "antd";
import Axios from "axios";
import { setGroup, useAppContext } from "store";
import { setIsLogin } from "store";
import { CommentOutlined } from "@ant-design/icons";
import { setIsMatch } from "store";

export function ChatStart({ chatClose, setWaiters }) {
  const {
    store: { pk, jwtToken, is_match },
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
    try {
      console.log(is_match);
      const response = await Axios.get(`http://localhost/chat/match/${pk}/`, {
        headers,
      });
      dispatch(setGroup(response.data.group));
      setWaiters(0);
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
