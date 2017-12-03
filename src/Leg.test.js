import React from 'react';
import ReactDOM from 'react-dom';
import Leg from './Leg';
import { activityTypes } from './Munter';

const defaultProps = {
  activities: activityTypes,
  activity: "uphill",
  distance: 5,
  distanceUnit: "km",
  elevation: 200,
  elevationUnit: "m",
  id: "abc",
  onChange: jest.fn(),
  onDelete: jest.fn()
};

describe('Leg', () => {
  let props, leg;

  beforeEach(() => {
    defaultProps.onChange = jest.fn()
    defaultProps.onDelete = jest.fn()
    props = defaultProps;
    const div = document.createElement('div');
    leg = ReactDOM.render(<Leg {...props} />, div);
  });

  describe('onChange is called for', () => {
    it('onSpeedChange', () => {
      const {onChange, id, activity, distance, elevation} = props;
      let value = "downhill"
      leg.onActivityChange(value);
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toBeCalledWith({
        id: id,
        activity: value,
        distance: distance,
        elevation: elevation,
      });
    });

    it('onDistanceChange', () => {
      const {onChange, id, activity, distance, elevation} = props;
      let value = distance - 1;
      leg.onDistanceChange({floatValue: value});
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toBeCalledWith({
        id: id,
        activity: activity,
        distance: value,
        elevation: elevation,
      });
    });

    it('onElevationChange', () => {
      const {onChange, id, activity, distance, elevation} = props;
      let value = elevation+50;
      leg.onElevationChange({floatValue: value});
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toBeCalledWith({
        id: id,
        activity: activity,
        distance: distance,
        elevation: value,
      });
    });
  });

  it('onDelete', () => {
    const {onDelete, id} = props;
    leg.onDelete();
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(id);
  });
});
