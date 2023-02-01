import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';

import NovationButton from 'components/Base/NovationButton';

import { useNavigate } from 'react-router-dom';

const ListHeader: React.FC<StackProps> = ({ ...rest }) => {
    const navigate = useNavigate();

    return (
        <Stack
            {...rest}
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            spacing={2.5}
            justifyContent="space-between"
            mb={{ xs: 2, sm: 5 }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                spacing={{ xs: 1, sm: 2.5 }}
            >
                <Typography fontSize={36} fontWeight={500} lineHeight="36px">
                    Launchpad List
                </Typography>
                <Typography fontSize={14} fontWeight={500} lineHeight="20px" color="textSecondary">
                    Discover tomorrow’s projects, today
                </Typography>
            </Stack>
            <NovationButton
                onClick={() => navigate('../create')}
                sx={{ width: { xs: '100%', sm: 'unset' }, height: 44, py: 0.5 }}
            >
                LAUNCH A TOKEN
            </NovationButton>
        </Stack>
    );
};

export default ListHeader;
