import React, { Component } from 'react';
import './Munter.css';
import Leg from './Leg';
import uuid from 'uuid';
import FaPlus from 'react-icons/lib/fa/plus';

const localStorageKey = 'munter';
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

  calculateTime = () => {
    const legs = Object.values(this.state.legs)
    const timeInHours = legs.reduce((sum, leg) => {
      return sum + (leg.distance + leg.elevation/100)/getSpeed(leg.activity)
    }, 0);
    const hours = Math.floor(timeInHours);
    let minutes = Math.round((timeInHours - hours)* 60);
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
          key={key} 
          id={key}
          distance={leg.distance} 
          elevation={leg.elevation} 
          onChange={this.onLegChange}
          onDelete={this.deleteLeg}
          menuItems={activityTypes}
          activity={leg.activity}
        />
      );
    });
  }

  render() {
    return (
      <div className="Munter">
        <p> 
          Usage: Enter your activity, distance (km), and elevation change (m), for
          each leg of your trip.
        </p>
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
