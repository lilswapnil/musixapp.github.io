import { useParams } from "react-router-dom";
  
export default function ArticlePage() {
    const { name } = useParams();
    return (
       <h1> This is the {name} page</h1>
    )
}