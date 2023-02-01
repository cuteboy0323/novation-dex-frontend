// ** React Methods ** //
import { useEffect, useState, useCallback } from 'react';

// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Link from '@mui/material/Link';
import { ThemeOptions } from '@mui/material';

// ** Custom Components ** //
import SpaceIcon from 'components/Items/SpaceIcon';
import TokenLogo from 'components/Logo/TokenLogo';

// ** Hooks ** //
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Types ** //
import { useDividendContract, useMainTokenContract, useTokenContract } from 'hooks/useContract';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useToast from 'hooks/useToast';
import useCatchTxError from 'hooks/useCatchTxError';

import { ethersToBigNumber, formatNumber, fromWei, toBigNumber } from 'utils/bigNumber';
import { DEADADDR } from 'config/constants/networks';

import { ToastDescriptionWithTx } from 'components/Toast';
import NovationButton from 'components/Base/NovationButton';
import { getBscScanLink } from 'utils';
import { getBnbBalance } from 'utils/web3';

const BUSDADDR = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';

const Dashboard = () => {
    const isMobile = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

    const { account } = useActiveWeb3React();
    const { toastSuccess } = useToast();
    const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError();

    const [data, setData] = useState<any>({});

    const tokenContract = useMainTokenContract();
    const dividendContract = useDividendContract();
    const busdContract = useTokenContract(BUSDADDR);

    const update = useCallback(() => {
        const UNLOCK_VAULT = process.env.REACT_APP_PUBLIC_UNLOCK_VAULT_ADDRESS;
        const DIAMOND_HEIST = process.env.REACT_APP_PUBLIC_DIAMOND_HEIST_ADDRESS;

        tokenContract.balanceOf(DEADADDR).then(async (result: any) => {
            const constValue = toBigNumber('1000000000000000').times(toBigNumber(10 ** 18));
            const totalSupply = await tokenContract.totalSupply();
            const burned = ethersToBigNumber(result).plus(constValue).minus(ethersToBigNumber(totalSupply));
            setData((prevState: any) => ({
                ...prevState,
                burned: burned
            }));
        });
        busdContract.balanceOf(UNLOCK_VAULT).then(async (result: any) => {
            const bnb = await getBnbBalance(UNLOCK_VAULT);
            setData((prevState: any) => ({
                ...prevState,
                unlockVault: {
                    busd: result,
                    bnb: bnb
                }
            }));
        });
        busdContract.balanceOf(DIAMOND_HEIST).then((result: any) => {
            setData((prevState: any) => ({
                ...prevState,
                diamondHeist: result
            }));
        });
        tokenContract.name().then((result: any) => {
            setData((prevState: any) => ({
                ...prevState,
                name: result
            }));
        });
        tokenContract.symbol().then((result: any) => {
            setData((prevState: any) => ({
                ...prevState,
                symbol: result
            }));
        });
        tokenContract.decimals().then((result: any) => {
            setData((prevState: any) => ({
                ...prevState,
                decimals: result
            }));
        });
        dividendContract.totalDistributed().then(async (result: any) => {
            const totalDividends = await dividendContract.totalDividends();
            const pendingOfBUSD = ethersToBigNumber(totalDividends).minus(ethersToBigNumber(result));
            setData((prevState: any) => ({
                ...prevState,
                totalDistributed: result,
                pendingOfBUSD
            }));
        });
        if (!account) return;
        tokenContract.balanceOf(account).then((result: any) => {
            setData((prevState: any) => ({
                ...prevState,
                balance: result
            }));
        });
        dividendContract.getUnpaidEarnings(account).then((result: any) => {
            setData((prevState: any) => ({
                ...prevState,
                pendingRewards: result
            }));
        });
        dividendContract.shares(account).then(({ totalRealised }: any) => {
            setData((prevState: any) => ({
                ...prevState,
                totalRealised: totalRealised
            }));
        });
    }, [account]);

    useEffect(() => {
        const interval = setInterval(() => {
            update();
        }, 12000);
        update();
        return () => clearInterval(interval);
    }, [update]);

    const claim = async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return dividendContract.claimDividend();
        });
        if (receipt?.status) {
            update();
            toastSuccess(
                'Claimed',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>You claimed rewards!.</ToastDescriptionWithTx>
            );
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                spacing={{ xs: 1, sm: 2.5 }}
                mb={5}
            >
                <Typography fontSize={36} fontWeight={500} lineHeight="36px">
                    Vault Finance
                </Typography>
                <Typography fontSize={14} fontWeight={500} lineHeight="20px" color="textSecondary">
                    VFX Rewards Dashboard
                </Typography>
            </Stack>
            <Grid container spacing={3.75}>
                <Grid item xs={12} sm={4}>
                    <Card variant="outlined" sx={{ height: '100%', minHeight: 260, position: 'relative' }}>
                        <CardContent>
                            <Stack>
                                <Typography color="primary" sx={{ opacity: 0.75 }} fontWeight={700}>
                                    BALANCE
                                </Typography>
                            </Stack>
                            <Stack
                                spacing={1}
                                sx={{
                                    position: 'absolute',
                                    zIndex: 2,
                                    top: '50%',
                                    left: '50%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                <TokenLogo>
                                    <Box
                                        component="img"
                                        src={require('assets/img/tokens/vfx.svg').default}
                                        alt="token-image"
                                        width="20px"
                                        height="20px"
                                    />
                                </TokenLogo>
                                <Typography fontSize={24} fontWeight={700}>
                                    {data.balance && data.decimals ? (
                                        formatNumber(fromWei(data.balance, data.decimals))
                                    ) : (
                                        <Skeleton
                                            animation="wave"
                                            variant="text"
                                            sx={{ minWidth: 80, maxWidth: '50%' }}
                                        />
                                    )}
                                </Typography>
                                <Typography fontSize={16} fontWeight={500}>
                                    {data.symbol ? (
                                        data.symbol
                                    ) : (
                                        <Skeleton
                                            animation="wave"
                                            variant="text"
                                            sx={{ minWidth: 80, maxWidth: '50%' }}
                                        />
                                    )}
                                </Typography>
                            </Stack>
                            <Box
                                component="img"
                                src={require('assets/img/items/looper.png')}
                                alt="Looper"
                                sx={{
                                    height: '100%',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)'
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Card variant="outlined" sx={{ py: { xs: 1, sm: 6 }, px: { xs: 1, sm: 2 } }}>
                        <CardContent component={Stack} spacing={3.75}>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                spacing={{ xs: 0.25, sm: 0 }}
                            >
                                <Typography fontSize={14} lineHeight="14px" color="textSecondary">
                                    Token Name
                                </Typography>
                                <SpaceIcon />
                                <Typography fontSize={14} lineHeight="14px" textTransform="uppercase">
                                    {data.name ? (
                                        data.name
                                    ) : (
                                        <Skeleton
                                            animation="wave"
                                            variant="text"
                                            sx={{ minWidth: 80, maxWidth: '50%' }}
                                        />
                                    )}
                                </Typography>
                            </Stack>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                spacing={{ xs: 0.25, sm: 0 }}
                            >
                                <Typography fontSize={14} lineHeight="14px" color="textSecondary">
                                    Symbol
                                </Typography>
                                <SpaceIcon />
                                <Typography fontSize={14} lineHeight="14px" textTransform="uppercase">
                                    {data.symbol ? (
                                        `$${data.symbol}`
                                    ) : (
                                        <Skeleton
                                            animation="wave"
                                            variant="text"
                                            sx={{ minWidth: 80, maxWidth: '50%' }}
                                        />
                                    )}
                                </Typography>
                            </Stack>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                spacing={{ xs: 0.25, sm: 0 }}
                            >
                                <Typography fontSize={14} lineHeight="14px" color="textSecondary">
                                    Decimals
                                </Typography>
                                <SpaceIcon />
                                <Typography fontSize={14} lineHeight="14px" textTransform="uppercase">
                                    {data.decimals ? (
                                        data.decimals.toString()
                                    ) : (
                                        <Skeleton
                                            animation="wave"
                                            variant="text"
                                            sx={{ minWidth: 80, maxWidth: '50%' }}
                                        />
                                    )}
                                </Typography>
                            </Stack>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                spacing={{ xs: 0.25, sm: 0 }}
                            >
                                <Typography fontSize={14} lineHeight="14px" color="textSecondary">
                                    VFX Contract Address
                                </Typography>
                                <SpaceIcon />
                                <Link
                                    href={getBscScanLink(tokenContract.address, 'token')}
                                    underline="none"
                                    color="inherit"
                                    target="_blank"
                                >
                                    {isMobile ? (
                                        <Typography fontSize={14} lineHeight="14px" textTransform="none">
                                            {`${tokenContract.address.substring(
                                                0,
                                                15
                                            )} ... ${tokenContract.address.substring(
                                                tokenContract.address.length - 10
                                            )}`}
                                        </Typography>
                                    ) : (
                                        <Typography fontSize={14} lineHeight="14px" textTransform="none">
                                            {tokenContract.address}
                                        </Typography>
                                    )}
                                </Link>
                            </Stack>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                spacing={{ xs: 0.25, sm: 0 }}
                            >
                                <Typography fontSize={14} lineHeight="14px" color="textSecondary">
                                    BUSD Contract Address
                                </Typography>
                                <SpaceIcon />
                                <Link
                                    href={getBscScanLink(BUSDADDR, 'token')}
                                    underline="none"
                                    color="inherit"
                                    target="_blank"
                                >
                                    {isMobile ? (
                                        <Typography fontSize={14} lineHeight="14px" textTransform="none">
                                            {`${BUSDADDR.substring(0, 15)} ... ${BUSDADDR.substring(
                                                BUSDADDR.length - 10
                                            )}`}
                                        </Typography>
                                    ) : (
                                        <Typography fontSize={14} lineHeight="14px" textTransform="none">
                                            {BUSDADDR}
                                        </Typography>
                                    )}
                                </Link>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Grid container spacing={3.75}>
                        <Grid item xs={12} sm={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack direction="row" spacing={1}>
                                        <TokenLogo>
                                            <Box
                                                component="img"
                                                src={require('assets/img/tokens/busd.svg').default}
                                                alt="token-image"
                                                width="20px"
                                                height="20px"
                                            />
                                        </TokenLogo>
                                        <Stack
                                            direction={{ xs: 'row', sm: 'column' }}
                                            spacing={{ xs: 1, sm: 0 }}
                                            justifyContent="center"
                                            alignItems={{ xs: 'center', sm: 'flex-start' }}
                                        >
                                            <Typography
                                                fontSize={{ xs: 18, sm: 14 }}
                                                fontWeight={700}
                                                lineHeight="20px"
                                            >
                                                {data.totalRealised ? (
                                                    formatNumber(fromWei(data.totalRealised))
                                                ) : (
                                                    <Skeleton
                                                        animation="wave"
                                                        variant="text"
                                                        sx={{ minWidth: 80, maxWidth: '50%' }}
                                                    />
                                                )}
                                            </Typography>
                                            <Typography
                                                fontSize={{ xs: 18, sm: 14 }}
                                                fontWeight={500}
                                                lineHeight="20px"
                                            >
                                                BUSD
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        sx={{
                                            pt: { xs: 4, sm: 7 },
                                            height: 40,
                                            justifyContent: 'flex-end'
                                        }}
                                    >
                                        <Typography
                                            fontSize={14}
                                            fontWeight={500}
                                            lineHeight="20px"
                                            color="textSecondary"
                                        >
                                            Your Total Rewards Earned
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack direction="row" spacing={1}>
                                        <TokenLogo>
                                            <Box
                                                component="img"
                                                src={require('assets/img/tokens/busd.svg').default}
                                                alt="token-image"
                                                width="20px"
                                                height="20px"
                                            />
                                        </TokenLogo>
                                        <Stack
                                            direction={{ xs: 'row', sm: 'column' }}
                                            spacing={{ xs: 1, sm: 0 }}
                                            justifyContent="center"
                                            alignItems={{ xs: 'center', sm: 'flex-start' }}
                                        >
                                            <Typography
                                                fontSize={{ xs: 18, sm: 14 }}
                                                fontWeight={700}
                                                lineHeight="20px"
                                            >
                                                {data.totalDistributed ? (
                                                    formatNumber(fromWei(data.totalDistributed))
                                                ) : (
                                                    <Skeleton
                                                        animation="wave"
                                                        variant="text"
                                                        sx={{ minWidth: 80, maxWidth: '50%' }}
                                                    />
                                                )}
                                            </Typography>
                                            <Typography
                                                fontSize={{ xs: 18, sm: 14 }}
                                                fontWeight={500}
                                                lineHeight="20px"
                                            >
                                                BUSD
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        sx={{
                                            pt: { xs: 4, sm: 7 },
                                            height: 40,
                                            justifyContent: 'flex-end'
                                        }}
                                    >
                                        <Typography
                                            fontSize={14}
                                            fontWeight={500}
                                            lineHeight="20px"
                                            color="textSecondary"
                                        >
                                            Total Rewards Paid to Holders
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack direction="row" spacing={1}>
                                        <TokenLogo>
                                            <Box
                                                component="img"
                                                src={require('assets/img/tokens/busd.svg').default}
                                                alt="token-image"
                                                width="20px"
                                                height="20px"
                                            />
                                        </TokenLogo>
                                        <Stack
                                            direction={{ xs: 'row', sm: 'column' }}
                                            spacing={{ xs: 1, sm: 0 }}
                                            justifyContent="center"
                                            alignItems={{ xs: 'center', sm: 'flex-start' }}
                                        >
                                            <Typography
                                                fontSize={{ xs: 18, sm: 14 }}
                                                fontWeight={700}
                                                lineHeight="20px"
                                            >
                                                {data.pendingOfBUSD ? (
                                                    formatNumber(fromWei(data.pendingOfBUSD))
                                                ) : (
                                                    <Skeleton
                                                        animation="wave"
                                                        variant="text"
                                                        sx={{ minWidth: 80, maxWidth: '50%' }}
                                                    />
                                                )}
                                            </Typography>
                                            <Typography
                                                fontSize={{ xs: 18, sm: 14 }}
                                                fontWeight={500}
                                                lineHeight="20px"
                                            >
                                                BUSD
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        sx={{
                                            pt: { xs: 4, sm: 7 },
                                            height: 40,
                                            justifyContent: 'flex-end'
                                        }}
                                    >
                                        <Typography
                                            fontSize={14}
                                            fontWeight={500}
                                            lineHeight="20px"
                                            color="textSecondary"
                                        >
                                            Total BUSD Pending for Holders
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack direction="row" spacing={1}>
                                        <TokenLogo>
                                            <Box
                                                component="img"
                                                src={require('assets/img/tokens/vfx.svg').default}
                                                alt="token-image"
                                                width="20px"
                                                height="20px"
                                            />
                                        </TokenLogo>
                                        <Stack
                                            direction={{ xs: 'row', sm: 'column' }}
                                            spacing={{ xs: 1, sm: 0 }}
                                            justifyContent="center"
                                            alignItems={{ xs: 'center', sm: 'flex-start' }}
                                        >
                                            <Typography
                                                fontSize={{ xs: 18, sm: 14 }}
                                                fontWeight={700}
                                                lineHeight="20px"
                                            >
                                                {data.burned && data.decimals ? (
                                                    formatNumber(fromWei(data.burned, data.decimals))
                                                ) : (
                                                    <Skeleton
                                                        animation="wave"
                                                        variant="text"
                                                        sx={{ minWidth: 80, maxWidth: '50%' }}
                                                    />
                                                )}
                                            </Typography>
                                            <Typography
                                                fontSize={{ xs: 18, sm: 14 }}
                                                fontWeight={500}
                                                lineHeight="20px"
                                            >
                                                VFX
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        sx={{
                                            pt: { xs: 4, sm: 7 },
                                            height: 40,
                                            justifyContent: 'flex-end'
                                        }}
                                    >
                                        <Typography
                                            fontSize={14}
                                            fontWeight={500}
                                            lineHeight="20px"
                                            color="textSecondary"
                                        >
                                            Total Tokens Burned
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                            <TokenLogo>
                                                <Box
                                                    component="img"
                                                    src="https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png?1644979850"
                                                    alt="token-image"
                                                    width="20px"
                                                    height="20px"
                                                />
                                            </TokenLogo>
                                            <Stack
                                                direction={{ xs: 'row', sm: 'column' }}
                                                spacing={{ xs: 1, sm: 0 }}
                                                justifyContent="center"
                                                alignItems={{ xs: 'center', sm: 'flex-start' }}
                                            >
                                                <Typography
                                                    fontSize={{ xs: 18, sm: 14 }}
                                                    fontWeight={700}
                                                    lineHeight="20px"
                                                >
                                                    {data.unlockVault?.bnb ? (
                                                        formatNumber(fromWei(data.unlockVault.bnb))
                                                    ) : (
                                                        <Skeleton
                                                            animation="wave"
                                                            variant="text"
                                                            sx={{ minWidth: 80, maxWidth: '50%' }}
                                                        />
                                                    )}
                                                </Typography>
                                                <Typography
                                                    fontSize={{ xs: 18, sm: 14 }}
                                                    fontWeight={500}
                                                    lineHeight="20px"
                                                >
                                                    BNB
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                            <TokenLogo>
                                                <Box
                                                    component="img"
                                                    src={require('assets/img/tokens/busd.svg').default}
                                                    alt="token-image"
                                                    width="20px"
                                                    height="20px"
                                                />
                                            </TokenLogo>
                                            <Stack
                                                direction={{ xs: 'row', sm: 'column' }}
                                                spacing={{ xs: 1, sm: 0 }}
                                                justifyContent="center"
                                                alignItems={{ xs: 'center', sm: 'flex-start' }}
                                            >
                                                <Typography
                                                    fontSize={{ xs: 18, sm: 14 }}
                                                    fontWeight={700}
                                                    lineHeight="20px"
                                                >
                                                    {data.unlockVault?.busd ? (
                                                        formatNumber(fromWei(data.unlockVault.busd))
                                                    ) : (
                                                        <Skeleton
                                                            animation="wave"
                                                            variant="text"
                                                            sx={{ minWidth: 80, maxWidth: '50%' }}
                                                        />
                                                    )}
                                                </Typography>
                                                <Typography
                                                    fontSize={{ xs: 18, sm: 14 }}
                                                    fontWeight={500}
                                                    lineHeight="20px"
                                                >
                                                    BUSD
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        sx={{
                                            pt: { xs: 4, sm: 7 },
                                            height: 40,
                                            justifyContent: 'flex-end'
                                        }}
                                    >
                                        <Typography
                                            fontSize={14}
                                            fontWeight={500}
                                            lineHeight="20px"
                                            color="textSecondary"
                                        >
                                            Total Rewards in the Unlock the Vault Wallet
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack direction="row" spacing={1}>
                                        <TokenLogo>
                                            <Box
                                                component="img"
                                                src={require('assets/img/tokens/busd.svg').default}
                                                alt="token-image"
                                                width="20px"
                                                height="20px"
                                            />
                                        </TokenLogo>
                                        <Stack
                                            direction={{ xs: 'row', sm: 'column' }}
                                            spacing={{ xs: 1, sm: 0 }}
                                            justifyContent="center"
                                            alignItems={{ xs: 'center', sm: 'flex-start' }}
                                        >
                                            <Typography
                                                fontSize={{ xs: 18, sm: 14 }}
                                                fontWeight={700}
                                                lineHeight="20px"
                                            >
                                                {data.diamondHeist ? (
                                                    formatNumber(fromWei(data.diamondHeist))
                                                ) : (
                                                    <Skeleton
                                                        animation="wave"
                                                        variant="text"
                                                        sx={{ minWidth: 80, maxWidth: '50%' }}
                                                    />
                                                )}
                                            </Typography>
                                            <Typography
                                                fontSize={{ xs: 18, sm: 14 }}
                                                fontWeight={500}
                                                lineHeight="20px"
                                            >
                                                BUSD
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        sx={{
                                            pt: { xs: 4, sm: 7 },
                                            height: 40,
                                            justifyContent: 'flex-end'
                                        }}
                                    >
                                        <Typography
                                            fontSize={14}
                                            fontWeight={500}
                                            lineHeight="20px"
                                            color="textSecondary"
                                        >
                                            Total Rewards in the Diamond Hands Heist Wallet
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent
                            component={Stack}
                            justifyContent="space-between"
                            spacing={{ xs: 3, sm: 0 }}
                            sx={{ height: '100%' }}
                        >
                            <Stack>
                                <Typography color="primary" sx={{ opacity: 0.75 }} fontWeight={700}>
                                    Pending Rewards
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Stack direction="row" spacing={1}>
                                    <TokenLogo>
                                        <Box
                                            component="img"
                                            src={require('assets/img/tokens/busd.svg').default}
                                            alt="token-image"
                                            width="20px"
                                            height="20px"
                                        />
                                    </TokenLogo>
                                    <Stack
                                        direction={{ xs: 'row', sm: 'column' }}
                                        spacing={{ xs: 1, sm: 0 }}
                                        justifyContent="center"
                                        alignItems={{ xs: 'center', sm: 'flex-start' }}
                                    >
                                        <Typography fontSize={{ xs: 18, sm: 14 }} fontWeight={700} lineHeight="20px">
                                            {data.pendingRewards ? (
                                                formatNumber(fromWei(data.pendingRewards))
                                            ) : (
                                                <Skeleton
                                                    animation="wave"
                                                    variant="text"
                                                    sx={{ minWidth: 80, maxWidth: '50%' }}
                                                />
                                            )}
                                        </Typography>
                                        <Typography fontSize={{ xs: 18, sm: 14 }} fontWeight={500} lineHeight="20px">
                                            BUSD
                                        </Typography>
                                    </Stack>
                                </Stack>
                                {!isMobile && (
                                    <NovationButton
                                        loading={pendingTx}
                                        onClick={claim}
                                        sx={{
                                            height: 44,
                                            width: 'unset',
                                            fontSize: 16,
                                            fontWeight: 500,
                                            letterSpacing: 1,
                                            px: 2
                                        }}
                                    >
                                        Manual Claim
                                    </NovationButton>
                                )}
                            </Stack>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: 6,
                                    alignSelf: 'flex-end',
                                    backgroundClip: 'content-box',
                                    backgroundSize: '6px 6px',
                                    backgroundImage: `url("${require('assets/img/icons/space-icon.svg').default}")`
                                }}
                            />
                            <Typography fontSize={14} fontWeight={500} lineHeight="20px" color="textSecondary">
                                Rewards are paid out automatically, but when you receive them depends on the number of
                                tokens you hold and the daily volume of $VFX. As such, you can claim your rewards
                                manually, but will have to pay the transaction fee.
                            </Typography>
                            {isMobile && (
                                <NovationButton
                                    loading={pendingTx}
                                    onClick={claim}
                                    sx={{
                                        height: 44,
                                        width: 'unset',
                                        fontSize: 16,
                                        fontWeight: 500,
                                        letterSpacing: 1,
                                        px: 2
                                    }}
                                >
                                    Manual Claim
                                </NovationButton>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
