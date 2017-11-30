import React from 'react';
import ReactDOM from 'react-dom';
import Munter from './Munter';

const defaultProps = {
  defaultLegs: [{ speed: 4, distance: 8, elevation: 500 }]
};

describe('Munter', () => {
  let munter;
  beforeEach(() => {
    const div = document.createElement('div');
    munter = ReactDOM.render(<Munter {...defaultProps} />, div);
  });

  it('calculateTime', () => {
    expect(munter.calculateTime()).toBe("3:15");
  });

  it('onLegChange', () => {
    const {id} = munter.legs()[0].props;
    const speed = 10;
    const distance = 10;
    const elevation = 0;
    munter.onLegChange({id: id, speed: speed, distance: distance, elevation: elevation})
    expect(munter.calculateTime()).toBe("1:00");
  });

  it('deleteLeg', () => {
    munter.deleteLeg(munter.state.legOrder[0]);
    expect(munter.legs().length).toBe(0);
    expect(munter.calculateTime()).toBe("0:00");
  });
  
  it('addLeg', () => {
    munter.addLeg();
    expect(munter.legs().length).toBe(2);
  });
});
