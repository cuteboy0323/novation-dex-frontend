import Box from '@mui/material/Box';
import Stack, { StackProps } from '@mui/material/Stack';

const CircleButton: React.FC<StackProps> = ({ children, sx, ...rest }) => (
    <Stack
        {...rest}
        alignItems="center"
        justifyContent="center"
        sx={{
            position: 'relative',
            height: 60,
            width: 60,
            ...sx
        }}
    >
        <Box
            sx={{
                borderRadius: '50%',
                border: '1px solid #00ACFD',
                filter: 'blur(1px)',
                position: 'absolute',
                top: 0,
                left: 0,
                width: 60,
                height: 60
            }}
        />
        <Box
            sx={{
                borderRadius: '50%',
                border: '2px solid #EAF8FF',
                boxShadow: 'inset 0px 0px 7.32115px rgba(168, 252, 255, 0.5)',
                filter: 'blur(0.5px) drop-shadow(0px 0px 10px rgba(168, 252, 255, 0.5)) drop-shadow(0px 0px 25px rgba(168, 252, 255, 0.5))',
                position: 'absolute',
                top: 8,
                left: 8,
                width: 44,
                height: 44
            }}
        />
        {children}
    </Stack>
);

export default CircleButton;
