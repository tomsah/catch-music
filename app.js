let ReactDOM = require('react-dom');
let React = require('react');

// Get components
let Loaded = require('./components/loaded.jsx');

// Super contrived
ReactDOM.render(
  <Loaded />,
  document.querySelector('[data-react-root]')
);
