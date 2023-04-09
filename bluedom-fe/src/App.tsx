import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Leaderboards from './pages/Leaderboards';
import Play, { questLoader } from './pages/Play';
import Root from './pages/Root';
import Shop from './pages/Shop';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'leaderboards',
        element: <Leaderboards />,
      },
      {
        path: 'shop',
        element: <Shop />,
      },
      {
        path: 'quest/:questId',
        element: <Play />,
        loader: questLoader,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
