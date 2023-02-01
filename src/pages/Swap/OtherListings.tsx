// ** React Methods ** //
import { useCallback, useEffect, useState, useMemo } from 'react';

// ** Material UI Components ** //
import Stack from '@mui/material/Stack';

// ** Novation Custom Components ** //
import NovationButton from 'components/Base/NovationButton';
import NovationSlider from 'components/Swap/NovationSlider';
import NovationTokenInput from 'components/Swap/NovationTokenInput';
import SwapVertIcon from 'components/Items/SwapVertIcon';
import TokenStatus from 'components/Swap/TokenStatus';
import Slippage from 'components/Swap/Slippage';
import TokenSelect from 'components/Swap/TokenSelect';

// ** Extra Components ** //
import { ToastDescriptionWithTx } from 'components/Toast';

// ** Hooks ** //
import useApi from 'hooks/useApi';
import useAuth from 'hooks/useAuth';
import useToast from 'hooks/useToast';
import useConfig from 'hooks/useConfig';
import useCatchTxError from 'hooks/useCatchTxError';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useParams } from 'react-router-dom';
import { useWalletModal } from 'components/WalletModal';
import { usePCSRouterContract, useSwapOtherContract, useTokenContract } from 'hooks/useContract';

import { isAddress } from 'utils';
import { ethersToBigNumber, fromWei, toBigNumber, toWei } from 'utils/bigNumber';
import { MaxUint256 } from '@ethersproject/constants';

import tokens from 'config/constants/tokens';
import TokenImport from 'components/Swap/TokenImportModal';
import { CIDS } from 'config';
import { setupNetwork } from 'utils/wallet';

const OtherListings = () => {
    const { account, chainId } = useActiveWeb3React();
    const { login, logout } = useAuth();
    const { onPresentConnectModal } = useWalletModal(login, logout);
    const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError();
    const { balances, updateBalance } = useApi();
    const { toastSuccess } = useToast();
    const { OLSlippage: slippage, onChangeOLSlippage: onChangeSlippage, gasFee, customTokens } = useConfig();
    const { address } = useParams();

    const [isOpenTokenImport, setIsOpenTokenImport] = useState<boolean>(false);
    const [percent, setPercent] = useState<number>(0);
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
    const [isNoLiquidity, setIsNoLiquidity] = useState<boolean>(false);
    const [activeToken, setActiveToken] = useState<any>({
        base: tokens.bnb,
        quote: customTokens[Object.keys(customTokens)[1]]
    });
    const [target, setTarget] = useState<string>('base');
    const [isOpenTokenSelect, setIsOpenTokenSelect] = useState<boolean>(false);
    const isNetworkMatch = useMemo(() => {
        return chainId === CIDS.MAINNET;
    }, [chainId]);
    const swapContract = useSwapOtherContract();
    const pcsRouterContract = usePCSRouterContract();
    const tokenContract = useTokenContract(activeToken.base.address);

    // ** Handle Events ---------------
    const handlePercentChange = (event: Event, newValue: number | number[]) => {
        subScribeEventForPercent(newValue as number);
        setPercent(newValue as number);
    };
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
    const handleTokenSelect = (token: any, flag = 'base') => {
        resetAmount();
        setActiveToken((prevState) => ({
            ...prevState,
            [flag]: token
        }));
    };
    const handleBaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBaseAmount(event.target.value);
        setAmountsOut(event.target.value);
        setPercentage(event.target.value);
    };
    const handleQuoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuoteAmount(event.target.value);
        setAmountsIn(event.target.value);
    };

    // ** Handle Flags ---------------
    const isNegativeOrZero = (value: any) => {
        if (Number(value) <= 0) return true;
        return false;
    };
    const isBuy = useCallback(() => {
        if (activeToken.base?.address === tokens.bnb?.address) return true;
        return false;
    }, [activeToken]);
    const isNegativeBaseBalance = useMemo(() => {
        const balance = balances[activeToken.base.address];
        const inputBalance = amount?.base?.number;
        if (!balance) return false;
        return ethersToBigNumber(balance).isLessThan(toBigNumber(toWei(inputBalance, activeToken.base.decimals)));
    }, [balances[activeToken.base.address], amount?.base?.number, activeToken.base.decimals]);

    // ** Handle Function ---------------
    const setBaseAmount = useCallback(
        (value: any, isWei = false) => {
            setAmount((prevState) => ({
                ...prevState,
                base: {
                    number: isWei ? fromWei(value, activeToken.base.decimals) : value,
                    wei: isWei ? value : toWei(value, activeToken.base.decimals)
                }
            }));
        },
        [activeToken]
    );
    const setQuoteAmount = useCallback(
        (value: any, isWei = false) => {
            setAmount((prevState) => ({
                ...prevState,
                quote: {
                    number: isWei ? fromWei(value, activeToken.quote.decimals) : value,
                    wei: isWei ? value : toWei(value, activeToken.quote.decimals)
                }
            }));
        },
        [activeToken]
    );
    const setPercentage = useCallback(
        (value: any, balance?: any, decimals?: any) => {
            balance = balance ?? balances[activeToken.base.address];
            decimals = decimals ?? activeToken.base.decimals;
            if (!balance) return setPercent(0);
            if (isNegativeOrZero(value) || isNegativeOrZero(balance)) {
                setPercent(0);
            } else {
                const p = toWei(value, decimals).dividedBy(ethersToBigNumber(balance)).times(toWei('100', decimals));
                setPercent(parseInt(fromWei(p, decimals)));
            }
        },
        [balances, activeToken]
    );
    const subScribeEventForPercent = useCallback(
        (percentage: number) => {
            const balance = balances[activeToken.base.address];
            if (!balance) return;
            const value = ethersToBigNumber(balance)
                .dividedBy(toWei('100', activeToken.base.decimals))
                .times(toWei(toBigNumber(percentage), activeToken.base.decimals));
            setBaseAmount(value, true);
            setAmountsOut(fromWei(Number(value).toFixed(0), activeToken.base.decimals));
        },
        [balances, activeToken]
    );
    const setAmountsIn = useCallback(
        (value: any) => {
            if (isNegativeOrZero(value)) {
                setBaseAmount('');
            } else {
                if (isBuy()) {
                    swapContract
                        .getAmountInFromBuy(
                            activeToken.quote.address,
                            toWei(value, activeToken.quote.decimals).toString()
                        )
                        .then(({ amountIn }: any) => {
                            setIsNoLiquidity(false);
                            setBaseAmount(amountIn, true);
                        })
                        .catch(() => {
                            setIsNoLiquidity(true);
                            setBaseAmount('');
                        });
                } else {
                    swapContract
                        .getAmountInFromSell(
                            activeToken.base.address,
                            toWei(value, activeToken.quote.decimals).toString()
                        )
                        .then(({ amountIn }: any) => {
                            setIsNoLiquidity(false);
                            setBaseAmount(amountIn, true);
                        })
                        .catch(() => {
                            setIsNoLiquidity(true);
                            setBaseAmount('');
                        });
                }
            }
        },
        [activeToken, isBuy, setBaseAmount, swapContract]
    );
    const setAmountsOut = useCallback(
        (value: any) => {
            if (isNegativeOrZero(value)) {
                setQuoteAmount('');
            } else {
                if (isBuy()) {
                    swapContract
                        .getAmountOutFromBuy(
                            activeToken.quote.address,
                            toWei(value, activeToken.base.decimals).toString()
                        )
                        .then(({ amountOut }: any) => {
                            setIsNoLiquidity(false);
                            setQuoteAmount(amountOut, true);
                        })
                        .catch(() => {
                            setIsNoLiquidity(true);
                            setQuoteAmount('');
                        });
                } else {
                    swapContract
                        .getAmountOutFromSell(
                            activeToken.base.address,
                            toWei(value, activeToken.base.decimals).toString()
                        )
                        .then(({ amountOut }: any) => {
                            setIsNoLiquidity(false);
                            setQuoteAmount(amountOut, true);
                        })
                        .catch(() => {
                            setIsNoLiquidity(true);
                            setQuoteAmount('');
                        });
                }
            }
        },
        [activeToken, isBuy, setQuoteAmount, swapContract]
    );
    const resetAmount = useCallback(() => {
        setBaseAmount('');
        setQuoteAmount('');
    }, [setBaseAmount, setQuoteAmount]);

    // ** Handle Trade ---------------
    const swapVert = () => {
        setAmount({
            base: amount.quote,
            quote: amount.base
        });
        setActiveToken({
            base: activeToken.quote,
            quote: activeToken.base
        });
        setPercentage(amount.quote.number, balances[activeToken.quote.address], activeToken.quote.decimals);
    };
    const checkAllowance = useCallback(() => {
        if (!account) return;
        tokenContract.allowance(account, pcsRouterContract.address).then((result: any) => {
            const allocate = toBigNumber(Number(amount.base.number));
            const allowance = ethersToBigNumber(result);
            if (allowance.isGreaterThan(allocate)) {
                setIsApproved(true);
            } else {
                setIsApproved(false);
            }
        });
    }, [activeToken.base, account, pcsRouterContract, tokenContract]);
    const getGasPrice = useCallback(() => {
        return toBigNumber(gasFee)
            .times(toBigNumber(10 ** 9))
            .toString();
    }, [gasFee]);
    const getCustomGasFee = useCallback(
        async (method: string, args: any) => {
            const contract = method === `buy` ? swapContract : pcsRouterContract;
            const gasPrice = getGasPrice();
            const gasLimit = await contract.estimateGas[method](...args);
            const estimateGas = ethersToBigNumber(gasLimit);
            const customFee = toBigNumber(50000);
            return {
                gasPrice: gasPrice.toString(),
                gasLimit: estimateGas.plus(customFee).toString()
            };
        },
        [getGasPrice, swapContract, pcsRouterContract]
    );
    const getSlippage = useCallback(async () => {
        let slip = Number(slippage);
        if (slip === 0 || slip > 100) slip = 100;
        slip = 100 - slip;
        return slip;
    }, [slippage]);

    const approve = useCallback(async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return tokenContract.approve(pcsRouterContract.address, MaxUint256);
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
    }, [tokenContract, checkAllowance, toastSuccess, fetchWithCatchTxError, pcsRouterContract]);

    const swap = useCallback(async () => {
        const am = amount?.quote?.wei;
        const slip = await getSlippage();
        const slipAmount = toBigNumber(am).times(toBigNumber(slip)).dividedBy(toBigNumber('100'));

        const _path = [activeToken.base.address, activeToken.quote.address];
        const _deadline = Math.floor((new Date().getTime() + 720000) / 1000);

        if (isBuy()) {
            const _token = activeToken.quote.address;
            const _payable = toBigNumber(amount?.base?.wei).toFixed(0);
            const _slippage = slipAmount.toFixed(0);

            const method = 'buy';
            const args = [_token, _slippage, { value: _payable }];
            const gasOverrides = await getCustomGasFee(method, args);
            const receipt = await fetchWithCatchTxError(() => {
                return swapContract.buy(_token, _slippage, {
                    value: _payable,
                    ...gasOverrides
                });
            });
            if (receipt?.status) {
                checkAllowance();
                resetAmount();
                toastSuccess(
                    'Bought!',
                    <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                        You bought {activeToken.quote.symbol} token from {activeToken.base.symbol}.
                    </ToastDescriptionWithTx>
                );
            }
        } else {
            const _payable = toBigNumber(amount?.base?.wei).toFixed(0);
            const _slippage = slipAmount.toFixed(0);
            const method = 'swapExactTokensForETHSupportingFeeOnTransferTokens';
            const args = [_payable, _slippage, _path, account, _deadline];
            const gasOverrides = await getCustomGasFee(method, args);
            const receipt = await fetchWithCatchTxError(() => {
                return pcsRouterContract[method](_payable, _slippage, _path, account, _deadline, { ...gasOverrides });
            });
            if (receipt?.status) {
                checkAllowance();
                resetAmount();
                toastSuccess(
                    'Sold!',
                    <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                        You sold {activeToken.base.symbol} token.
                    </ToastDescriptionWithTx>
                );
            }
        }
        updateBalance(customTokens);
    }, [
        getSlippage,
        activeToken,
        amount,
        swapContract,
        pcsRouterContract,
        getCustomGasFee,
        fetchWithCatchTxError,
        toastSuccess,
        checkAllowance,
        resetAmount
    ]);

    useEffect(() => {
        checkAllowance();
    }, [checkAllowance]);

    const isValidAddress = useMemo(() => {
        if (!address || !isAddress(address)) return;
        const isExistInList = Object.entries(customTokens).find(([key, token]: [string, any]) => {
            return token.address?.toLowerCase() === address?.toLowerCase() && tokens.bnb.address !== address;
        }) as any;
        return isExistInList ?? 'new';
    }, [address, customTokens]);

    useEffect(() => {
        if (!isValidAddress) return;
        if (isValidAddress === 'new') {
            setIsOpenTokenImport(true);
        } else {
            setActiveToken({
                base: tokens.bnb,
                quote: isValidAddress[1]
            });
        }
    }, [isValidAddress]);

    return (
        <Stack spacing={2} pt={1}>
            <NovationSlider
                value={percent}
                onEvent={subScribeEventForPercent}
                onChange={handlePercentChange}
                setValue={setPercent}
            />
            <Stack>
                <NovationTokenInput
                    balance={balances[activeToken.base.address]}
                    openTokenSelect={() => handleTokenSelectOpen('base')}
                    token={activeToken.base}
                    value={amount?.base?.number}
                    onChange={handleBaseChange}
                />
                <SwapVertIcon onClick={swapVert} />
                <NovationTokenInput
                    disabled={!activeToken.quote}
                    balance={balances[activeToken.quote.address]}
                    openTokenSelect={() => handleTokenSelectOpen('quote')}
                    token={activeToken.quote}
                    value={amount?.quote?.number}
                    onChange={handleQuoteChange}
                />
            </Stack>
            <TokenStatus contract={swapContract} base={activeToken.base} quote={activeToken.quote} />
            <Slippage value={slippage} onChange={onChangeSlippage} tab="listings" />
            {account ? (
                isNetworkMatch ? (
                    isNoLiquidity ? (
                        <NovationButton disabled>Insufficient liquidity for this trade</NovationButton>
                    ) : isNegativeBaseBalance ? (
                        <NovationButton disabled>Insufficient {activeToken.base.symbol} Token balance.</NovationButton>
                    ) : isNegativeOrZero(amount?.base?.number) ? (
                        <NovationButton disabled>Enter an amount</NovationButton>
                    ) : isBuy() ? (
                        <NovationButton loading={pendingTx} onClick={swap}>
                            TRADE
                        </NovationButton>
                    ) : isApproved ? (
                        <NovationButton loading={pendingTx} onClick={swap}>
                            TRADE
                        </NovationButton>
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
                tokenList={customTokens}
            />
            <TokenImport
                address={address}
                open={isOpenTokenImport}
                onClose={() => setIsOpenTokenImport(false)}
                onEvent={(newToken: any) => {
                    setActiveToken({
                        base: tokens.bnb,
                        quote: newToken
                    });
                }}
            />
        </Stack>
    );
};

export default OtherListings;
