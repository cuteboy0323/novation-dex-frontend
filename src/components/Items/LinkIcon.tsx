import { Box, BoxProps } from '@mui/material';

const LinkIcon: React.FC<BoxProps> = ({ sx, ...rest }) => (
    <Box
        {...rest}
        component="img"
        src={require('assets/img/icons/link.svg').default}
        alt="Arrow"
        sx={{
            height: 24,
            ...sx
        }}
    />
);

export default LinkIcon;
