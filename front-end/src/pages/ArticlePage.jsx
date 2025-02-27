import { useParams, useLoaderData } from "react-router-dom";
import articleContent from "../article-content";

export default function ArticlePage() {
    const { name } = useParams();
    const { upvotes, comments } = useLoaderData();
    const article = articleContent.find(article => article.name === name);
    return (
        <div>
            <h1> Article: { name }</h1>
            <h1>{article.title}</h1>
            <p>Upvotes: {upvotes}</p>
            {article.content.map((paragraph, key) => (
                <p key={key}>{paragraph}</p>
            ))}
            <h3>Comments</h3>
            {comments.map((comment, index) => (
                <div key={index}>
                    <p><strong>{comment.postedBy}</strong>: {comment.text}</p>
                </div>
            ))}
        </div>
    )
}