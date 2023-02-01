// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Avatar from '@mui/material/Avatar';

import { formatNumber, fromWei } from 'utils/bigNumber';

import useConfig from 'hooks/useConfig';

const RubicTokenInput = (props: any) => {
    const { tokenLogo } = useConfig();
    const { token, balance, openTokenSelect, value, onChange, disabled, network } = props;
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
                px: 2.5,
                py: 2,
                bgcolor: 'rgba(0, 172, 253, 0.1)',
                borderRadius: 1,
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
            <Stack spacing={1.25}>
                <TextField
                    disabled={disabled}
                    type="number"
                    value={(() => {
                        const v = value ?? '.';
                        const x = v.split('.')[0];
                        const y = v.split('.')[1];

                        if (!x || !y) return value ?? '';
                        const d = 18 - x.length;
                        const nv = `${x}.${y?.substring(0, d)}`;
                        return nv;
                    })()}
                    onChange={onChange}
                    inputProps={{
                        placeholder: '0.00',
                        min: 0,
                        step: 1
                    }}
                    sx={{
                        bgcolor: 'none',
                        '& input': {
                            fontSize: 20,
                            lineHeight: '20px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            height: 20,
                            padding: 0,
                            WebkitTextFillColor: '#FFFFFF !important'
                        },
                        '& fieldset': {
                            display: 'none'
                        }
                    }}
                />
                <Stack direction="row" alignItems="center" spacing={1.25}>
                    <Typography color="textSecondary" fontSize={14} fontWeight={500} lineHeight="14px">
                        Balance
                    </Typography>
                    <Typography
                        color="#FFFFFF"
                        noWrap
                        fontSize={14}
                        fontWeight={500}
                        lineHeight="14px"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        {balance ? (
                            formatNumber(fromWei(balance, token?.decimals))
                        ) : (
                            <Skeleton sx={{ minWidth: 60, height: 14 }} />
                        )}{' '}
                        {token?.symbol}
                    </Typography>
                </Stack>
            </Stack>
            <Button
                onClick={openTokenSelect}
                startIcon={
                    token ? (
                        <Box
                            component="img"
                            src={(() => {
                                if (token.icon && token.icon !== '') return token.icon;
                                try {
                                    return require(`assets/img/tokens/${token?.symbol?.toLowerCase()}.svg`);
                                } catch {
                                    const logo = tokenLogo[token?.address];
                                    if (logo && logo !== 'non-exist') return tokenLogo[token?.address];
                                    return require('assets/img/logo.png');
                                }
                            })()}
                            alt={token.symbol}
                            sx={{ width: 20, height: 20, borderRadius: 5 }}
                        />
                    ) : null
                }
                endIcon={
                    <Box
                        component="img"
                        src={require('assets/img/icons/arrow-down.svg').default}
                        sx={{
                            width: 20,
                            height: 20
                        }}
                        alt="Arrow Down"
                    />
                }
                sx={{
                    minWidth: 'unset',
                    fontSize: 16,
                    fontWeight: 500,
                    color: '#FFFFFF !important',
                    '& .MuiButton-startIcon': {
                        marginLeft: 0,
                        marginRight: 1
                    }
                }}
            >
                {token ? token.symbol : ''}
            </Button>
            <Button
                sx={{
                    color: 'white',
                    borderRadius: 1,
                    marginRight: -1,
                    textTransform: 'none',
                    flexDirection: 'column',
                    minWidth: 'fit-content',
                    justifyContent: 'space-between'
                }}
                onClick={openTokenSelect}
            >
                <Avatar
                    src={require(`assets/img/network/${network.icon}`)}
                    sx={{
                        width: 32,
                        height: 32
                    }}
                />
            </Button>
        </Stack>
    );
};

export default RubicTokenInput;
