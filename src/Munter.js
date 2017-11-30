import React, { Component } from 'react';
import Leg from './Leg';
import moment from 'moment';
import uuid from 'uuid';
import FaPlus from 'react-icons/lib/fa/plus';

class Munter extends Component {
  constructor(props) {
    super(props);
    let storedState = this.getInitialState();
    if (!storedState) {
      const id = uuid.v4()
      storedState = {
        legs: {
          [id]:{speed: 4, distance: 8, elevation: 500 },
        },
        legOrder: [id],
      };
    }
    this.state = storedState;
  }

  componentWillUpdate() {
    localStorage.setItem('munter', JSON.stringify(this.state));
  }

  getInitialState() {
    return JSON.parse(localStorage.getItem('munter'));
  }

  calculateTime = () => {
    const legs = Object.values(this.state.legs)
    const hours = legs.reduce((sum, leg) => {
      return sum + (leg.distance + leg.elevation/100)/leg.speed
    }, 0);
    return moment.unix(hours*3600).utc().format('HH:mm');
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
      <div>
        <h2>Munter Time Calculation</h2>
        <p className="App-intro"> 
          In order to use this enter the speed, distance (km), and elevation change (m) for
          each leg of your trip. Good estimates for speed are:
        </p>
        <ul>
          <li>Uphill travel (foot or skis) = 4</li>
          <li>Flat or downhill travel = 6</li>
          <li>Downhill on skis = 10</li>
          <li>Bushwhacking = 2</li>
        </ul>
        <h2>Legs</h2>
        <div>
          { this.legs()	}
          <div onClick={this.addLeg}>
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
