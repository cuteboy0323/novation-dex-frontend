import { EnvProps, ConfigProps } from 'types/config';
import { defaultCustomTokens } from './constants/tokens';

const NODE_ENV = process.env.NODE_ENV;

// ** Secret config variables should be located in .env. [Todo]
const ENV: EnvProps = {
    development: {},
    production: {},
    test: {}
};

export const CIDS = {
    MAINNET: 56,
    TESTNET: 97
};
export const BASE_BSC_SCAN_URLS = {
    [CIDS.MAINNET]: 'https://bscscan.com',
    [CIDS.TESTNET]: 'https://testnet.bscscan.com'
};

export const MULTICALL_CONTRACTS = {
    1: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    56: '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
    137: '0xed386Fe855C1EFf2f843B910923Dd8846E45C5A4',
    43114: '0xed386Fe855C1EFf2f843B910923Dd8846E45C5A4',
    250: '0xD98e3dBE5950Ca8Ce5a4b59630a5652110403E5c'
};

export const NETWORK_LIST = [
    {
        chainId: 1,
        id: 'ETH',
        name: 'Ethereum',
        icon: 'ETH.svg',
        rpcUrl: 'https://cloudflare-eth.com/',
        scan: 'https://etherscan.io'
    },
    {
        chainId: 56,
        id: 'BSC',
        name: 'BSC',
        icon: 'BSC.svg',
        rpcUrl: 'https://bsc-dataseed1.binance.org/',
        scan: 'https://bscscan.com'
    },
    {
        chainId: 137,
        id: 'POLYGON',
        name: 'Polygon',
        icon: 'POLYGON.svg',
        rpcUrl: 'https://polygon-rpc.com',
        scan: 'https://polygonscan.com/'
    },
    {
        chainId: 25,
        id: 'CRONOS',
        name: 'Cronos',
        icon: 'CRONOS.png',
        rpcUrl: 'https://evm-cronos.crypto.org',
        scan: 'https://cronoscan.com/'
    },
    {
        chainId: 43114,
        id: 'AVALANCHE',
        name: 'Avalanche',
        icon: 'AVALANCHE.svg',
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        scan: 'https://snowtrace.io/'
    },
    {
        chainId: 250,
        id: 'FANTOM',
        name: 'Fantom',
        icon: 'FANTOM.svg',
        rpcUrl: 'https://rpc.ftm.tools/',
        scan: 'https://ftmscan.com/'
    }
];

const Config: ConfigProps = {
    env: ENV[NODE_ENV],
    isOpenSideBar: false,
    isDark: true,
    gasFee: 5,
    SLSlippage: 'auto',
    OLSlippage: 0.5,
    customTokens: defaultCustomTokens
};

export default Config;
