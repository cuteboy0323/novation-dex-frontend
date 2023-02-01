import { useState, useEffect } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import NovationButton from 'components/Base/NovationButton';
import NovationDialogTitle from 'components/Base/NovationDialogTitle';

import BEP20ABI from 'config/abi/bep20.json';

import CoinGecko from 'coingecko-api';

// ** Hooks ** //
import useConfig from 'hooks/useConfig';
import useMediaQuery from '@mui/material/useMediaQuery';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

// ** Types ** //
import { ThemeOptions } from '@mui/material';

import { isAddress } from 'utils';
import { multicallv2 } from 'utils/multicall';

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

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

const TokenImport = ({ open, onClose, address }: any) => {
    const isMobile = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

    const [newToken, setNewToken] = useState<any>({});

    const { chainId } = useActiveWeb3React();

    const { onImportNewToken } = useConfig();

    useEffect(() => {
        if (!isAddress(address)) return setNewToken({});
        (async () => {
            try {
                const methods = ['decimals', 'name', 'symbol'];
                const calls = methods.map((method: string) => ({
                    address: address,
                    name: method
                }));
                const result = await multicallv2(BEP20ABI, calls);
                setNewToken({
                    address: address,
                    name: result[1][0],
                    decimals: result[0][0]?.toNumber(),
                    symbol: result[2][0]
                });

                try {
                    const { data } = await CoinGeckoClient.coins.fetchCoinContractInfo(
                        address?.toLowerCase(),
                        'binance-smart-chain'
                    );
                    if (data?.image?.large) {
                        setNewToken((prevState) => ({
                            ...prevState,
                            icon: data?.image?.large
                        }));
                    } else {
                        setNewToken((prevState) => ({
                            ...prevState,
                            icon: require('assets/img/logo.png')
                        }));
                    }
                } catch (e) {}
            } catch (e) {
                setNewToken({});
            }
        })();
    }, [address]);

    const TokenImportModalSelect = (
        <>
            <NovationDialogTitle id="import-token-dialog" onClose={onClose}>
                Import Tokens
            </NovationDialogTitle>
            <DialogContent>
                {newToken.symbol ? (
                    <>
                        <Alert severity="warning">
                            Anyone can create a BEP20 token on BNB Smart Chain {chainId === 97 ? 'Testnet' : ''} with
                            any name, including creating fake versions of existing tokens and tokens that claim to
                            represent projects that do not have a token. If you purchase an arbitrary token, you may be
                            unable to sell it back.
                        </Alert>
                        <List>
                            <ListItem>
                                <ListItemAvatar sx={{ minWidth: 44 }}>
                                    <Avatar
                                        src={newToken.icon}
                                        sx={{
                                            width: 32,
                                            height: 32
                                        }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${newToken.name} (${newToken.symbol})`}
                                    secondary={
                                        address
                                            ? `${address.substring(0, 5)} ... ${address.substring(address.length - 5)}`
                                            : ''
                                    }
                                />
                            </ListItem>
                        </List>
                        <NovationButton
                            onClick={() => {
                                onImportNewToken(newToken);
                                onClose();
                            }}
                            variant="outlined"
                            sx={{ boxShadow: 'none', height: 42 }}
                        >
                            Import
                        </NovationButton>
                    </>
                ) : (
                    <Alert severity="error">
                        Anyone can create a BEP20 token on BNB Smart Chain Testnet with any name, including creating
                        fake versions of existing tokens and tokens that claim to represent projects that do not have a
                        token. If you purchase an arbitrary token, you may be unable to sell it back.
                    </Alert>
                )}
            </DialogContent>
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
                {TokenImportModalSelect}
            </SwipeableDrawer>
        );
    }
    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            onClose={onClose}
            aria-labelledby="import-token-dialog"
            open={open}
            sx={{
                paddingLeft: { xs: 0, sm: 'calc((78px + 36px + 42px) / 2)' }
            }}
            PaperProps={PaperProps}
        >
            {TokenImportModalSelect}
        </Dialog>
    );
};

export default TokenImport;
