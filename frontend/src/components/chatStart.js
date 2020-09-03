import React from "react";
import { Button } from "antd";
import { useAppContext } from "store";
import Axios from "axios";

export function ChatStart() {
  const {
    store: { pk, jwtToken },
  } = useAppContext();
  const startMatching = async () => {
    const headers = { Authorization: `JWT ${jwtToken}` };

    try {
      const response = await Axios.get(`http://localhost/chat/match/${pk}/`, {
        headers,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button onClick={startMatching}>채팅시작하기</Button>
    </div>
  );
}
