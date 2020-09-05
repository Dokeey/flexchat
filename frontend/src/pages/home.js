import React from "react";
import { Chat } from "components/chat";
import { UserCount } from "components/userCount";
import { AppLayout } from "components/appLayout";

function Home() {
  return (
    <div>
      <AppLayout>
        <UserCount />
        <Chat />
      </AppLayout>
    </div>
  );
}

export default Home;
