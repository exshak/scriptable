// icon-color: deep-purple; icon-glyph: calendar;

const layout = `
  row
    column
      date
      battery
      space
      events

    column(90)
      current
      future
      space
`

const codeFilename = "weather-cal-code"
const gitHubUrl = "https://raw.githubusercontent.com/exshak/scriptable/main/weather-cal-code.js"

let files = FileManager.local()
const iCloudInUse = files.isFileStoredIniCloud(module.filename)

files = iCloudInUse ? FileManager.iCloud() : files

const pathToCode = files.joinPath(files.documentsDirectory(), codeFilename + ".js")
if (!files.fileExists(pathToCode)) {
  const req = new Request(gitHubUrl)
  const codeString = await req.loadString()
  files.writeString(pathToCode, codeString)
}

if (iCloudInUse) {
  await files.downloadFileFromiCloud(pathToCode)
}
const code = importModule(codeFilename)

const custom = {}

let preview
if (config.runsInApp) {
  preview = await code.runSetup(Script.name(), iCloudInUse, codeFilename, gitHubUrl)
  if (!preview) return
}

const widget = await code.createWidget(layout, Script.name(), iCloudInUse, custom)
Script.setWidget(widget)

if (config.runsInApp) {
  if (preview == "small") {
    widget.presentSmall()
  } else if (preview == "medium") {
    widget.presentMedium()
  } else {
    widget.presentLarge()
  }
}

Script.complete()
