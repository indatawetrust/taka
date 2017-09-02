import test from 'ava';
import taka from './index';

taka({
  uri: 'mongodb://localhost/test',
  pageSize: 4,
}).load(require('./models.json'));

test('tests', async t => {
  let user = await taka.model('User').save({
    username: 'ahmet',
    password: '12345',
  });

  t.deepEqual(
    {
      username: 'ahmet',
      password: '12345',
    },
    {
      username: user.username,
      password: user.password,
    },
  );

  await taka.model('User').update(
    {_id: user._id},
    {
      username: 'AHMET',
      password: '54321',
    },
  );

  user = await taka.model('User').findOne({
    _id: user._id,
  });

  t.deepEqual(
    {
      username: 'AHMET',
      password: '54321',
    },
    {
      username: user.username,
      password: user.password,
    },
  );

  await taka.model('User').remove({_id: user._id});

  user = await taka.model('User').findOne({
    _id: user._id,
  });

  t.deepEqual(null, user);

  user = await taka.model('User').save({
    username: 'ahmet',
    password: '12345',
  });

  await taka.model('Post').remove()

  for (let i = 0; i < 10; i++)
    await taka.model('Post').save({
      user_id: user._id,
      text: 'hello world',
    });

  t.is(4, (await taka.model('Post').page(1, {}, {text: 'desc'})).length);

  const datas = await taka.model('Post').find({},{},data => {
    data.hello = 'world'
    return data
  })

  t.is(Array(10).fill('world').join(''), datas.map(({hello}) => hello).join(''))
});
