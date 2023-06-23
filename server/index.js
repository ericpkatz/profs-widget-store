try {
  require('./secrets');
}
catch(ex){
  console.log(ex);
  //console.log('check README.md to create secrets.js if running locally');
}

if(!process.env.API_KEY){
  console.log(`
    you need to set up secrets.js in this folder\n
    in secrets.js\n
    process.env.API_KEY = 'YOUR KEY!!';
  `);
  throw 'NO API KEY';
}
const app = require('./app');
const { syncAndSeed } = require('./db');

const init = async()=> {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

init();



