import React, { useState, useEffect } from "react";
import { Radio, Drawer, Button } from "antd";
import { useAppContext } from "store";
import Axios from "axios";
import { setToken } from "store";
import {
  SettingFilled,
  ManOutlined,
  WomanOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { setIsMatch } from "store";
import { setIsLogin } from "store";

export function UserInfo({ signal }) {
  const {
    store: { jwtToken, is_login },
    dispatch,
  } = useAppContext();
  const [userInfo, setUserInfo] = useState({ gender: "", want_match: "" });
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const userSubmit = async () => {
    try {
      setLoading(true);
      if (userInfo.pk) {
        dispatch(setIsMatch(false));
        const headers = { Authorization: `JWT ${jwtToken}` };
        const response = await Axios.put(
          `http://localhost/accounts/users/${userInfo.pk}/`,
          { ...userInfo },
          { headers }
        );
        setUserInfo(response.data);
        setLoading(false);
        onDrawerClose();
      } else {
        const response = await Axios.post("http://localhost/accounts/users/", {
          ...userInfo,
        });
        setUserInfo(response.data);
        dispatch(setToken(response.data.token, response.data.pk));
        setLoading(false);
        onDrawerClose();
        dispatch(setIsLogin(true));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onDrawerClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!is_login) {
      showDrawer();
      dispatch(setIsLogin(true));
    }
  }, [is_login, dispatch]);

  return (
    <div>
      <>
        {jwtToken ? (
          <SettingFilled
            onClick={showDrawer}
            style={{ fontSize: "40px", color: "#43d5d2" }}
          />
        ) : (
          <SettingOutlined
            onClick={showDrawer}
            style={{ fontSize: "40px", color: "#43d5d2" }}
          />
        )}
        <Drawer
          //   mask={false}
          maskStyle={{
            backgroundColor: "transparent",
          }}
          //   title="SETTING"
          placement="left"
          closable={true}
          onClose={onDrawerClose}
          visible={visible}
          style={{
            boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 1)",
          }}
        >
          <div>
            <p style={{ marginBottom: 24, textAlign: "center" }}>
              <SettingOutlined />
              &nbsp;SETTING
            </p>
            <hr style={h1} />
            <div
              style={{
                marginTop: "30px",
                fontWeight: "bold",
                fontSize: "20px",
                color: "skyblue",
              }}
            >
              저는
            </div>
            <div style={{ textAlign: "center" }}>
              <Radio.Group
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, gender: e.target.value }))
                }
                buttonStyle="solid"
                size="large"
                style={{
                  margin: "10px 0 10px 0",
                  borderRadius: "12px",
                }}
              >
                <Radio.Button style={Radio_Button} value="M">
                  <ManOutlined />
                  &nbsp;남자
                </Radio.Button>
                <Radio.Button style={Radio_Button} value="F">
                  <WomanOutlined />
                  &nbsp;여자
                </Radio.Button>
              </Radio.Group>
            </div>
            <div style={{ textAlign: "right", marginBottom: "30px" }}>
              입니다.
            </div>
            <hr style={h1} />
            <div
              style={{
                marginTop: "30px",
                fontWeight: "bold",
                fontSize: "20px",
                color: "hotpink",
              }}
            >
              상대방은 &nbsp;
            </div>
            <div style={{ textAlign: "center" }}>
              <Radio.Group
                onChange={(e) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    want_match: e.target.value,
                  }))
                }
                buttonStyle="solid"
                style={{ margin: "10px 0 10px 0", borderRadius: "12px" }}
                size="large"
              >
                <Radio.Button style={Radio_Button} value="M">
                  <ManOutlined />
                  &nbsp;남자
                </Radio.Button>
                <Radio.Button style={Radio_Button} value="F">
                  <WomanOutlined />
                  &nbsp;여자
                </Radio.Button>
                <Radio.Button style={Radio_Button} value="A">
                  <TeamOutlined />
                  &nbsp;아무나
                </Radio.Button>
              </Radio.Group>
            </div>
            <div style={{ textAlign: "right", marginBottom: "30px" }}>
              가 좋겠어요.
            </div>
            <hr style={h1} />
            <div
              style={{
                textAlign: "center",
                marginTop: "30px",
              }}
            >
              <Button
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px 0 gray",
                }}
                block
                type="primary"
                loading={loading}
                disabled={!userInfo.gender || !userInfo.want_match}
                size="large"
                onClick={userSubmit}
              >
                저장
              </Button>
            </div>
          </div>
        </Drawer>
      </>
    </div>
  );
}

const h1 = { borderTop: "1px solid #eaeaea" };

const Radio_Button = {
  borderRadius: "8px",
  border: "2px solid #43d5d2",
  margin: "3px 3px 0 3px",
  boxShadow: "0 2px 3px 0 gray",
  //   color: "dimgray",
};
