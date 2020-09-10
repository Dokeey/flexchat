import React, { useEffect } from "react";
import { useAppContext, setTotalUser } from "store";
import { Card } from "antd";
import { setUserSocket } from "store";
import { SOCKET_HOST } from "Constants";

export function UserCount() {
  const {
    store: { total_user, userSocket },
    dispatch,
  } = useAppContext();

  //   const get_user_count = async () => {
  //     try {
  //       const response = await axiosInstance.get("/chat/users_count/");
  //       dispatch(setTotalUser(response.data.count));
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   useInterval(get_user_count, 5000);

  const set_total_user = (e) => {
    const data = JSON.parse(e.data);
    dispatch(setTotalUser(data.user_count));
  };

  useEffect(() => {
    const ws = new WebSocket(SOCKET_HOST + `/ws/users/`);
    ws.onmessage = (e) => {
      set_total_user(e);
    };
    dispatch(setUserSocket(ws));
  }, []);

  if (userSocket) {
    userSocket.onmessage = function (e) {
      set_total_user(e);
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
