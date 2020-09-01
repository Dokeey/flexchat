import React from "react";
import { Route } from "react-router-dom";
import Home from "./home";
import { Beforeunload } from "react-beforeunload";
import { useAppContext, deleteToken } from "store";
import Axios from "axios";

function Root() {
  const {
    store: { pk },
    dispatch,
  } = useAppContext();

  const userDelete = async (pk) => {
    dispatch(deleteToken());
    try {
      await Axios.delete(`http://localhost/accounts/users/${pk}/`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Beforeunload onBeforeunload={() => userDelete(pk)}>
      <Route path="/" component={Home} />
    </Beforeunload>
  );
}

export default Root;
