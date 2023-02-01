import { useState, useEffect } from 'react';

// ** MUI Components ** //
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ** Custom Components ** //
import { Skeleton } from '@mui/material';

const MapItemHeader: React.FC<any> = ({ title, logo, ...rest }) => {
    const [image, setImage] = useState<string>();

    const onError = () => {
        setImage(require('assets/img/logo.png'));
    };

    useEffect(() => {
        setImage(logo);
    }, [logo]);

    return (
        <Stack direction="row" alignItems="center" spacing={2} {...rest}>
            {logo ? (
                <Box width={44} height={44}>
                    <Box
                        component="img"
                        src={image}
                        alt="token-image"
                        onError={onError}
                        borderRadius={1}
                        width="100%"
                        height="100%"
                        sx={{
                            objectFit: 'cover'
                        }}
                    />
                </Box>
            ) : (
                <Skeleton variant="rounded" width={44} height={44} />
            )}
            <Typography fontSize={14} fontWeight={500} textTransform="uppercase">
                {title}
            </Typography>
        </Stack>
    );
};

export default MapItemHeader;
