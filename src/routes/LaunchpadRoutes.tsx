import { lazy } from 'react';

// project imports
import Layout from 'layouts';
import Loadable from 'components/Loadable';

const Welcome = Loadable(lazy(() => import('pages/Launchpad')));
const Create = Loadable(lazy(() => import('pages/Launchpad/Create')));
const List = Loadable(lazy(() => import('pages/Launchpad/List')));
const View = Loadable(lazy(() => import('pages/Launchpad/View')));
const Manage = Loadable(lazy(() => import('pages/Launchpad/Manage')));

const LaunchpadRoutes = {
    path: '/launchpad',
    element: <Layout />,
    children: [
        {
            index: true,
            element: <Welcome />
        },
        {
            path: 'list',
            element: <List />
        },
        {
            path: 'create',
            element: <Create />
        },
        {
            path: 'view',
            element: <View />
        },
        {
            path: 'manage',
            element: <Manage />
        }
    ]
};

export default LaunchpadRoutes;
