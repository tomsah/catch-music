let React = require('react');

class ComponentLoaded extends React.Component {
  constructor() {
    // When you define an explicit constructor always call super
    // to retain access to inherited methods/properties
    super();

    // Initial state
    this.state = {
      seconds: 0
    };
  }

  // When the component fires up, this method is called
  componentDidMount() {
    // Arrow functions don't kill scope
    setInterval(() => {
      this.state.seconds ++;
      this.setState(this.state);
    }, 1000);
  }

  // Our component markup goes here
  // Looks a lot like twig
  render() {
    return (
      <div>
        <p>Loaded {this.state.seconds} second{this.state.seconds == 1 ? '' : 's'} ago</p>
        {this.props.children}
      </div>
    );
  }
}

module.exports = ComponentLoaded;
