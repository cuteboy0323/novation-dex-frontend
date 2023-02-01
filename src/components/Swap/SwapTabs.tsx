// ** Material UI Components ** //
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabBottomLine from '../Items/TabBottomLine';

// ** Hooks ** //
import { useEffect, useMemo, useState } from 'react';
import { useSwapContract } from 'hooks/useContract';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

const SwapTabs = (props: any) => {
    const { value, onChange } = props;

    const { account } = useActiveWeb3React();
    const swapContract = useSwapContract();

    const [owner, setOwner] = useState<string>();

    const isAdmin = useMemo(() => {
        if (!account || !owner) return;
        return account.toLowerCase() === owner.toLowerCase();
    }, [account, owner]);

    useEffect(() => {
        swapContract
            .owner()
            .then(setOwner)
            .catch((e) => setOwner(''));
    }, [account, swapContract]);

    return (
        <Stack>
            <Tabs value={value} onChange={onChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                <Tab value="sellless" label="Sell Less" />
                <Tab value="cross" label="Cross Chain" />
                <Tab value="other" label="Other" />
                <Tab value="liquidity" label="Liquidity" />
                {isAdmin && <Tab value="..." label="..." />}
            </Tabs>
            <TabBottomLine />
        </Stack>
    );
};

export default SwapTabs;
