// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// ** Hooks ** //
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Types ** //
import { ThemeOptions } from '@mui/material';

const Logo = () => {
    const isMobile = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{
                width: 56,
                position: 'relative',
                display: isMobile ? 'flex' : 'none'
            }}
        >
            <Box
                component="img"
                src={require('assets/img/logo.png')}
                alt="logo"
                sx={{
                    width: 56
                }}
            />
            <Box
                component="img"
                src={require('assets/img/items/union.png')}
                alt="logo union"
                sx={{
                    width: 56,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            />
        </Stack>
    );
};

export default Logo;
