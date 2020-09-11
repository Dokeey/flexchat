import React, { useState, useEffect } from "react";
import { notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";
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
    store: { jwtToken, group, waiterSocket },
  } = useAppContext();

  const [chatSocket, setChatSocket] = useState({});

  useEffect(() => {
    if (jwtToken && group) {
      const ws = new WebSocket(SOCKET_HOST + `/ws/chat/?token=${jwtToken}`);
      setChatSocket(ws);
      if (waiterSocket) {
        waiterSocket.close();
      }

      notification.open({
        message: "상대방과 연결되었습니다.",
        description: "인사를 건네보세요 :)",
        icon: <SmileOutlined style={{ color: "#43d5d2" }} />,
      });
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
