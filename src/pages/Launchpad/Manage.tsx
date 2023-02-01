import { useState, useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';

import NovationCountDown from 'components/Base/NovationCountDown';
import NovationTable from 'components/Base/NovationTable';
import NovationButton from 'components/Base/NovationButton';
import NovationInput from 'components/Base/NovationInput';
import MapItemDetail from 'components/Launchpad/List/MapItem/MapItemDetail';
import NovationChip from 'components/Base/NovationChip';
import FileUpload from 'components/Launchpad/Create/FileUploadModal';
import { ToastDescriptionWithTx } from 'components/Toast';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePoolContract, useRouterContract, useTokenContract } from 'hooks/useContract';
import usePool from 'hooks/usePool';
import useToast from 'hooks/useToast';
import useCatchTxError from 'hooks/useCatchTxError';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useMediaQuery from '@mui/material/useMediaQuery';

import { ThemeOptions } from '@mui/material';
import { ethersToBigNumber, formatNumber, fromWei, toBigNumber } from 'utils/bigNumber';
import { getBscScanLink, isAddress } from 'utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MaxUint256 } from '@ethersproject/constants';

const Manage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const address = searchParams.get('address');
    const isMobile = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));
    const { activePool, getPoolStatus, updateActivePool } = usePool();
    const { account } = useActiveWeb3React();

    const [providers, setProviders] = useState<any>();
    const [tokenBalance, setTokenBalance] = useState<any>();
    const [activeTab, setActiveTab] = useState<string>('created');
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [isOpenFileUpload, setIsOpenFileUpload] = useState<boolean>(false);
    const [whitelist, setWhitelist] = useState<any>([]);
    const [whiteAddress, setWhiteAddress] = useState<string>('');
    const [file, setFile] = useState<any>();

    const { toastSuccess } = useToast();
    const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError();

    const tokenContract = useTokenContract(activePool.token);
    const poolContract = usePoolContract(address);
    const routerContract = useRouterContract();

    const setPublicMode = useCallback(async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return poolContract.setPublicMode(true);
        });
        if (receipt?.status) {
            updateActivePool(address);
            toastSuccess(
                'Canceled',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>You Canceled Presale!</ToastDescriptionWithTx>
            );
        }
    }, [address]);
    const cancelSale = useCallback(async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return poolContract.cancelSale();
        });
        if (receipt?.status) {
            updateActivePool(address);
            toastSuccess(
                'Canceled',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>You Canceled Presale!</ToastDescriptionWithTx>
            );
        }
    }, [address]);
    const multiSend = useCallback(async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return poolContract.multiSend();
        });
        if (receipt?.status) {
            updateActivePool(address);
            toastSuccess(
                'Multi Send',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    Multi Send is available for now.
                </ToastDescriptionWithTx>
            );
        }
    }, [address]);
    const updateWhitelist = useCallback(async () => {
        const wl = activeTab === 'created' ? whitelist : [whiteAddress];
        const receipt = await fetchWithCatchTxError(() => {
            return poolContract.setWhilteList(wl, true);
        });
        if (receipt?.status) {
            updateActivePool(address);
            toastSuccess(
                'Updated Whitelist',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    You have just updated whitelist.
                </ToastDescriptionWithTx>
            );
        }
    }, [address, whitelist, whiteAddress, activeTab]);
    const finalize = useCallback(async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return poolContract.finalize();
        });
        if (receipt?.status) {
            updateActivePool(address);
            toastSuccess(
                'Finalized',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    You just finalized your Presale!
                </ToastDescriptionWithTx>
            );
        }
    }, [address]);
    const enableRefund = useCallback(async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return poolContract.enableRefund();
        });
        if (receipt?.status) {
            updateActivePool(address);
            toastSuccess(
                'Enabled Refund',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    You just enabled refund!
                </ToastDescriptionWithTx>
            );
        }
    }, [address]);
    const transferUnsold = useCallback(async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return poolContract.transferUnsold();
        });
        if (receipt?.status) {
            updateActivePool(address);
            toastSuccess(
                'Transferred Unsold',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    You just transferred unsold!
                </ToastDescriptionWithTx>
            );
        }
    }, [address]);

    const ExpandIcon = () => (
        <Box
            component="img"
            src={require('assets/img/icons/expand.svg').default}
            sx={{
                transform: 'rotate(0deg)',
                width: 18
            }}
            alt="Expand icon"
        />
    );

    const checkAllowance = useCallback(() => {
        if (!account || !tokenContract) return;
        if (!activePool.tokenFee) return;
        if (ethersToBigNumber(activePool.tokenFee).isZero() && ethersToBigNumber(activePool.liquidityAlloc).isZero())
            return setIsApproved(true);
        tokenContract.allowance(account, address).then((result: any) => {
            const allocate = toBigNumber(1);
            const allowance = ethersToBigNumber(result);
            if (allowance.isGreaterThan(allocate)) {
                setIsApproved(true);
            } else {
                setIsApproved(false);
            }
        });
    }, [account, tokenContract, address, activePool]);

    const approve = useCallback(async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return tokenContract.approve(address, MaxUint256);
        });
        if (receipt?.status) {
            checkAllowance();
            toastSuccess(
                'Approved',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    Your Token was approved successfully.
                </ToastDescriptionWithTx>
            );
        }
    }, [tokenContract, checkAllowance, toastSuccess, fetchWithCatchTxError]);

    useEffect(() => {
        checkAllowance();
    }, [checkAllowance]);

    useEffect(() => {
        if (!isAddress(address) || !activePool.token) return;
        routerContract.lpProviders(activePool.token, address).then(setProviders);
    }, [address, activePool.token, activePool]);

    const applicationType = useMemo(() => {
        if (!activePool.liquidityAlloc) return '';
        return ethersToBigNumber(activePool.liquidityAlloc).isZero() ? 'Presale' : 'Presale + Token Listing';
    }, [activePool.liquidityAlloc]);

    const isAllowedForLiquidity = useMemo(() => {
        if (!activePool.liquidityAlloc || !activePool.router) return false;
        if (activePool.router?.toLowerCase() !== routerContract.address.toLowerCase()) return false;
        if (providers !== false) return false;
        if (ethersToBigNumber(activePool.liquidityAlloc).isZero()) return false;
        return true;
    }, [providers, activePool.liquidityAlloc, activePool.router]);

    useEffect(() => {
        const status = getPoolStatus(activePool);
        switch (status) {
            case 'upcoming':
                return setActiveTab('created');
            case 'live':
                return setActiveTab('started');
            case 'ended':
            case 'failed':
                return setActiveTab('ended');
            case 'claim':
            case 'finalized':
                return setActiveTab('finalized');
        }
    }, [activePool]);

    useEffect(() => {
        if (!tokenContract || !isAddress(address)) return;
        tokenContract.balanceOf(address).then(setTokenBalance);
    }, [tokenContract, address, activePool]);

    return (
        <Container
            sx={{
                padding: 0,
                maxWidth: '550px !important',
                width: { xs: 'unset', sm: '100%' }
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                spacing={1.25}
                onClick={() => navigate('../list')}
                sx={{
                    cursor: 'pointer',
                    mb: 3
                }}
            >
                <Box
                    component="img"
                    src={require('assets/img/icons/arrow-left.svg').default}
                    sx={{
                        width: 24,
                        height: 24,
                        filter: 'drop-shadow(0px 0px 50px rgba(0, 172, 253, 0.5)) drop-shadow(0px 0px 10px rgba(0, 172, 253, 0.8))'
                    }}
                />
                <Typography fontSize={16} lineHeight="16px" fontWeight={500} color="primary">
                    Back to the Pool List
                </Typography>
            </Stack>
            <Card
                variant="outlined"
                sx={{
                    position: 'relative',
                    borderRadius: 2,
                    boxShadow: {
                        xs: 'none',
                        sm: 'inset 0px 0px 7.32115px rgb(168 252 255 / 50%), inset 0px -20px 20px -49.2654px rgb(0 172 253 / 15%), inset 0px 20px 50px -36.9491px rgb(0 172 253 / 25%)'
                    },
                    backgroundColor: { xs: 'transparent', sm: 'rgba(0, 172, 253, 0.05)' },
                    backdropFilter: { xs: 'none', sm: 'blur(5px)' },
                    borderWidth: { xs: 0, sm: 2 }
                }}
            >
                <CardContent
                    component={Stack}
                    spacing={0.5}
                    sx={{
                        overflow: 'visible',
                        padding: '0px !important'
                    }}
                >
                    <Grid container>
                        <Grid item xs={12}>
                            <CardContent
                                component={Stack}
                                spacing={2}
                                direction="column"
                                justifyContent="space-between"
                                sx={{
                                    padding: { xs: '0px !important', sm: '20px !important' }
                                }}
                            >
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar
                                            src={
                                                activePool.urls && activePool.urls?.logo !== ''
                                                    ? activePool.urls?.logo
                                                    : require('assets/img/logo.png')
                                            }
                                            alt="Tefi"
                                            variant="rounded"
                                            sx={{ width: 44, height: 44 }}
                                        />
                                        <Stack justifyContent="center">
                                            <Typography fontSize={16} fontWeight={500} textTransform="uppercase">
                                                {activePool.symbol}
                                            </Typography>
                                            <Typography fontSize={14} fontWeight={500} color="primary">
                                                {activePool.name}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    {(() => {
                                        const status = getPoolStatus(activePool);
                                        switch (status) {
                                            case 'failed':
                                                return <NovationChip label="Failed" color="error.main" />;
                                            case 'live':
                                                return <NovationChip label="Live" color="success.main" />;
                                            case 'upcoming':
                                                return <NovationChip label="Upcoming" color="warning.main" />;
                                            case 'ended':
                                            case 'finalized':
                                            case 'claim':
                                                return <NovationChip label="Ended" color="error.main" />;
                                            case 'canceled':
                                                return <NovationChip label="Canceled" color="error.main" />;
                                            default:
                                                <NovationChip label={<Skeleton sx={{ minWidth: 80 }} />} />;
                                        }
                                    })()}
                                </Stack>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{
                                        borderRadius: 1
                                    }}
                                >
                                    <Typography fontSize={14}>
                                        {address
                                            ? isMobile
                                                ? `${address.substring(0, 10)}... ${address.substring(
                                                      address.length - 10
                                                  )}`
                                                : address
                                            : ''}
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <CopyToClipboard text={address} onCopy={() => setIsCopied(true)}>
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
                                        <Link
                                            href={getBscScanLink(address, 'address')}
                                            underline="none"
                                            target="_blank"
                                        >
                                            <IconButton size="small">
                                                <Avatar
                                                    src={
                                                        require('assets/img/icons/bscscan-logo-light-circle.svg')
                                                            .default
                                                    }
                                                    sx={{ width: 18, height: 18 }}
                                                />
                                            </IconButton>
                                        </Link>
                                    </Stack>
                                </Stack>
                                <Stack spacing={2.5} py={1}>
                                    <MapItemDetail title="Application Type" value={applicationType} />
                                    <MapItemDetail
                                        title="Sale Type"
                                        value={activePool.publicMode ? 'Public' : 'Private'}
                                    />
                                    <MapItemDetail
                                        title="Soft Cap"
                                        value={
                                            activePool.softcap
                                                ? `${formatNumber(fromWei(activePool.softcap))} BNB`
                                                : null
                                        }
                                    />
                                    <MapItemDetail
                                        title="Hard Cap"
                                        value={
                                            activePool.hardcap
                                                ? `${formatNumber(fromWei(activePool.hardcap))} BNB`
                                                : null
                                        }
                                    />
                                    {['started', 'ended', 'finalized'].includes(activeTab) && (
                                        <MapItemDetail
                                            title="Raised"
                                            value={
                                                activePool.raised
                                                    ? `${formatNumber(fromWei(activePool.raised))} BNB`
                                                    : null
                                            }
                                        />
                                    )}
                                    {['started', 'finalized'].includes(activeTab) && (
                                        <MapItemDetail
                                            title="Total Contributors:"
                                            value={activePool.count ? formatNumber(activePool.count) : null}
                                        />
                                    )}
                                    <MapItemDetail
                                        title="Presale Rate"
                                        value={
                                            activePool.salePrice && activePool.decimals && activePool.symbol
                                                ? `1 BNB = ${formatNumber(
                                                      fromWei(activePool.salePrice, activePool.decimals)
                                                  )} ${activePool.symbol}`
                                                : null
                                        }
                                    />
                                    <MapItemDetail
                                        title="Listing Rate"
                                        value={
                                            activePool.listPrice && activePool.decimals && activePool.symbol
                                                ? `1 BNB = ${formatNumber(
                                                      fromWei(activePool.listPrice, activePool.decimals)
                                                  )} ${activePool.symbol}`
                                                : null
                                        }
                                    />
                                    <MapItemDetail
                                        title="Liquidity Percent"
                                        value={
                                            activePool.liquidityAlloc
                                                ? `${formatNumber(activePool.liquidityAlloc / 100)}%`
                                                : null
                                        }
                                    />
                                    {['created', 'started', 'ended'].includes(activeTab) && (
                                        <MapItemDetail
                                            title="Start Time:"
                                            value={
                                                activePool.startTime
                                                    ? new Date(activePool.startTime * 1000).toLocaleString()
                                                    : null
                                            }
                                        />
                                    )}
                                    {['created', 'started', 'ended'].includes(activeTab) && (
                                        <MapItemDetail
                                            title="End Time:"
                                            value={
                                                activePool.endTime
                                                    ? new Date(activePool.endTime * 1000).toLocaleString()
                                                    : null
                                            }
                                        />
                                    )}
                                    {['ended'].includes(activeTab) && (
                                        <MapItemDetail
                                            title="Tokens for Liquidity"
                                            value={
                                                activePool.liquidityAlloc &&
                                                activePool.listPrice &&
                                                activePool.raised &&
                                                activePool.decimals &&
                                                activePool.symbol
                                                    ? `${formatNumber(
                                                          toBigNumber(
                                                              fromWei(activePool.listPrice, activePool.decimals)
                                                          ).times(
                                                              toBigNumber(fromWei(activePool.raised))
                                                                  .times(toBigNumber(activePool.liquidityAlloc / 100))
                                                                  .dividedBy(toBigNumber(100))
                                                          )
                                                      )} ${activePool.symbol}`
                                                    : null
                                            }
                                        />
                                    )}
                                    {['ended'].includes(activeTab) && (
                                        <MapItemDetail
                                            title="Listing On"
                                            value={(() => {
                                                if (
                                                    !activePool.listPrice ||
                                                    !activePool.liquidityAlloc ||
                                                    !activePool.router
                                                )
                                                    return '';
                                                if (
                                                    toBigNumber(fromWei(activePool.listPrice)).isZero() ||
                                                    toBigNumber(fromWei(activePool.liquidityAlloc)).isZero()
                                                )
                                                    return 'None';
                                                return activePool.router?.toLowerCase() ===
                                                    routerContract.address?.toLowerCase()
                                                    ? 'Novation'
                                                    : 'PancakeSwap';
                                            })()}
                                        />
                                    )}
                                    {['finalized'].includes(activeTab) && (
                                        <MapItemDetail
                                            title="Claimed"
                                            value={
                                                activePool.totalClaimed
                                                    ? formatNumber(fromWei(activePool.totalClaimed))
                                                    : null
                                            }
                                        />
                                    )}
                                    {['finalized'].includes(activeTab) && (
                                        <MapItemDetail
                                            title="Unsold Tokens"
                                            value={
                                                activePool.isBurnForUnsold !== undefined
                                                    ? activePool.isBurnForUnsold
                                                        ? 'Burn'
                                                        : 'Refund'
                                                    : ''
                                            }
                                        />
                                    )}
                                    {['ended'].includes(activeTab) && (
                                        <MapItemDetail
                                            title="Fee in BNB"
                                            value={
                                                activePool.bnbFee && activePool.feeDenominator
                                                    ? `${formatNumber(
                                                          (activePool.bnbFee / activePool.feeDenominator) * 100
                                                      )}%`
                                                    : null
                                            }
                                        />
                                    )}
                                    {['ended'].includes(activeTab) && (
                                        <MapItemDetail
                                            title="Fee in Token"
                                            value={
                                                activePool.tokenFee && activePool.feeDenominator
                                                    ? `${formatNumber(
                                                          (activePool.tokenFee / activePool.feeDenominator) * 100
                                                      )}%`
                                                    : null
                                            }
                                        />
                                    )}
                                </Stack>
                            </CardContent>
                        </Grid>
                        <Grid item xs={12}>
                            <Tabs
                                variant="fullWidth"
                                value={activeTab}
                                indicatorColor="secondary"
                                textColor="inherit"
                                aria-label="Vertical tabs example"
                                sx={{
                                    minHeight: 0,
                                    borderTop: 1,
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    '& .MuiTabs-flexContainer': {
                                        gap: '0px'
                                    },
                                    '& .Mui-disabled': {
                                        opacity: '1 !important',
                                        px: '0px !important'
                                    },
                                    '& .MuiTab-root': {
                                        cursor: 'default',
                                        minWidth: 0,
                                        minHeight: 0,
                                        py: 1,
                                        px: 1.5,
                                        color: 'text.secondary',
                                        fontSize: 14,
                                        '&.Mui-selected': {
                                            color: '#fff'
                                        }
                                    },
                                    '& .MuiTabs-indicator': {
                                        display: 'none'
                                    }
                                }}
                            >
                                <Tab disableRipple value="created" label="Created" />
                                <Tab disabled label={<ExpandIcon />} />
                                <Tab disableRipple value="started" label="Started" />
                                <Tab disabled label={<ExpandIcon />} />
                                <Tab disableRipple value="ended" label="Ended" />
                                <Tab disabled label={<ExpandIcon />} />
                                <Tab disableRipple value="finalized" label="Finalized" />
                            </Tabs>
                        </Grid>
                        <Grid item xs={12}>
                            {(() => {
                                switch (activeTab) {
                                    case 'created': {
                                        return (
                                            <NovationTable>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Stack spacing={1.5} alignItems="center">
                                                                <Typography>Sale Starts In</Typography>
                                                                <NovationCountDown
                                                                    spacing={2}
                                                                    units={{
                                                                        isDay: true,
                                                                        isHour: true,
                                                                        isMinute: true,
                                                                        isSecond: true
                                                                    }}
                                                                    endTime={activePool.startTime}
                                                                    size={48}
                                                                />
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Stack spacing={2}>
                                                                <Stack
                                                                    direction="row"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    spacing={0.75}
                                                                    sx={{
                                                                        cursor: 'pointer',
                                                                        opacity: 0.75,
                                                                        transition: '.25s',
                                                                        '&:hover': {
                                                                            opacity: 1
                                                                        }
                                                                    }}
                                                                    onClick={() => setIsOpenFileUpload(true)}
                                                                >
                                                                    <Box
                                                                        component="img"
                                                                        src={
                                                                            require('assets/img/icons/document-upload.svg')
                                                                                .default
                                                                        }
                                                                        sx={{
                                                                            width: 24,
                                                                            top: 'calc(50% - 12px) !important',
                                                                            right: '12px !important'
                                                                        }}
                                                                    />
                                                                    {file && whitelist?.length ? (
                                                                        <Typography color="primary" fontSize={14}>
                                                                            {file.name}{' '}
                                                                            {`(${whitelist.length} addresses)`}
                                                                        </Typography>
                                                                    ) : (
                                                                        <Typography color="primary" fontSize={14}>
                                                                            Upload File with the Wallet Addresses
                                                                        </Typography>
                                                                    )}
                                                                </Stack>
                                                                <Stack direction="row" spacing={2}>
                                                                    <NovationButton
                                                                        variant="outlined"
                                                                        loading={pendingTx}
                                                                        disabled={
                                                                            !account || !file || !whitelist.length
                                                                        }
                                                                        onClick={updateWhitelist}
                                                                        sx={{
                                                                            height: 44,
                                                                            fontSize: 14,
                                                                            letterSpacing: 0
                                                                        }}
                                                                    >
                                                                        Update Whitelist
                                                                    </NovationButton>
                                                                </Stack>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Stack spacing={2}>
                                                                <NovationInput
                                                                    value={whiteAddress}
                                                                    onChange={(e: any) => {
                                                                        setWhiteAddress(e.target.value);
                                                                    }}
                                                                    sx={{
                                                                        '& #input-wrapper': {
                                                                            pt: 1.5,
                                                                            pb: 1.5
                                                                        }
                                                                    }}
                                                                />
                                                                <NovationButton
                                                                    loading={pendingTx}
                                                                    disabled={!account || !isAddress(whiteAddress)}
                                                                    onClick={updateWhitelist}
                                                                    sx={{
                                                                        height: 44,
                                                                        fontSize: 14,
                                                                        flexGrow: 1,
                                                                        px: 0,
                                                                        letterSpacing: 0
                                                                    }}
                                                                >
                                                                    ADD A WALLET
                                                                </NovationButton>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    {activePool.publicMode === false && (
                                                        <TableRow>
                                                            <TableCell>
                                                                <NovationButton
                                                                    variant="contained"
                                                                    loading={pendingTx}
                                                                    disabled={!account || activePool.publicMode}
                                                                    onClick={setPublicMode}
                                                                    sx={{
                                                                        height: 44,
                                                                        fontSize: 14,
                                                                        flexGrow: 1,
                                                                        px: 0,
                                                                        letterSpacing: 0
                                                                    }}
                                                                >
                                                                    MAKE PUBLIC
                                                                </NovationButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                    <TableRow>
                                                        <TableCell>
                                                            <NovationButton
                                                                variant="outlined"
                                                                loading={pendingTx}
                                                                disabled={!account}
                                                                onClick={cancelSale}
                                                                sx={{
                                                                    height: 44,
                                                                    fontSize: 14,
                                                                    flexGrow: 1,
                                                                    px: 0,
                                                                    letterSpacing: 0
                                                                }}
                                                            >
                                                                Cancel
                                                            </NovationButton>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </NovationTable>
                                        );
                                    }
                                    case 'started': {
                                        return (
                                            <NovationTable>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>
                                                            <Stack spacing={1.5} alignItems="center">
                                                                <Typography>Sale Ends In</Typography>
                                                                <NovationCountDown
                                                                    spacing={2}
                                                                    units={{
                                                                        isDay: true,
                                                                        isHour: true,
                                                                        isMinute: true,
                                                                        isSecond: true
                                                                    }}
                                                                    endTime={activePool.endTime}
                                                                    size={48}
                                                                />
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>
                                                            <Stack
                                                                direction="row"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                            >
                                                                {(() => {
                                                                    const percent =
                                                                        (activePool.raised / activePool.hardcap) * 100;
                                                                    return (
                                                                        <LinearProgress
                                                                            variant="determinate"
                                                                            value={percent || 0}
                                                                            sx={{
                                                                                width: '100%',
                                                                                borderColor: 'divider',
                                                                                borderStyle: 'solid',
                                                                                borderWidth: 1,
                                                                                height: (theme) => theme.spacing(5),
                                                                                borderRadius: '4px',
                                                                                '& .MuiLinearProgress-dashed': {
                                                                                    backgroundSize: '5px 5px'
                                                                                }
                                                                            }}
                                                                        />
                                                                    );
                                                                })()}
                                                                {(() => {
                                                                    if (activePool.raised && activePool.hardcap) {
                                                                        return (
                                                                            <Typography
                                                                                sx={{
                                                                                    position: 'absolute'
                                                                                }}
                                                                            >
                                                                                {formatNumber(
                                                                                    fromWei(activePool.raised)
                                                                                )}{' '}
                                                                                BNB /{' '}
                                                                                {formatNumber(
                                                                                    fromWei(activePool.hardcap)
                                                                                )}{' '}
                                                                                BNB
                                                                            </Typography>
                                                                        );
                                                                    }
                                                                })()}
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Stack spacing={2}>
                                                                <Stack
                                                                    direction="row"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    spacing={0.75}
                                                                    sx={{
                                                                        cursor: 'pointer',
                                                                        opacity: 0.75,
                                                                        transition: '.25s',
                                                                        '&:hover': {
                                                                            opacity: 1
                                                                        }
                                                                    }}
                                                                    onClick={() => setIsOpenFileUpload(true)}
                                                                >
                                                                    <Box
                                                                        component="img"
                                                                        src={
                                                                            require('assets/img/icons/document-upload.svg')
                                                                                .default
                                                                        }
                                                                        sx={{
                                                                            width: 24,
                                                                            top: 'calc(50% - 12px) !important',
                                                                            right: '12px !important'
                                                                        }}
                                                                    />
                                                                    {file && whitelist?.length ? (
                                                                        <Typography color="primary" fontSize={14}>
                                                                            {file.name}{' '}
                                                                            {`(${whitelist.length} addresses)`}
                                                                        </Typography>
                                                                    ) : (
                                                                        <Typography color="primary" fontSize={14}>
                                                                            Upload File with the Wallet Addresses
                                                                        </Typography>
                                                                    )}
                                                                </Stack>
                                                                <NovationButton
                                                                    variant="outlined"
                                                                    loading={pendingTx}
                                                                    disabled={!account || !file || !whitelist.length}
                                                                    onClick={updateWhitelist}
                                                                    sx={{
                                                                        height: 44,
                                                                        fontSize: 14,
                                                                        letterSpacing: 0
                                                                    }}
                                                                >
                                                                    Update Whitelist
                                                                </NovationButton>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Stack spacing={2}>
                                                                <NovationInput
                                                                    value={whiteAddress}
                                                                    onChange={(e: any) => {
                                                                        setWhiteAddress(e.target.value);
                                                                    }}
                                                                    sx={{
                                                                        '& #input-wrapper': {
                                                                            pt: 1.5,
                                                                            pb: 1.5
                                                                        }
                                                                    }}
                                                                />
                                                                <NovationButton
                                                                    loading={pendingTx}
                                                                    disabled={!account || !isAddress(whiteAddress)}
                                                                    onClick={updateWhitelist}
                                                                    sx={{
                                                                        height: 44,
                                                                        fontSize: 14,
                                                                        flexGrow: 1,
                                                                        px: 0,
                                                                        letterSpacing: 0
                                                                    }}
                                                                >
                                                                    ADD A WALLET
                                                                </NovationButton>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    {activePool.publicMode === false && (
                                                        <TableRow>
                                                            <TableCell>
                                                                <NovationButton
                                                                    variant="contained"
                                                                    loading={pendingTx}
                                                                    disabled={!account || activePool.publicMode}
                                                                    onClick={setPublicMode}
                                                                    sx={{
                                                                        height: 44,
                                                                        fontSize: 14,
                                                                        flexGrow: 1,
                                                                        px: 0,
                                                                        letterSpacing: 0
                                                                    }}
                                                                >
                                                                    MAKE PUBLIC
                                                                </NovationButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </NovationTable>
                                        );
                                    }
                                    case 'ended': {
                                        const status = getPoolStatus(activePool);
                                        return (
                                            <NovationTable>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Stack spacing={1}>
                                                                <Alert severity="info">
                                                                    Please exclude presale address from fee and rewards
                                                                    before finalizing pool
                                                                </Alert>
                                                                {isAllowedForLiquidity && (
                                                                    <Alert severity="warning">
                                                                        This pool isn't allowed as the liquidity
                                                                        provider yet
                                                                    </Alert>
                                                                )}
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Stack direction="row" spacing={2}>
                                                                <NovationButton
                                                                    variant="outlined"
                                                                    loading={pendingTx}
                                                                    disabled={!account}
                                                                    onClick={enableRefund}
                                                                    sx={{
                                                                        height: 44,
                                                                        fontSize: 14,
                                                                        flexGrow: 1,
                                                                        px: 0,
                                                                        letterSpacing: 0
                                                                    }}
                                                                >
                                                                    ENABLE REFUND
                                                                </NovationButton>
                                                                {isApproved ? (
                                                                    <NovationButton
                                                                        variant="contained"
                                                                        loading={pendingTx}
                                                                        onClick={finalize}
                                                                        disabled={(() => {
                                                                            if (!account) return true;
                                                                            if (status === 'failed') return true;
                                                                            if (
                                                                                !activePool.raised ||
                                                                                !activePool.softcap
                                                                            )
                                                                                return true;
                                                                            if (
                                                                                ethersToBigNumber(
                                                                                    activePool.raised
                                                                                ).isLessThan(
                                                                                    ethersToBigNumber(
                                                                                        activePool.softcap
                                                                                    )
                                                                                )
                                                                            )
                                                                                return true;
                                                                            return false;
                                                                        })()}
                                                                        sx={{
                                                                            height: 44,
                                                                            fontSize: 14,
                                                                            flexGrow: 1,
                                                                            px: 0,
                                                                            letterSpacing: 0
                                                                        }}
                                                                    >
                                                                        Finalize
                                                                    </NovationButton>
                                                                ) : (
                                                                    <NovationButton
                                                                        variant="contained"
                                                                        loading={pendingTx}
                                                                        onClick={approve}
                                                                        disabled={!account || status === 'failed'}
                                                                        sx={{
                                                                            height: 44,
                                                                            fontSize: 14,
                                                                            flexGrow: 1,
                                                                            px: 0,
                                                                            letterSpacing: 0
                                                                        }}
                                                                    >
                                                                        Approve
                                                                    </NovationButton>
                                                                )}
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </NovationTable>
                                        );
                                    }
                                    case 'finalized': {
                                        return (
                                            <NovationTable>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>
                                                            <Stack
                                                                direction="row"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                            >
                                                                {(() => {
                                                                    const percent =
                                                                        (activePool.totalClaimed /
                                                                            activePool.saleAmount) *
                                                                        100;
                                                                    return (
                                                                        <LinearProgress
                                                                            variant="determinate"
                                                                            value={percent || 0}
                                                                            sx={{
                                                                                width: '100%',
                                                                                borderColor: 'divider',
                                                                                borderStyle: 'solid',
                                                                                borderWidth: 1,
                                                                                height: (theme) => theme.spacing(5),
                                                                                borderRadius: '4px',
                                                                                '& .MuiLinearProgress-dashed': {
                                                                                    backgroundSize: '5px 5px'
                                                                                }
                                                                            }}
                                                                        />
                                                                    );
                                                                })()}
                                                                {(() => {
                                                                    if (
                                                                        activePool.totalClaimed &&
                                                                        activePool.saleAmount &&
                                                                        activePool.decimals &&
                                                                        activePool.symbol
                                                                    ) {
                                                                        return (
                                                                            <Typography
                                                                                sx={{
                                                                                    position: 'absolute'
                                                                                }}
                                                                            >
                                                                                {formatNumber(
                                                                                    fromWei(
                                                                                        activePool.totalClaimed,
                                                                                        activePool.decimals
                                                                                    )
                                                                                )}{' '}
                                                                                {activePool.symbol} /{' '}
                                                                                {formatNumber(
                                                                                    fromWei(
                                                                                        activePool.saleAmount,
                                                                                        activePool.decimals
                                                                                    )
                                                                                )}{' '}
                                                                                {activePool.symbol}
                                                                            </Typography>
                                                                        );
                                                                    }
                                                                })()}
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>
                                                            <Stack direction="row" spacing={2}>
                                                                <NovationButton
                                                                    variant="contained"
                                                                    onClick={multiSend}
                                                                    loading={pendingTx}
                                                                    disabled={(() => {
                                                                        if (!account) return true;
                                                                        if (
                                                                            !activePool.saleAmount ||
                                                                            !activePool.totalClaimed
                                                                        )
                                                                            return true;
                                                                        if (
                                                                            ethersToBigNumber(
                                                                                activePool.saleAmount
                                                                            ).isEqualTo(
                                                                                ethersToBigNumber(
                                                                                    activePool.totalClaimed
                                                                                )
                                                                            )
                                                                        )
                                                                            return true;
                                                                        return false;
                                                                    })()}
                                                                    sx={{
                                                                        height: 44,
                                                                        fontSize: 14,
                                                                        flexGrow: 1,
                                                                        px: 0,
                                                                        letterSpacing: 0
                                                                    }}
                                                                >
                                                                    Multi Send
                                                                </NovationButton>
                                                                <NovationButton
                                                                    variant="contained"
                                                                    onClick={transferUnsold}
                                                                    loading={pendingTx}
                                                                    disabled={(() => {
                                                                        if (
                                                                            !account ||
                                                                            !activePool.salePrice ||
                                                                            !activePool.hardcap ||
                                                                            !activePool.saleAmount ||
                                                                            !activePool.totalClaimed ||
                                                                            !tokenBalance
                                                                        )
                                                                            return true;
                                                                        if (
                                                                            ethersToBigNumber(activePool.salePrice)
                                                                                .times(
                                                                                    toBigNumber(
                                                                                        fromWei(activePool.hardcap)
                                                                                    )
                                                                                )
                                                                                .minus(
                                                                                    ethersToBigNumber(
                                                                                        activePool.saleAmount
                                                                                    )
                                                                                )
                                                                                .isZero()
                                                                        )
                                                                            return true;
                                                                        if (
                                                                            ethersToBigNumber(
                                                                                tokenBalance
                                                                            ).isLessThanOrEqualTo(
                                                                                ethersToBigNumber(
                                                                                    activePool.saleAmount
                                                                                ).minus(
                                                                                    ethersToBigNumber(
                                                                                        activePool.totalClaimed
                                                                                    )
                                                                                )
                                                                            )
                                                                        )
                                                                            return true;
                                                                        return false;
                                                                    })()}
                                                                    sx={{
                                                                        height: 44,
                                                                        fontSize: 14,
                                                                        flexGrow: 1,
                                                                        px: 0,
                                                                        letterSpacing: 0
                                                                    }}
                                                                >
                                                                    TRANSFER UNSOLD
                                                                </NovationButton>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </NovationTable>
                                        );
                                    }
                                }
                            })()}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <FileUpload
                open={isOpenFileUpload}
                onClose={() => {
                    setWhitelist([]);
                    setFile(null);
                    setIsOpenFileUpload(false);
                }}
                onEvent={(content: any, contentMap: string[]) => {
                    setWhitelist(contentMap);
                    setFile(content);
                    setIsOpenFileUpload(false);
                }}
            />
        </Container>
    );
};

export default Manage;
