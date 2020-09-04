import React, { useState } from "react";
import Axios from "axios";
import { Radio } from "antd";
import { useAppContext, setToken } from "store";
import { Chat } from "components/chat";
import { UserCount } from "components/userCount";

function Home() {
  const {
    store: { jwtToken },
    dispatch,
  } = useAppContext();
  const [userInfo, setUserInfo] = useState({});
  const userSubmit = async () => {
    try {
      if (userInfo.pk) {
        const headers = { Authorization: `JWT ${jwtToken}` };
        const response = await Axios.put(
          `http://localhost/accounts/users/${userInfo.pk}/`,
          { ...userInfo },
          { headers }
        );
        setUserInfo(response.data);
      } else {
        const response = await Axios.post("http://localhost/accounts/users/", {
          ...userInfo,
        });
        setUserInfo(response.data);
        dispatch(setToken(response.data.token, response.data.pk));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <UserCount />
      <Radio.Group
        onChange={(e) =>
          setUserInfo((prev) => ({ ...prev, gender: e.target.value }))
        }
        buttonStyle="solid"
        size="large"
      >
        <Radio.Button style={{ borderRadius: "12px" }} value="M">
          남자
        </Radio.Button>
        <Radio.Button value="F">여자</Radio.Button>
      </Radio.Group>
      <hr />
      <Radio.Group
        onChange={(e) =>
          setUserInfo((prev) => ({ ...prev, want_match: e.target.value }))
        }
        buttonStyle="solid"
        style={{ marginTop: 16, borderRadius: "12px" }}
        size="large"
      >
        <Radio.Button value="M">남자</Radio.Button>
        <Radio.Button value="F">여자</Radio.Button>
        <Radio.Button value="A">아무나</Radio.Button>
      </Radio.Group>
      <button onClick={userSubmit}>내 정보 설정</button>
      <Chat />
    </div>
  );
}

export default Home;
