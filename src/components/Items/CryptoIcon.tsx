import { Box, BoxProps } from '@mui/material';

const CryptoIcon: React.FC<BoxProps> = ({ sx, ...rest }) => (
    <Box
        {...rest}
        component="img"
        src={require('assets/img/icons/buy-crypto.svg').default}
        alt="Arrow"
        sx={{
            height: 24,
            ...sx
        }}
    />
);

export default CryptoIcon;
