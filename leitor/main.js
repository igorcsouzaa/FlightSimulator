const { app, BrowserWindow } = require("electron")
const path = require("path")
const srcPath = path.join(__dirname + "/src")
const assetsPath = path.join(srcPath + "/assets")
const pagesPath = path.join(srcPath + "/pages")

function CreateWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    // win.setMenu(null)
    win.loadFile(pagesPath + '/index.html')
}

app.whenReady().then(() => {
    CreateWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            CreateWindow()
        }
    })
})

app.on("window-all-closed", () => {
    if(process.platform !== "darwin"){
        app.quit()
    }
})