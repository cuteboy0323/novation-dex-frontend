import { Box, BoxProps } from '@mui/material';

const SpaceIcon: React.FC<BoxProps> = ({ sx, ...rest }) => (
    <Box
        {...rest}
        sx={{
            flexGrow: 1,
            height: 6,
            px: 1,
            mb: '2.5px !important',
            alignSelf: 'flex-end',
            backgroundClip: 'content-box',
            backgroundSize: '6px 6px',
            backgroundImage: `url("${require('assets/img/icons/space-icon.svg').default}")`,
            ...sx
        }}
    />
);

export default SpaceIcon;
