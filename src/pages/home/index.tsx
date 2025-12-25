import { Divider, Col, Row } from "antd";
import styles from "@/styles/client.module.scss";
import SearchClient from "@/components/client/search.client";
import JobCard from "@/components/client/card/job.card";
import CompanyCard from "@/components/client/card/company.card";

const HomePage = () => {
  return (
    <div className={styles["homepage-container"]}>
      {/* --- HERO SECTION (Giữ nền trắng) --- */}
      <div className={styles["hero-section"]}>
        <div className={styles["container"]}>
          {/* ... (Giữ nguyên nội dung Hero cũ của bạn) ... */}
          <div className={styles["hero-content"]}>
            <h1 className={styles["title"]}>
              Tìm Kiếm Cơ Hội <br />
              <span>Việc Làm Tốt Nhất</span> Của Bạn
            </h1>
            <p className={styles["subtitle"]}>
              Hàng ngàn tin tuyển dụng IT chất lượng cao đang chờ đón bạn ứng
              tuyển.
            </p>

            <div className={styles["search-box"]}>
              <SearchClient />
            </div>
          </div>
        </div>
      </div>

      {/* --- BODY SECTION (Thêm nền xám ở đây) --- */}
      <div className={styles["bg-grey"]}>
        <div className={styles["container"]}>
          {/* Section: Top Công Ty */}
          {/* Dùng Divider kiểu mới cho gọn */}
          <div style={{ marginBottom: 20, marginTop: 10 }}>
            <CompanyCard />
          </div>

          <div style={{ margin: 50 }}></div>

          {/* Section: Việc làm mới nhất */}
          <JobCard />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
