import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const NovationChip: React.FC<any> = ({ color, label }) => {
    return (
        <Box
            sx={{
                bgcolor: 'rgba(0, 172, 253, 0.1)',
                padding: '8px 24px',
                borderRadius: 1
            }}
        >
            <Typography
                fontSize={14}
                lineHeight="14px"
                fontWeight={600}
                textTransform="uppercase"
                sx={{
                    color: color
                }}
            >
                {label}
            </Typography>
        </Box>
    );
};

export default NovationChip;
