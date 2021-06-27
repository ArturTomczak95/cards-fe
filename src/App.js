import './App.css';

import {Navigation} from './Navigation';
import {Cards} from './Cards';
import {BrowserRouter, Route, Switch} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Navigation/>
      <Switch>
        <Route path="/" component={Cards} exact/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
