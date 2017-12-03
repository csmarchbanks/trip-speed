import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import './Leg.css';
import FaTrashO from 'react-icons/lib/fa/trash-o';
import { DropdownButton, MenuItem } from 'react-bootstrap';

class Leg extends Component {
  onActivityChange = (activity) => {
    this.props.onChange({
      id: this.props.id,
      activity: activity,
      distance: this.props.distance,
      elevation: this.props.elevation,
    });
  }

  onDistanceChange = ({floatValue}) => {
    this.props.onChange({
      id: this.props.id,
      activity: this.props.activity,
      distance: floatValue || 0,
      elevation: this.props.elevation,
    });
  }

  onElevationChange = ({floatValue}) => {
    this.props.onChange({
      id: this.props.id,
      activity: this.props.activity,
      distance: this.props.distance,
      elevation: floatValue || 0,
    });
  }

  onDelete = () => {
    this.props.onDelete(this.props.id);
  }

  menuItems = () => {
    return this.props.menuItems.map((menuItem) => {
      const active =  menuItem.name === this.props.activity;
      return (<MenuItem key={menuItem.name} eventKey={ menuItem.name } active={active} onClick={ () => this.onActivityChange(menuItem.name) }>{ menuItem.description }</MenuItem>);
    });
  }

  activityDescription = () => {
    return this.props.menuItems.find((item) => {
      return item.name === this.props.activity;
    }).description;
  }

  render() {
    const title = "Activity: " + this.activityDescription();
    return (
      <div className="Leg">
        <DropdownButton bsStyle="default" id="activity" title={title}>
          { this.menuItems() }
        </DropdownButton>
        <span>Distance: 
          <NumberFormat 
            value={ this.props.distance || "" } 
            allowNegative={false}
            placeholder="Distance (km)"
            onValueChange={ this.onDistanceChange } /> 
        </span>
        <span>Elevation: 
          <NumberFormat 
            value={ this.props.elevation || "" } 
            allowNegative={false}
            placeholder="Elevation (m)"
            onValueChange={ this.onElevationChange } /> 
        </span>
        <FaTrashO onClick={ this.onDelete } className="Leg-clickable"/>
      </div>
    );
  }
}

export default Leg;
