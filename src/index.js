// Main entry point for programmatic usage
const { init } = require('./commands/init');
const { update } = require('./commands/update');
const { list } = require('./commands/list');
const { create } = require('./commands/create');
const { validate } = require('./commands/validate');

module.exports = {
  init,
  update,
  list,
  create,
  validate
};
