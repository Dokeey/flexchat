import React from "react";
import { Timeline, Divider, Typography } from "antd";
import {
  GithubOutlined,
  UserOutlined,
  MailOutlined,
  InfoCircleOutlined,
  ProjectOutlined,
  CopyrightOutlined,
} from "@ant-design/icons";
import "./footer.scss";

export const Footer = () => {
  const { Link } = Typography;
  return (
    <div className="footer-contents">
      <div className="footer-content">
        <Divider>
          <ProjectOutlined />
          &nbsp;Project
        </Divider>
        <Timeline>
          <Timeline.Item dot={<CopyrightOutlined />} color="dimgray">
            <Link
              href="https://github.com/dokeey/flexchat"
              style={{ color: "dimgray" }}
            >
              Flex Chat.
            </Link>
          </Timeline.Item>
          <Timeline.Item
            dot={
              <GithubOutlined
                className="timeline-clock-icon"
                style={{ color: "dimgray" }}
              />
            }
          >
            <Link
              href="https://github.com/dokeey/flexchat"
              style={{ color: "dimgray" }}
            >
              https://github.com/dokeey/flexchat
            </Link>
          </Timeline.Item>
          <Timeline.Item
            dot={<InfoCircleOutlined className="timeline-clock-icon" />}
            color="dimgray"
          >
            문의 :{" "}
            <Link href="mailto:ehdngv@naver.com" style={{ color: "dimgray" }}>
              ehdngv@naver.com
            </Link>
          </Timeline.Item>
        </Timeline>
      </div>
      <div className="footer-content">
        <Divider>
          <UserOutlined />
          &nbsp;개발자1
        </Divider>
        <Timeline>
          <Timeline.Item
            dot={
              <MailOutlined
                className="timeline-clock-icon"
                style={{ color: "skyblue" }}
              />
            }
          >
            <Link href="mailto:ehdngv@naver.com" style={{ color: "dimgray" }}>
              ehdngv@naver.com
            </Link>
          </Timeline.Item>
          <Timeline.Item
            dot={
              <GithubOutlined
                className="timeline-clock-icon"
                style={{ color: "dimgray" }}
              />
            }
          >
            <Link
              href="https://github.com/Dokeey/"
              style={{ color: "dimgray" }}
            >
              https://github.com/Dokeey
            </Link>
          </Timeline.Item>
        </Timeline>
      </div>

      <div className="footer-content">
        <Divider>
          <UserOutlined />
          &nbsp;개발자2
        </Divider>
        <Timeline>
          <Timeline.Item
            dot={
              <MailOutlined
                className="timeline-clock-icon"
                style={{ color: "skyblue" }}
              />
            }
          >
            <Link href="mailto:thflthdi@naver.com" style={{ color: "dimgray" }}>
              thflthdi@naver.com
            </Link>
          </Timeline.Item>
          <Timeline.Item
            dot={
              <GithubOutlined
                className="timeline-clock-icon"
                style={{ color: "dimgray" }}
              />
            }
          >
            <Link
              href="https://github.com/thflthdi/"
              style={{ color: "dimgray" }}
            >
              https://github.com/thflthdi
            </Link>
          </Timeline.Item>
        </Timeline>
      </div>
    </div>
  );
};
