import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function NewsItem({ item }) {
  const websiteUrl = item.url;
  const website = websiteUrl.split("https://").pop().split("/")[0];
  const date = item.publishedAt;
  const formatDate = date.replace("T", " ");
  const formatTime = formatDate.replace("Z", "");

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
            alt={item.source.id}
          />
          <span>{item.source.name}</span>
          <span style={{ position: "absolute", right: 10, cursor: "pointer" }}>
            <FavoriteBorderIcon />
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
