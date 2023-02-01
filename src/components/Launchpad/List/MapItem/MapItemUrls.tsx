import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

// ** Custom Components ** //
import NovationChip from 'components/Base/NovationChip';

const MapItemUrls: React.FC<any> = ({ urls, ...rest }) => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" {...rest}>
            <Stack direction="row" alignItems="center" spacing={1.25}>
                {urls ? (
                    <>
                        <Link href={urls.kyc} target="_blank" underline="none" sx={{ lineHeight: 0 }}>
                            <NovationChip label="KYC" color={urls.kyc ? '#fff' : 'primary.main'} />
                        </Link>
                        <Link href={urls.audit} target="_blank" underline="none" sx={{ lineHeight: 0 }}>
                            <NovationChip label="Audit" color={urls.audit ? '#fff' : 'primary.main'} />
                        </Link>
                    </>
                ) : (
                    <Skeleton animation="wave" sx={{ minWidth: 60, height: 30 }} />
                )}
            </Stack>
            <Stack direction="row" spacing={1.5}>
                {urls ? (
                    <>
                        <Link href={urls.website} target="_blank" underline="none" sx={{ lineHeight: 0 }}>
                            <Box
                                component="img"
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 50,
                                    filter: urls.website
                                        ? 'invert(100%) sepia(100%) saturate(0%) hue-rotate(61deg) brightness(250%) contrast(100%)'
                                        : 'none'
                                }}
                                src={require('assets/img/items/website.png')}
                            />
                        </Link>
                        <Link href={urls.discord} target="_blank" underline="none" sx={{ lineHeight: 0 }}>
                            <Box
                                component="img"
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 50,
                                    filter: urls.discord
                                        ? 'invert(100%) sepia(100%) saturate(0%) hue-rotate(61deg) brightness(250%) contrast(100%)'
                                        : 'none'
                                }}
                                src={require('assets/img/items/discord.png')}
                            />
                        </Link>
                        <Link href={urls.telegram} target="_blank" underline="none" sx={{ lineHeight: 0 }}>
                            <Box
                                component="img"
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 50,
                                    filter: urls.telegram
                                        ? 'invert(100%) sepia(100%) saturate(0%) hue-rotate(61deg) brightness(250%) contrast(100%)'
                                        : 'none'
                                }}
                                src={require('assets/img/items/telegram.png')}
                            />
                        </Link>
                    </>
                ) : (
                    <Skeleton animation="wave" sx={{ minWidth: 60, height: 30 }} />
                )}
            </Stack>
        </Stack>
    );
};

export default MapItemUrls;
