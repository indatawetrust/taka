const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let ps = 10;

const taka = ({uri, pageSize}) => {
  mongoose.connect(uri, {useMongoClient: true});

  ps = pageSize;

  return {
    load: models => {
      for (let model in models) {
        mongoose.model(model, models[model]);
      }
    },
  };
};

taka.model = name => {
  const model = mongoose.model(name);

  return {
    save: fields => {
      return new Promise((resolve, reject) => {
        new model(fields).save().then(resolve).catch(reject);
      });
    },
    find: (fields, sort, map) => {
      return new Promise((resolve, reject) => {
        if (!map) {
          model
            .find(fields)
            .sort(sort || {})
            .then(resolve)
            .catch(reject);
        } else {
          model
            .find(fields)
            .sort(sort || {})
            .then(datas => {
              for (let i in datas) {
                let data = datas[i].toObject();

                data = map(data);

                datas[i] = data
              }

              resolve(datas)
            })
            .catch(reject);
        }
      });
    },
    findOne: (fields, sort) => {
      return new Promise((resolve, reject) => {
        model
          .findOne(fields)
          .then(resolve)
          .catch(reject);
      });
    },
    count: (fields) => {
      return new Promise((resolve, reject) => {
        model
          .count(fields || {})
          .then(resolve)
          .catch(reject);
      });
    },
    remove: fields => {
      return new Promise((resolve, reject) => {
        model.remove(fields).then(({result}) => resolve(result)).catch(reject);
      });
    },
    update: (selector, fields) => {
      return new Promise((resolve, reject) => {
        model
          .update(selector, {
            $set: fields,
          })
          .then(resolve)
          .catch(reject);
      });
    },
    page: (page, fields, sort) => {
      page = fields ? page : 1;
      fields = fields || page || {};

      return new Promise((resolve, reject) => {
        model
          .find(fields)
          .skip((page - 1) * ps)
          .limit(ps)
          .sort(sort || {})
          .then(resolve)
          .catch(reject);
      });
    },
  };
};

module.exports = taka;
