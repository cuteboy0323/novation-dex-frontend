import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

// ** Custom Icon ** //
import MapItemHeader from 'components/Launchpad/List/MapItem/MapItemHeader';
import MapItemUrls from 'components/Launchpad/List/MapItem/MapItemUrls';

import usePool from 'hooks/usePool';

const ViewPoolHeader: React.FC<any> = () => {
    const { activePool } = usePool();

    return (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent component={Stack} spacing={3.5}>
                <MapItemHeader logo={activePool?.urls?.logo} title={activePool.name} />
                {activePool?.urls?.description ? (
                    <Typography
                        fontSize={14}
                        lineHeight="21px"
                        fontWeight={400}
                        color="textSecondary"
                        sx={{ minHeight: 44 }}
                    >
                        {activePool?.urls?.description}
                    </Typography>
                ) : (
                    <Skeleton variant="rounded" animation="wave" width="100%" sx={{ minHeight: 44 }} />
                )}
                <MapItemUrls urls={activePool?.urls} />
            </CardContent>
        </Card>
    );
};

export default ViewPoolHeader;
