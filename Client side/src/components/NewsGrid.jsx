import { useContext, useState } from "react";
import NewsItem from "./NewsItem";
import { ChartsContext } from "../scenes/global/Context";
import { getAllUserFavorites } from "../data/ServiceFunctions";

export default function NewsGrid({items, defaultClicked}) {
  const { userLogged } = useContext(ChartsContext);
  const [articles, setArticles] = useState(items);
  
  //Handle removing from favorites on myfavorite component.
  const handleFavorites = (url) =>{
    //setArticles(articles.filter((article)=> url !== article.url));
    if (!userLogged.IsLogged) navigate("/");
    getAllUserFavorites(userLogged.UserId).then((result) => {
      // Changing prop name using dot notation to match the item format in the NewsGrid component.
      result = changeObjProps(result);
      setArticles(result);
    });
  }
  return (
    <div className="news-grid">
      {articles.map((item, index) => (
        <NewsItem handleFavorites={handleFavorites} param={index} key={index} item={item} defaultClicked={defaultClicked}/>
      ))}
    </div>
  );
}

const changeObjProps = (arr) => {
  arr.map((item, index) => {
    item.url = item.Url;
    delete item.Url;

    item.author = item.Author;
    delete item.Author;

    item.content = item.Content;
    delete item.Content;

    item.description = item.Description;
    delete item.Description;

    item.publishedAt = item.PublishedAt;
    delete item.PublishedAt;

    item.source = item.Source;
    delete item.Source;
    item.title = item.Title;
    delete item.Title;

    item.urlToImage = item.Picture;
    delete item.Picture;
  });
  return arr;
};

