import React, { useState } from "react";
import { Row, Col, Select, Typography, Avatar, Card } from "antd";
import moment from "moment";
import { useGetCryptoNewsQuery } from "../services/cryptoNewsApi";
import { useGetCryptosQuery } from "../services/cryptoApi";
import Loader from "./Loader";

const { Text, Title } = Typography;
const { Option } = Select;

const demoImage =
  "https://images.pexels.com/photos/843700/pexels-photo-843700.jpeg";

const News = ({ simplified }) => {
  const count = simplified ? 6 : 12;

  const [newsCategory, setNewsCategory] = useState("Cryptocurrency");

  // SECTION Api Calls
  const { data: cryptoNews } = useGetCryptoNewsQuery({
    newsCategory,
    count,
  });
  const { data: cryptosList } = useGetCryptosQuery(100);

  if (!cryptoNews?.value) {
    return <Loader />;
  }

  return (
    <>
      <Row gutter={[24, 24]}>
        {!simplified && (
          <Col span={24}>
            <Select
              showSearch
              className="select-news"
              placeholder="Select a Crypto"
              optionFilterProp="children"
              onChange={(value) => setNewsCategory(value)}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="Cryptocurrency">Cryptocurrency</Option>
              {cryptosList?.data?.coins.map((coin) => (
                <Option value={coin.name} key={coin.uuid}>
                  {coin.name}
                </Option>
              ))}
            </Select>
          </Col>
        )}
        {cryptoNews.value.map((news, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card hoverable className="news-card">
              <a href={news.url} target="_blank" rel="noreferrer">
                <div className="news-image-container">
                  <Title className="news-title" level={4}>
                    {news.name}
                  </Title>
                  <img
                    style={{ maxWidth: "200px", maxHeight: "100px" }}
                    src={news?.image?.thumbnail?.contentUrl || demoImage}
                    alt="news"
                  />
                </div>
                <p>
                  {news.description > 100
                    ? `${news.description.substring(0, 100)}...`
                    : news.description}
                </p>

                <div className="provider-container">
                  <div>
                    <Avatar
                      src={
                        news.provider[0]?.image?.thumbnail?.contentUrl ||
                        demoImage
                      }
                      alt="news"
                    />

                    <Text className="provider-name">
                      {news.provider[0]?.name}
                    </Text>
                  </div>

                  <Text>
                    {moment(news.dataPublished).startOf("ss").fromNow()}
                  </Text>
                </div>
              </a>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default News;
