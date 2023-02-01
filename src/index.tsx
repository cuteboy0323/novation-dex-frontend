import App from './App';

import {
    Root,
    MuiThemeProvider,
    ConfigProvider,
    ToastsProvider,
    ModalProvider,
    Web3ReactProvider,
    APIProvider
} from './providers';

Root.render(
    <Web3ReactProvider>
        <ConfigProvider>
            <MuiThemeProvider>
                <APIProvider>
                    <ToastsProvider>
                        <ModalProvider>
                            <App />
                        </ModalProvider>
                    </ToastsProvider>
                </APIProvider>
            </MuiThemeProvider>
        </ConfigProvider>
    </Web3ReactProvider>
);
