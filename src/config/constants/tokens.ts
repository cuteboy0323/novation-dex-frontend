import { Token } from 'types/token';
import { CHAIN_ID } from './networks';

const MAINNET = 56;
const TESTNET = 97;

interface TokenList {
    [symbol: string]: Token;
}

const defineTokens = <T extends TokenList>(t: T) => t;

export const mainnetTokens = defineTokens({
    bnb: {
        chainId: MAINNET,
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        decimals: 18,
        symbol: 'BNB',
        name: 'BNB',
        apiId: 'binancecoin',
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        projectLink: 'https://www.binance.com/'
    }
} as const);

export const testnetTokens = defineTokens({
    bnb: {
        chainId: TESTNET,
        address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
        decimals: 18,
        symbol: 'BNB',
        name: 'BNB',
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        projectLink: 'https://www.binance.com/'
    }
} as const);

const tokens = () => {
    const chainId = CHAIN_ID;
    // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
    if (parseInt(chainId, 10) === TESTNET) {
        return testnetTokens;
    }
    return mainnetTokens;
};

const unserializedTokens = tokens();

const getCustomTokensAsObjectFromJson = () => {
    const mn = require('./tokens/pcs/mainnet.json');
    const tn = require('./tokens/pcs/testnet.json');
    const ci = parseInt(CHAIN_ID, 10);
    const t = ci === TESTNET ? tn : mn;

    const tObject = {};
    t.forEach((token) => {
        const id = token.symbol.toLowerCase();
        tObject[id] = token;
    });
    return tObject;
};

const getTokensAsObjectFromJson = () => {
    const mn = require('./tokens/novation/mainnet.json');
    const tn = require('./tokens/novation/testnet.json');
    const ci = parseInt(CHAIN_ID, 10);
    const t = ci === TESTNET ? tn : mn;

    const tObject = {};
    t.forEach((token) => {
        const id = token.symbol.toLowerCase();
        tObject[id] = token;
    });
    return tObject;
};

const getRubicTokensAsObjectFromJson = () => {
    const mn = require('./tokens/novation/rubic.json');

    const tObject = {};
    mn.forEach((token) => {
        const id = token.symbol.toLowerCase();
        tObject[id] = token;
    });
    return tObject;
};

const tokensList = getTokensAsObjectFromJson() as any;
const rubicTokensList = getRubicTokensAsObjectFromJson() as any;
const customTokensList = getCustomTokensAsObjectFromJson() as any;

export const defaultCustomTokens = {
    ...unserializedTokens,
    ...customTokensList
};
export const liquidityTokens = tokensList;
export const sellLessTokens = {
    ...unserializedTokens,
    ...tokensList
} as any;
export const rubicTokens = rubicTokensList;

export default unserializedTokens;
