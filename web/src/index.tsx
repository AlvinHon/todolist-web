import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SnackbarProvider } from 'notistack';
import { AccountProvider } from './context/AccountContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <AccountProvider >
    <SnackbarProvider maxSnack={5}>
      <App />
    </SnackbarProvider>
  </AccountProvider>
);