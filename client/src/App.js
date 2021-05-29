import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import Login from './Login';
import Dashboard from './Dashboard';

//access the auth token code from url
const code = new URLSearchParams(window.location.search).get("code")

function App() {
  return code ? <Dashboard code={code}/> : <Login/>
  
  
}

export default App;
