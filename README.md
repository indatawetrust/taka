[![Travis Build
Status](https://img.shields.io/travis/indatawetrust/taka.svg)](https://travis-ci.org/indatawetrust/taka)

Manage all models via a single package

### install
```
npm i taka -S
```

### usage

Save the models in a single js file.
```js
module.exports = {
  "User": {
    "username": String,
    "password": String
  },
  "Post": {
    "user_id": "ObjectId",
    "text": String
  }
}
```

And use only one function call.
```js
taka({
  uri: 'mongodb://localhost/test',
  pageSize: 4,
}).load(require('./models.json'));
```

##### save
```js
await taka.model('User').save({
  username: 'ahmet',
  password: '12345',
})
```
##### find
```js
await taka.model('User').find({}, /* sorting parameters */, /* map function */)
```
##### findOne
```js
await taka.model('User').findOne({
  username: 'ahmet'
})
```
##### count
```js
await taka.model('User').count()
```
##### remove
```js
await taka.model('User').count()
```
##### page
```js
await taka.model('User').page(2, { username: /^a/ }, /* sorting parameters */)
```


