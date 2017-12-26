import { types } from '../../../src/services/types-service';
import * as opsProvider from '../../../src/services/operators-provider';
import { expect } from 'chai';

describe('operators-provider service', () => {
  it('should contain the right operators for date', () => {
    const ops = opsProvider.getPropertySupportedOperators(types.date);
    expect(ops).to.have.deep.members([
      opsProvider.greaterEqualThan,
      opsProvider.lessEqualThan,
      opsProvider.within,
    ]);
  });
  it('should contain comparison operators for comparable types', () => {
    for (const type of [types.number, { base: 'string', name: 'version', comparer: 'version' }]) {
      const ops = opsProvider.getPropertySupportedOperators(type);
      expect(ops).to.include.deep.members([
        opsProvider.greater,
        opsProvider.greaterEqualThan,
        opsProvider.lessEqualThan,
        opsProvider.lessThan,
      ]);
    }
  });
});
