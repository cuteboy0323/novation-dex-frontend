import { useState, useEffect } from 'react';

// ** Material UI Components ** //
import Stack from '@mui/material/Stack';

// ** Custom Components ** //
import NovationTab from './NovationTab';

// ** Hooks ** //
import { useLocation } from 'react-router-dom';

const NovationTabs = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<string>('dashboard');

    useEffect(() => {
        const pathname = location.pathname;
        const active = pathname.split('/')[1];
        if (!active || active === '') {
            setActiveTab('dashboard');
        } else {
            setActiveTab(active);
        }
    }, [location]);

    return (
        <Stack
            direction={{ xs: 'row', sm: 'column' }}
            spacing={{ xs: 5, sm: 3 }}
            sx={{ width: '100%' }}
            justifyContent={{ xs: 'center', sm: 'flex-start' }}
        >
            <NovationTab
                active={activeTab}
                icon={require('assets/img/icons/home.svg').default}
                label="Home"
                value="dashboard"
                path="/"
            />
            <NovationTab
                active={activeTab}
                icon={require('assets/img/icons/launchpad.svg').default}
                label="Launchpad"
                value="launchpad"
                path="/launchpad"
            />
            <NovationTab
                active={activeTab}
                icon={require('assets/img/icons/swap.svg').default}
                label="Swap"
                value="swap"
                path="/swap"
            />
            <NovationTab
                active={activeTab}
                icon={require('assets/img/icons/rewards.svg').default}
                label="Rewards"
                value="rewards"
                path="/rewards"
            />
        </Stack>
    );
};

export default NovationTabs;
