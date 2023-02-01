// ** Material UI Components ** //
import Stack from '@mui/material/Stack';

// ** Hooks ** //
import useConfig from 'hooks/useConfig';
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Types ** //
import { ThemeOptions } from '@mui/material';

const SideBarWrapper = ({ children, ...rest }: any) => {
    const { isOpenSideBar } = useConfig();

    const isMobile = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

    return (
        <Stack
            {...rest}
            sx={{
                position: 'fixed',
                overflow: 'hidden',
                transition: '.125s',
                top: isMobile ? 'unset' : 28,
                bottom: isMobile ? 0 : 28,
                left: isMobile ? 0 : 36,
                width: isMobile ? '100%' : isOpenSideBar ? 258 : 78,
                height: isMobile ? 81 : 'unset',
                bgcolor: 'rgba(0, 172, 253, 0.05)',
                boxShadow:
                    'inset 0px -20px 20px -49.2654px rgba(0, 172, 253, 0.15), inset 0px 20px 50px -36.9491px rgba(0, 172, 253, 0.25)',
                backdropFilter: 'blur(10px)',
                borderRadius: isMobile ? 0 : 1,
                justifyContent: isMobile ? 'center' : 'flex-start',
                zIndex: (theme) => theme.zIndex.appBar,
                '&:before': {
                    content: "' '",
                    display: isMobile ? 'block' : 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: 2,
                    borderRadius: 0,
                    border: '1px solid #00ACFD',
                    filter: 'drop-shadow(0px 0px 50px rgba(0, 172, 253, 0.5)) drop-shadow(0px 0px 10px rgba(0, 172, 253, 0.8))'
                }
            }}
        >
            {children}
        </Stack>
    );
};

export default SideBarWrapper;
