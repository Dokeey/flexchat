import React from "react";
import { Button, notification } from "antd";
import { setGroup, useAppContext } from "store";
import { setIsLogin } from "store";
import { CommentOutlined, SmileOutlined } from "@ant-design/icons";
import { setIsMatch } from "store";
import { axiosInstance } from "api";

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
      const response = await axiosInstance.get(`/chat/match/${pk}/`, {
        headers,
      });
      dispatch(setGroup(response.data.group));
      setWaiters(0);

      notification.open({
        message: "상대방과 연결되었습니다.",
        description: "인사를 건네보세요 :)",
        icon: <SmileOutlined style={{ color: "#43d5d2" }} />,
      });
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