import Header from 'components/Header';
import Footer from 'components/Footer';
import SideBar from 'components/SideBar';

import Wrapper from './Wrapper';

import Stack from '@mui/material/Stack';

const MainLayout = () => (
    <Stack pb={{ xs: 10, sm: 0 }}>
        <Header />
        <SideBar />
        <Wrapper />
        <Footer />
    </Stack>
);

export default MainLayout;
