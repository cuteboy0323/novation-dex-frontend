import { useState, useCallback } from 'react';
import { APIContext } from 'contexts/api';

import { getBnbBalance } from 'utils/web3';
import { multicallv3 } from 'utils/multicall';

import tokens from 'config/constants/tokens';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import BEP20 from 'config/abi/bep20.json';
import { MULTICALL_CONTRACTS, NETWORK_LIST } from 'config';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

type APIProviderProps = {
    children: React.ReactNode;
};

const APIProvider: React.FC<APIProviderProps> = ({ children }) => {
    const { account } = useActiveWeb3React();
    const [balances, setBalances] = useState<any>({});

    const updateBalance = useCallback(
        async (tokenList: any) => {
            if (!Object.values(tokenList) || !account) return;
            for (let i = 0; i < NETWORK_LIST.length; i++) {
                const simpleRpcProvider = new StaticJsonRpcProvider(NETWORK_LIST[i].rpcUrl);

                const _tokens = Object.entries(tokenList).filter(
                    ([token, detail]: [string, any]) => detail.chainId === NETWORK_LIST[i].chainId
                );
                const mainToken: any = _tokens.find((item: any) => item[1].main === true);
                if (mainToken) {
                    const mainBalance = await simpleRpcProvider.getBalance(account);
                    setBalances((prevState) => ({
                        ...prevState,
                        [mainToken[1].address]: mainBalance
                    }));
                }
                const otherToken = _tokens.filter((item: any) => item[1].main !== true);
                const calls = otherToken.map((token: any) => {
                    return {
                        address: token[1].address,
                        name: 'balanceOf',
                        params: [account]
                    };
                }) as any;
                if (!calls.length) continue;

                const result = await multicallv3(
                    BEP20,
                    calls,
                    MULTICALL_CONTRACTS[NETWORK_LIST[i].chainId],
                    simpleRpcProvider
                );

                result.forEach((item: any, idx: number) => {
                    setBalances((prevState) => ({
                        ...prevState,
                        [calls[idx]?.address]: item[0]
                    }));
                });
            }
            getBnbBalance(account).then((bnbBalance: any) => {
                setBalances((prevState) => ({
                    ...prevState,
                    [tokens.bnb.address]: bnbBalance
                }));
            });
        },
        [account]
    );

    return <APIContext.Provider value={{ balances, updateBalance }}>{children}</APIContext.Provider>;
};

export default APIProvider;
