sudo npm install -g express-generator
express tmp
cd tmp && npm install
npm install supervisor
npm install pg

sudo -u postgres psql < db_setup.sql
cp -n -r ./* ../NodeJS/node-postgres
