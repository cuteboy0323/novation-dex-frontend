import { useEffect, useState } from 'react';

// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

// ** Extra Components ** //
import { CopyToClipboard } from 'react-copy-to-clipboard';
// ** Types ** //

import useAuth from 'hooks/useAuth';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useWalletModal } from 'components/WalletModal';
import { Tooltip } from '@mui/material';
import { NETWORK_LIST } from 'config';
const initialNet = { icon: 'BSC.svg' };

const WalletButton = ({ sx }: any) => {
    const { login, logout } = useAuth();
    const { account, chainId } = useActiveWeb3React();
    const { onPresentConnectModal } = useWalletModal(login, logout);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [network, setnetwork] = useState(initialNet);

    useEffect(() => {
        if (account) {
            const _network = NETWORK_LIST.find((item) => item.chainId === chainId);
            setnetwork(_network);
        } else {
            const ethereum: any = window.ethereum;
            console.log(ethereum?.chainId);
            setnetwork(initialNet);
        }
    }, [account, chainId]);

    return account ? (
        <Button
            disableElevation
            disableFocusRipple
            disableTouchRipple
            disableRipple
            startIcon={
                <Box
                    component="img"
                    src={require(`assets/img/network/${network.icon}`)}
                    alt={'Wallet'}
                    sx={{
                        width: (theme) => theme.spacing(3)
                    }}
                />
            }
            endIcon={
                <Stack direction="row" spacing={1}>
                    <CopyToClipboard text={account} onCopy={() => setIsCopied(true)}>
                        <Tooltip
                            arrow
                            title={isCopied ? 'Copied to clipboard!' : 'Copy wallet address'}
                            onClose={() => setIsCopied(false)}
                        >
                            <IconButton component="span" sx={{ width: 24, height: 24, p: 0 }}>
                                <Box
                                    component="img"
                                    src={require('assets/img/icons/copy.svg').default}
                                    alt={'Wallet'}
                                    sx={{
                                        width: (theme) => theme.spacing(2.75)
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    </CopyToClipboard>
                    <Tooltip arrow title="Disconnect Wallet">
                        <IconButton onClick={logout} component="span" sx={{ width: 24, height: 24, p: 0 }}>
                            <Box
                                component="img"
                                src={require('assets/img/icons/disconnect.svg').default}
                                alt={'Wallet'}
                                sx={{
                                    width: (theme) => theme.spacing(3)
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                </Stack>
            }
            variant="outlined"
            sx={{
                fontSize: 16,
                padding: (theme) => theme.spacing(0.75, 2.25),
                border: '2px solid rgba(0, 172, 253, 0.5) !important',
                ...sx
            }}
        >
            {account && `... ${account.substring(account.length - 5)}`}
        </Button>
    ) : (
        <Button
            onClick={onPresentConnectModal}
            variant="outlined"
            sx={{
                letterSpacing: 3,
                fontSize: 16,
                padding: (theme) => theme.spacing(0.75, 2.25)
            }}
        >
            Connect Wallet
        </Button>
    );
};

export default WalletButton;
