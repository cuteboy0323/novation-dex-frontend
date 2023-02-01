import { CIDS } from 'config';
import { CHAIN_ID } from 'config/constants/networks';
import { Address } from 'config/constants/types';

import addresses from 'config/constants/contracts';

export const getAddress = (address: Address): string => {
    return address[CHAIN_ID] ? address[CHAIN_ID] : address[CIDS.MAINNET];
};
export const getRouterAddress = () => {
    return getAddress(addresses.router);
};
export const getDividendAddress = () => {
    return getAddress(addresses.dividend);
};
export const getMainTokenAddress = () => {
    return getAddress(addresses.token);
};
export const getMulticallAddress = () => {
    return getAddress(addresses.multiCall);
};
export const getFactoryAddress = () => {
    return getAddress(addresses.factory);
};
export const getSwapAddress = () => {
    return getAddress(addresses.swap);
};
export const getSwapOtherAddress = () => {
    return getAddress(addresses.swapOther);
};
export const getPCSRouterAddress = () => {
    return getAddress(addresses.pcsRouter);
};
export const getLaunchpadAddress = () => {
    return getAddress(addresses.launchpad);
};
