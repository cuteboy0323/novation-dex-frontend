import { useMemo } from 'react';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import {
    getRouterContract,
    getDividendContract,
    getMainTokenContract,
    getFactoryContract,
    getSwapContract,
    getSwapOtherContract,
    getPCSRouterContract,
    getLaunchpadContract
} from 'utils/contractHelpers';

// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts';
import { getContract, getProviderOrSigner } from '../utils';

import BEP20_ABI from 'config/abi/bep20.json';
import LP_ABI from 'config/abi/lp.json';
import DISTRIBUTOR_ABI from 'config/abi/distributor.json';
import POOL_ABI from 'config/abi/pool.json';

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useRouterContract = (withSignerIfPossible = true) => {
    const { library, account } = useActiveWeb3React();
    const signer = useMemo(
        () => (withSignerIfPossible ? getProviderOrSigner(library, account) : null),
        [withSignerIfPossible, library, account]
    );
    return useMemo(() => getRouterContract(signer), [signer]);
};
export const usePCSRouterContract = (withSignerIfPossible = true) => {
    const { library, account } = useActiveWeb3React();
    const signer = useMemo(
        () => (withSignerIfPossible ? getProviderOrSigner(library, account) : null),
        [withSignerIfPossible, library, account]
    );
    return useMemo(() => getPCSRouterContract(signer), [signer]);
};
export const useDividendContract = (withSignerIfPossible = true) => {
    const { library, account } = useActiveWeb3React();
    const signer = useMemo(
        () => (withSignerIfPossible ? getProviderOrSigner(library, account) : null),
        [withSignerIfPossible, library, account]
    );
    return useMemo(() => getDividendContract(signer), [signer]);
};
export const useMainTokenContract = (withSignerIfPossible = true) => {
    const { library, account } = useActiveWeb3React();
    const signer = useMemo(
        () => (withSignerIfPossible ? getProviderOrSigner(library, account) : null),
        [withSignerIfPossible, library, account]
    );
    return useMemo(() => getMainTokenContract(signer), [signer]);
};
export const useFactoryContract = (withSignerIfPossible = true) => {
    const { library, account } = useActiveWeb3React();
    const signer = useMemo(
        () => (withSignerIfPossible ? getProviderOrSigner(library, account) : null),
        [withSignerIfPossible, library, account]
    );
    return useMemo(() => getFactoryContract(signer), [signer]);
};
export const useSwapContract = (withSignerIfPossible = true) => {
    const { library, account } = useActiveWeb3React();
    const signer = useMemo(
        () => (withSignerIfPossible ? getProviderOrSigner(library, account) : null),
        [withSignerIfPossible, library, account]
    );
    return useMemo(() => getSwapContract(signer), [signer]);
};
export const useSwapOtherContract = (withSignerIfPossible = true) => {
    const { library, account } = useActiveWeb3React();
    const signer = useMemo(
        () => (withSignerIfPossible ? getProviderOrSigner(library, account) : null),
        [withSignerIfPossible, library, account]
    );
    return useMemo(() => getSwapOtherContract(signer), [signer]);
};
export const useLaunchpadContract = (withSignerIfPossible = true) => {
    const { library, account } = useActiveWeb3React();
    const signer = useMemo(
        () => (withSignerIfPossible ? getProviderOrSigner(library, account) : null),
        [withSignerIfPossible, library, account]
    );
    return useMemo(() => getLaunchpadContract(signer), [signer]);
};
export function usePoolContract(poolAddress?: string, withSignerIfPossible?: boolean) {
    return useContract(poolAddress, POOL_ABI, withSignerIfPossible);
}
export function useLpTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
    return useContract(tokenAddress, LP_ABI, withSignerIfPossible);
}
export function useDiscributorContract(address?: string, withSignerIfPossible?: boolean) {
    return useContract(address, DISTRIBUTOR_ABI, withSignerIfPossible);
}

// returns null on errors
function useContract<T extends Contract = Contract>(
    address: string | undefined,
    ABI: any,
    withSignerIfPossible = true
): T | null {
    const { library, account } = useActiveWeb3React();
    const signer = useMemo(
        () => (withSignerIfPossible ? getProviderOrSigner(library, account) : null),
        [withSignerIfPossible, library, account]
    );

    const canReturnContract = useMemo(
        () => address && ABI && (withSignerIfPossible ? library : true),
        [address, ABI, library, withSignerIfPossible]
    );

    return useMemo(() => {
        if (!canReturnContract) return null;
        try {
            return getContract(address, ABI, signer);
        } catch (error) {
            // console.error('Failed to get contract', error);
            return null;
        }
    }, [address, ABI, signer, canReturnContract]) as T;
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
    return useContract(tokenAddress, BEP20_ABI, withSignerIfPossible);
}
