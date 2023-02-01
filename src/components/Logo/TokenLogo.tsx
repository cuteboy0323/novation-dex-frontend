import { Box, BoxProps } from '@mui/material';

const TokenLogo: React.FC<BoxProps> = ({ children }) => {
    return (
        <Box
            sx={{
                width: 40,
                height: 40,
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&:before': {
                    content: "' '",
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '2px solid #00ACFD',
                    filter: 'drop-shadow(0px 0px 50px rgba(0, 172, 253, 0.5)) drop-shadow(0px 0px 10px rgba(0, 172, 253, 0.8))'
                }
            }}
        >
            {children}
        </Box>
    );
};

export default TokenLogo;
