import { Box } from "@mui/material";
import { useEffect } from "react";
import Header from "../../components/Header";

const News = () => {
  useEffect(() => {
    const url =
      "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=baa59cfa2f64449ab76cf4d1b718714f";
    fetch(url, {
      method: "GET",
    })
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
