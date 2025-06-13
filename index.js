;(async () => {
  const express = require("express")
  const fs = require("fs")
  const path = require("path")
  const set = require("./settings")
  const chalk = require("chalk")

  const app = express()

  // Remove explicit PORT binding as Vercel handles this
  // const PORT = process.env.PORT || 4000

  const { getStats, setTotalEndpoints } = require("./lib/database/statistic")
  global.logRequest = require("./lib/database/logReq.js")

  const checkApikey = require("./lib/mware/checkApikey.js")
  const resetUserLimits = require("./lib/mware/dailyReset")
  const resetTimeRoute = require("./lib/mware/reset-time.js")
  app.use("/api", resetTimeRoute)

  const logger = {
    info: (message) => console.log(chalk.dim.blue("•") + chalk.dim(" info  - ") + message),
    ready: (message) => console.log(chalk.dim.green("•") + chalk.dim(" ready - ") + message),
    warn: (message) => console.log(chalk.dim.yellow("•") + chalk.dim(" warn  - ") + message),
    error: (message) => console.log(chalk.dim.red("•") + chalk.dim(" error - ") + message),
    event: (message) => console.log(chalk.dim.cyan("•") + chalk.dim(" event - ") + message),
  }

  app.set("trust proxy", true)
  app.set("json spaces", 2)

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use("/", express.static(path.join(__dirname, "docs")))

  function getMsUntilMidnight() {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0) // ke jam 00:00 besok
    return midnight.getTime() - now.getTime()
  }

  // Only run timer in development mode, not in Vercel's serverless environment
  if (process.env.NODE_ENV !== "production") {
    setTimeout(() => {
      resetUserLimits()
      setInterval(resetUserLimits, 24 * 60 * 60 * 1000)
    }, getMsUntilMidnight())
  }

  logger.info("Starting server initialization...")

  app.use((req, res, next) => {
    const originalJson = res.json
    res.json = function (data) {
      if (data && typeof data === "object") {
        const statusCode = res.statusCode || 200

        const responseData = {
          status: data.status,
          statusCode: statusCode,
          creator: set.author,
          ...data,
        }

        return originalJson.call(this, responseData)
      }
      return originalJson.call(this, data)
    }
    next()
  })

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
  }

  logger.info("Loading scraper module...")
  global.scraper = new (await require("./lib/scrape.js"))("./lib/scrape_file")
  global.scrape = await global.scraper.list()

  // Only run interval in development mode
  if (process.env.NODE_ENV !== "production") {
    setInterval(async () => {
      try {
        await global.scraper.load()
      } catch (error) {
        logger.error(chalk.bgRed.white.bold(`Failed to reload scraper: ${error.message}`))
      }
    }, 2000)
  }

  function loadEndpointsFromDirectory(directory, baseRoute = "") {
    let endpoints = []
    const fullPath = path.join(__dirname, directory)

    if (!fs.existsSync(fullPath)) {
      logger.warn(chalk.bgYellow.black.bold(`Directory not found: ${fullPath}`))
      return endpoints
    }

    logger.info(`Scanning directory: ${directory}...`)
    const items = fs.readdirSync(fullPath)

    items.forEach((item) => {
      const itemPath = path.join(fullPath, item)
      const stats = fs.statSync(itemPath)

      if (stats.isDirectory()) {
        console.log("")
        logger.info(`Found subdirectory: ${item}`)
        const nestedEndpoints = loadEndpointsFromDirectory(path.join(directory, item), `${baseRoute}/${item}`)
        endpoints = [...endpoints, ...nestedEndpoints]
      } else if (stats.isFile() && item.endsWith(".js")) {
        try {
          const module = require(itemPath)

          if (module && module.run && typeof module.run === "function") {
            const endpointName = item.replace(".js", "")
            const endpointPath = `${baseRoute}/${endpointName}`

            if (module.apikey) {
              app.all(endpointPath, checkApikey, module.run)
            } else {
              app.all(endpointPath, module.run)
            }

            let fullPathWithParams = endpointPath

            if (module.params && module.params.length > 0) {
              fullPathWithParams += "?" + module.params.map((param) => `${param}=`).join("&")
            }

            if (module.apikey) {
              fullPathWithParams += fullPathWithParams.includes("?") ? "&apikey=" : "?apikey="
            }

            const category = module.category || "Other"
            const categoryIndex = endpoints.findIndex((endpoint) => endpoint.name === category)

            if (categoryIndex === -1) {
              endpoints.push({
                name: category,
                items: [],
              })
            }

            const categoryObj = endpoints.find((endpoint) => endpoint.name === category)

            const endpointObj = {}
            endpointObj[module.name || endpointName] = {
              desc: module.desc || "No description provided",
              subcategory: module.subcategory || "-",
              path: fullPathWithParams,
            }

            categoryObj.items.push(endpointObj)

            logger.ready(`${chalk.green(endpointPath)} ${chalk.dim("(")}${chalk.cyan(category)}${chalk.dim(")")}`)
          }
        } catch (error) {
          logger.error(chalk.bgRed.white.bold(`Failed to load module ${itemPath}: ${error.message}`))
        }
      }
    })

    return endpoints
  }

  app.get("/stats", (req, res) => {
    res.json(getStats())
  })

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "docs", "index.html"))
  })

  logger.info("Loading API endpoints...")
  const allEndpoints = loadEndpointsFromDirectory("api")
  console.log("")
  logger.ready(`Loaded ${allEndpoints.reduce((total, category) => total + category.items.length, 0)} endpoints\n`)

  app.get("/endpoints", (req, res) => {
    const totalEndpoints = allEndpoints.reduce((total, category) => {
      return total + category.items.length
    }, 0)
    setTotalEndpoints(totalEndpoints)
    res.json({
      status: true,
      count: totalEndpoints,
      endpoints: allEndpoints,
    })
  })

  // Serve admin page
  app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "docs", "index.html"))
  })

  // Serve docs page
  app.get("/docs", (req, res) => {
    res.sendFile(path.join(__dirname, "docs", "index.html"))
  })

  try {
    require("./creator/create-users")(app)
    logger.ready(chalk.green("Creator - create-users loaded. . ."))
    require("./creator/delete-users")(app)
    logger.ready(chalk.green("Creator - delete-users loaded. . ."))
    require("./creator/update-apikey")(app)
    logger.ready(chalk.green("Creator - update-apikey loaded. . ."))
    require("./creator/get-users")(app)
    logger.ready(chalk.green("Creator - get-users loaded. . ."))
    logger.info("Creator system active ✓")
  } catch (e) {
    logger.error(chalk.bgRed.white.bold(e))
  }

  app.get("/set", (req, res) => {
    res.json({
      status: true,
      ...set,
    })
  })

  const tempFolder = path.join(__dirname, "tempFile")
  if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder)

  // Only run interval in development mode
  if (process.env.NODE_ENV !== "production") {
    setInterval(
      () => {
        const files = fs.readdirSync(tempFolder)
        const now = Date.now()
        for (const file of files) {
          const filePath = path.join(tempFolder, file)
          const stats = fs.statSync(filePath)
          const ageInMs = now - stats.mtimeMs
          if (ageInMs > 1000 * 60 * 60) {
            fs.unlinkSync(filePath)
          }
        }
      },
      1000 * 60 * 30,
    )
  }

  app.use("/cdn/downloads", express.static(path.join(__dirname, "tempFile")))

  app.use((req, res, next) => {
    logger.info(`404: ${req.method} ${req.path}`)
    res.status(404).sendFile(process.cwd() + "/docs/err/404.html")
  })

  app.use((err, req, res, next) => {
    logger.error(chalk.bgRed.white.bold(`500: ${err.message}`))
    res.status(500).sendFile(process.cwd() + "/docs/err/500.html")
  })

  // For local development, listen on a port
  if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
      console.log("")
      logger.ready(`Server started successfully`)
      logger.info(`Local:   ${chalk.cyan(`http://localhost:${PORT}`)}`)

      try {
        const { networkInterfaces } = require("os")
        const nets = networkInterfaces()
        const results = {}

        for (const name of Object.keys(nets)) {
          for (const net of nets[name]) {
            if (net.family === "IPv4" && !net.internal) {
              if (!results[name]) {
                results[name] = []
              }
              results[name].push(net.address)
            }
          }
        }

        for (const [, addresses] of Object.entries(results)) {
          for (const addr of addresses) {
            logger.info(`Network: ${chalk.cyan(`http://${addr}:${PORT}`)}`)
          }
        }
      } catch (error) {
        logger.warn(chalk.bgYellow.black.bold(`Cannot detect network interfaces: ${error.message}`))
      }

      logger.info(`${chalk.dim("Ready for connections")}`)
    })
  }

  // Export the Express app for Vercel
  module.exports = app
})()
