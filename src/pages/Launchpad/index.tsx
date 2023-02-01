// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import NovationButton from 'components/Base/NovationButton';

import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <Container
            sx={{
                maxWidth: '540px !important',
                padding: { xs: '0px 16px !important', sm: '0px !important' },
                width: { xs: 'unset', sm: '100%' },
                marginLeft: { xs: -6, sm: 'auto' },
                marginRight: { xs: -6, sm: 'auto' }
            }}
        >
            <Card
                variant="outlined"
                sx={{
                    overflow: 'visible',
                    position: 'relative',
                    borderRadius: 2,
                    boxShadow: {
                        xs: 'none',
                        sm: 'inset 0px 0px 7.32115px rgb(168 252 255 / 50%), inset 0px -20px 20px -49.2654px rgb(0 172 253 / 15%), inset 0px 20px 50px -36.9491px rgb(0 172 253 / 25%)'
                    },
                    backgroundColor: { xs: 'transparent', sm: 'rgba(0, 172, 253, 0.05)' },
                    backdropFilter: { xs: 'none', sm: 'blur(5px)' },
                    borderWidth: { xs: 0, sm: 2 },
                    pt: 3
                }}
            >
                <Box
                    component="img"
                    src={require('assets/img/items/line02.png')}
                    alt="line01"
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        width: 'calc(100% - 32px)',
                        position: 'absolute',
                        top: -16,
                        right: 16,
                        left: 16
                    }}
                />
                <CardContent
                    component={Stack}
                    sx={{ pt: '40px !important', px: '32px !important', pb: { sm: '60px !important' } }}
                    spacing={3}
                >
                    <Typography fontSize={{ xs: 32, sm: 36 }} fontWeight={500} lineHeight="36px">
                        Welcome to the
                        <Box component="br" sx={{ display: { xs: 'block', sm: 'none' } }} />
                        Novation Launchpad
                    </Typography>
                    <Typography
                        color="textSecondary"
                        fontSize={{ xs: 16, sm: 14 }}
                        sx={{ mb: { xs: '216px !important', sm: 'inherit !important' } }}
                    >
                        A creation of Vault Finance, this is the premier DeFi platform to both create your own token and
                        to discover exciting new projects
                    </Typography>
                    <Link to="create" style={{ textDecoration: 'none' }}>
                        <NovationButton>Launch A Token</NovationButton>
                    </Link>
                    <Link to="list" style={{ textDecoration: 'none' }}>
                        <NovationButton variant="outlined">Launchpad List</NovationButton>
                    </Link>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Welcome;
