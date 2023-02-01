// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// ** Custom Components ** //
import NovationButton from 'components/Base/NovationButton';

const ExtraButons = () => (
    <Stack
        sx={{
            position: { xs: 'relative', sm: 'absolute' },
            right: { xs: 0, sm: 65 },
            top: { xs: 0, sm: 29 },
            px: { xs: 4, sm: 0 },
            mt: { xs: -4.5, sm: 0 }
        }}
        direction={{ xs: 'row', sm: 'column' }}
        spacing={2.5}
        alignItems="flex-end"
        justifyContent="space-between"
    >
        <NovationButton sx={{ py: 1.5, px: 2.25, fontSize: 14, width: 'unset' }}>BUY VAULT TOKEN</NovationButton>
        <Link href="https://www.thevaultfinance.com/" underline="none" target="_blank">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0, sm: 1 }}>
                <Box
                    component="img"
                    src={require('assets/img/icons/link.svg').default}
                    alt="Link"
                    sx={{ width: 24, height: 24 }}
                />
                <Typography color="primary">Vault Finance</Typography>
            </Stack>
        </Link>
    </Stack>
);

export default ExtraButons;
