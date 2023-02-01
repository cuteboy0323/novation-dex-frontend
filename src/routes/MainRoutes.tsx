import { lazy } from 'react';

// project imports
import Layout from 'layouts';
import Loadable from 'components/Loadable';

const Rewards = Loadable(lazy(() => import('pages/Rewards')));
const Swap = Loadable(lazy(() => import('pages/Swap')));
const ComingSoon = Loadable(lazy(() => import('pages/ComingSoon')));

const MainRoutes = {
    path: '/',
    element: <Layout />,
    children: [
        {
            path: '/rewards',
            element: <Rewards />
        },
        {
            path: '/swap',
            element: <Swap />,
            children: [
                {
                    path: ':active',
                    element: <Swap />,
                    children: [
                        {
                            path: ':address',
                            element: <Swap />
                        }
                    ]
                }
            ]
        },
        {
            path: '/dashboard',
            element: <ComingSoon />
        }
    ]
};

export default MainRoutes;
