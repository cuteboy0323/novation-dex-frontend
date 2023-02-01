// ** React Methods ** //
import { useCallback, useEffect, useState, useMemo } from 'react';

// ** Material UI Components ** //
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ** Novation Custom Components ** //
import NovationButton from 'components/Base/NovationButton';
import NovationTokenInput from 'components/Swap/NovationTokenInput';
import SwapAddIcon from 'components/Items/SwapAddIcon';
import TokenSelect from 'components/Swap/TokenSelect';

// ** Extra Components ** //
import { ToastDescriptionWithTx } from 'components/Toast';

// ** Hooks ** //
import useApi from 'hooks/useApi';
import useAuth from 'hooks/useAuth';
import useToast from 'hooks/useToast';
import useCatchTxError from 'hooks/useCatchTxError';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useWalletModal } from 'components/WalletModal';
import { useFactoryContract, useLpTokenContract, useRouterContract, useTokenContract } from 'hooks/useContract';

import tokens, { liquidityTokens } from 'config/constants/tokens';
import { NULLADDR } from 'config/constants/networks';
import { MaxUint256 } from '@ethersproject/constants';
import { ethersToBigNumber, fromWei, toBigNumber, toWei } from 'utils/bigNumber';
import { CIDS } from 'config';
import { setupNetwork } from 'utils/wallet';

const AddLiquidity = () => {
    const { account, chainId } = useActiveWeb3React();
    const { login, logout } = useAuth();
    const { onPresentConnectModal } = useWalletModal(login, logout);
    const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError();
    const { toastSuccess } = useToast();
    const { balances, updateBalance } = useApi();

    const [amount, setAmount] = useState<any>({
        base: {
            number: '',
            wei: ''
        },
        quote: {
            number: '',
            wei: ''
        }
    });
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [data, setData] = useState<any>({});
    const [lpToken, setLpToken] = useState<string>();
    const [activeToken, setActiveToken] = useState<any>({
        base: liquidityTokens.vfx,
        quote: tokens.bnb
    });
    const [target, setTarget] = useState<string>('base');
    const [isOpenTokenSelect, setIsOpenTokenSelect] = useState<boolean>(false);
    const isNetworkMatch = useMemo(() => {
        return chainId === CIDS.MAINNET;
    }, [chainId]);
    const routerContract = useRouterContract();
    const factoryContract = useFactoryContract();
    const lpTokenContract = useLpTokenContract(lpToken);
    const tokenContract = useTokenContract(activeToken.base.address);

    const handleTokenSelectOpen = (params: any) => {
        setTarget(params);
        setIsOpenTokenSelect(true);
    };
    const handleTokenSelectClose = () => {
        setIsOpenTokenSelect(false);
    };
    const updateNetwork = () => {
        setupNetwork();
    };
    const handleTokenSelect = (token: any, flag: string) => {
        resetAmount();
        setActiveToken((prevState) => ({
            ...prevState,
            [flag]: token
        }));
    };

    const approve = async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return tokenContract.approve(routerContract.address, MaxUint256);
        });
        if (receipt?.status) {
            update();
            toastSuccess(
                'Approved',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    Your Token was approved successfully.
                </ToastDescriptionWithTx>
            );
        }
    };

    const addLiquidity = async () => {
        const cTime = new Date().getTime();
        const deadline = Math.floor((cTime + 720000) / 1000);
        const receipt = await fetchWithCatchTxError(() => {
            return routerContract.addLiquidityETH(
                activeToken.base.address,
                amount.base.wei.toString(),
                0,
                0,
                account,
                deadline,
                {
                    value: amount.quote.wei.toString()
                }
            );
        });
        if (receipt?.status) {
            update();
            resetAmount();
            updateBalance(liquidityTokens);
            toastSuccess(
                'Added Liquidity',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    You added liquidity successfully.
                </ToastDescriptionWithTx>
            );
        }
    };

    const isNegativeOrZero = (value: any) => {
        if (Number(value) <= 0) return true;
        return false;
    };

    const setBaseAmount = (value: any, isWei = false) => {
        setAmount((prevState) => ({
            ...prevState,
            base: {
                number: isWei ? fromWei(value, activeToken.base.decimals) : value,
                wei: isWei ? value : toWei(value, activeToken.base.decimals)
            }
        }));
    };
    const setQuoteAmount = (value: any, isWei = false) => {
        setAmount((prevState) => ({
            ...prevState,
            quote: {
                number: isWei ? fromWei(value, activeToken.quote.decimals) : value,
                wei: isWei ? value : toWei(value, activeToken.quote.decimals)
            }
        }));
    };

    const handleBaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBaseAmount(event.target.value);
        setAmountsOut(event.target.value);
    };
    const handleQuoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuoteAmount(event.target.value);
        setAmountsIn(event.target.value);
    };

    const setAmountsIn = (value: any) => {
        if (!data[lpToken]) return;
        if (isNegativeOrZero(value)) {
            setBaseAmount('');
        } else {
            routerContract
                .quote(
                    toWei(value, activeToken.quote.decimals).toString(),
                    data[lpToken]?.reserve1,
                    data[lpToken]?.reserve0
                )
                .then((result: any) => {
                    setBaseAmount(result, true);
                });
        }
    };
    const setAmountsOut = (value: any) => {
        if (!data[lpToken]) return;
        if (isNegativeOrZero(value)) {
            setQuoteAmount('');
        } else {
            routerContract
                .quote(
                    toWei(value, activeToken.base.decimals).toString(),
                    data[lpToken]?.reserve0,
                    data[lpToken]?.reserve1
                )
                .then((result: any) => {
                    setQuoteAmount(result, true);
                });
        }
    };

    const resetAmount = () => {
        setBaseAmount('');
        setQuoteAmount('');
    };

    const checkAllowance = useCallback(() => {
        if (!account) return;
        tokenContract.allowance(account, routerContract.address).then((result: any) => {
            const allocate = toBigNumber(Number(amount.base.number));
            const allowance = ethersToBigNumber(result);
            if (allowance.isGreaterThan(allocate)) {
                setIsApproved(true);
            } else {
                setIsApproved(false);
            }
        });
    }, [activeToken.base, account]);

    const checkReserves = useCallback(() => {
        if (!lpToken || lpToken === NULLADDR) return;
        lpTokenContract.token0().then((result: any) => {
            const flag = result === activeToken.quote.address;
            lpTokenContract.getReserves().then(({ _reserve0, _reserve1 }: any) => {
                if (isNegativeOrZero(_reserve0) || isNegativeOrZero(_reserve1)) return;
                setData((prevState) => ({
                    ...prevState,
                    [lpToken]: {
                        reserve0: flag ? _reserve1 : _reserve0,
                        reserve1: flag ? _reserve0 : _reserve1
                    }
                }));
            });
        });
    }, [lpToken]);

    const checkLpToken = useCallback(() => {
        factoryContract.getPair(activeToken.base.address, activeToken.quote.address).then(setLpToken);
    }, [activeToken]);

    const isNegativeBaseBalance = useMemo(() => {
        const balance = balances[activeToken.base.address];
        const inputBalance = amount?.base?.number;
        if (!balance) return false;
        return ethersToBigNumber(balance).isLessThan(toBigNumber(toWei(inputBalance, activeToken.base.decimals)));
    }, [balances[activeToken.base.address], amount?.base?.number, activeToken.base.decimals]);
    const isNegativeQuoteBalance = useMemo(() => {
        const balance = balances[activeToken.quote.address];
        const inputBalance = amount?.quote?.number;
        if (!balance) return false;
        return ethersToBigNumber(balance).isLessThan(toBigNumber(toWei(inputBalance, activeToken.quote.decimals)));
    }, [balances[activeToken.quote.address], amount?.quote?.number, activeToken.quote.decimals]);

    const update = () => {
        checkLpToken();
        checkReserves();
        checkAllowance();
    };

    useEffect(() => {
        checkAllowance();
        checkLpToken();
        checkReserves();
    }, [checkAllowance, checkReserves, checkLpToken]);

    return (
        <Stack spacing={2} pt={1}>
            <Typography fontSize={14} fontWeight={700} lineHeight="14px" textTransform="uppercase" mt={8.5}>
                choose a valid pair
            </Typography>
            <Stack pb={8.5}>
                <NovationTokenInput
                    balance={balances[activeToken.base.address]}
                    openTokenSelect={() => handleTokenSelectOpen('base')}
                    token={activeToken.base}
                    value={amount?.base?.number}
                    onChange={handleBaseChange}
                />
                <SwapAddIcon />
                <NovationTokenInput
                    balance={balances[activeToken.quote.address]}
                    token={activeToken.quote}
                    value={amount?.quote?.number}
                    onChange={handleQuoteChange}
                    disabled
                />
            </Stack>
            {account ? (
                isNetworkMatch ? (
                    isApproved ? (
                        isNegativeBaseBalance ? (
                            <NovationButton disabled loading={pendingTx} onClick={addLiquidity}>
                                Insufficient {activeToken.base.symbol} Token balance.
                            </NovationButton>
                        ) : isNegativeQuoteBalance ? (
                            <NovationButton disabled loading={pendingTx} onClick={addLiquidity}>
                                Insufficient {activeToken.quote.symbol} Token balance.
                            </NovationButton>
                        ) : (
                            <NovationButton loading={pendingTx} onClick={addLiquidity}>
                                Add Liquidity
                            </NovationButton>
                        )
                    ) : (
                        <NovationButton loading={pendingTx} onClick={approve}>
                            Approve
                        </NovationButton>
                    )
                ) : (
                    <NovationButton onClick={updateNetwork}>Switch to BSC Network</NovationButton>
                )
            ) : (
                <NovationButton onClick={onPresentConnectModal}>CONNECT WALLET</NovationButton>
            )}
            <TokenSelect
                target={target}
                activeToken={activeToken}
                open={isOpenTokenSelect}
                onClose={handleTokenSelectClose}
                onTokenSelect={handleTokenSelect}
                tokenList={liquidityTokens}
            />
        </Stack>
    );
};

export default AddLiquidity;
