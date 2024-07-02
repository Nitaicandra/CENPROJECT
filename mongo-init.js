db.createUser({
    user: 'root',
    pwd: 'th3P4asswd',
    roles: [
      {
        role: 'dbOwner',
        db: 'connect-pro-db',
      },
    ],
  });
  
  db.createCollection('test-collection');