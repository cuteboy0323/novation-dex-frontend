import { useCallback } from 'react';

import Box from '@mui/material/Box';

import Particles from 'react-particles';
import { loadFull } from 'tsparticles';

import particlesConfig from 'config/constants/particles/app-bg.json';

const AppBg = () => {
    const particlesInit = useCallback(async (engine: any) => {
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: any) => {
        await container;
    }, []);

    return (
        <Box className="app-background">
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={particlesConfig as any}
            />
            <Box className="green-circle" />
        </Box>
    );
};

export default AppBg;
