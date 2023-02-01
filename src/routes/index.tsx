import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LaunchpadRoutes from './LaunchpadRoutes';

import Loadable from 'components/Loadable';

const Home = Loadable(lazy(() => import('pages/Home')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([
        {
            index: true,
            element: <Home />
        },
        MainRoutes,
        LaunchpadRoutes
    ]);
}
