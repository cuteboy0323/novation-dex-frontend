// ** Material UI Components ** //
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabBottomLine from 'components/Items/TabBottomLine';

const ListTabs = (props: any) => {
    const { value, onChange } = props;

    return (
        <Stack
            alignSelf="flex-start"
            sx={{
                width: { xs: '100%', sm: 'unset' },
                '& .MuiTab-root': {
                    minWidth: { xs: 40, sm: 125 }
                }
            }}
        >
            <Tabs value={value} onChange={onChange} indicatorColor="primary" textColor="primary" variant="standard">
                <Tab value="all" label="All" />
                <Tab value="live" label="Live" />
                <Tab value="upcoming" label="Upcoming" />
                <Tab value="ended" label="Ended" />
            </Tabs>
            <TabBottomLine />
        </Stack>
    );
};

export default ListTabs;
