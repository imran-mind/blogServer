
# process to create table and insert data 
    
    CREATE TABLE users(speed_id  TEXT primary key ,
                      email TEXT,
                      password TEXT,
                      provider TEXT,
                      social_id TEXT,
                      profile_name TEXT,
                      deleted BOOLEAN,
                      refresh_token TEXT,
                      speed_app_id TEXT,
                      created_at bigint ,
                      updated_at bigint

    );
   
    
  INSERT INTO "users" ("speed_id","email","password","refresh_token","speed_app_id",
  "deleted","created_at","updated_at") VALUES ('59b7ee00fb94c364c7b3e860',
  'abc@gmail.com','ARJFjoab43e8daca41ff65547eabcd128daa816819',
  '59b7ee01fb94c364c7b3e861','585b82eddbcd5b7666e0e451',false,1505226241000,1505226241000)

    {
     "email":"abc@gmail.com",
     "password":"abc"
    }
=> git clone https://github.com/digitamizers/AuthService.git
=> cd AuthService/

  # Install Node
=> process to install node.js
  curl https://raw.githubusercontent.com/creationix/nvm/v0.11.1/install.sh | bash source ~/.profile
  
  nvm ls-remote

  nvm install v6.2.2

  #Set default node version
  nvm alias default v6.2.2
  #nvm alias default node
  
    
=> go to the project folder 
   npm install
   
=> process to change postgres credentials in node config.js
   > cd config
   > vim default.json
   > Now change the DB config
   > "db": {
         "host": "localhost",
         "database": "techforce",
         "dialect": "postgres",
         "username": "postgres",
         "password": "postgres",
         "minPoolSize": 0,
         "maxPoolSize": 5,
         "idleConnectionTimeout": 100000
       }
   
=> # Install PM2
   npm install pm2 -g
   
   pm2 start techforce.js
