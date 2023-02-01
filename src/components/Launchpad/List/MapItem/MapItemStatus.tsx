// ** Custom Components ** //
import { Skeleton } from '@mui/material';
import NovationChip from 'components/Base/NovationChip';

const MapItemStatus: React.FC<any> = ({ status }: any) => {
    switch (status) {
        case 'failed':
            return <NovationChip label="Ended" color="error.main" />;
        case 'live':
            return <NovationChip label="Live" color="success.main" />;
        case 'upcoming':
            return <NovationChip label="Upcoming" color="warning.main" />;
        case 'ended':
        case 'finalized':
        case 'claim':
            return <NovationChip label="Completed" color="info.main" />;
        case 'canceled':
            return <NovationChip label="Canceled" color="error.main" />;
        default:
            <NovationChip label={<Skeleton sx={{ minWidth: 80 }} />} />;
    }
};

export default MapItemStatus;
