import Grid, { GridProps } from '@mui/material/Grid';

const ViewContentWrapper: React.FC<GridProps> = ({ children }) => {
    return (
        <Grid container spacing={4}>
            {children}
        </Grid>
    );
};

export default ViewContentWrapper;
