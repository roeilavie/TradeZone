import NewsItem from "./NewsItem";

export default function NewsGrid({ items }) {
  return (
    <div className="news-grid">
      {items.map((item, index) => (
        <NewsItem key={index} item={item} />
      ))}
    </div>
  );
}
