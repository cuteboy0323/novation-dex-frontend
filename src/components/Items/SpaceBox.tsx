import { Box, BoxProps } from '@mui/material';

const SpaceBox: React.FC<BoxProps> = ({ ...rest }) => (
    <Box
        {...rest}
        sx={{
            flexGrow: 1
        }}
    />
);

export default SpaceBox;
