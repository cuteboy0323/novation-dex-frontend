import { useEffect, useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import NovationDialogTitle from 'components/Base/NovationDialogTitle';
import Search from './Search';
import TokenList from './TokenList';

import BEP20ABI from 'config/abi/bep20.json';

// ** Hooks ** //
import useApi from 'hooks/useApi';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useMediaQuery from '@mui/material/useMediaQuery';

import { isAddress } from 'utils';
import { multicallv2 } from 'utils/multicall';

// ** Types ** //
import { ThemeOptions } from '@mui/material';
import NetworkList from './NetworkList';
import useConfig from 'hooks/useConfig';

const PaperProps = {
    sx: {
        bgcolor: '#020B0F',
        backgroundImage: 'none',
        border: '2px solid #00ACFD',
        borderRadius: 2,
        margin: { xs: 0, sm: 4 },
        width: {
            xs: 'calc(100% - 48px)',
            sm: 'calc(100% - 64px)'
        }
    }
};

const TokenSelect = ({
    open,
    onClose,
    onTokenSelect,
    onNetworkSelect,
    activeNetwork,
    tokenList,
    activeToken,
    target
}: any) => {
    const { updateBalance } = useApi();
    const { account } = useActiveWeb3React();
    const { rubicCustomTokens } = useConfig();

    const allTokenList = { ...rubicCustomTokens, ...tokenList };

    const [search, setSearch] = useState<string>('');
    const [newToken, setNewToken] = useState<any>({});

    const [network, setNetwork] = useState(activeNetwork[target]);

    useEffect(() => {
        setNetwork(activeNetwork[target]);
    }, [target]);

    const handleSelectToken = (token: any) => {
        onNetworkSelect(network, target);
        onTokenSelect(token, target);
    };

    const isMobile = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

    useEffect(() => {
        if (!isAddress(search)) return setNewToken({});
        (async () => {
            const isExistToken = Object.entries(allTokenList).filter(
                ([token, detail]: [string, any]) => detail.address.toLowerCase() === search?.toLowerCase()
            ).length;
            if (!isExistToken) {
                const methods = ['decimals', 'name', 'symbol'];
                const calls = methods.map((method: string) => ({
                    address: search,
                    name: method
                }));
                const result = await multicallv2(BEP20ABI, calls);
                setNewToken((prevState) => ({
                    ...prevState,
                    chainId: network.chainId,
                    address: search,
                    name: result[1][0],
                    decimals: result[0][0]?.toNumber(),
                    symbol: result[2][0]
                }));
            } else {
                setNewToken({});
            }
        })();
    }, [search, tokenList, account, rubicCustomTokens]);

    useEffect(() => {
        updateBalance(allTokenList);
    }, [updateBalance, tokenList, rubicCustomTokens]);

    const TokenSelectModalContent = (
        <>
            <NovationDialogTitle id="swap-token-select-dialog" onClose={onClose}>
                Select a Token
            </NovationDialogTitle>
            <DialogContent
                dividers
                sx={{
                    minHeight: 85,
                    px: { xs: 3, sm: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    borderBottom: 'none'
                }}
            >
                <NetworkList target={target} activeNetwork={network} onNetworkSelect={setNetwork} />
            </DialogContent>
            <DialogContent
                dividers
                sx={{
                    minHeight: 85,
                    px: { xs: 3, sm: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    borderBottom: 'none'
                }}
            >
                <Search search={search} setSearch={setSearch} />
            </DialogContent>
            <TokenList
                target={target}
                activeToken={activeToken}
                search={search}
                setSearch={setSearch}
                tokenList={allTokenList}
                activeNetwork={network}
                onTokenSelect={handleSelectToken}
                onClose={onClose}
                newToken={newToken}
            />
        </>
    );

    if (isMobile) {
        return (
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                onOpen={() => {}}
                PaperProps={{
                    sx: {
                        bgcolor: '#020B0F',
                        backgroundImage: 'none',
                        borderTop: '2px solid #00ACFD',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10
                    }
                }}
            >
                {TokenSelectModalContent}
            </SwipeableDrawer>
        );
    }
    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            onClose={onClose}
            aria-labelledby="swap-token-select-dialog"
            open={open}
            sx={{
                paddingLeft: { xs: 0, sm: 'calc((78px + 36px + 42px) / 2)' }
            }}
            PaperProps={PaperProps}
        >
            {TokenSelectModalContent}
        </Dialog>
    );
};

export default TokenSelect;
