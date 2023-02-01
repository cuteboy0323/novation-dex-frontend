// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const NovationSelect = (props: any) => {
    const {
        children,
        id,
        name,
        value,
        onChange,
        required,
        label,
        disabled,
        readOnly,
        placeholder,
        inputProps,
        ...rest
    } = props;
    return (
        <Stack {...rest} spacing={label ? 1.5 : 0}>
            {label && (
                <Typography
                    color="textSecondary"
                    fontSize={14}
                    fontWeight={500}
                    lineHeight="14px"
                    textTransform="capitalize"
                >
                    {label} {required && '*'}
                </Typography>
            )}
            <Stack
                id="input-wrapper"
                sx={{
                    bgcolor: 'rgba(0, 172, 253, 0.1)',
                    borderRadius: 1,
                    '& .MuiSelect-select': {
                        px: 2.5,
                        py: 2
                    }
                }}
            >
                <TextField
                    id={id}
                    name={name}
                    value={value ?? ''}
                    disabled={disabled}
                    onChange={onChange}
                    inputProps={{
                        readOnly: readOnly,
                        placeholder: placeholder
                    }}
                    required={required}
                    {...inputProps}
                    select
                    SelectProps={{
                        IconComponent: (params) => {
                            return (
                                <Box
                                    {...params}
                                    component="img"
                                    src={require('assets/img/icons/arrow-down.svg').default}
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        top: 'calc(50% - 12px) !important',
                                        right: '12px !important'
                                    }}
                                />
                            );
                        }
                    }}
                    sx={{
                        padding: 0,
                        bgcolor: 'none',
                        '& input': {
                            fontSize: 13,
                            lineHeight: '20px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            height: 20,
                            padding: 0
                        },
                        '& fieldset': {
                            display: 'none'
                        },
                        '& .MuiSelect-select': {
                            lineHeight: '20px',
                            minHeight: '20px !important'
                        }
                    }}
                >
                    {children}
                </TextField>
            </Stack>
        </Stack>
    );
};

export default NovationSelect;
