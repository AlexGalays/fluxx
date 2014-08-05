/** @jsx React.DOM */

var React       = require('react');
var MagicButton = require('./MagicButton');


var App = React.createClass({

  render: function() {
    return (
      <div>
        <MagicButton />

        <div className="blue">
          {this.props.blueNumber}
        </div>

        <div className="green">
          {this.props.greenNumber} (Change faster)
        </div>

        <div className="red">
          {this.props.redNumber} (Only increment)
        </div>
      </div>
    );
  }

});


module.exports = App;