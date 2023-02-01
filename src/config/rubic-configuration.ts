import { BLOCKCHAIN_NAME, Configuration } from 'rubic-sdk';

const RUBIC_CONFIG: Configuration = {
    rpcProviders: {
        [BLOCKCHAIN_NAME.ETHEREUM]: {
            rpcList: ['https://cloudflare-eth.com/']
        },
        [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
            rpcList: ['https://bsc-dataseed1.binance.org/']
        },
        [BLOCKCHAIN_NAME.POLYGON]: {
            rpcList: ['https://polygon-rpc.com']
        },
        [BLOCKCHAIN_NAME.CRONOS]: {
            rpcList: ['https://evm-cronos.crypto.org']
        },
        [BLOCKCHAIN_NAME.AVALANCHE]: {
            rpcList: ['https://api.avax.network/ext/bc/C/rpc']
        },
        [BLOCKCHAIN_NAME.FANTOM]: {
            rpcList: ['https://rpc.ftm.tools/']
        }
        // [BLOCKCHAIN_NAME.ARBITRUM]: {
        //     mainRpc: 'https://rpc.ankr.com/arbitrum'
        // },
        // [BLOCKCHAIN_NAME.ETHEREUM_POW]: {
        //     mainRpc: 'https://mainnet.ethereumpow.org'
        // },
        // [BLOCKCHAIN_NAME.AURORA]: {
        //     mainRpc: 'https://mainnet.aurora.dev'
        // },
        // [BLOCKCHAIN_NAME.MOONBEAM]: {
        //     mainRpc: 'https://rpc.api.moonbeam.network'
        // },
        // [BLOCKCHAIN_NAME.FUSE]: {
        //     mainRpc: '	https://rpc.fuse.io'
        // },
        // [BLOCKCHAIN_NAME.MOONRIVER]: {
        //     mainRpc: 'https://rpc.moonriver.moonbeam.network	'
        // },
        // [BLOCKCHAIN_NAME.TELOS]: {
        //     mainRpc: 'https://mainnet.telos.net/evm	'
        // },
        // [BLOCKCHAIN_NAME.CELO]: {
        //     mainRpc: 'https://rpc.ankr.com/celo'
        // },
        // [BLOCKCHAIN_NAME.OKE_X_CHAIN]: {
        //     mainRpc: 'https://exchainrpc.okex.org'
        // },
        // [BLOCKCHAIN_NAME.CRONOS]: {
        //     mainRpc: 'https://evm-cronos.crypto.org	'
        // },
        // [BLOCKCHAIN_NAME.GNOSIS]: {
        //     mainRpc: 'https://rpc.gnosischain.com'
        // },
        // [BLOCKCHAIN_NAME.BOBA]: {
        //     mainRpc: 'https://mainnet.boba.network'
        // },
        // [BLOCKCHAIN_NAME.HARMONY]: {
        //     mainRpc: 'https://api.harmony.one'
        // }
    }
};

export default RUBIC_CONFIG;
