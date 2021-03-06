import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import gitInfo from './tools/gitInfo.json';
import { GAUID } from './app/const';
import GA from './common/utils/GA'
import { onUpdate, onSuccess } from './common/components/SwNotification';


const main = async ()=>{
  await GA.Initialize(gitInfo.long, GAUID);
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

//start the app
main();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register( {onSuccess, onUpdate});
