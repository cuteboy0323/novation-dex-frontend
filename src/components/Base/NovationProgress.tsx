// ** Material UI Components ** //
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { formatNumber } from 'utils/bigNumber';

const NovationProgressBar: React.FC<any> = ({ value, sx, min, max, label, ...rest }) => {
    return (
        <Stack {...rest} sx={{ position: 'relative', pt: 1, ...sx }} spacing={0.5} justifyContent="center">
            {label && (
                <Typography
                    textAlign={value > 50 ? 'left' : 'right'}
                    fontSize={14}
                    fontWeight={500}
                    lineHeight="14px"
                    textTransform="uppercase"
                    visibility="hidden"
                    pb={0.75}
                >
                    {label}
                </Typography>
            )}
            <Slider
                value={value}
                aria-label="Small"
                valueLabelDisplay="on"
                step={0.1}
                valueLabelFormat={(x) => `[${formatNumber(x, 2)}%]`}
                sx={{
                    py: 0.875,
                    '& .MuiSlider-rail': {
                        height: 7,
                        borderRadius: 0,
                        opacity: 1,
                        bgcolor: 'rgba(0, 172, 253, 0.2)'
                    },
                    '& .MuiSlider-thumb': {
                        width: 15,
                        height: 15,
                        bgcolor: '#04141B',
                        border: '2px solid #00ACFD',
                        top: { xs: 0, sm: -10 }
                    },
                    '& .MuiSlider-track': {
                        height: 7,
                        borderRadius: 0,
                        border: 'none',
                        background: 'linear-gradient(90.02deg, #00ACFD 41.28%, rgba(0, 172, 253, 0) 100.78%)'
                    },
                    '& .MuiSlider-valueLabel': {
                        background: 'transparent',
                        py: 0,
                        px: 1,
                        border: 'none',
                        top: -4,
                        '&:before': {
                            display: 'none'
                        },
                        '& .MuiSlider-valueLabelLabel': {
                            fontSize: 12,
                            fontWeight: 500,
                            lineHeight: '14px',
                            color: 'primary.main'
                        }
                    }
                }}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography fontSize={12} fontWeight={500} lineHeight="14px" color="textSecondary">
                    {min}
                </Typography>
                <Typography fontSize={12} fontWeight={500} lineHeight="14px" color="textSecondary">
                    {max}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default NovationProgressBar;
