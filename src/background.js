'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog, session } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
export { default as createProto2 } from './createProto2'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import createProto2 from './createProto2'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
  { scheme: 'molybdenum', privileges: { secure: true, standard: true } },
  { scheme: 'molybdenum-error', privileges: { secure: true, standard: true } },
  { scheme: 'molybdenum-extension', privileges: { secure: true, standard: true } },
])

function checkmax(w){
  console.log("maxstat: ",w.isMaximized() ? 0 : 1);
  w.webContents.send("maxstat",w.isMaximized() ? 0 : 1);
}

var win;
var mainWinSession;
var s;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: false,
      contextIsolation: false,
      preload: __dirname + '/preload.js',
      webviewTag: true,
      enableWebSQL: true,
      spellcheck: false,
      enableBlinkFeatures: true,
      defaultEncoding: "UTF-8",
      session: mainWinSession,
    }
  })
  
  ipcMain.handle("close",()=>{
    win.close();
  })
  ipcMain.handle("minimize",()=>{
    win.minimize();
  })
  ipcMain.handle("maximize",()=>{
    win.maximize();
  })
  ipcMain.handle("unmaximize",()=>{
    win.unmaximize();
  })
  ipcMain.handle("checkmax",()=>{
    console.log("checkmax");
    checkmax(win);
  })

  createProto2("molybdenum", "pages",mainWinSession);
  createProto2("molybdenum-error", "errorpages",mainWinSession);
  createProto2("molybdenum-extension", "extensions",mainWinSession);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app',mainWinSession.protocol)
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  win.on("maximize",()=>{
    checkmax(win);
  });
  win.on("unmaximize",()=>{
    checkmax(win);
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('certificate-error', function(event, webContents, url, error, certificate, callback) {
  event.preventDefault();
  callback(false);
});



app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  mainWinSession = session.fromPartition("persist:interface");
  s = session.fromPartition("persist:wvcontent");
  createProto2("molybdenum", "pages",s);
  createProto2("molybdenum-error", "errorpages",s);
  createProto2("molybdenum-extension", "extensions",s);
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

