import R from 'ramda';
import Chance from 'chance';
const change = new Chance();

export function addPartition(partition, rules, depth) {
  if (depth == 0) {
    const byPartition = R.groupBy((rule) => rule.Matcher[partition] || '*');
    const partitioned = byPartition(rules);
    Object.keys(partitioned).forEach(key => {
      partitioned[key].forEach(rule => {
        delete rule.Matcher[partition];
      })
    });
    return partitioned;
  }
  return Object.keys(rules).reduce((result, key) => ({
    ...result,
    [key]: addPartition(partition, rules[key], depth - 1)
  }), {});
}

export function convertToExplicitKey(key) {
  return {
    ...key,
    rules: convertToExplicitRules(key.rules, key.partitions.length)
  }
}

export function convertToExplicitRules(rules, depth) {
  let fixedRules = rules;

  if (typeof rules === 'string') {
    fixedRules =[{
        Id: change.guid(),
        Matcher: {},
        Value: rules,
        Type: "SingleVariant"
      }];
  }

  if (Array.isArray(fixedRules) || depth == 0) {
    for (let i = 0; i < depth; i++) {
      fixedRules = {'*': fixedRules};
    }
    return fixedRules;
  }

  return Object.keys(rules).reduce((result, key) => ({
    ...result,
    [key]: convertToExplicitRules(rules[key], depth - 1)
  }), {});
}
