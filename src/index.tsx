import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './firebase/firebase.config'
import './assests/style/style.scss'

const container = document.getElementById('root')!;
const root = createRoot(container as HTMLElement);
 
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
