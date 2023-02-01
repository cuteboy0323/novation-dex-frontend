// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import useConfig from 'hooks/useConfig';

const Settings = (props: any) => {
    const { anchorEl, onClose } = props;
    const { gasFee, onChangeGasFee } = useConfig();

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            PaperProps={{
                sx: {
                    bgcolor: '#020B0F',
                    backgroundImage: 'none',
                    border: '2px solid #00ACFD',
                    borderRadius: 2,
                    padding: 2.5
                }
            }}
        >
            <Stack>
                <Stack
                    direction="row"
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography fontSize={24} lineHeight="31px">
                        Settings
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            color: 'primary.main'
                        }}
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                </Stack>
                <Stack
                    spacing={2}
                    sx={{
                        padding: 3
                    }}
                >
                    <Typography textTransform="uppercase" lineHeight="21px" fontSize={16}>
                        Default transaction speed (Gwei)
                    </Typography>

                    <Stack spacing={1} pb={1}>
                        <Box
                            onClick={() => onChangeGasFee(5)}
                            sx={{
                                padding: 1.75,
                                borderRadius: 1,
                                alignSelf: 'flex-start',
                                transition: '.25s',
                                cursor: 'pointer',
                                bgcolor: Number(gasFee) === 5 ? 'rgba(0, 172, 253, 0.1)' : 'transparent',
                                border: Number(gasFee) === 5 ? '1.5px solid #00ACFD' : '1.5px solid transparent',
                                boxShadow: Number(gasFee) === 5 ? '0px 0px 25px rgba(0, 172, 253, 0.5)' : 'none',
                                color: Number(gasFee) === 5 ? 'inherit' : 'text.secondary'
                            }}
                        >
                            <Typography fontSize={14} fontWeight={400} lineHeight="14px">
                                Standard (5)
                            </Typography>
                        </Box>
                        <Box
                            onClick={() => onChangeGasFee(6)}
                            sx={{
                                padding: 1.75,
                                borderRadius: 1,
                                alignSelf: 'flex-start',
                                transition: '.25s',
                                cursor: 'pointer',
                                bgcolor: Number(gasFee) === 6 ? 'rgba(0, 172, 253, 0.1)' : 'transparent',
                                border: Number(gasFee) === 6 ? '1.5px solid #00ACFD' : '1.5px solid transparent',
                                boxShadow: Number(gasFee) === 6 ? '0px 0px 25px rgba(0, 172, 253, 0.5)' : 'none',
                                color: Number(gasFee) === 6 ? 'inherit' : 'text.secondary'
                            }}
                        >
                            <Typography fontSize={14} fontWeight={400} lineHeight="14px">
                                Fast (6)
                            </Typography>
                        </Box>
                        <Box
                            onClick={() => onChangeGasFee(7)}
                            sx={{
                                padding: 1.75,
                                borderRadius: 1,
                                alignSelf: 'flex-start',
                                transition: '.25s',
                                cursor: 'pointer',
                                bgcolor: Number(gasFee) === 7 ? 'rgba(0, 172, 253, 0.1)' : 'transparent',
                                border: Number(gasFee) === 7 ? '1.5px solid #00ACFD' : '1.5px solid transparent',
                                boxShadow: Number(gasFee) === 7 ? '0px 0px 25px rgba(0, 172, 253, 0.5)' : 'none',
                                color: Number(gasFee) === 7 ? 'inherit' : 'text.secondary'
                            }}
                        >
                            <Typography fontSize={14} fontWeight={400} lineHeight="14px">
                                Instant (7)
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        </Popover>
    );
};

export default Settings;
