import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useAppContext } from "store";
import Axios from "axios";
import { setGroup } from "store";

export function ChatStart() {
  const {
    store: { pk, jwtToken },
    dispatch,
  } = useAppContext();
  const [group_name, setGroup_name] = useState("");
  const headers = { Authorization: `JWT ${jwtToken}` };

  useEffect(() => {
    if (jwtToken) {
      if (group_name.length === 0) {
        const get_group = setInterval(async () => {
          console.log("while");
          try {
            const response = await Axios.get(
              `http://localhost/chat/group/${pk}/`,
              {
                headers,
              }
            );
            console.log(response.data.group_name);
            setGroup_name(response.data.group_name);
            dispatch(setGroup(response.data.group_name));
          } catch (error) {
            console.error(error);
          }
        }, 1000);
        return () => {
          clearInterval(get_group);
        };
      }
    }
  });

  const startMatching = async () => {
    try {
      const response = await Axios.get(`http://localhost/chat/match/${pk}/`, {
        headers,
      });
      setGroup_name(response.data.group_name);
      dispatch(setGroup(response.data.group_name));
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
