import GlobalHooks from 'components/GlobalHooks';

import { ToastListener } from 'contexts/ToastsContext';
import { PoolProvider } from 'providers';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';

function App() {
    return (
        <BrowserRouter basename="">
            <PoolProvider>
                <GlobalHooks />
                <Routes />
                <ToastListener />
            </PoolProvider>
        </BrowserRouter>
    );
}

export default App;
