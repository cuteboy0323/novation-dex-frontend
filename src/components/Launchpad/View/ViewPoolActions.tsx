import Grid, { GridProps } from '@mui/material/Grid';
import ViewActionsWrapper from './ViewActions/ViewActionsWrapper';
import ViewPoolAction from './ViewActions/ViewPoolAction';
import ViewPoolDetail from './ViewActions/ViewPoolDetail';
import ViewPoolHeader from './ViewActions/ViewPoolHeader';

const ViewPoolActions: React.FC<GridProps> = () => {
    return (
        <Grid item xs={12} sm={5}>
            <ViewActionsWrapper>
                <ViewPoolHeader />
                <ViewPoolAction />
                <ViewPoolDetail />
            </ViewActionsWrapper>
        </Grid>
    );
};

export default ViewPoolActions;
