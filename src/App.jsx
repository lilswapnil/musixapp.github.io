import {
  createBrowserRouter,
  RouterProvider,
}  from 'react-router-dom'

import './App.css';
import HomePage from "./pages/HomePage";
import MyLibrary from "./pages/MyLibrary";
import Account from "./pages/Account";
import ArticlePage from "./pages/ArticlePage";
import Layout from "./Layout";
import NotFoundPage from './pages/NotFoundPage';


const routes = [{
  path: '/',
  element: <Layout />,
  errorElement: <NotFoundPage />,
  children: [{
    path: '/',
    element:<HomePage />
  },
  {
    path: '/my-library',
    element:<MyLibrary />
  },
  {
    path: '/account',
    element:<Account />
  },
  {
    path: '/my-library/:name', // > /my-library/albumname 
    element:<ArticlePage />
  },]
}]

const router = createBrowserRouter(routes);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
