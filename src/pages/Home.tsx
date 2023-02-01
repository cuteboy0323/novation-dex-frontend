import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';

import WalletButton from 'components/Header/WalletButton';
import NovationCircleButton from 'components/Base/NovationCircleButton';
import CryptoIcon from 'components/Items/CryptoIcon';
import LinkIcon from 'components/Items/LinkIcon';
import NovationDialogTitle from 'components/Base/NovationDialogTitle';

import { useNavigate } from 'react-router-dom';

import AppBg from 'components/AppBg';

const Menu = () => {
    const navigate = useNavigate();

    return (
        <Stack spacing={{ xs: 3, sm: 1.75 }} alignItems={{ xs: 'center', sm: 'flex-start' }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
                <Box
                    component="img"
                    src={require('assets/img/logo.png')}
                    alt="Home"
                    sx={{
                        height: 20,
                        width: 20
                    }}
                />
                <Typography
                    sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '24px',
                        textTransform: 'capitalize',
                        color: 'rgba(255, 255, 255, 0.5)'
                    }}
                >
                    Menu
                </Typography>
            </Stack>
            <Link
                underline="none"
                onClick={() => navigate('/swap')}
                color="inherit"
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                        color: 'primary.main'
                    }
                }}
            >
                <Typography
                    sx={{
                        fontSize: 16,
                        fontWeight: 400,
                        lineHeight: '21px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase'
                    }}
                >
                    Exchange
                </Typography>
            </Link>
            <Link
                underline="none"
                onClick={() => navigate('/launchpad')}
                color="inherit"
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                        color: 'primary.main'
                    }
                }}
            >
                <Typography
                    sx={{
                        fontSize: 16,
                        fontWeight: 400,
                        lineHeight: '21px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase'
                    }}
                >
                    launchpad
                </Typography>
            </Link>
            <Link
                underline="none"
                onClick={() => navigate('/rewards')}
                color="inherit"
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                        color: 'primary.main'
                    }
                }}
            >
                <Typography
                    sx={{
                        fontSize: 16,
                        fontWeight: 400,
                        lineHeight: '21px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase'
                    }}
                >
                    rewards
                </Typography>
            </Link>
        </Stack>
    );
};

const Home = () => {
    const [open, setOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    const onOpen = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    return (
        <Stack
            px={{ xs: 2.5, sm: 12 }}
            py={{ xs: 4, sm: 5.25 }}
            sx={{
                height: { xs: 'unset', sm: '100vh' }
            }}
            justifyContent="space-between"
        >
            <AppBg />
            <Box
                component="video"
                autoPlay
                loop
                muted
                playsInline
                src={require('assets/img/bg/app-video.mp4')}
                sx={{
                    width: '100%',
                    maxWidth: 700,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    zIndex: -1,
                    transform: 'translate(-50%, -50%)',
                    mixBlendMode: 'color-dodge'
                }}
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box
                    component="img"
                    src={require('assets/img/home-logo.png')}
                    alt="Home"
                    sx={{
                        height: 74
                    }}
                />
                <IconButton
                    onClick={onOpen}
                    sx={{
                        display: { xs: 'flex', sm: 'none' }
                    }}
                >
                    <Box
                        component="img"
                        src={require('assets/img/icons/menu.svg').default}
                        alt="Home"
                        sx={{
                            height: 32,
                            width: 32
                        }}
                    />
                </IconButton>
                <WalletButton
                    sx={{
                        display: { xs: 'none', sm: 'flex' }
                    }}
                />
                <Dialog
                    fullWidth
                    maxWidth="xs"
                    open={open}
                    onClose={onClose}
                    PaperProps={{
                        sx: {
                            bgcolor: '#020B0F',
                            backgroundImage: 'none',
                            border: '2px solid #00ACFD',
                            borderRadius: 2,
                            padding: 2.5
                        }
                    }}
                >
                    <NovationDialogTitle id="menu-modal" onClose={onClose}>
                        <Typography sx={{ visibility: 'hidden' }}>Menu Modal</Typography>
                    </NovationDialogTitle>
                    <Stack px={4} spacing={6} pb={4}>
                        <Menu />
                        <WalletButton />
                    </Stack>
                </Dialog>
            </Stack>
            <Grid container pt={{ xs: 20, sm: 0 }}>
                <Grid item xs={12} sm={8}>
                    <Stack spacing={{ xs: 2, sm: 3 }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                            sx={{
                                textShadow: '0px 0px 50px rgba(0, 172, 253, 0.5), 0px 0px 10px rgba(0, 172, 253, 0.8)'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 16,
                                    fontWeight: 400,
                                    lineHeight: '21px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase'
                                }}
                            >
                                launchpad
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 16,
                                    fontWeight: 400,
                                    lineHeight: '21px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: 'primary.main'
                                }}
                            >
                                &
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 16,
                                    fontWeight: 400,
                                    lineHeight: '21px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Exchange
                            </Typography>
                        </Stack>
                        <Typography
                            sx={{
                                fontSize: 50,
                                fontWeight: 400,
                                lineHeight: '118%',
                                textTransform: 'uppercase',
                                textShadow: '0px 0px 10px rgba(0, 172, 253, 0.8), 0px 0px 50px rgba(0, 172, 253, 0.5)'
                            }}
                        >
                            Welcome to the New Standard in DeFi Trading
                        </Typography>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.75}
                            pt={{ xs: 0, sm: 4 }}
                            pl={{ xs: 0, sm: 10 }}
                        >
                            <Box
                                sx={{
                                    width: 3,
                                    height: 44,
                                    boxShadow:
                                        '0px 0px 50px rgba(0, 172, 253, 0.5), 0px 0px 10px rgba(0, 172, 253, 0.8)',
                                    backgroundColor: '#00ACFD'
                                }}
                            />
                            <Stack
                                sx={{
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    lineHeight: '24px',
                                    textTransform: 'capitalize',
                                    color: 'rgba(255, 255, 255, 0.5)'
                                }}
                            >
                                <Typography>Imagination, Creation, Innovation</Typography>
                                <Typography>Powered By Vault Finance</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={4} display={{ xs: 'none', sm: 'block' }}>
                    <Stack
                        sx={{
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Menu />
                    </Stack>
                </Grid>
            </Grid>
            <Stack
                sx={{
                    pt: { xs: 10, sm: 0 },
                    display: { xs: 'flex', sm: 'grid' },
                    gap: { xs: 5, sm: 0 },
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gridTemplateColumns: '25% 25% 25% 25%'
                }}
            >
                <Box
                    component="img"
                    src={require('assets/img/items/arrow.png')}
                    alt="Arrow"
                    sx={{
                        height: 34
                    }}
                />
                <Link underline="none" onClick={() => navigate('/swap')} sx={{ cursor: 'pointer' }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.75}>
                        <NovationCircleButton>
                            <CryptoIcon />
                        </NovationCircleButton>
                        <Stack spacing={1.25}>
                            <Typography
                                sx={{
                                    textShadow:
                                        '0px 0px 50px rgba(0, 172, 253, 0.5), 0px 0px 10px rgba(0, 172, 253, 0.8)',
                                    color: 'primary.main',
                                    fontSize: 14,
                                    fontWeight: 400,
                                    lineHeight: '16px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Buy Vault Token
                            </Typography>
                            <Box
                                sx={{
                                    height: 2,
                                    backgroundColor: 'primary.main',
                                    boxShadow:
                                        '0px 0px 50px rgba(0, 172, 253, 0.5), 0px 0px 10px rgba(0, 172, 253, 0.8)'
                                }}
                            />
                        </Stack>
                    </Stack>
                </Link>
                <Link
                    underline="none"
                    href="https://github.com/VersatileFinance/Smart-Contract-Audits/blob/main/Vault%20Finance%20Token%20Smart%20Contract%20Security%20Audit.pdf"
                    target="_blank"
                    sx={{
                        width: { xs: '100%', sm: 'unset' }
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.75}>
                        <NovationCircleButton>
                            <Box
                                component="img"
                                src={require('assets/img/items/audit-logo.png')}
                                alt="Audit"
                                sx={{
                                    height: 28,
                                    width: 28
                                }}
                            />
                        </NovationCircleButton>
                        <Stack spacing={1.25}>
                            <Typography
                                sx={{
                                    textShadow:
                                        '0px 0px 50px rgba(0, 172, 253, 0.5), 0px 0px 10px rgba(0, 172, 253, 0.8)',
                                    color: 'primary.main',
                                    fontSize: 14,
                                    fontWeight: 400,
                                    lineHeight: '16px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Smart Contract Audits
                            </Typography>
                            <Box
                                sx={{
                                    height: 2,
                                    backgroundColor: 'primary.main',
                                    boxShadow:
                                        '0px 0px 50px rgba(0, 172, 253, 0.5), 0px 0px 10px rgba(0, 172, 253, 0.8)'
                                }}
                            />
                        </Stack>
                    </Stack>
                </Link>
                <Link
                    underline="none"
                    href="https://www.thevaultfinance.com/"
                    target="_blank"
                    sx={{
                        width: { xs: '100%', sm: 'unset' }
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1.75}>
                        <NovationCircleButton>
                            <LinkIcon />
                        </NovationCircleButton>
                        <Stack spacing={1.25}>
                            <Typography
                                sx={{
                                    textShadow:
                                        '0px 0px 50px rgba(0, 172, 253, 0.5), 0px 0px 10px rgba(0, 172, 253, 0.8)',
                                    color: 'primary.main',
                                    fontSize: 14,
                                    fontWeight: 400,
                                    lineHeight: '16px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Vault Finance
                            </Typography>
                            <Box
                                sx={{
                                    height: 2,
                                    backgroundColor: 'primary.main',
                                    boxShadow:
                                        '0px 0px 50px rgba(0, 172, 253, 0.5), 0px 0px 10px rgba(0, 172, 253, 0.8)'
                                }}
                            />
                        </Stack>
                    </Stack>
                </Link>
            </Stack>
        </Stack>
    );
};

export default Home;
