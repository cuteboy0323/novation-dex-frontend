import { useState, useEffect, useCallback } from 'react';

// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import NovationButton from 'components/Base/NovationButton';
import NovationInput from 'components/Base/NovationInput';
import NovationSelect from 'components/Base/NovationSelect';
import NovationYesNo from 'components/Base/NovationYesNo';
import FileUpload from 'components/Launchpad/Create/FileUploadModal';

import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import WallpaperRoundedIcon from '@mui/icons-material/WallpaperRounded';

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import useAuth from 'hooks/useAuth';
import useToast from 'hooks/useToast';
import useCatchTxError from 'hooks/useCatchTxError';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useNavigate } from 'react-router-dom';
import { useWalletModal } from 'components/WalletModal';
import { useLaunchpadContract, useTokenContract } from 'hooks/useContract';

import { ethersToBigNumber, fromWei, toBigNumber, toWei } from 'utils/bigNumber';
import { multicallv2 } from 'utils/multicall';

import BEP20ABI from 'config/abi/bep20.json';
import { MaxUint256 } from '@ethersproject/constants';

import { ToastDescriptionWithTx } from 'components/Toast';
import usePool from 'hooks/usePool';

const Create = () => {
    const navigate = useNavigate();
    const { login, logout } = useAuth();
    const { account } = useActiveWeb3React();
    const { onPresentConnectModal } = useWalletModal(login, logout);
    const { getTimestamp } = usePool();

    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [isOpenFileUpload, setIsOpenFileUpload] = useState<boolean>(false);

    const [info, setInfo] = useState<any>({
        softcap: 0,
        hardcap: 1,
        min: 0.01,
        pRate: 0,
        lRate: 0,
        liquidity: 0,
        time: dayjs(new Date().setHours(0, 0, 0)),
        endTime: dayjs(new Date().setHours(0, 0, 0)),
        unsold: 'burn',
        type: 'presale',
        dex: 'novation'
    });

    const tokenContract = useTokenContract(info.address);
    const launchpadContract = useLaunchpadContract();

    const { toastSuccess, toastError } = useToast();
    const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInfo((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };
    const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInfo((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };
    const handleDateTimeChange = (key: string, value: any) => {
        setInfo((prevState) => ({
            ...prevState,
            [key]: value
        }));
    };
    const handleRadioChange = (key: string, value: any) => {
        setInfo((prevState) => ({
            ...prevState,
            [key]: value
        }));
    };

    const getDateTimefromEachItem = (date: any, time: any) => {
        const datetime = new Date(date.year(), date.month(), date.date(), time.hour(), time.minute(), time.second());
        return dayjs(datetime);
    };

    const deploy = useCallback(async () => {
        const _token = info.address;
        const _launchTime = getDateTimefromEachItem(info.date, info.time);
        const _endTime = getDateTimefromEachItem(info.endDate, info.endTime);
        const _router = info.type === 'presale' ? 0 : info.dex === 'novation' ? 0 : 1;
        const _whitelist = info.whitelist ?? [];
        const _urls = JSON.stringify({
            website: info.website,
            telegram: info.telegram,
            discord: info.discord,
            kyc: info.kyc,
            audit: info.audit,
            logo: info.logo,
            description: info.description
        });
        const _args = {
            hardCap: toWei(info.hardcap).toString(),
            softCap: toWei(info.softcap).toString(),
            minInvest: toWei(info.min).toString(),
            maxInvest: toWei(info.max ?? 0).toString(),
            startTime: _launchTime.unix(),
            endTime: _endTime.unix(),
            salePrice: toWei(info.pRate, info.decimals).toString(),
            listPrice: toWei(info.lRate, info.decimals).toString(),
            liquidityAlloc: info.liquidity * 100,
            isBurnForUnsold: info.unsold === 'burn'
        };
        const price = await launchpadContract.price();
        const receipt = await fetchWithCatchTxError(() => {
            return launchpadContract.deploy(_token, _urls, _args, _whitelist, _router, { value: price });
        });
        if (receipt?.status) {
            navigate('../list');
            toastSuccess(
                'Deployed',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    The pool has been created.
                </ToastDescriptionWithTx>
            );
        }
    }, [info, account]);

    const checkAllowance = useCallback(() => {
        if (!account || !tokenContract) return;
        tokenContract.allowance(account, launchpadContract.address).then((result: any) => {
            const allocate = toBigNumber(Number(info.presaleTokens ?? 1));
            const allowance = ethersToBigNumber(result);
            if (allowance.isGreaterThan(allocate)) {
                setIsApproved(true);
            } else {
                setIsApproved(false);
            }
        });
    }, [info.address, info.presaleTokens, account, tokenContract]);

    const approve = useCallback(async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return tokenContract.approve(launchpadContract.address, MaxUint256);
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

    const validateDate = useCallback(async () => {
        const _cTime = dayjs(new Date((await getTimestamp()) * 1000));
        const _launchTime = getDateTimefromEachItem(info.date, info.time);
        const _endTime = getDateTimefromEachItem(info.endDate, info.endTime);
        if (_launchTime.isBefore(_cTime)) return [false, 'Presale start time should be later than current time'];
        if (_endTime.isBefore(_launchTime)) return [false, 'End time should be later than presale start time'];
        return [true, ''];
    }, [info.date, info.time, info.endDate, info.endTime]);

    const onSubmit = useCallback(
        async (e: any) => {
            e.preventDefault();
            const [isValidDate, msg] = await validateDate();
            if (isValidDate) {
                if (isApproved) {
                    deploy();
                } else {
                    approve();
                }
            } else {
                toastError(msg as string);
            }
        },
        [isApproved, approve, deploy, validateDate]
    );

    useEffect(() => {
        checkAllowance();
    }, [checkAllowance]);

    useEffect(() => {
        (async () => {
            if (!info.address) return;
            try {
                const methods = ['name', 'symbol', 'totalSupply', 'decimals'];
                const calls = methods.map((method: string) => ({
                    address: info.address,
                    name: method
                }));
                const result = await multicallv2(BEP20ABI, calls);
                setInfo((prevState: any) => ({
                    ...prevState,
                    name: result[0][0],
                    symbol: result[1][0],
                    decimals: result[3][0],
                    totalSupply: Number(fromWei(ethersToBigNumber(result[2][0]), result[3][0]))
                }));
            } catch (e) {
                setInfo((prevState: any) => ({
                    ...prevState,
                    name: '',
                    symbol: '',
                    totalSupply: ''
                }));
            }
        })();
    }, [info.address]);

    useEffect(() => {
        if (!info.type || !info.hardcap || !info.lRate || !info.liquidity) return;
        if (info.type === 'presale') return;
        const tokensForLiquidity = toBigNumber(info.lRate)
            .times(toBigNumber(info.hardcap))
            .times(toBigNumber(info.liquidity))
            .dividedBy(toBigNumber(100))
            .toString();
        setInfo((prevState) => ({
            ...prevState,
            liquidityTokens: tokensForLiquidity
        }));
    }, [info.type, info.hardcap, info.lRate, info.liquidity]);

    useEffect(() => {
        if (!info.hardcap || !info.pRate) return;
        const tokensForPresale = toBigNumber(info.pRate).times(toBigNumber(info.hardcap)).toString();
        setInfo((prevState) => ({
            ...prevState,
            presaleTokens: tokensForPresale
        }));
    }, [info.hardcap, info.pRate]);

    return (
        <Container sx={{ px: { xs: 0, sm: 2 } }}>
            <Stack component="form" onSubmit={onSubmit}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2.5}
                    pb={{ xs: 1, sm: 7 }}
                >
                    <Typography textTransform="capitalize" fontSize={{ xs: 28, sm: 36 }} fontWeight={500}>
                        token application form
                    </Typography>
                    <Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.25}
                                onClick={() => navigate('../list')}
                                sx={{
                                    cursor: 'pointer'
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
                                    Launchpad List
                                </Typography>
                            </Stack>
                            {account ? (
                                isApproved ? (
                                    <NovationButton
                                        type="submit"
                                        loading={pendingTx}
                                        sx={{
                                            width: 'unset',
                                            height: 44,
                                            py: 0.5,
                                            display: { xs: 'none', sm: 'block' }
                                        }}
                                    >
                                        submit
                                    </NovationButton>
                                ) : (
                                    <NovationButton
                                        type="submit"
                                        loading={pendingTx}
                                        disabled={!tokenContract}
                                        sx={{
                                            width: 'unset',
                                            height: 44,
                                            py: 0.5,
                                            display: { xs: 'none', sm: 'block' }
                                        }}
                                    >
                                        Approve
                                    </NovationButton>
                                )
                            ) : (
                                <Button
                                    onClick={onPresentConnectModal}
                                    variant="outlined"
                                    sx={{
                                        letterSpacing: 3,
                                        fontSize: 16,
                                        padding: (theme) => theme.spacing(0.75, 2.25),
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                >
                                    Connect Wallet
                                </Button>
                            )}
                        </Stack>
                        <Typography
                            textAlign={{ xs: 'left', sm: 'right' }}
                            fontSize={16}
                            fontWeight={500}
                            lineHeight="12px"
                            color="rgba(255, 255, 255, 0.5)"
                            sx={{
                                pt: 3
                            }}
                        >
                            Pool creation fee: 1 BNB
                        </Typography>
                    </Stack>
                </Stack>
                <Grid container spacing={3.5}>
                    <Grid item xs={12} sm={12} md={6}>
                        <Card variant="outlined">
                            <CardContent sx={{ py: '28px !important' }}>
                                <Stack spacing={3}>
                                    <Typography
                                        color="primary"
                                        textTransform="uppercase"
                                        sx={{ opacity: 0.75 }}
                                        fontWeight={700}
                                    >
                                        Project/Token DETAILS
                                    </Typography>
                                    <Stack spacing={2.5}>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                                            <NovationInput
                                                multiline
                                                name="description"
                                                label="Description"
                                                value={info.description ?? ''}
                                                placeholder="Enter Description"
                                                onChange={handleInputChange}
                                                required
                                                sx={{
                                                    flexGrow: 1,
                                                    height: 78 * 2 + 2.5 * 8,
                                                    '& #input-wrapper': {
                                                        flexGrow: 1,
                                                        '& > div': {
                                                            height: '100%',
                                                            '& > div': {
                                                                height: '100%',
                                                                '& textarea': {
                                                                    height: '100% !important'
                                                                }
                                                            }
                                                        }
                                                    },
                                                    '& .MuiInputBase-multiline': {
                                                        padding: 0
                                                    }
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    bgcolor: 'rgba(0, 172, 253, 0.1)',
                                                    position: 'relative',
                                                    top: { xs: 0, sm: 26 },
                                                    height: { xs: 280, sm: 78 * 2 + 2.5 * 8 - 26 },
                                                    width: { xs: '100%', sm: 78 * 2 + 2.5 * 8 - 26 },
                                                    borderRadius: 1,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 0.25
                                                }}
                                            >
                                                {info.logo ? (
                                                    <Box
                                                        component="img"
                                                        src={info.logo}
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            borderRadius: 1
                                                        }}
                                                    />
                                                ) : (
                                                    <Stack justifyContent="center" alignItems="center">
                                                        <WallpaperRoundedIcon sx={{ color: 'text.secondary' }} />
                                                        <Typography
                                                            color="textSecondary"
                                                            textAlign="center"
                                                            padding={1}
                                                            fontSize={13}
                                                        >
                                                            Input your online token logo asset link.
                                                        </Typography>
                                                    </Stack>
                                                )}
                                            </Box>
                                        </Stack>
                                        <NovationInput
                                            name="logo"
                                            label="Logo"
                                            type="url"
                                            value={info.logo ?? ''}
                                            placeholder="Enter Logo URL"
                                            onChange={handleInputChange}
                                            sx={{ flexGrow: 1 }}
                                            required
                                        />
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                                            <NovationSelect
                                                name="type"
                                                label="Application Type"
                                                value={info.type ?? 'presale'}
                                                onChange={handleSelectChange}
                                                required
                                                sx={{ width: { xs: '100%', sm: '55%' } }}
                                            >
                                                <MenuItem id="type" value="presale">
                                                    Presale
                                                </MenuItem>
                                                <MenuItem id="type" value="token-listing">
                                                    Presale + Token Listing
                                                </MenuItem>
                                            </NovationSelect>
                                            <NovationSelect
                                                name="dex"
                                                label="List On"
                                                disabled={info.type !== 'token-listing'}
                                                value={info.dex ?? 'novation'}
                                                onChange={handleSelectChange}
                                                required={info.type === 'token-listing'}
                                                sx={{ width: { xs: '100%', sm: '45%' } }}
                                            >
                                                <MenuItem id="type" value="novation">
                                                    Novation
                                                </MenuItem>
                                                <MenuItem id="type" value="pacakeswap">
                                                    Pancakeswap
                                                </MenuItem>
                                            </NovationSelect>
                                        </Stack>
                                        <NovationInput
                                            name="address"
                                            label="Token Address"
                                            value={info.address ?? ''}
                                            placeholder="Enter Token Address"
                                            onChange={handleInputChange}
                                            required
                                            pattern="^0x[a-fA-F0-9]{40}$"
                                            title="BEP20 Token Address"
                                        />
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                                            <NovationInput
                                                readOnly
                                                name="name"
                                                label="Token Name"
                                                placeholder="Token Name"
                                                value={info.name ?? ''}
                                                onChange={handleInputChange}
                                                sx={{ flexGrow: 1 }}
                                                required
                                            />
                                            <NovationInput
                                                readOnly
                                                name="symbol"
                                                label="Token Symbol"
                                                placeholder="Token Symbol"
                                                value={info.symbol ?? ''}
                                                onChange={handleInputChange}
                                                sx={{ flexGrow: 1 }}
                                                required
                                            />
                                        </Stack>
                                        <Stack direction="row" spacing={2.5}>
                                            <NovationInput
                                                readOnly
                                                name="decimals"
                                                label="Decimals"
                                                placeholder="Decimals"
                                                value={info.decimals ?? ''}
                                                onChange={handleInputChange}
                                                sx={{ width: '50%' }}
                                                required
                                            />
                                            <NovationInput
                                                readOnly
                                                name="totalSupply"
                                                label="Total Supply"
                                                placeholder="Total Supply"
                                                value={info.totalSupply ?? ''}
                                                onChange={handleInputChange}
                                                sx={{ width: '50%' }}
                                                required
                                            />
                                        </Stack>
                                        <NovationInput
                                            name="website"
                                            label="Website URL"
                                            value={info.website ?? ''}
                                            placeholder="Enter Website URL"
                                            onChange={handleInputChange}
                                            type="url"
                                            required
                                        />
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                                            <NovationInput
                                                name="telegram"
                                                label="Telegram"
                                                value={info.telegram ?? ''}
                                                placeholder="Enter Telegram URL"
                                                onChange={handleInputChange}
                                                type="url"
                                                sx={{ flexGrow: 1 }}
                                            />
                                            <NovationInput
                                                name="discord"
                                                label="Discord"
                                                value={info.discord ?? ''}
                                                placeholder="Enter Discord URL"
                                                onChange={handleInputChange}
                                                type="url"
                                                sx={{ flexGrow: 1 }}
                                            />
                                        </Stack>
                                        <NovationInput
                                            name="kyc"
                                            label="KYC"
                                            value={info.kyc ?? ''}
                                            placeholder="Enter KYC URL"
                                            onChange={handleInputChange}
                                            type="url"
                                        />
                                        <NovationInput
                                            name="audit"
                                            label="Audit"
                                            value={info.audit ?? ''}
                                            placeholder="Enter Audit URL"
                                            onChange={handleInputChange}
                                            type="url"
                                        />
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Card variant="outlined">
                            <CardContent sx={{ py: '28px !important' }}>
                                <Stack spacing={3}>
                                    <Typography
                                        color="primary"
                                        textTransform="uppercase"
                                        sx={{ opacity: 0.75 }}
                                        fontWeight={700}
                                    >
                                        Pool information
                                    </Typography>
                                    <Stack spacing={2.5}>
                                        <Stack direction="row" spacing={2.5}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    value={info.date ?? ''}
                                                    onChange={(newValue) => handleDateTimeChange('date', newValue)}
                                                    minDate={new Date()}
                                                    maxDate={info.endDate ?? null}
                                                    components={{
                                                        OpenPickerIcon: () => (
                                                            <Box
                                                                component="img"
                                                                src={require('assets/img/icons/calendar.svg').default}
                                                                sx={{
                                                                    width: 24,
                                                                    height: 24
                                                                }}
                                                            />
                                                        )
                                                    }}
                                                    renderInput={(params) => {
                                                        params.inputProps.placeholder = '_ _ / _ _ / _ _';
                                                        return (
                                                            <NovationInput
                                                                id="Presale Date"
                                                                label="Presale Date"
                                                                inputProps={params}
                                                                required
                                                                sx={{
                                                                    flexGrow: 1,
                                                                    '& #input-wrapper': {
                                                                        paddingRight: 0
                                                                    }
                                                                }}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </LocalizationProvider>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker
                                                    ampm={false}
                                                    value={info.time ?? ''}
                                                    disabled={!info.date}
                                                    onChange={(newValue) => handleDateTimeChange('time', newValue)}
                                                    components={{
                                                        OpenPickerIcon: () => <AccessTimeRoundedIcon color="primary" />
                                                    }}
                                                    renderInput={(params) => {
                                                        params.inputProps.placeholder = '_ _ : _ _';
                                                        return (
                                                            <NovationInput
                                                                id="Presale Time"
                                                                label="Presale Time"
                                                                inputProps={params}
                                                                required
                                                                sx={{
                                                                    flexGrow: 1,
                                                                    '& #input-wrapper': {
                                                                        paddingRight: 0
                                                                    }
                                                                }}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </Stack>
                                        <Stack direction="row" spacing={2.5}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    value={info.endDate ?? ''}
                                                    onChange={(newValue) => {
                                                        handleDateTimeChange('endDate', newValue);
                                                    }}
                                                    minDate={info.date ?? new Date()}
                                                    disabled={!info.date || !info.time}
                                                    components={{
                                                        OpenPickerIcon: () => (
                                                            <Box
                                                                component="img"
                                                                src={require('assets/img/icons/calendar.svg').default}
                                                                sx={{
                                                                    width: 24,
                                                                    height: 24
                                                                }}
                                                            />
                                                        )
                                                    }}
                                                    renderInput={(params) => {
                                                        params.inputProps.placeholder = '_ _ / _ _ / _ _';
                                                        return (
                                                            <NovationInput
                                                                id="End Date"
                                                                label="End Date"
                                                                inputProps={params}
                                                                required
                                                                sx={{
                                                                    flexGrow: 1,
                                                                    '& #input-wrapper': {
                                                                        paddingRight: 0
                                                                    }
                                                                }}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </LocalizationProvider>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker
                                                    ampm={false}
                                                    value={info.endTime ?? ''}
                                                    onChange={(newValue) => handleDateTimeChange('endTime', newValue)}
                                                    components={{
                                                        OpenPickerIcon: () => <AccessTimeRoundedIcon color="primary" />
                                                    }}
                                                    disabled={!info.endDate}
                                                    renderInput={(params) => {
                                                        params.inputProps.placeholder = '_ _ : _ _';
                                                        return (
                                                            <NovationInput
                                                                id="End Time"
                                                                label="End Time"
                                                                inputProps={params}
                                                                required
                                                                sx={{
                                                                    flexGrow: 1,
                                                                    '& #input-wrapper': {
                                                                        paddingRight: 0
                                                                    }
                                                                }}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </Stack>
                                        <Stack direction="row" spacing={2.5}>
                                            <NovationInput
                                                name="softcap"
                                                label="Soft Cap ( BNB )"
                                                type="number"
                                                value={info.softcap ?? ''}
                                                placeholder="Soft Cap"
                                                onChange={handleInputChange}
                                                sx={{ width: '100%' }}
                                                required
                                                min={0}
                                                max={info.hardcap}
                                                step={10 ** -18}
                                            />
                                            <NovationInput
                                                name="hardcap"
                                                label="Hard Cap ( BNB )"
                                                type="number"
                                                value={info.hardcap ?? ''}
                                                placeholder="Hard Cap"
                                                onChange={handleInputChange}
                                                sx={{ width: '100%' }}
                                                required
                                                step={10 ** -18}
                                                min={info.softcap > 0 ? info.softcap : 10 ** -18}
                                            />
                                        </Stack>
                                        <Stack direction="row" spacing={2.5}>
                                            <NovationInput
                                                name="min"
                                                label="Minimum Buy ( BNB )"
                                                type="number"
                                                value={info.min ?? ''}
                                                placeholder="Minimum Buy"
                                                onChange={handleInputChange}
                                                sx={{ flexGrow: 1 }}
                                                min={0.01}
                                                max={info.max > 0 ? info.max : info.hardcap}
                                                step={10 ** -18}
                                                required
                                            />
                                            <NovationInput
                                                name="max"
                                                label="Maximum Buy ( BNB )"
                                                type="number"
                                                value={info.max ?? ''}
                                                placeholder="Maximum Buy"
                                                onChange={handleInputChange}
                                                sx={{ flexGrow: 1 }}
                                                min={info.min}
                                                max={info.hardcap}
                                                step={10 ** -18}
                                                required={info.max > 0}
                                            />
                                        </Stack>
                                        <NovationInput
                                            name="pRate"
                                            label="Presale Rate ( per BNB )"
                                            type="number"
                                            value={info.pRate ?? ''}
                                            placeholder="Presale Rate ( per BNB )"
                                            onChange={handleInputChange}
                                            sx={{ flexGrow: 1 }}
                                            required
                                            step={10 ** -18}
                                            min={1 / 10 ** 18}
                                        />
                                        <NovationInput
                                            name="lRate"
                                            label="Listing Rate ( per BNB )"
                                            type="number"
                                            value={info.lRate ?? ''}
                                            disabled={info.type !== 'token-listing'}
                                            placeholder="Listing Rate ( per BNB )"
                                            onChange={handleInputChange}
                                            sx={{ flexGrow: 1 }}
                                            step={10 ** -18}
                                            required={info.type === 'token-listing'}
                                        />
                                        <NovationInput
                                            name="liquidity"
                                            label="Liquidity Percent ( % )"
                                            type="number"
                                            value={info.liquidity ?? ''}
                                            disabled={info.type !== 'token-listing'}
                                            placeholder="Liquidity Percent"
                                            onChange={handleInputChange}
                                            sx={{ flexGrow: 1 }}
                                            required={info.type === 'token-listing'}
                                            min={10}
                                            max={100}
                                            step={10 ** -18}
                                        />
                                        <NovationSelect
                                            name="unsold"
                                            label="Unsold Tokens"
                                            value={info.unsold ?? 'burn'}
                                            onChange={handleSelectChange}
                                            sx={{ flexGrow: 1 }}
                                            required
                                        >
                                            <MenuItem value="burn">BURN</MenuItem>
                                            <MenuItem value="refund">REFUND</MenuItem>
                                        </NovationSelect>
                                        <NovationInput
                                            name="presaleTokens"
                                            label="Tokens For Presale"
                                            type="number"
                                            value={info.presaleTokens ?? ''}
                                            placeholder="Tokens For Presale"
                                            onChange={handleInputChange}
                                            sx={{ flexGrow: 1 }}
                                            readOnly
                                        />
                                        <NovationInput
                                            name="liquidityTokens"
                                            label="Tokens for Liquidity"
                                            type="number"
                                            value={info.liquidityTokens ?? ''}
                                            placeholder="Tokens for Liquidity"
                                            onChange={handleInputChange}
                                            sx={{ flexGrow: 1 }}
                                            readOnly
                                        />
                                        <Stack>
                                            <Typography fontSize={14} lineHeight="14px" color="textSecondary">
                                                Is there a whitelist for the pool?
                                            </Typography>
                                            <Stack direction="row" justifyContent="space-between" spacing={2.5}>
                                                <NovationYesNo
                                                    name="isPrivate"
                                                    value={info.isPrivate ?? false}
                                                    onChange={handleRadioChange}
                                                />
                                                {info.isPrivate && (
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
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
                                                                require('assets/img/icons/document-upload.svg').default
                                                            }
                                                            sx={{
                                                                width: 24,
                                                                top: 'calc(50% - 12px) !important',
                                                                right: '12px !important'
                                                            }}
                                                        />
                                                        {info.file && info.whitelist?.length ? (
                                                            <Typography color="primary" fontSize={14}>
                                                                {info.file.name}{' '}
                                                                {`(${info.whitelist.length} addresses)`}
                                                            </Typography>
                                                        ) : (
                                                            <Typography color="primary" fontSize={14}>
                                                                Upload File with the Wallet Addresses
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                )}
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                {account ? (
                    isApproved ? (
                        <NovationButton
                            type="submit"
                            loading={pendingTx}
                            sx={{ mt: 3.5, display: { xs: 'block', sm: 'none' } }}
                        >
                            submit
                        </NovationButton>
                    ) : (
                        <NovationButton
                            type="submit"
                            loading={pendingTx}
                            disabled={!tokenContract}
                            sx={{ mt: 3.5, display: { xs: 'block', sm: 'none' } }}
                        >
                            Approve
                        </NovationButton>
                    )
                ) : (
                    <Button
                        onClick={onPresentConnectModal}
                        variant="outlined"
                        sx={{
                            letterSpacing: 3,
                            fontSize: 16,
                            padding: (theme) => theme.spacing(0.75, 2.25),
                            mt: 3.5,
                            display: { xs: 'block', sm: 'none' }
                        }}
                    >
                        Connect Wallet
                    </Button>
                )}
            </Stack>
            <FileUpload
                open={isOpenFileUpload}
                onClose={() => {
                    setInfo((prevState) => ({
                        ...prevState,
                        whitelist: [],
                        file: null
                    }));
                    setIsOpenFileUpload(false);
                }}
                onEvent={(file: any, contentMap: string[]) => {
                    setIsOpenFileUpload(false);
                    setInfo((prevState) => ({
                        ...prevState,
                        whitelist: contentMap,
                        file: file
                    }));
                }}
            />
        </Container>
    );
};

export default Create;
