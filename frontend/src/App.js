import React, { useState } from "react";
import Axios from "axios";
import { Radio } from "antd";
import { useAppContext, setToken } from "store";
import "App.css";

function App() {
  const { dispatch } = useAppContext();
  const [userInfo, setUserInfo] = useState({});
  const userSubmit = async () => {
    try {
      const response = await Axios.post("http://localhost/accounts/users/", {
        ...userInfo,
      });
      console.log(response.data);
      setUserInfo(response.data);
      dispatch(setToken(userInfo.token, userInfo.pk));
    } catch (error) {
      console.error(error);
    }
  };

  const userSelectInfo = (e) => {
    if (e.target.name === "gender") {
      setUserInfo((prev) => ({
        ...prev,
        gender: e.target.value,
      }));
    } else {
      setUserInfo((prev) => ({
        ...prev,
        want_match: e.target.value,
      }));
    }
  };

  return (
    <div>
      hello donghoo
      <Radio.Group
        onChange={userSelectInfo}
        defaultValue="M"
        buttonStyle="solid"
        size="large"
        name="gender"
      >
        <Radio.Button style={{ borderRadius: "12px" }} value="M">
          남자
        </Radio.Button>
        <Radio.Button value="F">여자</Radio.Button>
      </Radio.Group>
      <hr />
      <Radio.Group
        onChange={userSelectInfo}
        defaultValue="A"
        buttonStyle="solid"
        style={{ marginTop: 16, borderRadius: "12px" }}
        size="large"
        name="want_match"
      >
        <Radio.Button value="M">남자</Radio.Button>
        <Radio.Button value="F">여자</Radio.Button>
        <Radio.Button value="A">아무나</Radio.Button>
      </Radio.Group>
      <button onClick={userSubmit}>token가져오기</button>
      성별 : {userInfo.gender}
      매칭 : {userInfo.want_match}
      토큰 : {userInfo.token}
    </div>
  );
}

export default App;