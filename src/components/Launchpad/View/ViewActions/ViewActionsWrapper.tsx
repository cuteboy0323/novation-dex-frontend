import Stack, { StackProps } from '@mui/material/Stack';

const ViewActionsWrapper: React.FC<StackProps> = ({ children }) => {
    return (
        <Stack
            sx={{
                display: 'flex',
                flexDirection: 'column'
            }}
            spacing={3.75}
        >
            {children}
        </Stack>
    );
};

export default ViewActionsWrapper;
