import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';

import { useNavigate } from 'react-router-dom';

const ViewHeader: React.FC<StackProps> = ({ ...rest }) => {
    const navigate = useNavigate();

    return (
        <Stack
            {...rest}
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            spacing={{ xs: 1, sm: 2.5 }}
            justifyContent="space-between"
            mb={5}
        >
            <Typography fontSize={36} fontWeight={500} lineHeight="36px">
                Launchpad Pool
            </Typography>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1.25}
                onClick={() => navigate('../list')}
                sx={{
                    cursor: 'pointer'
                }}
            >
                <Box
                    component="img"
                    src={require('assets/img/icons/arrow-left.svg').default}
                    sx={{
                        width: 24,
                        height: 24,
                        filter: 'drop-shadow(0px 0px 50px rgba(0, 172, 253, 0.5)) drop-shadow(0px 0px 10px rgba(0, 172, 253, 0.8))'
                    }}
                />
                <Typography fontSize={16} lineHeight="16px" fontWeight={500} color="primary">
                    Back to the Pool List
                </Typography>
            </Stack>
        </Stack>
    );
};

export default ViewHeader;
