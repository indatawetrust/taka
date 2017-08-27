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

  user = await taka.model('User').find({
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

  user = await taka.model('User').find({
    _id: user._id,
  });

  t.deepEqual([], user);

  user = await taka.model('User').save({
    username: 'ahmet',
    password: '12345',
  });

  for (let i = 0; i < 10; i++)
    await taka.model('Post').save({
      user_id: user._id,
      text: 'hello world',
    });

  t.is(4, (await taka.model('Post').page(1, {}, {text: 'desc'})).length);
});
