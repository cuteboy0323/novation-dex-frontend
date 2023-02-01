import { useEffect, useState, useCallback } from 'react';

// ** Material UI Components ** //
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

import { formatNumber } from 'utils/bigNumber';

import LoopRoundedIcon from '@mui/icons-material/LoopRounded';
import { useCrossChain } from 'hooks/useRubic';

const RubicTokenStatus = (props: any) => {
    const { base, quote, activeNetwork } = props;
    const { onCross } = useCrossChain();

    const [output, setOutput] = useState<any>(0);

    const update = useCallback(async () => {
        const mainAddr = '0x0000000000000000000000000000000000000000';

        const fromToken = {
            blockchain: activeNetwork.quote.id,
            address: quote.main ? mainAddr : quote.address
        };
        const fromAmount = '1';
        const toToken = {
            blockchain: activeNetwork.base.id,
            address: base.main ? mainAddr : base.address
        };
        const bestTrade: any = await onCross(fromToken, fromAmount, toToken);
        if (bestTrade) {
            if (fromToken.blockchain === toToken.blockchain) {
                const value = bestTrade.to.tokenAmount.toFormat(3);
                setOutput(value);
            } else {
                const value = bestTrade.trade.toTokenAmountMin.toFormat(3);
                setOutput(value);
            }
        }
    }, [base, quote]);

    useEffect(() => {
        setOutput(0);
        update();
    }, [base, quote]);

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

export default RubicTokenStatus;
