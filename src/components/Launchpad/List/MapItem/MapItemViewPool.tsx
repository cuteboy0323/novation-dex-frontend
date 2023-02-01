// ** MUI Components ** //
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import usePool from 'hooks/usePool';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

const MapItemViewPool: React.FC<any> = ({ pool, ...rest }) => {
    const navigate = useNavigate();

    const { account } = useActiveWeb3React();
    const { poolMap } = usePool();
    const poolData = poolMap[pool] ?? {};

    const isOwner = useMemo(() => {
        if (!account || !poolData) return;
        return poolData.owner?.toLowerCase() === account?.toLowerCase();
    }, [poolData, account]);

    return (
        <Stack alignItems="flex-end" pt={2} {...rest}>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1.25}
                onClick={() => (isOwner ? navigate(`../manage?address=${pool}`) : navigate(`../view?address=${pool}`))}
                sx={{
                    cursor: 'pointer'
                }}
            >
                <Typography
                    fontSize={16}
                    lineHeight="24px"
                    letterSpacing="3px"
                    textTransform="uppercase"
                    fontWeight={700}
                    color="primary"
                    sx={{
                        filter: 'drop-shadow(0px 0px 50px rgba(0, 172, 253, 0.5)) drop-shadow(0px 0px 10px rgba(0, 172, 253, 0.8))'
                    }}
                >
                    {isOwner ? 'Manage Pool' : 'View Pool'}
                </Typography>
                <Box
                    component="img"
                    src={require('assets/img/icons/arrow-right.svg').default}
                    sx={{
                        width: 24,
                        height: 24,
                        filter: 'drop-shadow(0px 0px 50px rgba(0, 172, 253, 0.5)) drop-shadow(0px 0px 10px rgba(0, 172, 253, 0.8))'
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default MapItemViewPool;
