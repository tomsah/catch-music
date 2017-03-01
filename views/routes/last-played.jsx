let React = require('react');
let Layout = require('../layouts/default');

class RouteIndex extends React.Component {
  render() {
    return (
      <Layout head={this.props.head}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              <h1>{this.props.song.title} by {this.props.song.artist}</h1>
              <img src={this.props.song.albumArtURL} alt={this.props.song.title} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

module.exports = RouteIndex;
