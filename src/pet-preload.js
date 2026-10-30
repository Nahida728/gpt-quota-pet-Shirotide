const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("gptPet", {
  read: () => ipcRenderer.invoke("pet:read"),
  ready: () => ipcRenderer.send("pet:ready"),
  gesture: () => ipcRenderer.invoke("pet:gesture"),
  catch: point => ipcRenderer.send("pet:catch", point),
  hover: hit => ipcRenderer.send("pet:hover", hit),
  flightProgress: point => ipcRenderer.send("pet:flight-progress", point),
  flightHover: value => ipcRenderer.send("pet:flight-hover", value),
  flightEnd: point => ipcRenderer.send("pet:flight-end", point),
  menu: () => ipcRenderer.send("pet:menu"),
  tap: () => ipcRenderer.send("pet:tap"),
  interact: () => ipcRenderer.send("pet:interact"),
  dismiss: () => ipcRenderer.send("pet:dismiss"),
  onState: callback => { const listener = (_event, state) => callback(state); ipcRenderer.on("pet:state", listener);
    return () => ipcRenderer.removeListener("pet:state", listener); },
  onMotion: callback => { const listener = (_event, motion) => callback(motion); ipcRenderer.on("pet:motion", listener);
    return () => ipcRenderer.removeListener("pet:motion", listener); },
  onFlight: callback => { const listener = (_event, flight) => callback(flight); ipcRenderer.on("pet:flight", listener);
    return () => ipcRenderer.removeListener("pet:flight", listener); }
});
