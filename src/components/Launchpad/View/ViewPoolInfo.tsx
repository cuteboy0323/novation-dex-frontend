import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Grid, { GridProps } from '@mui/material/Grid';

import SpaceIcon from 'components/Items/SpaceIcon';

import usePool from 'hooks/usePool';
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Types ** //
import { ThemeOptions } from '@mui/material';

import { formatNumber, fromWei, toBigNumber } from 'utils/bigNumber';
import { getBscScanLink, isAddress } from 'utils';
import { getRouterAddress } from 'utils/addressHelpers';

const infoList = [
    {
        key: 'pool',
        label: 'Presale Address',
        value: '0x469772635f09cfb5186fg9568gf62658g96648',
        extra: '( Do not send funds to this address )',
        method: (poolData: any) => (poolData.pool ? poolData.pool : <Skeleton />)
    },
    {
        key: 'token',
        label: 'Token Address',
        value: '0x469772635f09cfb5186fg9568gf62658g96648',
        extra: '( Do not send funds to this address )',
        method: (poolData: any) => (poolData.token ? poolData.token : <Skeleton />)
    },
    {
        key: 'name',
        label: 'Token Name',
        value: 'Vault Finance',
        extra: '',
        method: (poolData: any) => (poolData.name ? poolData.name : <Skeleton />)
    },
    {
        key: 'symbol',
        label: 'Symbol',
        value: '$VFX',
        extra: '',
        method: (poolData: any) => (poolData.symbol ? poolData.symbol : <Skeleton />)
    },
    {
        key: 'decimals',
        label: 'Decimals',
        value: '18',
        extra: '',
        method: (poolData: any) => (poolData.decimals ? formatNumber(poolData.decimals) : <Skeleton />)
    },
    {
        key: 'totalSupply',
        label: 'Total Supply',
        value: '1,000,000,000,000,000 VFX',
        extra: '',
        method: (poolData: any) =>
            poolData.totalSupply && poolData.decimals && poolData.symbol ? (
                `${formatNumber(fromWei(poolData.totalSupply, poolData.decimals))} ${poolData.symbol}`
            ) : (
                <Skeleton />
            )
    },
    {
        key: 'tokensForPresale',
        label: 'Tokens for Presale',
        value: '300,000,000,000,000 VFX',
        extra: '',
        method: (poolData: any) =>
            poolData.salePrice && poolData.hardcap && poolData.decimals && poolData.symbol ? (
                `${formatNumber(
                    toBigNumber(fromWei(poolData.salePrice, poolData.decimals)).times(
                        toBigNumber(fromWei(poolData.hardcap))
                    )
                )} ${poolData.symbol}`
            ) : (
                <Skeleton />
            )
    },
    {
        key: 'tokensForLiquidity',
        label: 'Tokens for Liquidity',
        value: '300,000,000,000,000 VFX',
        extra: '',
        method: (poolData: any) =>
            poolData.liquidityAlloc && poolData.listPrice && poolData.raised && poolData.decimals && poolData.symbol ? (
                `${formatNumber(
                    toBigNumber(fromWei(poolData.listPrice, poolData.decimals)).times(
                        toBigNumber(fromWei(poolData.raised))
                            .times(toBigNumber(poolData.liquidityAlloc / 100))
                            .dividedBy(toBigNumber(100))
                    )
                )} ${poolData.symbol}`
            ) : (
                <Skeleton />
            )
    },
    {
        key: 'liquidityAlloc',
        label: 'Liquidity Percent',
        value: '60%',
        extra: '',
        method: (poolData: any) =>
            poolData.liquidityAlloc ? `${formatNumber(poolData.liquidityAlloc / 100)}%` : <Skeleton />
    },
    {
        key: 'salePrice',
        label: 'Presale Rate',
        value: '1 BNB = 300,000,000,000 VFX',
        extra: '',
        method: (poolData: any) =>
            poolData.salePrice && poolData.decimals && poolData.symbol ? (
                `1 BNB = ${formatNumber(fromWei(poolData.salePrice, poolData.decimals))} ${poolData.symbol}`
            ) : (
                <Skeleton />
            )
    },
    {
        key: 'listPrice',
        label: 'Listing Rate',
        value: '1 BNB = 300,000,000,000 VFX',
        extra: '',
        method: (poolData: any) =>
            poolData.listPrice && poolData.decimals && poolData.symbol ? (
                `1 BNB = ${formatNumber(fromWei(poolData.listPrice, poolData.decimals))} ${poolData.symbol}`
            ) : (
                <Skeleton />
            )
    },
    {
        key: 'softcap',
        label: 'Soft Cap',
        value: '100 BNB',
        extra: '',
        method: (poolData: any) => (poolData.softcap ? `${formatNumber(fromWei(poolData.softcap))} BNB` : <Skeleton />)
    },
    {
        key: 'hardcap',
        label: 'Hard Cap',
        value: '200 BNB',
        extra: '',
        method: (poolData: any) => (poolData.hardcap ? `${formatNumber(fromWei(poolData.hardcap))} BNB` : <Skeleton />)
    },
    {
        key: 'isBurnForUnsold',
        label: 'Unsold Tokens',
        value: 'Burn',
        extra: '',
        method: (poolData: any) =>
            poolData.isBurnForUnsold !== undefined ? poolData.isBurnForUnsold ? 'Burn' : 'Refund' : <Skeleton />
    },
    {
        key: 'startTime',
        label: 'Presale Start Time',
        value: '2022-08-17 17:00 UTC',
        extra: '',
        method: (poolData: any) =>
            poolData.startTime ? new Date(poolData.startTime * 1000).toLocaleString() : <Skeleton />
    },
    {
        key: 'endTime',
        label: 'Presale End Time',
        value: '2022-08-18 17:00 UTC',
        extra: '',
        method: (poolData: any) =>
            poolData.endTime ? new Date(poolData.endTime * 1000).toLocaleString() : <Skeleton />
    },
    {
        key: 'router',
        label: 'Listing On',
        value: 'Novation',
        extra: '',
        method: (poolData: any) => {
            if (!poolData.listPrice || !poolData.liquidityAlloc || !poolData.router) return <Skeleton />;
            if (
                toBigNumber(fromWei(poolData.listPrice)).isZero() ||
                toBigNumber(fromWei(poolData.liquidityAlloc)).isZero()
            )
                return 'None';
            return poolData.router === getRouterAddress() ? 'Novation' : 'Pancake';
        }
    }
];

const ViewPoolInfo: React.FC<GridProps> = () => {
    const { activePool } = usePool();

    const isMobile = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

    return (
        <Grid item xs={12} sm={7}>
            <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent
                    component={Stack}
                    spacing={2}
                    justifyContent="space-between"
                    sx={{ height: '100%', padding: '36px !important' }}
                >
                    {infoList.map((item) => (
                        <Stack spacing={0.5} key={item.key}>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                spacing={{ xs: 0.25, sm: 0 }}
                            >
                                <Typography fontSize={14} lineHeight="14px" color="textSecondary">
                                    {item.label}
                                </Typography>
                                <SpaceIcon />
                                <Link
                                    href={
                                        isAddress(item.method(activePool))
                                            ? getBscScanLink(item.method(activePool), 'address')
                                            : null
                                    }
                                    color="inherit"
                                    underline="none"
                                    target="_blank"
                                >
                                    <Typography fontSize={14} lineHeight="14px">
                                        {isAddress(item.method(activePool))
                                            ? isMobile
                                                ? `${item.method(activePool).substring(0, 10)} ... ${item
                                                      .method(activePool)
                                                      .substring(item.method(activePool).length - 10)}`
                                                : item.method(activePool)
                                            : item.method(activePool)}
                                    </Typography>
                                </Link>
                            </Stack>
                            <Typography
                                textAlign={{ xs: 'left', sm: 'right' }}
                                fontSize={12}
                                lineHeight="12px"
                                color="rgba(255, 255, 255, 0.5)"
                            >
                                {item.extra}
                            </Typography>
                        </Stack>
                    ))}
                </CardContent>
            </Card>
        </Grid>
    );
};

export default ViewPoolInfo;
