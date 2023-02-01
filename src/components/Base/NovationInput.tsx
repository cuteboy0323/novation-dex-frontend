// ** Material UI Components ** //
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const NovationInput = (props: any) => {
    const {
        id,
        name,
        type,
        value,
        onChange,
        title,
        label,
        required,
        readOnly,
        placeholder,
        multiline,
        pattern,
        inputProps,
        disabled,
        min,
        max,
        step,
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
                    px: 2.5,
                    py: 2,
                    bgcolor: 'rgba(0, 172, 253, 0.1)',
                    borderRadius: 1,
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        margin: 0,
                        WebkitAppearance: 'none'
                    },
                    '& input[type=number]': {
                        MozAppearance: 'textfield'
                    }
                }}
            >
                <TextField
                    id={id}
                    name={name}
                    type={type}
                    value={value ?? ''}
                    multiline={multiline}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    inputProps={{
                        readOnly: readOnly,
                        placeholder: placeholder,
                        min: min,
                        max: max,
                        step: step,
                        pattern: pattern,
                        title: title
                    }}
                    {...inputProps}
                    sx={{
                        bgcolor: 'none',
                        '& input': {
                            fontSize: 16,
                            lineHeight: '20px',
                            fontWeight: 500,
                            color: '#FFFFFF',
                            height: 20,
                            padding: 0
                        },
                        '& fieldset': {
                            display: 'none'
                        }
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default NovationInput;
