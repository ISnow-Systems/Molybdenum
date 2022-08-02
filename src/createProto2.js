const { readFile } = require("fs");
const path = require("path")
export default (scheme, basedir, sess) => {
    sess.protocol.registerBufferProtocol(
        scheme,
            (request, respond) => {
                let url = new URL(request.url)
                let hostName = url.hostname
                let pathName = url.pathname
                hostName = decodeURI(hostName) // Needed in case URL contains spaces
                pathName = decodeURI(pathName) // Needed in case URL contains spaces

                if (pathName == "/" || pathName == ""){
                    pathName = "/index.html";
                }

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