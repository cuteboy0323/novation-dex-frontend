import { useEffect, useState, useCallback, useMemo } from 'react';
import { PoolContext } from 'contexts/pool';

import { multicallv2 } from 'utils/multicall';

import POOL_ABI from 'config/abi/pool.json';
import BEP20_ABI from 'config/abi/bep20.json';

import { useLaunchpadContract } from 'hooks/useContract';
import { useLocation, useSearchParams } from 'react-router-dom';

import { isAddress } from 'utils';
import { NULLADDR } from 'config/constants/networks';
import { ethersToBigNumber } from 'utils/bigNumber';

type PoolProviderProps = {
    children: React.ReactNode;
};

const PoolProvider: React.FC<PoolProviderProps> = ({ children }) => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const launchpadContract = useLaunchpadContract();

    const [pools, setPools] = useState<string[]>([]);
    const [poolMap, setPoolMap] = useState<any>({});

    const updatePoolMap = useCallback(
        async (pool: string) => {
            try {
                const methods = [
                    'bnbFee',
                    'bnbFeeWallet',
                    'canceled',
                    'count',
                    'enabledClaim',
                    'enabledRefund',
                    'endTime',
                    'ended',
                    'feeDenominator',
                    'finalized',
                    'hardcap',
                    'isBurnForUnsold',
                    'liquidityAlloc',
                    'listPrice',
                    'maxInvestable',
                    'minBnbAllocToLiquidity',
                    'minInvestable',
                    'minTokenAllocToLiquidity',
                    'publicMode',
                    'raised',
                    'router',
                    'saleAmount',
                    'salePrice',
                    'softcap',
                    'startTime',
                    'started',
                    'token',
                    'tokenFee',
                    'tokenFeeWallet',
                    'tokenOwner',
                    'totalClaimed'
                ];
                const calls = methods.map((method: string) => ({
                    address: pool,
                    name: method
                }));
                const result = await multicallv2(POOL_ABI, calls);
                result.map((item: any, idx: number) =>
                    setPoolMap((prevState: any) => ({
                        ...prevState,
                        [pool]: {
                            ...prevState[pool],
                            [methods[idx]]: item[0]
                        }
                    }))
                );
            } catch (e) {
                console.log(e.toString());
            }
        },
        [setPoolMap]
    );

    const getPoolMap = async (address: string) => {
        const map = await launchpadContract.poolMap(address);
        return map;
    };
    const getTimestamp = async () => {
        const timestamp = await launchpadContract.timestamp();
        return timestamp.toString();
    };

    const updatePoolToken = useCallback(
        async (pool: string, token: string) => {
            try {
                const methods = ['decimals', 'name', 'symbol', 'totalSupply'];
                const calls = methods.map((method: string) => ({
                    address: token,
                    name: method
                }));
                const result = await multicallv2(BEP20_ABI, calls);
                result.map((item: any, idx: number) =>
                    setPoolMap((prevState: any) => ({
                        ...prevState,
                        [pool]: {
                            ...prevState[pool],
                            [methods[idx]]: item[0]
                        }
                    }))
                );
            } catch (e) {
                console.log(e.toString());
            }
        },
        [setPoolMap]
    );

    const getPoolStatus = ({ ended, started, canceled, raised, softcap, enabledClaim, enabledRefund, finalized }) => {
        if (canceled) {
            return 'canceled';
        } else if (ended) {
            const r = ethersToBigNumber(raised);
            const sc = ethersToBigNumber(softcap);
            if (r.isLessThan(sc)) {
                return 'failed';
            }
            if (!enabledRefund) {
                if (finalized) {
                    if (enabledClaim) {
                        return 'claim';
                    }
                    return 'finalized';
                }
            }
            return 'ended';
        } else if (started) {
            return 'live';
        } else if (!started) {
            return 'upcoming';
        } else {
            return 'none';
        }
    };

    const isValidPoolMap = ({ token, owner }: any) => {
        if (token === NULLADDR || owner === NULLADDR) return false;
        return true;
    };

    const updatePools = useCallback(() => {
        launchpadContract
            .getPools(NULLADDR)
            .then(setPools)
            .catch(() => setPools([]));
    }, [location.pathname]);

    const updatePool = useCallback(async (element: string) => {
        const map = await getPoolMap(element);
        setPoolMap((prevState: any) => ({
            ...prevState,
            [element]: {
                ...prevState[element],
                createdAt: map.createdAt,
                owner: map.owner,
                pool: map.pool,
                token: map.token,
                revoked: map.revoked,
                urls: JSON.parse(map.urls)
            }
        }));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            updatePools();
        }, 12000);
        updatePools();
        return () => clearInterval(interval);
    }, [updatePools]);

    useEffect(() => {
        pools.forEach((element: any) => {
            launchpadContract.poolMap(element).then((result: any) => {
                if (!isValidPoolMap(result)) return;
                updatePoolMap(element);
                updatePoolToken(element, result.token);
                setPoolMap((prevState: any) => ({
                    ...prevState,
                    [element]: {
                        ...prevState[element],
                        createdAt: result.createdAt,
                        owner: result.owner,
                        pool: result.pool,
                        token: result.token,
                        revoked: result.revoked,
                        urls: JSON.parse(result.urls)
                    }
                }));
            });
        });
    }, [pools.length]);

    const updateActivePool = useCallback(
        (address: string) => {
            launchpadContract
                .poolMap(address)
                .then((result: any) => {
                    updatePoolMap(address);
                    updatePoolToken(address, result.token);
                })
                .catch(() => {});
        },
        [updatePoolMap, updatePoolToken]
    );

    useEffect(() => {
        const address = searchParams.get('address');
        if (!isAddress(address)) return;
        const interval = setInterval(() => {
            updateActivePool(address);
        }, 12000);
        updateActivePool(address);
        return () => clearInterval(interval);
    }, [searchParams]);

    const activePool = useMemo(() => {
        const address = searchParams.get('address');
        if (!isAddress(address)) return {};
        return poolMap[address] ?? {};
    }, [poolMap, searchParams]);

    return (
        <PoolContext.Provider
            value={{
                pools,
                poolMap,
                activePool,
                getPoolStatus,
                updateActivePool,
                updatePoolMap,
                updatePoolToken,
                updatePool,
                getPoolMap,
                getTimestamp
            }}
        >
            {children}
        </PoolContext.Provider>
    );
};

export default PoolProvider;
