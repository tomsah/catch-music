let React = require('react');
let Layout = require('../layouts/default');

class RouteIndex extends React.Component {
  render() {
    return (
      <Layout head={this.props.head}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              <h1>Catch Music</h1>
              <hr />
              <div data-react-root></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

module.exports = RouteIndex;
