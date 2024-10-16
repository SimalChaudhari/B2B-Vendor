import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import { CONFIG } from './config-global';
import { Provider } from 'react-redux';
import store from './store';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={CONFIG.site.basePath}>
      <Provider store={store}>
        <Suspense>
          <App />
        </Suspense>
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
