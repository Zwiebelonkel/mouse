const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const isDev = !app.isPackaged;

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, "icons/app.ico"), // ICON hier
  });

  win.loadURL(
    isDev
      ? "http://localhost:9003"
      : `file://${path.join(__dirname, "docs/index.html")}`
  );
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
