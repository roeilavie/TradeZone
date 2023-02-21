import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useContext, useState } from "react";
import { ChartsContext } from "../scenes/global/Context";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { insertFavoriteToUser,deleteFavorite } from "../data/ServiceFunctions";
import Swal from "sweetalert2";

export default function NewsItem({ item, param, defaultClicked, handleFavorites}) {
  const websiteUrl = item.url;
  const website = websiteUrl.split("https://").pop().split("/")[0];
  const date = item.publishedAt;
  const formatDate = date.replace("T", " ");
  const formatTime = formatDate.replace("Z", "");
  const { userLogged } = useContext(ChartsContext);
  const [isClicked, setIsClicked] = useState(defaultClicked);
  const addToFavorites = () => {
    if (!userLogged.IsLogged) {
      alert("you need to sign in first");
      return;
    }
    setIsClicked(true);
    //Insert favorites to DB
    let defaultValue = getNotEmptyValue(
      item.author,
      item.Journal,
      item.source.name
    );

    let fav = {
      Author: item.author != "" ? item.author : defaultValue,
      Content: item.content,
      Description: item.description,
      PublishedAt: item.publishedAt,
      Journal: item.Journal != undefined ? item.Journal : defaultValue,
      Url: item.url,
      Picture: item.urlToImage,
      UserId: userLogged.UserId,
    };
    insertFavoriteToUser(fav).then((result) => {
      if (result == 1) {
        Swal.fire("Added to favorites successfully!", "success");
        return;
      } else {
        Swal.fire({
          title: "This article already in your favorites",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
        setIsClicked(false);
      }
    });
  };

  const favoriteRemove = () => {
    //Remove favorites from DB
    let fav = {
      Url: item.url,
      UserId: userLogged.UserId,
    };
    deleteFavorite(fav).then((result) => {
      Swal.fire("Article removed successfully!", "success");
    });
    //Handling only if we are on the My favorite component.
    defaultClicked == false ? setIsClicked(false) : setIsClicked(true);
    if (defaultClicked == true) {
      handleFavorites(item.url);
      return;
    }
    
  };

  return (
      <div className="article">
        <a href={item.url} target="_blank">
          <div className="article-image">
            <img src={item.urlToImage} alt={item.title} />
          </div>
        </a>
        <div className="article-content">
          <div className="article-source">
            <img
              src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${website}&size=16`}
              // alt={item.source.id != null ? item.source.id : ""}
            />
            {/* <span>{item.source.name}</span> */}
            <span
              style={{ position: "absolute", right: 10, cursor: "pointer" }}
            >
              {!isClicked && <FavoriteBorderIcon onClick={addToFavorites} />}
              {isClicked && <FavoriteIcon onClick={favoriteRemove} />}
            </span>
          </div>
          <div className="article-title">
            <h2>{item.title}</h2>
          </div>
          <p>{item.description}</p>
          <div>
            <small>
              <b>Published At: </b>
              {formatTime}
            </small>
          </div>
        </div>
      </div>
  );
}

export const getNotEmptyValue = (str1, str2, str3) => {
  if (str1 != null || str1 != "") return str1;
  if (str2 != null || str2 != "") return str2;
  if (str3 != null || str3 != "") return str3;
};
