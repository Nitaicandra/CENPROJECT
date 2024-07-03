db.createUser({
    user: process.env.MONGODB_USER,
    pwd: process.env.MONGODB_PASSWORD,
    roles: [
      {
        role: 'dbOwner',
        db: process.env.MONGODB_DATABASE,
      },
    ],
  });

  db.createCollection('todos');

  db.todos.insertOne({ text: 'Write code', done: true });
  db.todos.insertOne({ text: 'Learn about containers', done: false });