import type { Signer } from '@ethersproject/abstract-signer';
import type { Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { simpleRpcProvider } from 'utils/providers';

// Addresses
import {
    getRouterAddress,
    getDividendAddress,
    getMainTokenAddress,
    getMulticallAddress,
    getFactoryAddress,
    getSwapAddress,
    getSwapOtherAddress,
    getPCSRouterAddress,
    getLaunchpadAddress
} from 'utils/addressHelpers';

// ABI
import token from 'config/abi/token.json';
import pkrouter from 'config/abi/pkrouter.json';
import router from 'config/abi/router.json';
import dividend from 'config/abi/dividend.json';
import multicall from 'config/abi/multicall.json';
import factory from 'config/abi/factory.json';
import swap from 'config/abi/swap.json';
import launchpad from 'config/abi/launchpad.json';

export const getContract = (abi: any, address: string, signer?: Signer | Provider) => {
    const signerOrProvider = signer ?? simpleRpcProvider;
    return new Contract(address, abi, signerOrProvider);
};

export const getRouterContract = (signer?: Signer | Provider) => {
    return getContract(router, getRouterAddress(), signer);
};
export const getDividendContract = (signer?: Signer | Provider) => {
    return getContract(dividend, getDividendAddress(), signer);
};
export const getMainTokenContract = (signer?: Signer | Provider) => {
    return getContract(token, getMainTokenAddress(), signer);
};
export const getMulticallContract = (signer?: Signer | Provider) => {
    return getContract(multicall, getMulticallAddress(), signer);
};
export const getMulticallContractByNetwork = (address: string, signer?: Signer | Provider) => {
    return getContract(multicall, address, signer);
};
export const getFactoryContract = (signer?: Signer | Provider) => {
    return getContract(factory, getFactoryAddress(), signer);
};
export const getSwapContract = (signer?: Signer | Provider) => {
    return getContract(swap, getSwapAddress(), signer);
};
export const getSwapOtherContract = (signer?: Signer | Provider) => {
    return getContract(swap, getSwapOtherAddress(), signer);
};
export const getPCSRouterContract = (signer?: Signer | Provider) => {
    return getContract(pkrouter, getPCSRouterAddress(), signer);
};
export const getLaunchpadContract = (signer?: Signer | Provider) => {
    return getContract(launchpad, getLaunchpadAddress(), signer);
};
