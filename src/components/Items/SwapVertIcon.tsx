import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack, { StackProps } from '@mui/material/Stack';

const SwapVertIcon: React.FC<StackProps> = ({ onClick, ...rest }: any) => (
    <Stack {...rest} direction="row" justifyContent="center" alignItems="center" py={0.5}>
        <IconButton onClick={onClick}>
            <Box
                component="img"
                src={require('assets/img/icons/swap-white.svg').default}
                alt="Swap White"
                sx={{
                    width: 20,
                    height: 20
                }}
            />
        </IconButton>
    </Stack>
);

export default SwapVertIcon;
