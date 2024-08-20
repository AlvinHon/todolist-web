import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider } from 'notistack';
import { StompSessionProvider } from 'react-stomp-hooks';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  // <React.StrictMode>
  <StompSessionProvider url={"ws://" + (process.env.BACKEND_URL ?? "localhost:8080") + "/backend-ws"}>
    <SnackbarProvider maxSnack={5}>
      <App />
    </SnackbarProvider>
  </StompSessionProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
