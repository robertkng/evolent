import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router';
import App from './components/App/App.jsx';
import Add from './components/App/Add/Add.jsx';
import List from './components/App/List/List.jsx';
import Home from './components/App/Home/Home.jsx';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App} >
      <IndexRoute component={List} />
        <Route path="/add" component={Add} />
        <Route path="/home" component={Home} />
    </Route>
  </Router>
), document.querySelector('#root-container'));
