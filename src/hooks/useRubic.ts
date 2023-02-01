import RUBIC_CONFIG from 'config/rubic-configuration';
import { CHAIN_TYPE, SDK, Configuration, WalletProvider } from 'rubic-sdk';
import useActiveWeb3React from './useActiveWeb3React';

const useRubic = () => {
    const { account } = useActiveWeb3React();

    const handleCross = async () => {
        const address = account || '0x0000000000000000000000000000000000000000';

        const walletProvider: WalletProvider = {
            [CHAIN_TYPE.EVM]: {
                address: address as any, // user wallet address
                core: window.ethereum as any
            }
        };
        const configuration: Configuration = {
            ...RUBIC_CONFIG,
            walletProvider,
            providerAddress: address as any
        };
        const rubicSDK = await SDK.createSDK(configuration);
        return rubicSDK;
    };

    return { onRubic: handleCross };
};

export const useCrossChain = () => {
    const { onRubic } = useRubic();

    const handleCross = async (fromToken: any, fromAmount: any, toToken: any) => {
        const rubic = await onRubic();
        if (!rubic) return false;
        try {
            if (fromToken.blockchain === toToken.blockchain) {
                const trades = await rubic.onChainManager.calculateTrade(fromToken, fromAmount, toToken.address);
                const bestTrade = trades[0];

                return bestTrade;
            } else {
                const trades = await rubic.crossChainManager.calculateTrade(fromToken, fromAmount, toToken);
                const bestTrade = trades[0];

                return bestTrade;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    return { onCross: handleCross };
};

export default useRubic;
