import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import usePool from 'hooks/usePool';

import { formatNumber, fromWei } from 'utils/bigNumber';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { usePoolContract } from 'hooks/useContract';

const ViewPoolDetail: React.FC<any> = () => {
    const [invested, setInvested] = useState<any>();

    const { account } = useActiveWeb3React();
    const { activePool, getPoolStatus } = usePool();

    const poolContract = usePoolContract(activePool.pool);

    useEffect(() => {
        if (!account || !poolContract) return;
        poolContract
            .invests(account)
            .then(setInvested)
            .catch(() => {});
    }, [account, poolContract, activePool]);

    const getStatusLabel = (poolData: any) => {
        const status = getPoolStatus(poolData);
        switch (status) {
            case 'live':
                return (
                    <Typography
                        fontSize={14}
                        lineHeight="14px"
                        fontWeight={500}
                        textTransform="uppercase"
                        sx={{ color: 'success.main' }}
                    >
                        Live
                    </Typography>
                );
            case 'upcoming':
                return (
                    <Typography
                        fontSize={14}
                        lineHeight="14px"
                        fontWeight={500}
                        textTransform="uppercase"
                        sx={{ color: 'warning.main' }}
                    >
                        Upcoming
                    </Typography>
                );
            case 'ended':
            case 'finalized':
            case 'claim':
                return (
                    <Typography
                        fontSize={14}
                        lineHeight="14px"
                        fontWeight={500}
                        textTransform="uppercase"
                        sx={{ color: 'info.main' }}
                    >
                        Completed
                    </Typography>
                );
            case 'canceled':
                return (
                    <Typography
                        fontSize={14}
                        lineHeight="14px"
                        fontWeight={500}
                        textTransform="uppercase"
                        sx={{ color: 'error.main' }}
                    >
                        Canceled
                    </Typography>
                );
            case 'failed':
                return (
                    <Typography
                        fontSize={14}
                        lineHeight="14px"
                        fontWeight={500}
                        textTransform="uppercase"
                        sx={{ color: 'error.main' }}
                    >
                        Ended
                    </Typography>
                );
            default:
                return (
                    <Typography
                        fontSize={14}
                        lineHeight="14px"
                        fontWeight={500}
                        textTransform="uppercase"
                        sx={{ color: 'error.main' }}
                    >
                        Unknown
                    </Typography>
                );
        }
    };

    return (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent component={Stack} spacing={3.5}>
                <Typography
                    color="textSecondary"
                    fontSize={16}
                    fontWeight={500}
                    lineHeight="14px"
                    textTransform="uppercase"
                >
                    INFO
                </Typography>
                <Table
                    sx={{
                        '& td': {
                            border: 'none',
                            py: 1.5,
                            pl: 0,
                            lineHeight: 1
                        }
                    }}
                >
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Typography
                                    fontSize={14}
                                    lineHeight="14px"
                                    fontWeight={500}
                                    color="textSecondary"
                                    textTransform="capitalize"
                                >
                                    Status
                                </Typography>
                            </TableCell>
                            <TableCell>{getStatusLabel(activePool)}</TableCell>
                            <TableCell>
                                <Typography
                                    fontSize={14}
                                    lineHeight="14px"
                                    fontWeight={500}
                                    color="textSecondary"
                                    textTransform="capitalize"
                                >
                                    Sale Type
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    fontSize={14}
                                    lineHeight="14px"
                                    fontWeight={500}
                                    color="inherit"
                                    textTransform="uppercase"
                                >
                                    {activePool.publicMode ? 'Public' : 'Private'}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography
                                    fontSize={14}
                                    lineHeight="14px"
                                    fontWeight={500}
                                    color="textSecondary"
                                    textTransform="capitalize"
                                >
                                    Total Contributors
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    fontSize={14}
                                    lineHeight="14px"
                                    fontWeight={500}
                                    color="inherit"
                                    textTransform="uppercase"
                                >
                                    {activePool.count ? `${formatNumber(activePool.count)}` : null}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    fontSize={14}
                                    lineHeight="14px"
                                    fontWeight={500}
                                    color="textSecondary"
                                    textTransform="capitalize"
                                >
                                    Your Contributed
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    fontSize={14}
                                    lineHeight="14px"
                                    fontWeight={500}
                                    color="inherit"
                                    textTransform="uppercase"
                                >
                                    {invested ? `${formatNumber(fromWei(invested))}` : null}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography
                                    fontSize={14}
                                    lineHeight="14px"
                                    fontWeight={500}
                                    color="textSecondary"
                                    textTransform="capitalize"
                                >
                                    Minimum Buy
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    fontSize={14}
                                    lineHeight="14px"
                                    fontWeight={500}
                                    color="inherit"
                                    textTransform="uppercase"
                                >
                                    {activePool.minInvestable
                                        ? `${formatNumber(fromWei(activePool.minInvestable))} BNB`
                                        : null}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    fontSize={14}
                                    lineHeight="14px"
                                    fontWeight={500}
                                    color="textSecondary"
                                    textTransform="capitalize"
                                >
                                    Maximum Buy
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    fontSize={14}
                                    lineHeight="14px"
                                    fontWeight={500}
                                    color="inherit"
                                    textTransform="uppercase"
                                >
                                    {activePool.maxInvestable
                                        ? `${formatNumber(fromWei(activePool.maxInvestable))} BNB`
                                        : null}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default ViewPoolDetail;
