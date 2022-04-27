import './App.css';
import AppRouter from './AppRouter';
import AppMain from './AppMain'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AppMain>
            <AppRouter/>
        </AppMain>
      </header>
    </div>
  );
}

export default App;
