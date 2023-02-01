import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ComingSoon = () => {
    return (
        <Box
            sx={{
                height: 'calc(100vh - 108px - 21px - 28px - 120px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Typography fontSize={40}>Coming Soon</Typography>
        </Box>
    );
};

export default ComingSoon;
