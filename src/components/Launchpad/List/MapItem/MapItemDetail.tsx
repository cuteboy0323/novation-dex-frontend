import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ** Custom Icon ** //
import SpaceIcon from 'components/Items/SpaceIcon';

const MapItemDetail: React.FC<any> = ({ title, value }) => {
    return (
        <Stack direction="row" alignItems="center">
            <Typography
                fontSize={14}
                lineHeight="14px"
                fontWeight={500}
                color="textSecondary"
                textTransform="capitalize"
            >
                {title}
            </Typography>
            <SpaceIcon sx={{ alignSelf: 'center' }} />
            <Typography fontSize={14} lineHeight="14px" textTransform="uppercase">
                {value}
            </Typography>
        </Stack>
    );
};

export default MapItemDetail;
