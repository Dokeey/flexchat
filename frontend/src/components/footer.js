import React from "react";
import { Timeline, Divider, Typography } from "antd";
import {
  GithubOutlined,
  UserOutlined,
  MailOutlined,
  InfoCircleOutlined,
  ProjectOutlined,
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
          <Timeline.Item
            dot={
              <GithubOutlined
                className="timeline-clock-icon"
                style={{ color: "dimgray" }}
              />
            }
          >
            <Link href="https://github.com/dokeey/flexchat">
              https://github.com/dokeey/flexchat
            </Link>
          </Timeline.Item>
          <Timeline.Item
            dot={<InfoCircleOutlined className="timeline-clock-icon" />}
            color="red"
          >
            친구 못 사귀어도 책임 안짐
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
            <Link href="mailto:ehdngv@naver.com">ehdngv@naver.com</Link>
          </Timeline.Item>
          <Timeline.Item
            dot={
              <GithubOutlined
                className="timeline-clock-icon"
                style={{ color: "dimgray" }}
              />
            }
          >
            <Link href="https://github.com/Dokeey/">
              https://github.com/Dokeey
            </Link>
          </Timeline.Item>
          <Timeline.Item
            dot={<InfoCircleOutlined className="timeline-clock-icon" />}
            color="red"
          >
            삼겹살을 좋아함
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
            <Link href="mailto:thflthdi@naver.com">thflthdi@naver.com</Link>
          </Timeline.Item>
          <Timeline.Item
            dot={
              <GithubOutlined
                className="timeline-clock-icon"
                style={{ color: "dimgray" }}
              />
            }
          >
            <Link href="https://github.com/thflthdi/">
              https://github.com/thflthdi
            </Link>
          </Timeline.Item>
          <Timeline.Item
            dot={<InfoCircleOutlined className="timeline-clock-icon" />}
            color="red"
          >
            강아지를 키움
          </Timeline.Item>
        </Timeline>
      </div>
    </div>
  );
};
