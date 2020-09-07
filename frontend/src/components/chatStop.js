import React from "react";
import { Button } from "antd";
import { StopOutlined } from "@ant-design/icons";
import { useAppContext } from "store";

export function ChatStop({ chatSocket }) {
  const {
    store: { group },
  } = useAppContext();
  const chatClose = () => {
    if (chatSocket.close) {
      chatSocket.close();
    } else {
      return null;
    }
  };
  return (
    <div>
      {group ? (
        <Button
          type="danger"
          danger
          block
          shape="round"
          icon={<StopOutlined />}
          size="large"
          onClick={chatClose}
          style={{ marginTop: "10px" }}
        >
          채팅 그만하기
        </Button>
      ) : null}
    </div>
  );
}
