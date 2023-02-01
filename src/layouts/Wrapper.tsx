import Box from '@mui/material/Box';
import AppBg from 'components/AppBg';

// ** Hooks ** //
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Types ** //
import { ThemeOptions } from '@mui/material';

import { Outlet } from 'react-router-dom';

const Wrapper = () => {
    const isMobile = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 108px - 21px - 28px)',
                padding: (theme) => theme.spacing(7.5, 0),
                paddingLeft: isMobile ? 2 : 'calc(78px + 36px + 42px)',
                paddingRight: isMobile ? 2 : 65 / 8,
                overflowX: 'hidden',
                position: 'relative'
            }}
        >
            <Outlet />
            <AppBg />
        </Box>
    );
};

export default Wrapper;
