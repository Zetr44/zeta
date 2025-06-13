const fs = require("fs")

module.exports = (app) => {
  app.get("/system/get-users", (req, res) => {
    const { secretcode } = req.query

    if (!secretcode) {
      return res.status(400).json({
        status: false,
        error: "Secretcode parameter is required!",
      })
    }

    if (secretcode !== "zabsxzeta") {
      return res.status(403).json({
        status: false,
        error: "Invalid secret code! Access denied.",
      })
    }

    try {
      const usersPath = "./lib/database/data/users.json"

      if (!fs.existsSync(usersPath)) {
        return res.status(404).json({
          status: false,
          error: "Users database not found!",
        })
      }

      const users = JSON.parse(fs.readFileSync(usersPath, "utf8"))

      res.status(200).json({
        status: true,
        message: "Users loaded successfully",
        count: users.length,
        data: users,
      })
    } catch (e) {
      console.error("Error reading users file:", e)
      res.status(500).json({
        status: false,
        error: `Database error: ${e.message}`,
      })
    }
  })
}
