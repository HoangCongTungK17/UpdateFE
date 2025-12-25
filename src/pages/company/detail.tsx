import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ICompany } from "@/types/backend";
import { callFetchCompanyById } from "@/config/api";
import styles from "@/styles/client.module.scss";
import parse from "html-react-parser";
import { Col, Row, Spin, Breadcrumb } from "antd"; // Thay Skeleton bằng Spin cho đồng bộ
import { EnvironmentOutlined, GlobalOutlined } from "@ant-design/icons";

const ClientCompanyDetailPage = (props: any) => {
  const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id");

  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true);
        const res = await callFetchCompanyById(id);
        if (res?.data) {
          setCompanyDetail(res.data);
        }
        setIsLoading(false);
      }
    };
    init();
  }, [id]);

  return (
    // 1. Sử dụng class 'job-detail-section' để tái sử dụng style nền/spacing của trang Job
    <div className={styles["job-detail-section"]}>
      {/* Loading State */}
      {isLoading ? (
        <div
          style={{
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" tip="Đang tải thông tin công ty..." />
        </div>
      ) : (
        companyDetail &&
        companyDetail.id && (
          <>
            {/* 2. Header Section: Chứa Logo và Tên công ty */}
            <div className={styles["job-header-container"]}>
              <div className={styles["container"]}>
                {/* Breadcrumb điều hướng */}
                <Breadcrumb
                  style={{ marginBottom: 20 }}
                  items={[
                    { title: "Trang chủ", href: "/" },
                    { title: "Công ty", href: "/company" },
                    { title: companyDetail.name },
                  ]}
                />

                <div className={styles["header-content"]}>
                  {/* Logo Công ty */}
                  <img
                    className={styles["company-logo"]}
                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${
                      companyDetail?.logo
                    }`}
                    alt="Company Logo"
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = "/images/company/default-company.png";
                    }}
                  />

                  {/* Thông tin chính */}
                  <div className={styles["job-info-header"]}>
                    <h1 className={styles["job-title"]}>
                      {companyDetail.name}
                    </h1>
                    <div className={styles["job-meta"]}>
                      <span style={{ color: "#5E6670" }}>
                        <EnvironmentOutlined style={{ color: "#0A65CC" }} />
                        &nbsp;
                        {companyDetail?.address ?? "Đang cập nhật địa chỉ"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Main Content: Chia 2 cột */}
            <div className={styles["container"]}>
              <Row gutter={[24, 24]}>
                {/* Cột Trái: Giới thiệu công ty (Chiếm 16 phần) */}
                <Col span={24} md={16}>
                  <div className={styles["job-description-card"]}>
                    <h3>Giới thiệu công ty</h3>
                    <div style={{ marginTop: 15, lineHeight: "1.6" }}>
                      {parse(companyDetail?.description ?? "")}
                    </div>
                  </div>
                </Col>

                {/* Cột Phải: Thông tin liên hệ (Chiếm 8 phần) */}
                <Col span={24} md={8}>
                  <div className={styles["company-sidebar-card"]}>
                    <div className={styles["sidebar-title"]}>
                      Thông tin liên hệ
                    </div>

                    <div className={styles["info-row"]}>
                      <EnvironmentOutlined className={styles["icon"]} />
                      <div className={styles["text"]}>
                        <div>Địa chỉ</div>
                        <div>{companyDetail?.address ?? "Chưa cập nhật"}</div>
                      </div>
                    </div>

                    {/* Nếu backend có trả về website, hiển thị thêm ở đây (giả định) */}
                    {/* <div className={styles['info-row']}>
                                            <GlobalOutlined className={styles['icon']} />
                                            <div className={styles['text']}>
                                                <div>Website</div>
                                                <a href="#" target="_blank">Truy cập website</a>
                                            </div>
                                        </div> 
                                        */}
                  </div>
                </Col>
              </Row>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default ClientCompanyDetailPage;
