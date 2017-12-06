import React, { Component } from 'react';
import './Munter.css';
import Leg from './Leg';
import uuid from 'uuid';
import FaPlus from 'react-icons/lib/fa/plus';
import { DropdownButton, MenuItem } from 'react-bootstrap';

const localStorageKey = "munter";
const imperial = "Imperial";
const metric = "Metric";
const defaultLegs = [{ activity: "uphill", distance: 8, elevation: 500 }];
export const activityTypes = [
  { name: "uphill", description: "Walking or skiing uphill", baseValue: 4},
  { name: "walking", description: "Walking flat or downhill", baseValue: 6},
  { name: "downhill", description: "Skiing downhill", baseValue: 10},
  { name: "bushwhacking", description: "Bushwhacking", baseValue: 2},
];
const activityMap = activityTypes.reduce((accumulator, activity) => {
  accumulator[activity.name] = activity;
  return accumulator;
}, {});

const getSpeed = (activity) => {
  return activityMap[activity].baseValue
}

class Munter extends Component {
  constructor(props) {
    super(props);
    let storedState = this.getInitialState();
    if (!storedState) {
      const order = defaultLegs.map((leg) => {
        return uuid.v4();
      });
      const legs = defaultLegs.reduce((accumulator, leg, index) => {
        accumulator[order[index]] = leg;
        return accumulator
      }, {});
      storedState = {
        legs: legs,
        legOrder: order,
      };
    }
    this.state = storedState;
  }

  componentWillUpdate() {
    localStorage.setItem(localStorageKey, JSON.stringify(this.state));
  }

  getInitialState() {
    try {
      return JSON.parse(localStorage.getItem(localStorageKey));
    } catch (e) {
      return null;
    }
  }

  getDistanceUnit = () => {
    if (this.state.units === imperial) {
      return "miles";
    }
    return "km"
  }

  getElevationUnit = () => {
    if (this.state.units === imperial) {
      return "ft";
    }
    return "m";
  }

  getMetricDistance = (leg) => {
    if (this.state.units === imperial) {
      return leg.distance * 1.60934;
    }
    return leg.distance;
  }

  getMetricElevation = (leg) => {
    if (this.state.units === imperial) {
      return leg.elevation * 0.3048;
    }
    return leg.elevation;
  }

  calculateTime = () => {
    const legs = Object.values(this.state.legs)
    const timeInHours = legs.reduce((sum, leg) => {
      return sum + (this.getMetricDistance(leg) + this.getMetricElevation(leg)/100)/getSpeed(leg.activity)
    }, 0);
    const totalMinutes = Math.round(timeInHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ":" + minutes;
  }

  onLegChange = ({id, activity, distance, elevation}) => {
    let legs = this.state.legs;
    legs[id] = {
      activity: activity,
      distance: distance,
      elevation: elevation
    };
    this.setState({
      legs: legs
    });
  }

  addLeg = () => {
    let legs = this.state.legs;
    const id = uuid.v4();
    legs[id] = {
      activity: "uphill",
      distance: 0,
      elevation: 0,
    };
    let order = this.state.legOrder;
    order.push(id)
    this.setState({
      legs: legs,
      legOrder: order,
    });
  }

  deleteLeg = (id) => {
    const legs = this.state.legs;
    delete legs[id]
    const order = this.state.legOrder;
    const index = order.indexOf(id)
    order.splice(index, 1);
    this.setState({
      legs: legs,
      legOrder: order,
    });
  }

  legs = () => {
    return this.state.legOrder.map((key) => {
      const leg = this.state.legs[key]
      return (
        <Leg 
          activities={ activityTypes }
          activity={ leg.activity }
          distance={ leg.distance } 
          distanceUnit={ this.getDistanceUnit() }
          elevation={ leg.elevation } 
          elevationUnit={ this.getElevationUnit() }
          id={ key }
          key={ key } 
          onChange={ this.onLegChange }
          onDelete={ this.deleteLeg }
        />
      );
    });
  }

  onUnitChange = (units) => {
    this.setState({units: units});
  }

  getUnitDescriptions = (unit) => {
    if (unit === imperial) {
      return "Imperial: Miles and feet";
    }
    return "Metric: Kilometers and meters";
  }

  unitMenuItems = () => {
    const unitSystems = [metric, imperial];
    const activeUnits = this.state.units || metric
    return unitSystems.map((units) => {
      return (
        <MenuItem key={ units } active={ activeUnits === units } eventKey={ units } onSelect={ this.onUnitChange }>
          { units }
        </MenuItem>
      );
    });
  }

  render() {
    return (
      <div className="Munter">
        <p> 
          Usage: Enter your activity, distance ({ this.getDistanceUnit() }), and 
          elevation change ({ this.getElevationUnit() }), for each leg of your trip.
        </p>
        <div>
          Units: 
          <DropdownButton id="units" title={this.state.units || metric}>
            { this.unitMenuItems() }
          </DropdownButton>
        </div>
        <h2>Legs</h2>
        <div>
          { this.legs()	}
          <div onClick={this.addLeg} className="Munter-clickable">
            <FaPlus/><span> Add Leg </span>
          </div>
        </div>
        <div>
          Total trip time: { this.calculateTime() }.
        </div>
      </div>
    );
  }
}

export default Munter;
