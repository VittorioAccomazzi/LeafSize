import './App.css';
import AppRouter from './AppRouter';
import AppMain from './AppMain';
import SwNotification from './common/components/SwNotification';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AppMain>
            <AppRouter/>
        </AppMain>
      </header>
      <SwNotification/>
    </div>
  );
}

export default App;
