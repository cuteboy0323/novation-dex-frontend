import { useEffect, useCallback } from 'react';

import BigNumber from 'bignumber.js';
import useLocalStorage from 'hooks/useLocalStorage';
import { ConfigContext, initialState } from 'contexts/config';

import CoinGecko from 'coingecko-api';

type ConfigProviderProps = {
    children: React.ReactNode;
};

BigNumber.config({
    EXPONENTIAL_AT: 1000,
    DECIMAL_PLACES: 80,
    ROUNDING_MODE: 4
});

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
    const origin = window?.location.origin ?? 'novation-dex-config';
    const [config, setConfig] = useLocalStorage(origin, {
        ...initialState
    });

    const [rubicCustomTokens, setRubicCustomTokens] = useLocalStorage('novation-rubic-custom', {});
    const [tokenLogo, setTokenLogo] = useLocalStorage('novation-other-listings-token-logo', {});

    const onChangeSideBar = () => {
        setConfig((prevState) => ({
            ...prevState,
            isOpenSideBar: !prevState.isOpenSideBar
        }));
    };
    const onChangeThemeMode = () => {
        setConfig((prevState) => ({
            ...prevState,
            isDark: !prevState.isDark
        }));
    };
    const onChangeGasFee = (newValue: string | number) => {
        setConfig((prevState) => ({
            ...prevState,
            gasFee: newValue
        }));
    };
    const onChangeOLSlippage = (newValue: string | number) => {
        setConfig((prevState) => ({
            ...prevState,
            OLSlippage: newValue
        }));
    };
    const onChangeSLSlippage = (newValue: string | number) => {
        setConfig((prevState) => ({
            ...prevState,
            SLSlippage: newValue
        }));
    };
    const onImportNewToken = (newToken: any) => {
        setConfig((prevState) => ({
            ...prevState,
            customTokens: {
                ...prevState.customTokens,
                [newToken.symbol?.toLowerCase()]: {
                    ...newToken,
                    decimals: newToken.decimals?.toString()
                }
            }
        }));
    };
    const onImportNewRubicToken = (newToken: any) => {
        setRubicCustomTokens((prevState) => ({
            ...prevState,
            [newToken.symbol?.toLowerCase()]: {
                ...newToken,
                decimals: newToken.decimals?.toString()
            }
        }));
    };
    const onRemoveRubicCustomToken = (token: any) => {
        setRubicCustomTokens((prevState) => {
            const filtered = Object.fromEntries(
                Object.entries(prevState).filter(([T, D]: [string, any]) => T !== token)
            );
            return { ...filtered };
        });
    };
    const onRemoveCustomToken = (token: any) => {
        setConfig((prevState) => {
            const { customTokens } = prevState;
            const filtered = Object.fromEntries(
                Object.entries(customTokens).filter(([T, D]: [string, any]) => T !== token)
            );
            return {
                ...prevState,
                customTokens: filtered
            };
        });
    };

    const updateTokenLogo = useCallback(() => {
        Object.entries(config.customTokens).map(async ([id, { address }]: any) => {
            if (tokenLogo[address]) return;
            const { data } = await CoinGeckoClient.coins.fetchCoinContractInfo(
                address?.toLowerCase(),
                'binance-smart-chain'
            );
            if (data) {
                setTokenLogo((prevState) => ({
                    ...prevState,
                    [address]: data?.error ? 'non-exist' : data?.image?.large
                }));
            }
        });

        Object.entries(rubicCustomTokens).map(async ([id, { address }]: any) => {
            if (tokenLogo[address]) return;
            const { data } = await CoinGeckoClient.coins.fetchCoinContractInfo(
                address?.toLowerCase(),
                'binance-smart-chain'
            );
            if (data) {
                setTokenLogo((prevState) => ({
                    ...prevState,
                    [address]: data?.error ? 'non-exist' : data?.image?.large
                }));
            }
        });
    }, [config.customTokens, rubicCustomTokens]);

    useEffect(() => {
        updateTokenLogo();
    }, [updateTokenLogo]);

    return (
        <ConfigContext.Provider
            value={{
                ...config,
                tokenLogo,
                rubicCustomTokens,
                onChangeThemeMode,
                onChangeSideBar,
                onChangeGasFee,
                onChangeSLSlippage,
                onChangeOLSlippage,
                onImportNewToken,
                onRemoveCustomToken,
                onImportNewRubicToken,
                onRemoveRubicCustomToken
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
};

export default ConfigProvider;
