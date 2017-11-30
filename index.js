// start up app:
// npm run electron
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



var cmd = require('node-cmd');

var Client = require('ssh2').Client;
var connection = new Client();
// connection settings
var connSettings = {
   host: 'NEXTcamera50.local',
   port: 22, // Normal is 22 port
   username: 'pi',
   password: 'ahc6674762'
};

var remotePathToList = '/home/pi';
let myfile;

var conn = new Client();
conn.on('ready', function() {
    conn.sftp(function(err, sftp) {
         if (err) throw err;

         // try .unlink or chmod
         sftp.readdir(remotePathToList, function(err, list) {
            if (err) throw err;
            // List the directory in the console
            // console.dir(list);
            myfile = list;

            conn.end(); // close the connection
         });



    });

}).connect(connSettings);








// // wait function
// function wait(ms){
//    var start = new Date().getTime();
//    var end = start;
//    while(end < start + ms) {
//      end = new Date().getTime();
//   }
// }


var exec = require('node-ssh-exec');
// when button is pressed
ipcMain.on('capture:btn', (event, todo) => {
   // execute 
  console.log("Taking picture..");
    // 
    exec(connSettings, 'python3 TestTakePhoto.py', function (err, response) {
      if (err) throw err
      // once photo is taken
      console.log("picture complete");

    });
});


// require package
// var client = require('scp2');

// transfer image
var start = "/home/pi/testimg.jpg";
var to = "./bbb.jpg";

// when button is pressed
ipcMain.on('transfer:btn', (event, todo) => {

  var conn = new Client();
  conn.on('ready', function() {
      conn.sftp(function(err, sftp) {
           if (err) throw err;

              // test copy photo
              var moveFrom = "/home/pi/testimg.jpg";
              var moveTo = "./fff.jpg";

              sftp.fastGet(moveFrom, moveTo, {}, function(downloadError){
                  if(downloadError) throw downloadError;
                  console.log("transfer complete");
              });
      });

  }).connect(connSettings);


});





// move files

// var moveFrom = "/home/pi/TakePhoto.py";
// var moveTo = "./TakePhoto.py";

// sftp.fastGet(moveFrom, moveTo, {}, function(downloadError){

//     if(downloadError) throw downloadError;
//     console.log("Succesfully uploaded");

// });



// c.on('ready', function() {
//   c.exec('ls', function(err, stream) {
//     if (err) throw err;
//     stream.on('data', function(data, stderr) {
//       if (stderr)
//         console.log('STDERR: ' + data);
//       else
//         console.log('STDOUT: ' + data);
//     }).on('exit', function(code, signal) {
//       console.log('Exited with code ' + code);
//     });
//   });
// });







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
}
];

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










