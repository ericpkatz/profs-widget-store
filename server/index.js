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
const { syncAndSeed, User } = require('./db');
const { Server } = require("socket.io");
const { socketMap } = require('./io');

const init = async()=> {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    const server = app.listen(port, ()=> console.log(`listening on port ${port}`));
    const socketServer = new Server(server);
    socketServer.on('connection', (socket) => {
      let user;
      socket.on('token', async(token) => {
        user = await User.findByToken(token);
        socketMap[user.id] = socket;
      });
      socket.on('disconnect', ()=> {
        if(user){
          console.log(`${user.username} disconnected.`);
          delete socketMap[user.id];
        }
      });
    });
  }
  catch(ex){
    console.log(ex);
  }
};

init();



