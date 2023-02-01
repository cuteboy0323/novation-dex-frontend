// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// ** Hooks ** //
import useConfig from 'hooks/useConfig';

const NovationLogo = () => {
    const { isOpenSideBar } = useConfig();

    return isOpenSideBar ? (
        <Stack
            justifyContent="flex-start"
            alignItems="center"
            sx={{
                top: 45,
                width: 242,
                height: 92,
                left: 8,
                position: 'relative',
                display: { xs: 'none', sm: 'flex' }
            }}
        >
            <Box
                component="img"
                src={require('assets/img/logo-wide.png')}
                alt="logo"
                sx={{
                    width: 242,
                    height: 74
                }}
            />
            <Box
                component="img"
                src={require('assets/img/items/union.png')}
                alt="logo union"
                sx={{
                    width: 56,
                    position: 'absolute',
                    top: 32,
                    left: 30,
                    transform: 'translate(-50%, -50%)'
                }}
            />
        </Stack>
    ) : (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{
                top: 32,
                width: 92,
                height: 92,
                marginLeft: '-5px',
                marginRight: '-9px',
                position: 'relative',
                display: { xs: 'none', sm: 'flex' }
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

export default NovationLogo;
