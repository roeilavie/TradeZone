import { Box } from "@mui/material";
import { useEffect } from "react";
import Header from "../../components/Header";

const News = () => {
  useEffect(() => {
    const url =
      "https://reuters-business-and-financial-news.p.rapidapi.com/article-date/01-04-2021";

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "2bc871f75dmsh2663209cc5cb965p1bf706jsne56a67f1d95d",
        "X-RapidAPI-Host": "reuters-business-and-financial-news.p.rapidapi.com",
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => console.error("error:" + err));
  }, []);

  return (
    <Box m="20px">
      <Header title="News" subtitle="World News" />
    </Box>
  );
};

export default News;
