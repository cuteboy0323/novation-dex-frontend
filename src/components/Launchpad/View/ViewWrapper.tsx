import Box, { BoxProps } from '@mui/material/Box';

const ViewWrapper: React.FC<BoxProps> = ({ children }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {children}
        </Box>
    );
};

export default ViewWrapper;
