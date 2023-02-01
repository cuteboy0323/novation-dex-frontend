// ** Material UI Components ** //
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

// ** Hooks ** //
import useMediaQuery from '@mui/material/useMediaQuery';
import useScrollTrigger from '@mui/material/useScrollTrigger';

// ** Types ** //
import { ThemeOptions } from '@mui/material';

const Wrapper = ({ children, ...rest }: any) => {
    const trigger = useScrollTrigger({ disableHysteresis: true });
    const isMobile = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));
    return (
        <AppBar
            {...rest}
            position={trigger ? 'static' : 'static'}
            sx={{
                bgcolor: 'transparent',
                backgroundImage: 'none',
                marginLeft: 0,
                transition: '.5s',
                width: '100%',
                padding: 0
            }}
        >
            <Toolbar
                sx={{
                    gap: 2.5,
                    padding: isMobile ? '28px 16px 28px 16px !important' : '28px 65px 28px 156px !important'
                }}
            >
                {children}
            </Toolbar>
            <Box
                sx={{
                    height: { xs: 2, sm: 4 },
                    bgcolor: '#00ACFD',
                    boxShadow:
                        '0px 0px 18.9113px rgba(168, 252, 255, 0.7), 0px 0px 73.2115px rgba(168, 252, 255, 0.5), inset 0px 0px 7.32115px rgba(168, 252, 255, 0.5)'
                }}
            />
        </AppBar>
    );
};

export default Wrapper;
