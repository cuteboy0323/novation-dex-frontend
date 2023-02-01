// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// ** Custom Components ** //
import Settings from './Settings';

const SwapHeader = (props: any) => {
    const { onClick, onClose, anchorEl } = props;
    return (
        <>
            <Stack>
                <Typography fontSize={36} fontWeight={500} lineHeight="36px">
                    Trade
                </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontSize={16} lineHeight="21px" fontWeight={500} color="#ffffff">
                    Swap Tokens In An Instant
                </Typography>
                <IconButton onClick={onClick}>
                    <Box component="img" src={require('assets/img/icons/setting.svg').default} alt="Settings" />
                </IconButton>
                <Settings anchorEl={anchorEl} onClose={onClose} />
            </Stack>
        </>
    );
};

export default SwapHeader;
