// --start up app--
// npm run electron
// --update env variables--
// source app-env


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
 
    
ssh.connect({
  host: process.env.host,
  username: process.env.username,
  password: process.env.password
}).then(function() {

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

})







var http = require('http');

http.createServer(function (req, res) {
  res.write('Hello World!');
  res.end();
}).listen(8080);


var ngrok = require('ngrok');

ngrok.connect(8080, function (err, url) {
  if(err){
    console.log(err);
  } else {
    console.log(url);
  }
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
    // mediaUrl: 'http://test.jpg',
  }, function(err, message) { 

      if(err){
        console.log(err);
      } else {
        console.log(message.sid);
      }

      // console.log(message);
      // console.log(message.sid); 
  });

});









// // fs = require('fs')
// // path = require('path')
// // node_ssh = require('node-ssh')
// // ssh = new node_ssh()
 
// // ssh.connect({
// //   host: 'localhost',
// //   username: 'steel',
// //   privateKey: '/home/steel/.ssh/id_rsa'
// // })
// /*
//  Or
//  ssh.connect({
//    host: 'localhost',
//    username: 'steel',
//    privateKey: fs.readFileSync('/home/steel/.ssh/id_rsa')
//  })
//  if you want to use the raw string as private key
//  */
// .then(function() {
//   // Local, Remote
//   ssh.putFile('/home/steel/Lab/localPath', '/home/steel/Lab/remotePath').then(function() {
//     console.log("The File thing is done")
//   }, function(error) {
//     console.log("Something's wrong")
//     console.log(error)
//   })
//   // Array<Shape('local' => string, 'remote' => string)>
//   ssh.putFiles([{ local: '/home/steel/Lab/localPath', remote: '/home/steel/Lab/remotePath' }]).then(function() {
//     console.log("The File thing is done")
//   }, function(error) {
//     console.log("Something's wrong")
//     console.log(error)
//   })
//   // Local, Remote
//   ssh.getFile('/home/steel/Lab/localPath', '/home/steel/Lab/remotePath').then(function(Contents) {
//     console.log("The File's contents were successfully downloaded")
//   }, function(error) {
//     console.log("Something's wrong")
//     console.log(error)
//   })
//   // Putting entire directories
//   const failed = []
//   const successful = []
//   ssh.putDirectory('/home/steel/Lab', '/home/steel/Lab', {
//     recursive: true,
//     concurrency: 10,
//     validate: function(itemPath) {
//       const baseName = path.basename(itemPath)
//       return baseName.substr(0, 1) !== '.' && // do not allow dot files
//              baseName !== 'node_modules' // do not allow node_modules
//     },
//     tick: function(localPath, remotePath, error) {
//       if (error) {
//         failed.push(localPath)
//       } else {
//         successful.push(localPath)
//       }
//     }
//   }).then(function(status) {
//     console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
//     console.log('failed transfers', failed.join(', '))
//     console.log('successful transfers', successful.join(', '))
//   })
//   // Command
//   ssh.execCommand('hh_client --json', { cwd:'/var/www' }).then(function(result) {
//     console.log('STDOUT: ' + result.stdout)
//     console.log('STDERR: ' + result.stderr)
//   })
//   // Command with escaped params
//   ssh.exec('hh_client', ['--json'], { cwd: '/var/www', stream: 'stdout', options: { pty: true } }).then(function(result) {
//     console.log('STDOUT: ' + result)
//   })
//   // With streaming stdout/stderr callbacks
//   ssh.exec('hh_client', ['--json'], {
//     cwd: '/var/www',
//     onStdout(chunk) {
//       console.log('stdoutChunk', chunk.toString('utf8'))
//     },
//     onStderr(chunk) {
//       console.log('stderrChunk', chunk.toString('utf8'))
//     },
//   })
// })









// listen for button clicks (from main.html): 
// var exec = require('ssh-exec')

// ipcMain.on('test:btn', (event, todo) => {
//   console.log("test:btn clicked");


//   exec('ls -lh', {
//     user: 'pi',
//     host: 'NEXTcamera50.local',
//     key: '',
//     password: 'ahc6674762'
//   }).pipe(process.stdout)




// {
//    host: 'NEXTcamera50.local', // 169.254.126.55  NEXTcamera50.local
//    port: 22, // Normal is 22 port
//    username: 'pi',
//    password: 'ahc6674762'
// };


  // // Start an interactive shell session
  // var conn = new Client();
  // conn.on('ready', function() {
  //   console.log('Client :: ready');
  //   conn.shell(function(err, stream) {
  //     if (err) throw err;


  //     stream.on('close', function() {
  //       console.log('1 :: close');
  //       conn.end();
  //     }).on('data', function(data) {
  //       console.log('2: ' + data);
  //     }).stderr.on('data', function(data) {
  //       console.log('3: ' + data);
  //     });

  //     console.log('---- A ----');
  //     stream.end('ls -l\nexit\n');


  //   });
  // }).connect(connSettings);


  // createSettingsWindow();
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


// Trash?
// var cmd = require('node-cmd');

var Client = require('ssh2').Client;
var connection = new Client();
// connection settings
var connSettings = {
   host: 'NEXTcamera50.local', // 169.254.126.55  NEXTcamera50.local
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




var exec = require('node-ssh-exec');

// when button is pressed
ipcMain.on('capture:btn', (event, todo) => {
   // execute 
    console.log("Taking picture..");
    var start = new Date().getTime(); // Timer

    exec(connSettings, 'python3 TestTakePhoto.py', function (err, response) {
      if (err) throw err
      var end = new Date().getTime(); // Timer
      // once photo is taken
      var time = end - start; // Timer
      console.log('Picture Taken! Execution time: ' + time); // Timer
    });

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










