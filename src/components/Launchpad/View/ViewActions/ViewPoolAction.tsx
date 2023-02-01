import { useCallback, useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// ** Custom Icon ** //
import CountDown from 'components/Base/NovationCountDown';
import NovationProgressBar from 'components/Base/NovationProgress';
import NovationInput from 'components/Base/NovationInput';
import NovationButton from 'components/Base/NovationButton';

import usePool from 'hooks/usePool';
import useAuth from 'hooks/useAuth';
import useToast from 'hooks/useToast';
import useCatchTxError from 'hooks/useCatchTxError';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useWalletModal } from 'components/WalletModal';
import { usePoolContract } from 'hooks/useContract';

import { ethersToBigNumber, formatNumber, fromWei, toBigNumber, toWei } from 'utils/bigNumber';

import { ToastDescriptionWithTx } from 'components/Toast';
import { getBnbBalance } from 'utils/web3';

const ViewPoolAction: React.FC<any> = () => {
    const { activePool, getPoolStatus } = usePool();

    const [isClaimed, setIsClaimed] = useState<boolean>(false);
    const [isWhiteList, setIsWhiteList] = useState<boolean>(false);
    const [amount, setAmount] = useState<any>('');
    const [bnbBalance, setBnbBalance] = useState<any>();

    const { login, logout } = useAuth();
    const { account } = useActiveWeb3React();
    const { toastSuccess } = useToast();
    const { onPresentConnectModal } = useWalletModal(login, logout);
    const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError();

    const poolContract = usePoolContract(activePool.pool);

    const setMax = useCallback(() => {
        if (ethersToBigNumber(bnbBalance).isGreaterThan(ethersToBigNumber(activePool.maxInvestable))) {
            setAmount(fromWei(activePool.maxInvestable));
        } else {
            setAmount(fromWei(bnbBalance));
        }
    }, [bnbBalance, activePool.maxInvestable]);

    const invest = useCallback(async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return poolContract.invest({ value: toWei(amount).toString() });
        });
        if (receipt?.status) {
            setAmount('');
            toastSuccess(
                'Invested',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    Your Token was invested successfully.
                </ToastDescriptionWithTx>
            );
        }
    }, [amount, poolContract]);

    const claim = useCallback(async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return poolContract.claim();
        });
        if (receipt?.status) {
            setAmount('');
            toastSuccess(
                'Claimed',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    Your Token was claimed successfully.
                </ToastDescriptionWithTx>
            );
        }
    }, [amount, poolContract]);

    const claimRefund = useCallback(async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return poolContract.getRefund();
        });
        if (receipt?.status) {
            setAmount('');
            toastSuccess(
                'Refunded',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    Your Invested balance was refunded successfully.
                </ToastDescriptionWithTx>
            );
        }
    }, [amount, poolContract]);

    useEffect(() => {
        (async () => {
            if (!account) return;
            const balance = await getBnbBalance(account);
            setBnbBalance(balance);
        })();
    }, [account, getBnbBalance, amount]);

    useEffect(() => {
        if (!account || !poolContract) return;
        poolContract.claimed(account).then(setIsClaimed);
    }, [account, activePool]);
    useEffect(() => {
        if (!account || !poolContract) return;
        poolContract.whitelist(account).then(setIsWhiteList);
    }, [account, activePool]);

    return (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent component={Stack} spacing={3.5}>
                {(() => {
                    if (!activePool.started) {
                        return (
                            <>
                                <Typography fontSize={12} fontWeight={500} lineHeight="14px" textTransform="uppercase">
                                    Presale Starts In
                                </Typography>
                                <CountDown size={54} endTime={activePool.startTime} />
                            </>
                        );
                    } else if (activePool.started) {
                        return (
                            <>
                                <Typography fontSize={12} fontWeight={500} lineHeight="14px" textTransform="uppercase">
                                    Presale Ends In
                                </Typography>
                                <CountDown size={54} endTime={activePool.endTime} />
                            </>
                        );
                    }
                })()}
                <NovationProgressBar
                    label="Progress"
                    value={
                        activePool.raised && activePool.hardcap
                            ? Number(
                                  ethersToBigNumber(activePool.raised)
                                      .dividedBy(ethersToBigNumber(activePool.hardcap))
                                      .times(toBigNumber(100))
                              )
                            : 0
                    }
                    min={activePool.raised ? `${formatNumber(fromWei(activePool.raised))} BNB` : null}
                    max={activePool.hardcap ? `${formatNumber(fromWei(activePool.hardcap))} BNB` : null}
                />
                <Stack spacing={1}>
                    <Stack direction="row" alignItems="flex-end" spacing={2}>
                        <NovationInput
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            sx={{ width: '100% ' }}
                            label="Amount"
                            placeholder="Enter an amount"
                        />
                        <NovationButton
                            onClick={setMax}
                            variant="outlined"
                            sx={{ height: 52, flexGrow: 1, width: 'unset' }}
                        >
                            Max
                        </NovationButton>
                    </Stack>
                    <Typography
                        color="textSecondary"
                        fontSize={14}
                        fontWeight={500}
                        lineHeight="14px"
                        textTransform="capitalize"
                    >
                        {bnbBalance ? `Available Balance: ${formatNumber(fromWei(bnbBalance))} BNB` : ''}
                    </Typography>
                </Stack>
                {account ? (
                    ['ended', 'failed', 'finalized', 'claim'].includes(getPoolStatus(activePool)) ? (
                        activePool.enabledRefund ? (
                            <NovationButton
                                onClick={claimRefund}
                                loading={pendingTx}
                                sx={{ width: 'unset', height: 44, py: 0.5 }}
                            >
                                Claim Refund
                            </NovationButton>
                        ) : (
                            <NovationButton
                                onClick={claim}
                                loading={pendingTx}
                                disabled={getPoolStatus(activePool) !== 'claim' || isClaimed}
                                sx={{ width: 'unset', height: 44, py: 0.5 }}
                            >
                                Claim
                            </NovationButton>
                        )
                    ) : activePool.publicMode || isWhiteList ? (
                        <NovationButton
                            onClick={invest}
                            loading={pendingTx}
                            disabled={(() => {
                                if (!poolContract || !activePool.minInvestable) return true;
                                if (!amount || amount === '') return true;
                                if (toWei(amount).isLessThan(ethersToBigNumber(activePool.minInvestable))) {
                                    return true;
                                }
                                const status = getPoolStatus(activePool);
                                if (status !== 'live') return true;
                            })()}
                            sx={{ width: 'unset', height: 44, py: 0.5 }}
                        >
                            Invest
                        </NovationButton>
                    ) : (
                        <NovationButton disabled={true} sx={{ width: 'unset', height: 44, py: 0.5 }}>
                            Not Whitelisted
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
            </CardContent>
        </Card>
    );
};

export default ViewPoolAction;
