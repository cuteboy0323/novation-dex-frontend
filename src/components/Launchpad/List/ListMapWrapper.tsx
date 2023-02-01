import Grid from '@mui/material/Grid';
import Stack, { StackProps } from '@mui/material/Stack';

const ListMapWrapper: React.FC<StackProps> = ({ children, ...rest }) => {
    return (
        <Stack pt={3} {...rest}>
            <Grid container spacing={3.75}>
                {children}
            </Grid>
        </Stack>
    );
};

export default ListMapWrapper;
