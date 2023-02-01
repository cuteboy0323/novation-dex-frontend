// ** Material UI Components ** //
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import TabBottomLine from '../Items/TabBottomLine';

const Slippage = ({ value, onChange, tab, ...rest }: any) => {
    return (
        <Stack
            {...rest}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            pb={1}
            sx={{
                /* Chrome, Safari, Edge, Opera */
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0
                },
                /* Firefox */
                '& input[type=number]': {
                    MozAppearance: 'textfield'
                }
            }}
        >
            <Typography fontSize={14} fontWeight={500} lineHeight="14px" textTransform="uppercase">
                Slippage tolerance
            </Typography>
            <Stack direction="row" spacing={1}>
                <Stack
                    sx={{
                        width: 54,
                        height: 40,
                        bgcolor: 'rgba(0, 172, 253, 0.1)',
                        borderRadius: 1,
                        cursor: 'pointer',
                        lineHeight: '14px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        px: 1
                    }}
                >
                    <Stack direction="row" alignItems="center">
                        <TextField
                            type="number"
                            value={value === 'auto' ? '' : value}
                            onChange={(e: any) => onChange(e.target.value)}
                            inputProps={{
                                min: 0,
                                max: 100,
                                step: 0.1
                            }}
                            sx={{
                                bgcolor: 'none',
                                '& input': {
                                    fontSize: 14,
                                    fontWeight: 400,
                                    lineHeight: '14px',
                                    color: '#FFFFFF',
                                    height: 20,
                                    padding: 0,
                                    textAlign: 'center'
                                },
                                '& fieldset': {
                                    display: 'none'
                                }
                            }}
                            fullWidth
                        />
                        <Typography fontSize={14} fontWeight={400} lineHeight="14px">
                            %
                        </Typography>
                    </Stack>
                    <TabBottomLine />
                </Stack>
                {tab !== 'listings' ? (
                    <>
                        <Stack
                            onClick={() => onChange('auto')}
                            sx={{
                                width: 54,
                                height: 40,
                                bgcolor: 'rgba(0, 172, 253, 0.1)',
                                border: value === 'auto' ? '1.5px solid #00ACFD' : 'none',
                                boxShadow: value === 'auto' ? '0px 0px 25px rgba(0, 172, 253, 0.5)' : 'none',
                                fontSize: 14,
                                fontWeight: 400,
                                borderRadius: 1,
                                cursor: 'pointer',
                                lineHeight: '14px',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            Auto
                        </Stack>
                        <Stack
                            onClick={() => onChange(5)}
                            sx={{
                                width: 54,
                                height: 40,
                                bgcolor: 'rgba(0, 172, 253, 0.1)',
                                border: Number(value) === 5 ? '1.5px solid #00ACFD' : 'none',
                                boxShadow: Number(value) === 5 ? '0px 0px 25px rgba(0, 172, 253, 0.5)' : 'none',
                                fontSize: 14,
                                fontWeight: 400,
                                borderRadius: 1,
                                cursor: 'pointer',
                                lineHeight: '14px',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            5%
                        </Stack>
                        <Stack
                            onClick={() => onChange(10)}
                            sx={{
                                width: 54,
                                height: 40,
                                bgcolor: 'rgba(0, 172, 253, 0.1)',
                                border: Number(value) === 10 ? '1.5px solid #00ACFD' : 'none',
                                boxShadow: Number(value) === 10 ? '0px 0px 25px rgba(0, 172, 253, 0.5)' : 'none',
                                fontSize: 14,
                                fontWeight: 400,
                                borderRadius: 1,
                                cursor: 'pointer',
                                lineHeight: '14px',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            10%
                        </Stack>
                    </>
                ) : (
                    <>
                        <Stack
                            onClick={() => onChange(0.5)}
                            sx={{
                                width: 54,
                                height: 40,
                                bgcolor: 'rgba(0, 172, 253, 0.1)',
                                border: Number(value) === 0.5 ? '1.5px solid #00ACFD' : 'none',
                                boxShadow: Number(value) === 0.5 ? '0px 0px 25px rgba(0, 172, 253, 0.5)' : 'none',
                                fontSize: 14,
                                fontWeight: 400,
                                borderRadius: 1,
                                cursor: 'pointer',
                                lineHeight: '14px',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            0.5%
                        </Stack>
                        <Stack
                            onClick={() => onChange(1)}
                            sx={{
                                width: 54,
                                height: 40,
                                bgcolor: 'rgba(0, 172, 253, 0.1)',
                                border: Number(value) === 1 ? '1.5px solid #00ACFD' : 'none',
                                boxShadow: Number(value) === 1 ? '0px 0px 25px rgba(0, 172, 253, 0.5)' : 'none',
                                fontSize: 14,
                                fontWeight: 400,
                                borderRadius: 1,
                                cursor: 'pointer',
                                lineHeight: '14px',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            1%
                        </Stack>
                        <Stack
                            onClick={() => onChange(5)}
                            sx={{
                                width: 54,
                                height: 40,
                                bgcolor: 'rgba(0, 172, 253, 0.1)',
                                border: Number(value) === 5 ? '1.5px solid #00ACFD' : 'none',
                                boxShadow: Number(value) === 5 ? '0px 0px 25px rgba(0, 172, 253, 0.5)' : 'none',
                                fontSize: 14,
                                fontWeight: 400,
                                borderRadius: 1,
                                cursor: 'pointer',
                                lineHeight: '14px',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            5%
                        </Stack>
                    </>
                )}
            </Stack>
        </Stack>
    );
};

export default Slippage;
