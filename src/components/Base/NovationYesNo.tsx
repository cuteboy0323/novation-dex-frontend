// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const NovationYesNo = ({ value, name, onChange, ...rest }: any) => {
    return (
        <Stack direction="row" spacing={3} py={3} {...rest}>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                onClick={() => onChange(name, false)}
                sx={{
                    cursor: 'pointer'
                }}
            >
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        width: 19,
                        height: 19,
                        bgcolor: 'rgba(0, 172, 253, 0.2)',
                        borderRadius: 50,
                        position: 'relative'
                    }}
                >
                    {!value && (
                        <Box
                            sx={{
                                width: 11,
                                height: 11,
                                boxShadow: '0px 0px 50px rgba(0, 172, 253, 0.5), 0px 0px 10px rgba(0, 172, 253, 0.8)',
                                bgcolor: 'primary.main',
                                position: 'absolute',
                                borderRadius: 50
                            }}
                        />
                    )}
                </Stack>
                <Typography color="textSecondary" fontSize={14} lineHeight="14px" fontWeight={500}>
                    No
                </Typography>
            </Stack>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                onClick={() => onChange(name, true)}
                sx={{
                    cursor: 'pointer'
                }}
            >
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        width: 19,
                        height: 19,
                        bgcolor: 'rgba(0, 172, 253, 0.2)',
                        borderRadius: 50,
                        position: 'relative'
                    }}
                >
                    {value && (
                        <Box
                            sx={{
                                width: 11,
                                height: 11,
                                boxShadow: '0px 0px 50px rgba(0, 172, 253, 0.5), 0px 0px 10px rgba(0, 172, 253, 0.8)',
                                bgcolor: 'primary.main',
                                position: 'absolute',
                                borderRadius: 50
                            }}
                        />
                    )}
                </Stack>
                <Typography color="textSecondary" fontSize={14} lineHeight="14px" fontWeight={500}>
                    Yes
                </Typography>
            </Stack>
        </Stack>
    );
};

export default NovationYesNo;
