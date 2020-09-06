import React from "react";
import { Button } from "antd";
import { useAppContext } from "store";
import Axios from "axios";
import { setGroup } from "store";
import { useInterval } from "utils/useInterval";
import { setTotalUser } from "store";

export function ChatStart({ chatClose, setWaiters }) {
  const {
    store: { pk, jwtToken, group },
    dispatch,
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };

  const get_waiters_counter = () => {
    console.log("signup function ran");
    if (jwtToken && !group) {
      try {
        const response = Axios.get("http://localhost/chat/users_count/");
        const response2 = Axios.get(`http://localhost/chat/group/${pk}/`, {
          headers,
        });
        Axios.all([response, response2])
          .then(
            Axios.spread((...responses) => {
              const response = responses[0];
              const response2 = responses[1];
              console.log("response : ", response.data);
              console.log("response2 : ", response2.data);
              dispatch(setTotalUser(response.data.count));
              setWaiters(response2.data.waiters_count);
            })
          )
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
  useInterval(get_waiters_counter, 5000);

  const startMatching = async () => {
    chatClose();
    try {
      const response = await Axios.get(`http://localhost/chat/match/${pk}/`, {
        headers,
      });
      dispatch(setGroup(response.data.group));
      setWaiters(0);
      console.log(response.data.group);
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
