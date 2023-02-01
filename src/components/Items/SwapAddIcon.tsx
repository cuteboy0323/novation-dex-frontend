import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack, { StackProps } from '@mui/material/Stack';

const SwapAddIcon: React.FC<StackProps> = ({ ...rest }) => (
    <Stack {...rest} direction="row" justifyContent="center" alignItems="center" py={0.5}>
        <IconButton
            disableRipple
            disableFocusRipple
            disableTouchRipple
            sx={{
                bgcolor: 'transparent !important'
            }}
        >
            <Box
                component="img"
                src={require('assets/img/icons/swap-add.svg').default}
                alt="Swap White"
                sx={{
                    width: 20,
                    height: 20
                }}
            />
        </IconButton>
    </Stack>
);

export default SwapAddIcon;
