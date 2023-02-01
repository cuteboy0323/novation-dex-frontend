import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

// ** Hooks ** //
import useConfig from 'hooks/useConfig';
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Types ** //
import { ThemeOptions } from '@mui/material';

const Footer = () => {
    const { isDark } = useConfig();
    const isMobile = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

    return (
        <AppBar
            position="static"
            component="footer"
            color={isDark ? 'primary' : 'secondary'}
            sx={{
                marginLeft: 0,
                transition: '.5s',
                width: '100%',
                p: 0,
                pb: 3.5,
                paddingLeft: isMobile ? 2 : 'calc(78px + 36px + 42px)',
                paddingRight: isMobile ? 2 : '65px',
                boxShadow: 'none',
                bgcolor: 'transparent',
                backgroundImage: 'none'
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    height: '21px !important',
                    minHeight: '0px !important'
                }}
            >
                <Typography fontSize={14} color="textSecondary">
                    2022© Novation
                </Typography>
                <Link underline="none" href="https://twitter.com/vaultnovation" target="_blank">
                    <Typography fontSize={14} color="primary">
                        TWITTER
                    </Typography>
                </Link>
            </Toolbar>
        </AppBar>
    );
};

export default Footer;
