import {Link} from 'react-router-dom';
import articles from "../article-content";
export default function MyLibrary() {
    return (
    <>
    <h1>Articles</h1>
    {articles.map(a => (
        <Link key={a.name} to= {'/my-library/' + a.name}>
            <h3>{a.title}</h3>
            <p>{a.content[0].substring(0, 150)}</p>
        </Link>
        
    ))}
    </>
    );
}