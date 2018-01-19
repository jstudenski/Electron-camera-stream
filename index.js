// --start up app--
// npm run electron
// --update env variables--
// source app-env
// --sass compiler--
// npm run watch-css

const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;

//initialize variables
let mainWindow;
let addWindow;

// when the app is ready:
app.on('ready', () => {
  // assign window to variable
  mainWindow = new BrowserWindow({}); // set window config here
  // load main.html file
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  // when main window is closed, close everything
  mainWindow.on('closed', () => app.quit());
  
  // buildFronTemplate helper
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  // create menu from build
  Menu.setApplicationMenu(mainMenu);
});



// function to be called by 'New Todo' menu button
function createAddWindow() {
  // create new widow
  addWindow = new BrowserWindow({
    width: 220,
    height: 100,
    title: 'Add New Todo'
  });
  // populate window with add.html
  addWindow.loadURL(`file://${__dirname}/add.html`);
  // garbage collect
  addWindow.on('closed', () => addWindow = null);
}

// listen for event (from add.html)
ipcMain.on('todo:add', (event, todo) => {
  // send to mainWindow
  mainWindow.webContents.send('todo:add', todo);
  // close add window
  addWindow.close();
});



var path, node_ssh, ssh, fs
 
fs = require('fs')
path = require('path')
node_ssh = require('node-ssh')
ssh = new node_ssh()
 
    // node-ssh Error: getadderinfo ENOTFOUND

ssh.connect({
  host: process.env.host,
  username: process.env.username,
  password: process.env.password
}).then(function() {

      // console.log("Something's wrong")
      // console.log(error)

  ipcMain.on('download:btn', (event, todo) => { 
    ssh.getFile('./temp/TestTakePhoto.py', '/home/pi/TestTakePhoto.py').then(function() {
      console.log("The File TestTakePhoto.py downloaded")
    }, function(error) {
      console.log("Something's wrong")
      console.log(error)
    })
  });

  ipcMain.on('upload:btn', (event, todo) => { 
    ssh.putFiles([{ local: './temp/TestTakePhoto.py', remote: '/home/pi/TestTakePhoto.py'}]).then(function() {
      console.log("The File TestTakePhoto.py uploaded")
    }, function(error) {
      console.log("Something's wrong")
      console.log(error)
    })
  });

});







var http = require('http'),
    fs = require('fs'),
    url = require('url');

http.createServer(function (req, res) {
  fs.readFile('test.jpg', function (err, content) {
      if (err) {
        res.writeHead(400, {'Content-type':'text/html'})
        console.log(err);
        res.end("No such image");    
      } else {
        res.writeHead(200,{'Content-type':'image/jpg'});
        res.end(content);
      }
  });
}).listen(8080);
console.log("Server running at http://localhost:8080/");

var ngrok = require('ngrok');

var imgurl = '';
ngrok.connect(8080, function (err, url) {
  if(err){
    console.log(err);
  } else {
    console.log(url);
    imgurl = url;
  }
});




// listen for event (from add.html)
ipcMain.on('phone:add', (event, number) => {

  console.log("phone number: " + number);

  // Twilio Credentials 
  var accountSid = process.env.accountSid;
  var authToken = process.env.authToken;
  var myNumber = process.env.myNumber;

 // require the Twilio module and create a REST client 
  var client = require('twilio')(accountSid, authToken); 
   
  client.messages.create({ 
    to: number,
    from: myNumber,
    body: "Test Image",
    mediaUrl: imgurl,
  }, function(err, message) { 

      if(err){
        console.log(err);
      } else {
        console.log("sent: " + message.sid);
      }

  });




});






// listen for button clicks (from main.html): 
ipcMain.on('sendText:btn', (event, todo) => {

  // Twilio Credentials 
  var accountSid = process.env.accountSid;
  var authToken = process.env.authToken;
  var myNumber = process.env.myNumber;
  var destination = process.env.destination;

  console.log(accountSid);
  console.log(authToken);
  console.log(myNumber);
  console.log(destination);

   
 // require the Twilio module and create a REST client 
  var client = require('twilio')(accountSid, authToken); 
   
  client.messages.create({ 
    to: destination,
    from: myNumber,
    body: "Initial Test",
    mediaUrl: imgurl,
  }, function(err, message) { 
      if(err){
        console.log(err);
      } else {
        console.log(message.sid);
      }
  });

});











// function to be called by 'New Todo' menu button
function createSettingsWindow() {
  // create new widow
  addWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: 'Camera Settings'
  });
  // populate window with add.html
  addWindow.loadURL(`file://${__dirname}/settings.html`);
  // garbage collect
  addWindow.on('closed', () => addWindow = null);
}



// listen for button clicks (from main.html): 
ipcMain.on('refresh:btn', (event, todo) => {
  mainWindow.reload();
});
ipcMain.on('devTools:btn', (event, todo) => {
  mainWindow.toggleDevTools();
});
ipcMain.on('addTask:btn', (event, todo) => {
  createAddWindow();
});




// var Client = require('ssh2').Client;
// var connection = new Client();

var connSettings = {
  host: process.env.host,
  port: 22, // Normal is 22 port 
  username: 'pi',
  password: process.env.password
};

// var remotePathToList = '/home/pi';
// let myfile;

// var conn = new Client();
// conn.on('ready', function() {
//   conn.sftp(function(err, sftp) {
//   if (err) throw err;

//     sftp.readdir(remotePathToList, function(err, list) {
//       if (err) throw err;
//       myfile = list;

//       conn.end(); // close the connection
//     });

//   });

// }).connect(connSettings);




var exec = require('node-ssh-exec');
var images = [];

// when button is pressed
ipcMain.on('capture:btn', (event, todo) => {
  // execute 
  console.log("Taking picture..");
  var start = new Date().getTime(); // Timer
  // 'python3 TestTakePhoto.py'
  exec(connSettings, 'python3 /home/pi/touchscripts/TPsingle.py', function (err, response) {
    if (err) {
      if (err.code === 'ECONNREFUSED') {
        console.log("Pi not connected, try updating env variables with `source app-env`");
      } else {
        throw err
      }
    }
    var end = new Date().getTime(); // Timer
    // once photo is taken
    var time = end - start; // Timer
    console.log('Picture Taken! Execution time: ' + time); // Timer

    //getFile(); // get file path


          exec(connSettings, 'cat /media/pi/1T/NEXCAP/Settings/lastgif.txt', function (err, response) {
            if (err) throw err
            var imgFilePath = response;

            console.log(imgFilePath);

            client.scp({
              host: process.env.host,
              username: 'pi',
              password: process.env.password,
              path: imgFilePath
            }, './images/gifs/', function(err) {
              if (err) throw err
              // displayImage();

                  images = [];
                  // get images
                  fs.readdir('./images/gifs/', (err, files) => {
                    if (err) throw  err;

                    for (let file of files) {
                      // if the last 4 digits are gif
                      if (file.substr(-4) === '.gif') {
                        images.push(file)
                      }
                    }
                    console.log(images)
                    mainWindow.webContents.send('list-of-images', images);
                  });




            })
          });









  });
});


// // get file path
// function getFile(){

// }



function displayImage(){

}




ipcMain.on('test:btn', (event, list) => {

  images = [];
  // get images
  fs.readdir('./images/gifs/', (err, files) => {
    if (err) throw  err;

    for (let file of files) {
      // if the last 4 digits are gif
      if (file.substr(-4) === '.gif') {
        images.push(file)
      }
    }
    console.log(images)
    mainWindow.webContents.send('list-of-images', images);
  });



  //   // execute 
  // console.log("Taking picture..");
  // var start = new Date().getTime(); // Timer
  // // 'python3 TestTakePhoto.py'
  // exec(connSettings, 'python3 /home/pi/touchscripts/TPsingle.py', function (err, response) {
  //   if (err) {
  //     if (err.code === 'ECONNREFUSED') {
  //       console.log("Pi not connected, try updating env variables with `source app-env`");
  //     } else {
  //       throw err
  //     }
  //   }
  //   var end = new Date().getTime(); // Timer
  //   // once photo is taken
  //   var time = end - start; // Timer
  //   console.log('Picture Taken! Execution time: ' + time); // Timer

  //   getFile(); // get file path
  // });

  displayImage();
});







var folders;
// when button is pressed
ipcMain.on('sync:btn', (event, todo) => {
   // execute
   console.log("Syncing images folder..");
   var start = new Date().getTime(); // Timer
   exec(connSettings, 'ls /media/pi/1T/NEXCAP/Files/NEXTLAB', function (err, response) {
      if (err) throw err
      var end = new Date().getTime(); // Timer
      // once photo is taken
      var time = end - start; // Timer
      console.log('Folders found.. Time: ' + time); // Timer

      folders = response;
    });
});   

// // when button is pressed
// ipcMain.on('test:btn', (event, todo) => {
//    // execute
//    console.log(folders);
//    console.log(typeof(folders)); 
//    console.log(folders.split('\n')); 
// });



var client = require('scp2')


ipcMain.on('move:btn', (event, todo) => {

  exec(connSettings, 'cat /media/pi/1T/NEXCAP/Settings/lastgif.txt', function (err, response) {
    if (err) throw err
    var imgFilePath = response;

    console.log(imgFilePath);

    client.scp({
      host: process.env.host,
      username: 'pi',
      password: process.env.password,
      path: imgFilePath
    }, './images/gifs/', function(err) {
      if (err) throw err
    })
  });

});






// manually add image
ipcMain.on('get:image', (event, num) => {

    console.log("get:image");
    console.log(num); 

    var filePath = '/media/pi/1T/NEXCAP/Files/NEXTLAB/MediaGroup' + num + '/Media/MGIF' + num + '.gif' 

    console.log(filePath); 


     exec(connSettings, '', function (err, response) { // better way of connecting??
        if (err) throw err

       client.scp({
         host: process.env.host,
         username: 'pi',
         password: process.env.password,
         path: filePath
       }, './images/gifs/', function(err) {
         if (err) throw err
         // displayImage();
          console.log("made it insiode!");
           images = [];
           // get images
           fs.readdir('./images/gifs/', (err, files) => {
             if (err) throw  err;

             for (let file of files) {
               // if the last 4 digits are gif
               if (file.substr(-4) === '.gif') {
                 images.push(file)
               }
             }
             console.log(images)
             mainWindow.webContents.send('list-of-images', images);
           });

       })

     });

      



     // exec(connSettings, 'cat /media/pi/1T/NEXCAP/Settings/lastgif.txt', function (err, response) {
     //        if (err) throw err
     //        var imgFilePath = response;

     //        console.log(imgFilePath);

     //        client.scp({
     //          host: process.env.host,
     //          username: 'pi',
     //          password: process.env.password,
     //          path: imgFilePath
     //        }, './images/gifs/', function(err) {
     //          if (err) throw err
     //          // displayImage();

     //              images = [];
     //              // get images
     //              fs.readdir('./images/gifs/', (err, files) => {
     //                if (err) throw  err;

     //                for (let file of files) {
     //                  // if the last 4 digits are gif
     //                  if (file.substr(-4) === '.gif') {
     //                    images.push(file)
     //                  }
     //                }
     //                console.log(images)
     //                mainWindow.webContents.send('list-of-images', images);
     //              });




     //        })
     //      });






});









// when button is pressed
ipcMain.on('phone:btn', (event, todo) => {

    console.log("phoneBTN");
    console.log(this);  

});




var moveFrom;
var moveTo;

// when button is pressed
ipcMain.on('transfer:btn', (event, todo) => {

    var conn = new Client();
    conn.on('ready', function() {

        console.log('Client :: ready');

        conn.sftp(function(err, sftp) {
            if (err) throw err;

            var moveFrom = "/home/pi/testimg.jpg";
            var moveTo = "./test.jpg";

            sftp.fastGet(moveFrom, moveTo, {}, function(downloadError) {
                if (downloadError) throw downloadError;
                mainWindow.reload(); // refresh
            });

        });

    }).connect(connSettings);

});

ipcMain.on('download:btn', (event, todo) => {
  var conn = new Client();
    conn.on('ready', function() {

        console.log('Client :: ready');

        conn.sftp(function(err, sftp) {
            if (err) throw err;

            var moveFrom = "/home/pi/TestTakePhoto.py";
            var moveTo = "temp/TestTakePhoto.py";

            sftp.fastGet(moveFrom, moveTo, {}, function(downloadError) {
                if (downloadError) throw downloadError;
                mainWindow.reload(); // refresh
            });

        });

    }).connect(connSettings);
});



ipcMain.on('upload:btn', (event, todo) => {
  var conn = new Client();
    conn.on('ready', function() {

        console.log('Client :: ready');

        conn.sftp(function(err, sftp) {
            if (err) throw err;

            var moveFrom = "/home/pi/TestTakePhoto.py";
            var moveTo = "temp/TestTakePhoto.py";

            sftp.fastGet(moveFrom, moveTo, {}, function(downloadError) {
                if (downloadError) throw downloadError;
                mainWindow.reload(); // refresh
            });

        });

    }).connect(connSettings);
});





ipcMain.on('showfiles:btn', (event, todo) => {
  conn.end();
  // send to mainWindow
  mainWindow.webContents.send('showfiles:btn', myfile);
   // var fs = require('fs');
   //  fs.mkdir('/Users/jeffstud/Desktop/testfolder');
   //  fs.writeFile('/Users/jeffstud/Desktop/testfolder/helloworld.txt', 'Hello World!', function (err) {
   //  if (err) return console.log(err);
   //    console.log('Hello World > helloworld.txt');
   //  });
});






// menu template
const menuTemplate = [
{
  label: 'File', // single menu bar drop down item
  submenu: [
    { 
      label: 'New Todo',
      accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N', // Hot Keys: if mac, else pc
      click() { createAddWindow(); }
    },
    { 
      label: 'Clear Todos',
      click() {
        mainWindow.webContents.send('todo:clear');
      }
    },

    {  
      label: 'Quit',
      accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q', // Hot Keys: if mac, else pc
      click() {
        app.quit(); // quit application
      }
    }
  ]
},
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'}
    ]
  },




];


  // submenu: [
  //   {role: 'undo'},
  //   {role: 'redo'},
  //   {type: 'separator'},
  //   {role: 'cut'},
  //   {role: 'copy'},
  //   {role: 'paste'},
  //   {role: 'pasteandmatchstyle'},
  //   {role: 'delete'},
  //   {role: 'selectall'}
  // ]


 // if mac
if (process.platform === 'darwin') {
  menuTemplate.unshift({}); // add empty object so 'Electron' menu doesn't dissappear on mac
}

// if not in production environment
if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'Developer',
      submenu: [
        { role: 'reload'}, // electron preset role
        { 
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
          click(item, focusedWindow) { // currently selected window
            focusedWindow.toggleDevTools();
          }
        }
      ]
  });
}

// 'production'
// 'development'
// 'staging'
// 'test'










