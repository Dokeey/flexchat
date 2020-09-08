import React from "react";
import { useInterval } from "utils/useInterval";
import { useAppContext, setTotalUser } from "store";
import { Card } from "antd";
import { axiosInstance } from "api";

export function UserCount() {
  const {
    store: { total_user },
    dispatch,
  } = useAppContext();

  const get_user_count = async () => {
    try {
      const response = await axiosInstance.get("/chat/users_count/");
      dispatch(setTotalUser(response.data.count));
    } catch (error) {
      console.error(error);
    }
  };

  useInterval(get_user_count, 5000);

  return (
    <Card
      title={<div style={{ textAlign: "center" }}>지금 몇명?</div>}
      bordered={true}
    >
      <h1 style={{ textAlign: "center", color: "#43d5d2" }}>{total_user}</h1>
    </Card>
  );
}
