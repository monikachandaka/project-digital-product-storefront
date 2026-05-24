const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const admin = mongoose.connection.db.admin();
    const { databases } = await admin.listDatabases();
    console.log('Databases:', databases.map(d => d.name));
    
    let foundSneha = false;

    for (let db of databases) {
      const dbInstance = mongoose.connection.client.db(db.name);
      const products = await dbInstance.collection('products').find().toArray();
      const users = await dbInstance.collection('users').find({ name: /sneha/i }).toArray();
      
      if (products.length > 0) {
        console.log(`\nFound ${products.length} products in DB: ${db.name}`);
        console.log('Sample product titles:', products.slice(0, 3).map(p => p.title));
      }

      if (users.length > 0) {
        console.log(`\nFound user Sneha in DB: ${db.name}`);
        foundSneha = true;
      }
    }
    
    if (!foundSneha) {
       console.log('\nCould not find a user named Sneha in any online database.');
    }

    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}).catch(e => console.error(e));
