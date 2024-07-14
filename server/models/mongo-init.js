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

  db.createCollection('users');
  db.createCollection('services');
  db.createCollection('reviews');
  db.createCollection('bookings');