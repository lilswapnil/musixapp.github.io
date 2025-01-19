import { useParams } from "react-router-dom";
import articleContent from "../article-content";

export default function ArticlePage() {
    const { name } = useParams();
    const article = articleContent.find(article => article.name === name);
    return (
        <div>
            <h1>{article.title}</h1>
            {article.content.map((paragraph, key) => (
                <p key={key}>{paragraph}</p>
            ))}
        </div>
    )
}