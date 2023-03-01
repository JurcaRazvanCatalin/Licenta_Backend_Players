const collectionModel = require("./Model");

const collectionService = {
  createRecord: (team) => {
    collectionModel.create(team);
  },
};

module.exports = collectionService;
