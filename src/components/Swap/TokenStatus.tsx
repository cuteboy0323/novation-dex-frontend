import { useEffect, useState, useCallback } from 'react';

// ** Material UI Components ** //
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

import { sellLessTokens } from 'config/constants/tokens';
import { formatNumber, fromWei, toWei } from 'utils/bigNumber';

import LoopRoundedIcon from '@mui/icons-material/LoopRounded';

const TokenStatus = (props: any) => {
    const { base, quote, contract } = props;

    const [output, setOutput] = useState<any>();

    const isBuy = useCallback(() => {
        if (base?.address === sellLessTokens.bnb?.address) return true;
        return false;
    }, [base]);

    const update = useCallback(() => {
        if (isBuy()) {
            contract
                .getAmountInFromBuy(quote.address, toWei('0.0001', quote.decimals).toString())
                .then(({ amountIn }: any) => {
                    setOutput(fromWei(amountIn, base.decimals - 4));
                })
                .catch(() => {});
        } else {
            contract
                .getAmountInFromSell(base.address, toWei('0.0001', quote.decimals).toString())
                .then(({ amountIn }: any) => {
                    setOutput(fromWei(amountIn, base.decimals - 4));
                })
                .catch(() => {});
        }
    }, [isBuy, base, quote]);

    useEffect(() => {
        const interval = setInterval(() => update(), 6000);
        update();
        return () => clearInterval(interval);
    }, [update]);

    return (
        <Stack direction="row" spacing={1.125} justifyContent="flex-end" py={0.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={500} lineHeight="14px">
                    1 {quote.symbol}
                </Typography>
                <Typography fontSize={14} fontWeight={500} lineHeight="14px">
                    =
                </Typography>
                <Typography fontSize={14} fontWeight={500} lineHeight="14px">
                    {formatNumber(output, 15)} {base.symbol}
                </Typography>
                <IconButton size="small" onClick={update}>
                    <LoopRoundedIcon fontSize="small" />
                </IconButton>
            </Stack>
        </Stack>
    );
};

export default TokenStatus;
