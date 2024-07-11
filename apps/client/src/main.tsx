import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { BrowserRouter as Router } from 'react-router-dom';
import IndexRouter from './routes';

import { Provider as ReduxProvider } from 'react-redux';
import store from './store';
import { Toaster } from './components/ui/sonner';

import { ThemeProvider } from './providers/ThemeProvider';
import AuthProvider from './providers/AuthProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="room-ezy-ui-theme">
        <Router>
          <AuthProvider>
            <IndexRouter />
          </AuthProvider>
        </Router>
        <Toaster />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>
);
