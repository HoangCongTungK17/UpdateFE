// src/components/client/header.client.tsx

import { useState, useEffect } from "react";
import {
  CodeOutlined,
  ContactsOutlined,
  FireOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  RiseOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Drawer,
  Dropdown,
  MenuProps,
  Space,
  message,
  Menu,
  Button,
} from "antd"; // Thêm Button
import styles from "@/styles/client.module.scss";
import { isMobile } from "react-device-detect";
import { FaReact } from "react-icons/fa";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { callLogout } from "@/config/api";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import ManageAccount from "./modal/manage.account";

const Header = (props: any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state.account.user);
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

  const [current, setCurrent] = useState("home");
  const location = useLocation();

  const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  const items: MenuProps["items"] = [
    {
      label: <Link to={"/"}>Trang Chủ</Link>,
      key: "/",
      icon: <TwitterOutlined />,
    },
    {
      label: <Link to={"/job"}>Việc Làm IT</Link>,
      key: "/job",
      icon: <CodeOutlined />,
    },
    {
      label: <Link to={"/company"}>Top Công ty IT</Link>,
      key: "/company",
      icon: <RiseOutlined />,
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && +res.statusCode === 200) {
      dispatch(setLogoutAction({}));
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  const itemsDropdown = [
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => setOpenManageAccount(true)}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "manage-account",
      icon: <ContactsOutlined />,
    },
    ...(user.role?.permissions?.length
      ? [
          {
            label: <Link to={"/admin"}>Trang Quản Trị</Link>,
            key: "admin",
            icon: <FireOutlined />,
          },
        ]
      : []),
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  const itemsMobiles = [...items, ...itemsDropdown];

  return (
    <>
      <div className={styles["header-section"]}>
        <div className={styles["container"]}>
          {!isMobile ? (
            <>
              <div className={styles["brand"]} onClick={() => navigate("/")}>
                <FaReact />
                <span className={styles["brand-text"]}>
                  JOB<span style={{ color: "#0A65CC" }}>FINDER</span>
                </span>
              </div>

              <div className={styles["top-menu"]}>
                <Menu
                  onClick={onClick}
                  selectedKeys={[current]}
                  mode="horizontal"
                  items={items}
                  style={{ minWidth: 400 }}
                />

                <div className={styles["extra"]}>
                  {isAuthenticated === false ? (
                    <Space>
                      <Link to={"/login"}>Đăng Nhập</Link>
                      <Button
                        type="primary"
                        onClick={() => navigate("/register")}
                      >
                        Đăng Ký
                      </Button>
                    </Space>
                  ) : (
                    <Dropdown
                      menu={{ items: itemsDropdown }}
                      trigger={["click"]}
                    >
                      <Space style={{ cursor: "pointer" }}>
                        <Avatar
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/avatar/${user?.name}`}
                        >
                          {user?.name?.substring(0, 2)?.toUpperCase()}
                        </Avatar>
                        <span>{user?.name}</span>
                      </Space>
                    </Dropdown>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={styles["header-mobile"]}>
              <span>JOB FINDER</span>
              <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
            </div>
          )}
        </div>
      </div>

      <Drawer
        title="Chức năng"
        placement="right"
        onClose={() => setOpenMobileMenu(false)}
        open={openMobileMenu}
      >
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="vertical"
          items={itemsMobiles}
        />
      </Drawer>

      <ManageAccount open={openMangeAccount} onClose={setOpenManageAccount} />
    </>
  );
};

export default Header;
