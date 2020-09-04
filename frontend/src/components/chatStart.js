import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useAppContext } from "store";
import Axios from "axios";
import { setGroup } from "store";

export function ChatStart({ chatClose }) {
  const {
    store: { pk, jwtToken, group },
    dispatch,
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };

  useEffect(() => {
    if (jwtToken && !group) {
      const get_group = setInterval(async () => {
        console.log("while");
        try {
          const response = await Axios.get(
            `http://localhost/chat/group/${pk}/`,
            {
              headers,
            }
          );
          console.log(response.data);
          dispatch(setGroup(response.data.group));
        } catch (error) {
          console.error(error);
        }
      }, 1000);
      return () => {
        clearInterval(get_group);
      };
    }
  });
  const startMatching = async () => {
    chatClose();
    try {
      const response = await Axios.get(`http://localhost/chat/match/${pk}/`, {
        headers,
      });
      dispatch(setGroup(response.data.group));
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
