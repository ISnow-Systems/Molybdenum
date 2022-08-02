const {ipcRenderer, session} = require("electron");
const electron = require("electron");

function createProto2(scheme, basedir, sess) {
    sess.protocol.registerBufferProtocol(
        scheme,
            (request, respond) => {
                let url = new URL(request.url)
                let hostName = url.hostname
                let pathName = url.pathname
                hostName = decodeURI(hostName) // Needed in case URL contains spaces
                pathName = decodeURI(pathName) // Needed in case URL contains spaces

                readFile(path.join(__dirname, basedir, hostName, pathName), (error, data) => {
                if (error) {
                    console.error(
                        `Failed to read ${pathName} on ${scheme} protocol`,
                        error
                    )
                }
                const extension = path.extname(pathName).toLowerCase()
                let mimeType = ''

                if (extension === '.js') {
                    mimeType = 'text/javascript'
                } else if (extension === '.html') {
                    mimeType = 'text/html'
                } else if (extension === '.css') {
                    mimeType = 'text/css'
                } else if (extension === '.svg' || extension === '.svgz') {
                    mimeType = 'image/svg+xml'
                } else if (extension === '.json') {
                    mimeType = 'application/json'
                } else if (extension === '.wasm') {
                    mimeType = 'application/wasm'
                }

                respond({ mimeType, data })
            })
        }
    )
}

window.electron = {
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
    version: process.versions,
    /*
    session: () => {
        var s = session.fromPartition("persist:wvcontent");
        createProto2("molybdenum", "pages",s);
        createProto2("molybdenum-error", "errorpages",s);
        createProto2("molybdenum-extension", "extensions",s);
        return s;
    },
    //*/
}

window.electron2 = electron;
/*
window.wvsession = (() => {
    var s;
    s = window.electron2.session.fromPartition("persist:wvcontent");
    createProto2("molybdenum", "pages",s);
    createProto2("molybdenum-error", "errorpages",s);
    createProto2("molybdenum-extension", "extensions",s);
    return s;
})();
//*/