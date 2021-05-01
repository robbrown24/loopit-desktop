const { app, BrowserWindow, screen } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');
const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
const dbConfig = require("../config/config.js");


const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    dateStrings: 'date'
  });

let mainWindow;
let thirdWindow;
let displays;
let externalDisplay;

//const displays = screen.getAllDisplays()
//const externalDisplay = displays.find((display) => {
    //return display.bounds.x !== 0 || display.bounds.y !== 0
//})

function createWindow() {
    mainWindow = new BrowserWindow({
        width:1000,
        height:1000,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule:true,
            contextIsolation: false,
         },
         icon: __dirname + '/assets/loopit.ico'
    });
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
 
    mainWindow.loadURL(startURL);
    //mainWindow.removeMenu();
 
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createTestWindow(){
    
    externalDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0
    })
  
    if (externalDisplay) {
        thirdWindow = new BrowserWindow({
            x: externalDisplay.bounds.x + 50,
            y: externalDisplay.bounds.y + 50,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule:true,
                contextIsolation: false,
             }
        })
        const startURL = isDev ? 'http://localhost:3000/test' : `file://${path.join(__dirname, '../build/index.html')}`;
 
        thirdWindow.loadURL(startURL);
        //secondWindow.loadURL('https://github.com');
        thirdWindow.maximize();
        thirdWindow.isAlwaysOnTop();
        
        thirdWindow.once('ready-to-show', () => thirdWindow.show());
        thirdWindow.on('closed', () => {
            thirdWindow = null;
        });
        thirdWindow.removeMenu();
    }
   
}

const program = async () => {
  

    const instance = new MySQLEvents(connection, {
      startAtEnd: true // to record only the new binary logs, if set to false or you didn'y provide it all the events will be console.logged after you start the app
    });
  
    await instance.start();
  
    instance.addTrigger({
      name: 'monitoring all statments',
      expression: 'demo.appointment', // listen to TEST database !!!
      statement: MySQLEvents.STATEMENTS.ALL, // you can choose only insert for example MySQLEvents.STATEMENTS.INSERT, but here we are choosing everything
      onEvent: e => {
          let aptNum = e.affectedRows[0].after.AptNum;
          let patNum = e.affectedRows[0].after.PatNum;
          let seated = e.affectedRows[0].after.DateTimeSeated;
          console.log(aptNum);
          console.log(patNum);
          console.log(seated);
        console.log(e.affectedColumns);
        let affectedCol = e.affectedColumns[2];
  
        if(affectedCol === 'DateTimeSeated'){
          let sql = `SELECT p.fname, DATE_FORMAT(a.aptdatetime,'%H:%i:%s') apttime, a.op, a.procdescript FROM appointment a join patient p on p.patnum = a.patnum where AptNum=` + aptNum ;
          connection.query(sql, aptNum, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
                console.log(results);
                createTestWindow();
                //sqlMessage = results;
                //mainWindow.webContents.send('test',results);
                

                thirdWindow.webContents.on('dom-ready', () => {
                    thirdWindow.webContents.send('test', results);
                  })
                
                
            
            });
        }
        
      }
    });
  
    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
  };
  
  program()
    .then()
    .catch(console.error);

//app.on('ready', createWindow);
//app.on('ready', () => {
    //createWindow();


//})

app.whenReady().then(() => {
    displays = screen.getAllDisplays()
    externalDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0
    })
    createWindow();
    
  })
