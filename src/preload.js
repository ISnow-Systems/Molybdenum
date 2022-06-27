const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
    'electron',
    {
        close: () => ipcRenderer.invoke('close'),
        maximize: () => ipcRenderer.invoke('maximize'),
        unmaximize: () => ipcRenderer.invoke('unmaximize'),
        minimize: () => ipcRenderer.invoke('minimize'),
        retmax: (func) => {
            console.log("Reg Listener: Max Status");
            ipcRenderer.on("maxstat",(...args) => {
                console.log("On maxstat");
                func(...args);
            });
        },
        on: (channel, func) => {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        },
        ipcon: ipcRenderer.on,
        checkmax: () => ipcRenderer.invoke('checkmax'),
        version: process.versions
    }
)