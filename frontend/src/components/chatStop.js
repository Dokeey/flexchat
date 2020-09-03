import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useAppContext } from "store";
import Axios from "axios";
import { setGroup } from "store";

export function ChatStop({ chatClose }) {
  //   const {
  //     store: { pk, jwtToken },
  //     dispatch,
  //   } = useAppContext();
  //   const [group_name, setGroup_name] = useState("");
  //   const headers = { Authorization: `JWT ${jwtToken}` };

  //   const stopChatting = () => {};

  return (
    <div>
      <Button onClick={chatClose}>채팅 그만하기</Button>
    </div>
  );
}
