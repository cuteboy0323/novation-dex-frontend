import { Box, BoxProps } from '@mui/material';

const TabBottomLine: React.FC<BoxProps> = ({ ...rest }) => (
    <Box
        {...rest}
        sx={{
            height: 2,
            width: '100%',
            marginTop: -0.25,
            background: '#00ACFD33'
        }}
    />
);

export default TabBottomLine;
