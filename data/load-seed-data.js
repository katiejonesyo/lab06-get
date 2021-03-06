const client = require('../lib/client');
const lacroixs = require('./lacroixs.js');
const categories = require('./categories.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );

    await Promise.all(
      categories.map(category => {
        return client.query(`
                    INSERT INTO categories (names)
                    VALUES ($1)
                    RETURNING *;
                `,
        [category.names]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      lacroixs.map(lacroixs => {
        return client.query(`

                    INSERT INTO lacroixs (name, cool_factor, category, crisp, owner_id)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *;
                `,
        [lacroixs.name, lacroixs.cool_factor, lacroixs.category, lacroixs.crisp, user.id]);

      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
