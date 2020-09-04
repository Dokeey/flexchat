import React from "react";
import { Button } from "antd";

export function ChatStop({ chatClose }) {
  return (
    <div>
      <Button onClick={chatClose}>채팅 그만하기</Button>
    </div>
  );
}
