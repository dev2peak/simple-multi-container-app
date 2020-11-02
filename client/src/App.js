import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Navigator from './Navigator';
import Fibonacci from './Fibonacci';

function App() {
  return (

    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">My Fibonacci Calculator</h1>
          <Link to="/">Home</Link>
          <Link to="/navigator">Navigator</Link>
        </header>
        <div>
          <Route exact path="/" component={Fibonacci} />
          <Route exact path="/navigator" component={Navigator} /> 
        </div>
      </div>
    </Router>
  );
}

export default App;
