import React, { useState, useEffect } from "react";
import { Chat } from "components/chat";
import { UserCount } from "components/userCount";
import { AppLayout } from "components/appLayout";
import { useAppContext } from "store";
import { ChatStop } from "components/chatStop";
import { UserInfo } from "components/userInfo";
import { Footer } from "components/footer";
import { SOCKET_HOST } from "Constants";

function Home() {
  const {
    store: { jwtToken, group },
  } = useAppContext();

  const [chatSocket, setChatSocket] = useState({});

  useEffect(() => {
    if (jwtToken && group) {
      const ws = new WebSocket(SOCKET_HOST + `/ws/chat/?token=${jwtToken}`);
      setChatSocket(ws);
    }
  }, [jwtToken, group]);

  const right_sidebar = (
    <>
      <UserCount />
      <ChatStop chatSocket={chatSocket} />
    </>
  );

  return (
    <div>
      <AppLayout
        right_sidebar={right_sidebar}
        user_info={<UserInfo />}
        footer={<Footer />}
      >
        <Chat chatSocket={chatSocket} setChatSocket={setChatSocket} />
      </AppLayout>
    </div>
  );
}

export default Home;
