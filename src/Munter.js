import React, { Component } from 'react';
import './Munter.css';
import Leg from './Leg';
import uuid from 'uuid';
import FaPlus from 'react-icons/lib/fa/plus';

const localStorageKey = 'munter';

class Munter extends Component {
  constructor(props) {
    super(props);
    let storedState = this.getInitialState();
    if (!storedState) {
      const order = props.defaultLegs.map((leg) => {
        return uuid.v4();
      });
      const legs = props.defaultLegs.reduce((accumulator, leg, index) => {
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
      return sum + (leg.distance + leg.elevation/100)/leg.speed
    }, 0);
    const hours = Math.floor(timeInHours);
    let minutes = Math.round((timeInHours - hours)* 60);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ":" + minutes;
  }

  onLegChange = ({id, speed, distance, elevation}) => {
    let legs = this.state.legs;
    legs[id] = {
      speed: speed,
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
      speed: 4,
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
          speed={leg.speed} 
          distance={leg.distance} 
          elevation={leg.elevation} 
          onChange={this.onLegChange}
          onDelete={this.deleteLeg}/>
      );
    });
  }

  render() {
    return (
      <div className="Munter">
        <p> 
          Usage: Enter the speed, distance(km), and elevation change(m), for
          each leg of your trip. Good estimates for speed are:
        </p>
        <ul className="Munter-list">
          <li>Uphill travel (foot or skis) = 4</li>
          <li>Flat or downhill travel = 6</li>
          <li>Downhill on skis = 10</li>
          <li>Bushwhacking = 2</li>
        </ul>
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
