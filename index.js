// --start up app--
// npm run electron
// --update env variables--
// source app-env
// --sass compiler--
// npm run watch-css
console.log("App initiated");

const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;

//initialize variables
let mainWindow;
let addWindow;


// when the app is ready:
app.on('ready', () => {
  // assign window to variable
  mainWindow = new BrowserWindow({
    width: 800,
    height: 950
  }); // set window config here
  // load main.html file
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  // when main window is closed, close everything
  mainWindow.on('closed', () => app.quit());
  
  // buildFronTemplate helper
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  // create menu from build
  Menu.setApplicationMenu(mainMenu);
});

require('dotenv').config();



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
  host: process.env.HOST,
  username: process.env.USERNAME,
  password: process.env.PASSWORD
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
    url = require('url')
var ngrok = require('ngrok');


var num ='';

ipcMain.on('send:text', (event, number, path) => {

  console.log("phone number: " + number);
  console.log("image path: " + path);
  num = number;


  http.createServer(function (req, res) {
    fs.readFile(path, function (err, content) {
        if (err) {
          res.writeHead(400, {'Content-type':'text/html'})
          console.log(err);
          res.end("No such image");    
        } else {
          res.writeHead(200,{'Content-type':'image/gif'});
          var img = fs.readFileSync(path);
          res.end(content);
        }
    });
  }).listen(9000);


  var imgurl = '';
  ngrok.connect(9000, function (err, url) {
    if(err){
      console.log(err);
    } else {
      console.log("connected");
      //sendSMS(number, url)
      //imgurl = url;
    }
  });
});


ngrok.once('connect', function (url) {
  console.log("once conect..");
  console.log(".. " + url);
  console.log(".. " + num);
  sendSMS(num, url);
});


// TEST //////////////////////

// http.createServer(function (req, res) {
//   fs.readFile('images/gifs/SmallGIF.gif', function (err, content) {
//       if (err) {
//         res.writeHead(400, {'Content-type':'text/html'})
//         console.log(err);
//         res.end("No such image");    
//       } else {
//         res.writeHead(200, {'Content-Type': 'image/gif' });
//         var img = fs.readFileSync('images/gifs/SmallGIF.gif');
//         res.end(img, 'binary');
//       }
//   });
// }).listen(9000);

// // ngrok.disconnect(); // stops all

// var imgurl = '';
// ngrok.connect(9000, function (err, url) {

//   if(err){
//     console.log(err);
//   } else {
//     console.log("URL: " + url );
//     sendSMS(6127180553, url)
//   }

// });   

//////////////////////



// ngrok.disconnect();



  
function sendSMS(recipient, imageURL) {

  console.log(recipient + ' -- recipient');
  console.log(imageURL + ' -- imageURL');
  // Twilio Credentials 
  var accountSid = process.env.ACCOUNTSID;
  var authToken = process.env.AUTHTOKEN;
  var myNumber = process.env.MYNUM;

  // require the Twilio module and create a REST client 
  var client = require('twilio')(accountSid, authToken); 

 client.messages.create({ 
   to: recipient,
   from: myNumber,
   body: "Small Test",
   // mediaUrl: 'https://tctechcrunch2011.files.wordpress.com/2018/01/giphy1.gif',
   mediaUrl: imageURL,

 }, function(err, message) { 
   if(err){
     console.log(err);
   } else {
     console.log("sent: " + message.sid);
   }

 });


}











// ipcMain.on('phone:add', (event, number) => {

//   console.log("phone number: " + number);

//   // Twilio Credentials 
//   var accountSid = process.env.accountSid;
//   var authToken = process.env.authToken;
//   var myNumber = process.env.myNumber;

//  // require the Twilio module and create a REST client 
//   var client = require('twilio')(accountSid, authToken); 
   
//   client.messages.create({ 
//     to: number,
//     from: myNumber,
//     body: "Test Test",
//     mediaUrl: 'https://tctechcrunch2011.files.wordpress.com/2018/01/giphy1.gif',
//    // mediaUrl: imgurl,
//   }, function(err, message) { 

//       if(err){
//         console.log(err);
//       } else {
//         console.log("sent: " + message.sid);
//       }

//   });
// });







// //var imgurl = 
// // listen for button clicks (from main.html): 
// ipcMain.on('sendText:btn', (event, todo) => {

//   // Twilio Credentials 
//   var accountSid = process.env.accountSid;
//   var authToken = process.env.authToken;
//   var myNumber = process.env.myNumber;
//   var destination = process.env.destination;

//   console.log(accountSid);
//   console.log(authToken);
//   console.log(myNumber);
//   console.log(destination);
 

//   //var imgurl = 'https://tctechcrunch2011.files.wordpress.com/2018/01/giphy1.gif'
//    // var imgurl = 'http://static1.businessinsider.com/image/58c6f8e35f3ca830008b4f3c-875/9577356756453472e419b.jpg'

//  // require the Twilio module and create a REST client 
//   var client = require('twilio')(accountSid, authToken); 
   
//   client.messages.create({ 
//     to: destination,
//     from: myNumber,
//     body: "Gif Test",
//     mediaUrl: 'https://tctechcrunch2011.files.wordpress.com/2018/01/giphy1.gif',
//   }, function(err, message) { 
//       if(err){
//         console.log(err);
//       } else {
//         console.log(message.sid);
//       }
//   });

// });











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


var connSettings = {
  host: process.env.HOST,
  port: 22, // Normal is 22 port 
  username: 'pi',
  password: process.env.PASSWORD
};


var exec = require('node-ssh-exec');
var images = [];

// when button is pressed
ipcMain.on('capture:btn', (event, todo) => {

  mainWindow.webContents.send('start:stopwatch');

  // execute 
  console.log("Taking picture..");
  var start = new Date().getTime(); // Timer
  // 'python3 TestTakePhoto.py'   // TPsingle.py
  exec(connSettings, 'python3 /home/pi/touchscripts/TPgroup.py', function (err, response) {

    if (err) {
      if (err.code === 'ECONNREFUSED') {
        console.log("Pi not connected, try updating env variables with `source app-env`");
      } else {
        throw err
        console.log(err);
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
              host: process.env.HOST,
              username: 'pi',
              password: process.env.PASSWORD,
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
                    //console.log(images)
                   // mainWindow.webContents.send('list-of-images', images);
                     mainWindow.webContents.send('stop:stopwatch');
                  });


            })
          });

  });
});



ipcMain.on('start:up', (event, list) => {
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
    // console.log(images)
    mainWindow.webContents.send('list-of-images', images);
  });
});



// ipcMain.on('test:btn', (event, list) => {

//   mainWindow.webContents.send('start:stopwatch');


// });






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
      host: process.env.HOST,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
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
// SGIF


  console.log(filePath); 

   exec(connSettings, '', function (err, response) { // better way of connecting??
      if (err) throw err

     client.scp({
       host: process.env.HOST,
       username: 'pi',
       password: process.env.PASSWORD,
       path: filePath
     }, './images/gifs/', function(err) {
       if (err) throw err
       // displayImage();
        console.log("made it insiode!");
        refreshImages();

     })

   });
});


function refreshImages() {
  
 images = []; // clear array
 // find what images exist
 fs.readdir('./images/gifs/', (err, files) => {
   if (err) throw  err;
   for (let file of files) {
     if (file.substr(-4) === '.gif') { // if the last 4 digits are gif
       images.push(file)
     }
   }
   // console.log(images)
   mainWindow.webContents.send('list-of-images', images);
 });
}



ipcMain.on('remove:image', (event, filePath) => {

  fs.unlink('./' + filePath, function(error) {
    if (error) {
        throw error;
    }
    console.log('Deleted: ' + filePath);

    refreshImages();

  });

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










