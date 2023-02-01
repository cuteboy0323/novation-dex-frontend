import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';

const NovationButton: React.FC<LoadingButtonProps> = ({ children, sx, variant = 'contained', ...rest }) => (
    <LoadingButton
        {...rest}
        variant={variant}
        color="primary"
        size="large"
        fullWidth
        sx={{
            letterSpacing: 3,
            fontWeight: 700,
            fontSize: 16,
            lineHeight: '24px',
            py: 1.875,
            px: 2,
            backgroundImage:
                variant === 'contained'
                    ? 'linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), linear-gradient(180deg, #00ACFD 0%, rgba(0, 172, 253, 0) 100%)'
                    : 'none',
            boxShadow:
                ' 0px 0px 18.9113px rgba(0, 172, 253, 0.7), 0px 0px 73.2115px rgba(0, 172, 253, 0.5), inset 0px 0px 7.32115px rgba(0, 172, 253, 0.5) !important',
            ...sx,
            '&.Mui-disabled': {
                background: 'none'
            },
            '& .MuiCircularProgress-root': {
                width: '24px !important',
                height: '24px !important',
                color: 'primary.main'
            }
        }}
    >
        {children}
    </LoadingButton>
);

export default NovationButton;
