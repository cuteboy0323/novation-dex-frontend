// ** Material UI Components ** //
import Stack from '@mui/material/Stack';

// ** Custom Components ** //
import NovationTabs from './NovationTabs';
import NovationLogo from './NovationLogo';
import SideBarWrapper from './SideBarWrapper';
import SideBarExpand from './SideBarExpand';

const Sidebar = () => {
    return (
        <SideBarWrapper>
            <NovationLogo />
            <Stack alignItems="center">
                <SideBarExpand />
                <NovationTabs />
            </Stack>
        </SideBarWrapper>
    );
};

export default Sidebar;
