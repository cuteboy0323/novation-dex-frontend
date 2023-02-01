// ** Material UI Components ** //
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ** Hooks ** //
import useConfig from 'hooks/useConfig';

const SideBarExpand = () => {
    const { isOpenSideBar, onChangeSideBar } = useConfig();
    if (isOpenSideBar) {
        return (
            <Stack
                direction="row"
                spacing={2}
                onClick={onChangeSideBar}
                sx={{
                    mt: '64px',
                    mb: '68px',
                    marginLeft: 19 / 8,
                    justifySelf: 'center',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    color: '#00ACFD',
                    cursor: 'pointer',
                    display: { xs: 'none', sm: 'flex' }
                }}
            >
                <IconButton
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    sx={{ bgcolor: 'transparent !important' }}
                >
                    <Box
                        component="img"
                        src={require('assets/img/icons/expand.svg').default}
                        sx={{
                            transform: isOpenSideBar ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                        alt="Expand icon"
                    />
                </IconButton>
                <Typography textTransform="uppercase" fontSize={14} fontWeight={600}>
                    collapse
                </Typography>
            </Stack>
        );
    } else {
        return (
            <IconButton onClick={onChangeSideBar} sx={{ mt: '64px', mb: '68px', display: { xs: 'none', sm: 'flex' } }}>
                <Box component="img" src={require('assets/img/icons/expand.svg').default} alt="Expand icon" />
            </IconButton>
        );
    }
};

export default SideBarExpand;
