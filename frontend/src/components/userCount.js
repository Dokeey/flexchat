import React from "react";
import Axios from "axios";
import { useInterval } from "utils/useInterval";
import { useAppContext } from "store";
import { setTotalUser } from "store";

export function UserCount() {
  const {
    store: { total_user },
    dispatch,
  } = useAppContext();

  const get_user_count = async () => {
    try {
      const response = await Axios.get("http://localhost/chat/users_count/");
      dispatch(setTotalUser(response.data.count));
    } catch (error) {
      console.error(error);
    }
  };

  useInterval(get_user_count, 5000);

  return <div>현재 {total_user}명이 FlexChat을 이용 중 입니다</div>;
}
