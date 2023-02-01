import Box, { BoxProps } from '@mui/material/Box';

const ListWrapper: React.FC<BoxProps> = ({ children }) => {
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

export default ListWrapper;
