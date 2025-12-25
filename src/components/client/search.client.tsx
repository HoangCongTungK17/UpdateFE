import { Button, Col, Form, Row, Select, notification } from "antd";
import {
  EnvironmentOutlined,
  MonitorOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { LOCATION_LIST } from "@/config/utils";
import { useEffect, useState } from "react";
import { callFetchAllSkill } from "@/config/api";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const SearchClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();

  const [optionsSkills, setOptionsSkills] = useState<
    { label: string; value: string }[]
  >([]);

  // Giữ nguyên logic fetch API
  useEffect(() => {
    const fetchSkill = async () => {
      let query = `page=1&size=100&sort=createdAt,desc`;
      const res = await callFetchAllSkill(query);
      if (res && res.data) {
        const arr =
          res?.data?.result?.map((item) => ({
            label: item.name as string,
            value: (item.id + "") as string,
          })) ?? [];
        setOptionsSkills(arr);
      }
    };
    fetchSkill();
  }, []);

  useEffect(() => {
    // Sync URL param với Form
    if (location.search) {
      const queryLocation = searchParams.get("location");
      const querySkills = searchParams.get("skills");
      if (queryLocation) {
        form.setFieldValue("location", queryLocation.split(","));
      }
      if (querySkills) {
        form.setFieldValue("skills", querySkills.split(","));
      }
    }
  }, [location.search]);

  const onFinish = async (values: any) => {
    let query = "";
    if (values?.location?.length) {
      query = `location=${values?.location?.join(",")}`;
    }
    if (values?.skills?.length) {
      query = values.location?.length
        ? query + `&skills=${values?.skills?.join(",")}`
        : `skills=${values?.skills?.join(",")}`;
    }

    if (!query) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: "Vui lòng chọn tiêu chí để search",
      });
      return;
    }
    navigate(`/job?${query}`);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="inline"
      style={{ width: "100%" }} // Form chiếm full chiều rộng
    >
      <Row gutter={[12, 12]} style={{ width: "100%" }} align="middle">
        {/* Input Skills */}
        <Col span={24} md={10}>
          <Form.Item name="skills" style={{ width: "100%", margin: 0 }}>
            <Select
              mode="multiple"
              allowClear
              showArrow={false}
              style={{ width: "100%" }}
              placeholder={
                <span style={{ color: "#999" }}>
                  <MonitorOutlined style={{ marginRight: 8 }} />
                  Tìm theo kỹ năng...
                </span>
              }
              optionLabelProp="label"
              options={optionsSkills}
              size="large"
              bordered={false} // Hỗ trợ bản AntD cũ
              variant="borderless" // Hỗ trợ bản AntD mới (5.13+)
            />
          </Form.Item>
        </Col>

        {/* Đường gạch ngăn cách (Chỉ hiện trên PC) */}
        <Col span={0} md={1}>
          <div
            style={{
              width: 1,
              height: 30,
              background: "#E4E5E8",
              margin: "0 auto",
            }}
          ></div>
        </Col>

        {/* Input Location */}
        <Col span={24} md={9}>
          <Form.Item name="location" style={{ width: "100%", margin: 0 }}>
            <Select
              mode="multiple"
              allowClear
              showArrow={false}
              style={{ width: "100%" }}
              placeholder={
                <span style={{ color: "#999" }}>
                  <EnvironmentOutlined style={{ marginRight: 8 }} />
                  Địa điểm làm việc...
                </span>
              }
              optionLabelProp="label"
              options={LOCATION_LIST}
              size="large"
              bordered={false}
              variant="borderless"
            />
          </Form.Item>
        </Col>

        {/* Nút Submit */}
        <Col span={24} md={4}>
          <Form.Item style={{ width: "100%", margin: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block // Nút full chiều rộng cột
              icon={<SearchOutlined />}
              style={{ height: 46 }} // Tăng chiều cao nút cho đẹp
            >
              Tìm kiếm
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchClient;
