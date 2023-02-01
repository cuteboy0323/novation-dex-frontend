import { useState, useEffect, useMemo } from 'react';

// ** Material UI Components ** //
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';

import { rubicTokens, sellLessTokens } from 'config/constants/tokens';
import { formatNumber, fromWei, toBigNumber, toWei } from 'utils/bigNumber';

// ** Hooks ** //
import useApi from 'hooks/useApi';
import useConfig from 'hooks/useConfig';
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Types ** //
import { ThemeOptions } from '@mui/material';

import CoinGecko from 'coingecko-api';

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

const TokenListItem = ({
    token,
    onTokenSelect,
    onImportNewToken,
    onRemoveCustomToken,
    onClose,
    detail,
    base,
    quote,
    tokenList,
    target,
    isNewToken = false,
    setSearch
}: any) => {
    const [tokenIcon, setTokenIcon] = useState<string>();

    const { balances } = useApi();
    const { rubicCustomTokens, tokenLogo } = useConfig();
    const isCustomToken = rubicCustomTokens[token];
    const isDefaultToken = rubicTokens[token];

    const isMobile = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

    useEffect(() => {
        if (!detail.address || (detail.icon && detail.icon !== '')) return;
        try {
            const internalLogo = require(`assets/img/tokens/${detail?.symbol?.toLowerCase()}.svg`);
            setTokenIcon(internalLogo);
        } catch {
            const logo = tokenLogo[detail.address];
            if (logo) {
                setTokenIcon(logo === 'non-exist' ? require('assets/img/logo.png') : logo);
            } else {
                CoinGeckoClient.coins.fetchCoinContractInfo(detail.address, 'binance-smart-chain').then(({ data }) => {
                    setTokenIcon(data?.image?.large);
                });
            }
        }
    }, [detail.address]);

    const TokenBalance = () => {
        const entries = Object.entries(balances);
        const balance = entries.find(([address, value]: any) => address === detail.address);
        if (balance) {
            const [address, value] = balance;
            const tl = Object.entries(tokenList).find(([t, d]: [string, any]) => d.address === address) as any;
            const [id, { decimals }] = tl;

            const ethValue = fromWei(value, decimals);
            const isGreaterThan10 = toBigNumber(value).isGreaterThan(toWei(10 ** 10));

            return (
                <Typography id={id}>
                    {!isMobile
                        ? formatNumber(ethValue)
                        : `${formatNumber(ethValue)?.substring(0, isGreaterThan10 ? 10 : ethValue.length)}${
                              isGreaterThan10 ? ' ...' : ''
                          }`}
                </Typography>
            );
        }
        return (
            <Typography>
                <Skeleton sx={{ minWidth: 80, maxWidth: 100 }} />
            </Typography>
        );
    };

    return (
        <ListItem disablePadding>
            <ListItemButton
                onClick={() => {
                    if (isNewToken) return;
                    onTokenSelect(detail, target);
                    onClose();
                }}
                disabled={(() => {
                    if (detail.address === base?.address && target === 'base') return true;
                    if (detail.address === quote?.address && target === 'quote') return true;
                    return false;
                })()}
                sx={{
                    borderRadius: 1,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'divider',
                    mb: 1
                }}
            >
                <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Avatar
                        src={(() => {
                            if (detail.icon && detail.icon !== '') return detail.icon;
                            if (tokenIcon) return tokenIcon;
                            try {
                                return require(`assets/img/tokens/${detail?.symbol?.toLowerCase()}.svg`);
                            } catch (e) {
                                return require('assets/img/logo.png');
                            }
                        })()}
                        sx={{
                            width: 32,
                            height: 32
                        }}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={detail?.symbol}
                    secondary={detail?.name}
                    secondaryTypographyProps={{
                        component: 'div',
                        sx: {
                            fontSize: 14,
                            textTransform: 'uppercase'
                        }
                    }}
                />
                <Stack
                    sx={{
                        marginRight: isCustomToken && !isDefaultToken ? 4 : 0
                    }}
                >
                    {(() => {
                        if (isNewToken) {
                            if (isMobile) {
                                return (
                                    <Tooltip title="Import Token" arrow>
                                        <IconButton
                                            onClick={() => {
                                                onImportNewToken({
                                                    ...detail,
                                                    icon: tokenIcon
                                                });
                                                setSearch('');
                                            }}
                                            sx={{ bgcolor: 'rgba(255, 255, 255, .05)' }}
                                        >
                                            <PlaylistAddRoundedIcon />
                                        </IconButton>
                                    </Tooltip>
                                );
                            }
                            return (
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        onImportNewToken({
                                            ...detail,
                                            icon: tokenIcon
                                        });
                                        setSearch('');
                                    }}
                                >
                                    Import
                                </Button>
                            );
                        } else return <TokenBalance />;
                    })()}
                </Stack>
            </ListItemButton>
            {isCustomToken && !isNewToken && !isDefaultToken && (
                <IconButton
                    onClick={() => {
                        onRemoveCustomToken(token);
                        setSearch('');
                    }}
                    size="small"
                    sx={{
                        marginLeft: 1,
                        position: 'absolute',
                        right: isMobile ? 16 : 8,
                        top: 'calc(50% - 4px)',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255, 255, 255, .045)'
                    }}
                >
                    <CloseRoundedIcon fontSize="small" />
                </IconButton>
            )}
        </ListItem>
    );
};

const TokenList = ({
    tokenList,
    onTokenSelect,
    activeNetwork,
    onClose,
    search,
    setSearch,
    newToken,
    activeToken = {},
    target
}: any) => {
    const { base, quote } = activeToken;
    const { onImportNewRubicToken, onRemoveRubicCustomToken } = useConfig();

    const isFitBySearch = (data: any, searchKey: any) => {
        const tokenName = data.name.toLowerCase() as string;
        const tokenAddress = data.address.toLowerCase() as string;
        const tokenSymbol = data.symbol.toLowerCase() as string;
        return tokenName.includes(searchKey) || tokenAddress === searchKey || tokenSymbol.includes(searchKey);
    };

    const activeTokenList = useMemo(() => {
        return Object.entries(tokenList).filter(
            ([, detail]: [string, any]) => detail.chainId === activeNetwork.chainId
        );
    }, [activeNetwork, tokenList]);

    return (
        <Stack
            sx={{
                px: { xs: 3, sm: 4 },
                pb: 2,
                maxHeight: { xs: 480, sm: 400 },
                height: { xs: 480, sm: 'unset' },
                overflow: 'auto'
            }}
        >
            <List sx={{ pt: 0 }}>
                {newToken.symbol && newToken.address !== sellLessTokens?.vfx?.address && (
                    <TokenListItem
                        tokenList={tokenList}
                        onTokenSelect={onTokenSelect}
                        onClose={onClose}
                        base={base}
                        quote={quote}
                        token={newToken.symbol?.toLowerCase()}
                        detail={newToken}
                        target={target}
                        isNewToken={true}
                        onImportNewToken={onImportNewRubicToken}
                        setSearch={setSearch}
                    />
                )}
                {activeTokenList.map((token) => {
                    const searchKey = search?.toLowerCase();
                    if (isFitBySearch(token[1], searchKey))
                        return (
                            <TokenListItem
                                key={token[0]}
                                tokenList={tokenList}
                                onTokenSelect={onTokenSelect}
                                onRemoveCustomToken={onRemoveRubicCustomToken}
                                onClose={onClose}
                                base={base}
                                quote={quote}
                                token={token[0]}
                                detail={token[1]}
                                target={target}
                                setSearch={setSearch}
                            />
                        );
                    return null;
                })}
            </List>
        </Stack>
    );
};

export default TokenList;
