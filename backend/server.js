const http = require("http")
const app = require("./app")

// Sécurité port
const normalizePort = (val) => {
  const port = parseInt(val, 10)
  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

const port = normalizePort(process.env.PORT || "3000")
app.set("port", port)


// Erreur handler
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error
  }
  switch (error.code) {

    case "EACCES":
      console.error(error)
      process.exit(1)
      // fin
      break
    case "EADDRINUSE":
      console.error(error)
      process.exit(1)
      break
    default:
      throw error
  }
}

// Server
const server = http.createServer(app)
server.on("error", errorHandler)

server.on("listening", () => {
  console.log(
    "Listening on port " +
    process.env.PORT +
    "(FR)écoute sur le port " +
    process.env.PORT
  )
})

server.listen(port)
