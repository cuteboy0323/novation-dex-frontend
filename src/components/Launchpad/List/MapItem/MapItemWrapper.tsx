import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack, { StackProps } from '@mui/material/Stack';

const MapItemWrapper: React.FC<StackProps> = ({ children }) => {
    return (
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
            <Card variant="outlined">
                <CardContent component={Stack} spacing={3}>
                    {children}
                </CardContent>
            </Card>
        </Grid>
    );
};

export default MapItemWrapper;
