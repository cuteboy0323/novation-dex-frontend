// ** React Methods ** //
import { useCallback, useEffect, useState, useMemo } from 'react';

// ** Material UI Components ** //
import Stack from '@mui/material/Stack';

// ** Novation Custom Components ** //
import NovationButton from 'components/Base/NovationButton';
import NovationSlider from 'components/Swap/NovationSlider';
import SwapVertIcon from 'components/Items/SwapVertIcon';
import RubicTokenStatus from 'components/Swap/RubicTokenStatus';
import Slippage from 'components/Swap/Slippage';
import TokenSelect from 'components/Swap/Cross-TokenSelect';

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
import { useSwapContract, useTokenContract } from 'hooks/useContract';

import { rubicTokens, sellLessTokens } from 'config/constants/tokens';
import { ethersToBigNumber, fromWei, toBigNumber, toWei } from 'utils/bigNumber';
import { MaxUint256 } from '@ethersproject/constants';
import { isAddress } from 'utils';

import tokens from 'config/constants/tokens';
import { NETWORK_LIST } from 'config';
import RubicTokenInput from 'components/Swap/RubicTokenInput';
import { useCrossChain } from 'hooks/useRubic';

const Rubic = () => {
    const { account, chainId } = useActiveWeb3React();
    const { login, logout } = useAuth();
    const { onCross } = useCrossChain();
    const { onPresentConnectModal } = useWalletModal(login, logout);
    const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError();
    const { balances } = useApi();
    const { toastSuccess } = useToast();
    const { SLSlippage: slippage, onChangeSLSlippage: onChangeSlippage } = useConfig();
    const { address } = useParams();

    const [percent, setPercent] = useState<number>(0);
    const [baseNum, setBaseNum] = useState(0);
    const [loading, setLoading] = useState(false);
    const [trade, setTrade] = useState(null);
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
    const [activeToken, setActiveToken] = useState<any>({
        base: rubicTokens.bnb,
        quote: rubicTokens.busd
    });

    const [activeNetwork, setActiveNetwork] = useState<any>({
        base: NETWORK_LIST[1],
        quote: NETWORK_LIST[1]
    });

    useEffect(() => {
        if (!Number(amount.base.number)) return;
        if (Number(amount.base.number) === Number(baseNum)) return;
        setBaseNum(amount.base.number);
        setLoading(true);
        const mainAddr = '0x0000000000000000000000000000000000000000';

        (async () => {
            const fromToken = {
                blockchain: activeNetwork.base.id,
                address: activeToken.base.main ? mainAddr : activeToken.base.address
            };
            const fromAmount = amount.base.number;
            const toToken = {
                blockchain: activeNetwork.quote.id,
                address: activeToken.quote.main ? mainAddr : activeToken.quote.address
            };
            const bestTrade: any = await onCross(fromToken, fromAmount, toToken);
            if (bestTrade) {
                setTrade(bestTrade);
                if (fromToken.blockchain === toToken.blockchain) {
                    const value = bestTrade.to.tokenAmount.toFormat(3);
                    setQuoteAmount(value, false);
                } else {
                    const value = bestTrade.trade.toTokenAmountMin.toFormat(3);
                    setQuoteAmount(value, false);
                }
            }
            setLoading(false);
        })();
    }, [amount]);

    const isNetworkMatch = useMemo(() => {
        return chainId === activeNetwork.base.chainId;
    }, [chainId, activeNetwork.base]);

    const updateNetwork = async () => {
        const provider = window.ethereum;
        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${activeNetwork.base.chainId.toString(16)}` }]
            });
            return true;
        } catch (switchError) {
            if ((switchError as any)?.code === 4902) {
                try {
                    await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: `0x${activeNetwork.base.chainId.toString(16)}`,
                                chainName: activeNetwork.base.name,
                                nativeCurrency: {
                                    name: 'BNB',
                                    symbol: 'bnb',
                                    decimals: 18
                                },
                                rpcUrls: activeNetwork.base.rpcUrl,
                                blockExplorerUrls: [`${activeNetwork.base.scan}/`]
                            }
                        ]
                    });
                    return true;
                } catch (error) {
                    console.error('Failed to setup the network in Metamask:', error);
                    return false;
                }
            }
            return false;
        }
    };

    const [target, setTarget] = useState<string>('base');
    const [isOpenTokenSelect, setIsOpenTokenSelect] = useState<boolean>(false);

    const swapContract = useSwapContract();
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
    const handleTokenSelect = (token: any, flag = 'base') => {
        resetAmount();
        switch (flag) {
            case 'base': {
                if (token.address === activeToken.quote.address) {
                    handleNetworkSelect(activeNetwork.base, 'quote');
                    setActiveToken({
                        base: token,
                        quote: activeToken.base
                    });
                } else {
                    setActiveToken((prevState) => ({
                        ...prevState,
                        [flag]: token
                    }));
                }
                break;
            }
            case 'quote': {
                if (token.address === activeToken.base.address) {
                    handleNetworkSelect(activeNetwork.quote, 'base');
                    setActiveToken({
                        base: activeToken.quote,
                        quote: token
                    });
                } else {
                    setActiveToken((prevState) => ({
                        ...prevState,
                        [flag]: token
                    }));
                }
                break;
            }
        }
        // setActiveToken((prevState) => ({
        //     ...prevState,
        //     [flag]: token
        // }));
    };
    const handleNetworkSelect = (network: any, flag = 'base') => {
        resetAmount();
        setActiveNetwork((prevState) => ({
            ...prevState,
            [flag]: network
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
        if (activeToken.base?.address === sellLessTokens.bnb?.address) return true;
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
                            setBaseAmount(amountIn, true);
                        })
                        .catch(() => {
                            setBaseAmount('');
                        });
                } else {
                    swapContract
                        .getAmountInFromSell(
                            activeToken.base.address,
                            toWei(value, activeToken.quote.decimals).toString()
                        )
                        .then(({ amountIn }: any) => {
                            setBaseAmount(amountIn, true);
                        })
                        .catch(() => {
                            setBaseAmount('');
                        });
                }
            }
        },
        [activeToken, isBuy]
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
                            setQuoteAmount(amountOut, true);
                        })
                        .catch(() => {
                            setQuoteAmount('');
                        });
                } else {
                    swapContract
                        .getAmountOutFromSell(
                            activeToken.base.address,
                            toWei(value, activeToken.base.decimals).toString()
                        )
                        .then(({ amountOut }: any) => {
                            setQuoteAmount(amountOut, true);
                        })
                        .catch(() => {
                            setQuoteAmount('');
                        });
                }
            }
        },
        [activeToken, isBuy]
    );
    const resetAmount = useCallback(() => {
        setBaseAmount('');
        setQuoteAmount('');
        setBaseNum(0);
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
        setActiveNetwork({
            base: activeNetwork.quote,
            quote: activeNetwork.base
        });
        setPercentage(amount.quote.number, balances[activeToken.quote.address], activeToken.quote.decimals);
    };
    const checkAllowance = useCallback(() => {
        if (!account) return;
        tokenContract.allowance(account, swapContract.address).then((result: any) => {
            const allocate = toBigNumber(Number(amount.base.number));
            const allowance = ethersToBigNumber(result);
            if (allowance.isGreaterThan(allocate)) {
                setIsApproved(true);
            } else {
                setIsApproved(false);
            }
        });
    }, [activeToken.base, account]);

    const approve = useCallback(async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return tokenContract.approve(swapContract.address, MaxUint256);
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
    }, [tokenContract, checkAllowance, toastSuccess, fetchWithCatchTxError, swapContract]);

    const onConfirm = (hash: string) => console.log(hash);

    const swap = async () => {
        if (!trade) return;

        if (trade.trade) {
            const bestTrade = trade.trade;
            const receipt = await bestTrade.swap({ onConfirm });
            console.log(receipt);
        } else {
            const receipt = await trade.swap({ onConfirm });
            console.log(receipt);
        }
    };

    useEffect(() => {
        checkAllowance();
    }, [checkAllowance]);

    const isValidAddress = useMemo(() => {
        if (!address || !isAddress(address)) return;
        const isExistInList = Object.entries(sellLessTokens).find(([key, token]: [string, any]) => {
            return token.address === address && tokens.bnb.address !== address;
        }) as any;
        return isExistInList;
    }, [address, sellLessTokens]);

    useEffect(() => {
        if (!isValidAddress) return;
        setActiveToken({
            base: sellLessTokens.bnb,
            quote: isValidAddress[1]
        });
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
                <Stack direction="row" spacing={1}>
                    <RubicTokenInput
                        balance={balances[activeToken.base.address]}
                        openTokenSelect={() => handleTokenSelectOpen('base')}
                        token={activeToken.base}
                        value={amount?.base?.number}
                        onChange={handleBaseChange}
                        network={activeNetwork.base}
                    />
                </Stack>
                <SwapVertIcon onClick={swapVert} />
                <Stack direction="row" spacing={1}>
                    <RubicTokenInput
                        balance={balances[activeToken.quote.address]}
                        openTokenSelect={() => handleTokenSelectOpen('quote')}
                        token={activeToken.quote}
                        value={amount?.quote?.number}
                        onChange={handleQuoteChange}
                        network={activeNetwork.quote}
                        disabled={true}
                    />
                </Stack>
            </Stack>
            <RubicTokenStatus activeNetwork={activeNetwork} base={activeToken.base} quote={activeToken.quote} />
            <Slippage value={slippage} onChange={onChangeSlippage} />
            {account ? (
                isNetworkMatch ? (
                    loading ? (
                        <NovationButton disabled>Loading...</NovationButton>
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
                    <NovationButton onClick={updateNetwork}>Switch to {activeNetwork.base.name} Network</NovationButton>
                )
            ) : (
                <NovationButton onClick={onPresentConnectModal}>CONNECT WALLET</NovationButton>
            )}
            <TokenSelect
                target={target}
                activeToken={activeToken}
                activeNetwork={activeNetwork}
                open={isOpenTokenSelect}
                onClose={handleTokenSelectClose}
                onTokenSelect={handleTokenSelect}
                onNetworkSelect={handleNetworkSelect}
                tokenList={rubicTokens}
            />
        </Stack>
    );
};

export default Rubic;
