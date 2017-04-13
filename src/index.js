import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router';
// import App from './components/App/App.jsx';
import Add from './components/App/Add/Add.jsx';
import List from './components/App/List/List.jsx';
import Home from './components/App/Home/Home.jsx';
import './index.css';

const App = props => (
  <div className="container">
    <header>
      <div className="wrapper">
        <img src={require('./evolent.png')} className="logo" />
        <Link to="/home" className="navbar-button">Home</Link>
        <Link to="/" className="navbar-button">List Contacts</Link>
        <Link to="/add" className="navbar-button">Add Contacts</Link>
      </div>
    </header>

    {props.children}
  </div>
  );

App.propTypes = {
  children: React.PropTypes.node,
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={App} >
      <IndexRoute component={Home} />
        <Route path="/add" component={Add} />
        <Route path="/list" component={List} />
    </Route>
  </Router>
), document.querySelector('#root-container'));

