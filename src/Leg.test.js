import React from 'react';
import ReactDOM from 'react-dom';
import Leg from './Leg';

const defaultProps = {
  id: "abc",
  speed: 4,
  distance: 5,
  elevation: 200,
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
      const {onChange, id, speed, distance, elevation} = props;
      let value = speed + .5;
      leg.onSpeedChange({floatValue: value});
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toBeCalledWith({
        id: id,
        speed: value,
        distance: distance,
        elevation: elevation,
      });
    });

    it('onDistanceChange', () => {
      const {onChange, id, speed, distance, elevation} = props;
      let value = distance - 1;
      leg.onDistanceChange({floatValue: value});
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toBeCalledWith({
        id: id,
        speed: speed,
        distance: value,
        elevation: elevation,
      });
    });

    it('onElevationChange', () => {
      const {onChange, id, speed, distance, elevation} = props;
      let value = elevation+50;
      leg.onElevationChange({floatValue: value});
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toBeCalledWith({
        id: id,
        speed: speed,
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
