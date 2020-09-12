import React from "react";
import { Card } from "antd";

import { ExclamationCircleOutlined } from "@ant-design/icons";
export const Tip = () => {
  return (
    <Card>
      <p>
        <ExclamationCircleOutlined style={{ color: "#108ee9" }} /> 새로고침(F5)
        - 내 정보 초기화
      </p>
      <p>
        <ExclamationCircleOutlined style={{ color: "red" }} /> Desktop 전용
        입니다.
      </p>
    </Card>
  );
};
