import React, { useState } from "react";
import "./App.css";
import Axios from "axios";

function App() {
  const [userInfo, setUserInfo] = useState({});

  async function getUser() {
    try {
      const response = await Axios.post(
        "https://dry-dawn-35150.herokuapp.com/accounts/users/",
        {
          gender: "M",
          want_match: "M",
        }
      );
      // setUserInfo(response.data);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
  getUser();

  return <div>hello donghoo</div>;
}

export default App;
