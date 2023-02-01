import React from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';

import { TimeProgressProps } from 'types/components/time';

const TimeProgress: React.FC<TimeProgressProps> = (props) => {
    const { value, unit, uvalue, size, ...rest } = props;
    return (
        <Stack
            {...rest}
            justifyContent="center"
            alignItems="center"
            sx={{
                width: size,
                height: size - 8,
                bgcolor: 'rgba(0, 172, 253, 0.1)',
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <Stack
                justifyContent="center"
                alignItems="center"
                sx={{
                    bgcolor: '#0b3f61',
                    zIndex: 2,
                    width: size - 6,
                    height: size - 6 - 8,
                    borderRadius: 1,
                    border: '1px solid rgba(0, 172, 253, 0.2)'
                }}
            >
                <Typography
                    sx={{
                        lineHeight: `${size / 3}px`,
                        fontSize: size / 3
                    }}
                >
                    {value >= 0 ? value : <Skeleton variant="rounded" animation="wave" width={size} height={size} />}
                </Typography>
                <Typography
                    sx={{
                        lineHeight: `${size / 4.5}px`,
                        fontSize: size / 4.5
                    }}
                    textTransform="capitalize"
                >
                    {value >= 0 ? unit : ''}
                </Typography>
            </Stack>
            <CircularProgress
                size={size + 15}
                thickness={size / 2.5}
                variant="determinate"
                value={value >= 0 ? (value / uvalue) * 100 : 0}
                sx={{
                    position: 'absolute',
                    zIndex: 1
                }}
            />
            <CircularProgress
                size={size + 15}
                thickness={size / 2.5}
                variant="determinate"
                value={100}
                sx={{
                    position: 'absolute',
                    color: 'rgba(0, 172, 253, 0.2)'
                }}
            />
        </Stack>
    );
};

export default TimeProgress;
