import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import './App.css';
import HomePage from "./pages/HomePage";
import MyLibrary from "./pages/MyLibrary";
import Account from "./pages/Account";
import ArticlePage from "./pages/ArticlePage";
import Layout from "./Layout";
import NotFoundPage from './pages/NotFoundPage';
import SearchPage from './pages/SearchPage';
import AlbumPage from './pages/AlbumPage';
import ArtistPage from './pages/ArtistPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Callback from './pages/Callback'; // Import the Callback component
import axios from 'axios';

const routes = [{
  path: '/',
  element: <Layout />,
  errorElement: <NotFoundPage />,
  children: [{
    path: '/',
    element: <HomePage />
  },
  {
    path: '/my-library',
    element: <MyLibrary />
  },
  {
    path: '/account',
    element: <Account />
  },
  {
    path: '/my-library/:name',
    element: <ArticlePage />,
    loader: async ({ params }) => {
      const response = await axios.get(`/api/articles/${params.name}`);
      const { upvotes, comments } = response.data;
      return { upvotes, comments };
    }
  },
  {
    path: '/search',
    element: <SearchPage />
  },
  {
    path: '/album',
    element: <AlbumPage />
  },
  {
    path: '/artist',
    element: <ArtistPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/signup',
    element: <SignupPage />
  },
  {
    path: '/callback', // Add the callback route
    element: <Callback />
  },
]
}];

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
