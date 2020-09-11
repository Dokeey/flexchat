import React, { useEffect } from "react";
import { useAppContext, setTotalUser, setGroup, setUserSocket } from "store";
import { Card } from "antd";
import { SOCKET_HOST } from "Constants";

export function UserCount() {
  const {
    store: { total_user, userSocket },
    dispatch,
  } = useAppContext();

  const set_group_total_user = (e) => {
    const data = JSON.parse(e.data);
    dispatch(setTotalUser(data.user_count));
    dispatch(setGroup(data.group));
  };

  useEffect(() => {
    const ws = new WebSocket(SOCKET_HOST + `/ws/users/`);
    ws.onmessage = (e) => {
      set_group_total_user(e);
    };
    dispatch(setUserSocket(ws));
  }, []);

  if (userSocket) {
    userSocket.onmessage = (e) => {
      set_group_total_user(e);
    };
  }

  return (
    <Card
      hoverable={true}
      title={
        <div
          style={{
            textAlign: "center",
            wordBreak: "break-all",
          }}
        >
          지금 몇명?
        </div>
      }
      bordered={true}
    >
      <h1 style={{ textAlign: "center", color: "#43d5d2" }}>{total_user}</h1>
    </Card>
  );
}
