// ** React Methods ** //
import { useEffect, useState } from 'react';

// ** Material UI Components ** //

// ** Novation Custom Components ** //
import TabPanel from 'components/Base/NovationTabPanel';
import SwapTabs from 'components/Swap/SwapTabs';
import Wrapper from 'components/Swap/Wrapper';
import SwapHeader from 'components/Swap/SwapHeader';

// ** Each Tab Components ** //
import SellLess from './SellLess';
import OtherListings from './OtherListings';
import AddLiquidity from './AddLiquidity';
import Admin from './Admin';

import { useNavigate, useParams } from 'react-router-dom';
import Rubic from './Rubic';
// import useActiveWeb3React from 'hooks/useActiveWeb3React';

const Swap = () => {
    // const { library } = useActiveWeb3React();

    const [activeTab, setActiveTab] = useState<string>('sellless');
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleActiveTabChange = (event: React.SyntheticEvent, newTab: string) => {
        navigate(newTab);
    };
    const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleSettingsClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();
    const { active } = useParams();

    useEffect(() => {
        const activeTabs = ['sellless', 'cross', 'other', 'liquidity', '...'];
        if (activeTabs.includes(active)) {
            setActiveTab(active);
        }
    }, [active]);

    return (
        <Wrapper>
            <SwapHeader anchorEl={anchorEl} onClick={handleSettingsClick} onClose={handleSettingsClose} />
            <SwapTabs value={activeTab} onChange={handleActiveTabChange} />
            <TabPanel value={activeTab} index={'sellless'}>
                <SellLess />
            </TabPanel>
            <TabPanel value={activeTab} index={'cross'}>
                <Rubic />
            </TabPanel>
            <TabPanel value={activeTab} index={'other'}>
                <OtherListings />
            </TabPanel>
            <TabPanel value={activeTab} index={'liquidity'}>
                <AddLiquidity />
            </TabPanel>
            <TabPanel value={activeTab} index={'...'}>
                <Admin />
            </TabPanel>
        </Wrapper>
    );
};

export default Swap;
