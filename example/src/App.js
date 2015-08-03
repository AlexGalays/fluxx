
import React from 'react';
import MagicButton from './MagicButton';


export default React.createClass({

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