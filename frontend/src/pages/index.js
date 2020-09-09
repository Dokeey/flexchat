import React from "react";
import { Route } from "react-router-dom";
import Home from "./home";
import { useAppContext, deleteToken, deleteGroup } from "store";
import { API_HOST } from "Constants";
import { Unload } from "utils/Unload";

function Root() {
  const {
    store: { pk },
    dispatch,
  } = useAppContext();

  const userDelete = () => {
    dispatch(deleteToken());
    dispatch(deleteGroup());
    // const HOST = "http://localhost";
    const HOST = API_HOST;
    try {
      navigator.sendBeacon(`${HOST}/accounts/delete/${pk}/`);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   const userDel = () => userDelete();
  //   window.addEventListener("unload", userDel);
  //   window.addEventListener("beforeunload", userDel);
  //   window.addEventListener("pagehide", userDel);
  //   return () => {
  //     window.removeEventListener("unload", userDel);
  //     window.removeEventListener("beforeunload", userDel);
  //     window.removeEventListener("pagehide", userDel);
  //   };
  // });

  return (
    <Unload onUnload={() => userDelete()}>
      {/* <Beforeunload onBeforeunload={() => userDelete()}> */}
      <Route path="/" component={Home} />
    </Unload>
  );
}

export default Root;
