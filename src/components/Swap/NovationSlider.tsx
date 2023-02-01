// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const NovationSlider: React.FC<any> = ({ value, onChange, setValue, onEvent, ...rest }) => {
    return (
        <Stack {...rest} sx={{ height: 90, position: 'relative' }} justifyContent="center">
            <Slider
                value={value}
                onChange={onChange}
                aria-label="Small"
                valueLabelDisplay="auto"
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
                        top: { xs: -12, sm: -26 }
                    },
                    '& .MuiSlider-track': {
                        height: 7,
                        borderRadius: 0,
                        border: 'none',
                        background: 'linear-gradient(90.02deg, #00ACFD 41.28%, rgba(0, 172, 253, 0) 100.78%)'
                    }
                }}
            />
            <Stack
                direction="row"
                alignItems="flex-end"
                sx={{
                    width: '100%',
                    top: '50%',
                    position: 'absolute',
                    transform: 'translateY(-10px)'
                }}
            >
                {new Array(41).fill('').map((item, idx) => {
                    const c = 2.5 * idx;
                    const i = Math.abs(value - c);
                    const active = i < 1.25;
                    return (
                        <Box
                            key={idx}
                            sx={{
                                position: 'absolute',
                                left: `calc(100% / 40 * ${idx})`,
                                transform: 'translateX(-50%)',
                                height: idx % 10 === 0 ? 9 : 6,
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderColor: active ? '#00ACFD' : 'rgba(0, 172, 253, 0.35)'
                            }}
                        />
                    );
                })}
            </Stack>
            <Stack
                direction="row"
                alignItems="flex-start"
                sx={{
                    width: '100%',
                    top: '50%',
                    position: 'absolute',
                    transform: 'translateY(10px)'
                }}
            >
                {new Array(41).fill('').map((item, idx) => {
                    const c = 2.5 * idx;
                    const i = Math.abs(value - c);
                    const active = i < 1.25;
                    return (
                        <Box
                            key={idx}
                            sx={{
                                position: 'absolute',
                                left: `calc(100% / 40 * ${idx})`,
                                transform: 'translateX(-50%)',
                                height: idx % 10 === 0 ? 9 : 6,
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderColor: active ? '#00ACFD' : 'rgba(0, 172, 253, 0.35)'
                            }}
                        />
                    );
                })}
            </Stack>
            <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                    width: '100%',
                    left: 0,
                    bottom: 0,
                    position: 'absolute'
                }}
            >
                <Typography
                    fontSize={14}
                    fontWeight={100}
                    lineHeight="14px"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                        onEvent(0);
                        setValue(0);
                    }}
                >
                    0%
                </Typography>
                <Typography
                    fontSize={14}
                    fontWeight={100}
                    lineHeight="14px"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                        onEvent(25);
                        setValue(25);
                    }}
                >
                    25%
                </Typography>
                <Typography
                    fontSize={14}
                    fontWeight={100}
                    lineHeight="14px"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                        onEvent(50);
                        setValue(50);
                    }}
                >
                    50%
                </Typography>
                <Typography
                    fontSize={14}
                    fontWeight={100}
                    lineHeight="14px"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                        onEvent(75);
                        setValue(75);
                    }}
                >
                    75%
                </Typography>
                <Typography
                    fontSize={14}
                    fontWeight={100}
                    lineHeight="14px"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                        onEvent(100);
                        setValue(100);
                    }}
                >
                    Max
                </Typography>
            </Stack>
        </Stack>
    );
};

export default NovationSlider;
