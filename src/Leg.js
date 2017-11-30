import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import FaTrashO from 'react-icons/lib/fa/trash-o';

class Leg extends Component {
  onSpeedChange = ({floatValue}) => {
    this.props.onChange({
      id: this.props.id,
      speed: floatValue || 0,
      distance: this.props.distance,
      elevation: this.props.elevation,
    });
  }

  onDistanceChange = ({floatValue}) => {
    this.props.onChange({
      id: this.props.id,
      speed: this.props.speed,
      distance: floatValue || 0,
      elevation: this.props.elevation,
    });
  }

  onElevationChange = ({floatValue}) => {
    this.props.onChange({
      id: this.props.id,
      speed: this.props.speed,
      distance: this.props.distance,
      elevation: floatValue || 0,
    });
  }

  onDelete = () => {
    this.props.onDelete(this.props.id);
  }

  render() {
    return (
      <div>
        <span>Speed: 
          <NumberFormat 
            value={ this.props.speed } 
            allowNegative={false} 
            onValueChange={ this.onSpeedChange } /> 
        </span>
        <span>Distance: 
          <NumberFormat 
            value={ this.props.distance } 
            allowNegative={false}
            onValueChange={ this.onDistanceChange } /> 
        </span>
        <span>Elevation: 
          <NumberFormat 
            value={ this.props.elevation } 
            allowNegative={false}
            onValueChange={ this.onElevationChange } /> 
        </span>
        <FaTrashO onClick={ this.onDelete }/>
      </div>
    );
  }
}

export default Leg;
