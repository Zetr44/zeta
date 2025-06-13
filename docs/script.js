// Global variables
let currentPage = "landing"
let apiData = null
let secretCode = "zabsxzeta"

// Status code explanations
const statusCodes = {
  200: "OK - Request successful",
  201: "Created - Resource created successfully",
  400: "Bad Request - Invalid request parameters",
  401: "Unauthorized - Authentication required",
  403: "Forbidden - Access denied",
  404: "Not Found - Resource not found",
  429: "Too Many Requests - Rate limit exceeded",
  500: "Internal Server Error - Server error occurred",
  502: "Bad Gateway - Invalid response from server",
  503: "Service Unavailable - Server temporarily unavailable",
}

// Initialize app
document.addEventListener("DOMContentLoaded", async () => {
  showLoader()
  await initializeApp()
  setupRouting()
  setupTheme()
  hideLoader()
})

async function initializeApp() {
  try {
    // Load API data
    const [endpointsRes, settingsRes] = await Promise.all([fetch("/endpoints"), fetch("/set")])

    const endpoints = await endpointsRes.json()
    const settings = await settingsRes.json()

    apiData = { endpoints: endpoints.endpoints, settings }

    // Update page content
    updatePageContent(settings)
    setupStats()
    setupApiContent(endpoints.endpoints)
    setupEventListeners()
  } catch (error) {
    console.error("Failed to initialize app:", error)
  }
}

function updatePageContent(settings) {
  const elements = {
    "brand-name": settings.name.main,
    "api-name": settings.name.main,
    "api-description": settings.description,
    "api-creator": `by ${settings.author}`,
  }

  Object.entries(elements).forEach(([id, content]) => {
    const element = document.getElementById(id)
    if (element) element.textContent = content
  })

  // Setup footer
  setupFooter(settings)
}

function setupFooter(settings) {
  // Brand and description
  const footerBrandName = document.getElementById("footer-brand-name")
  const footerDescription = document.getElementById("footer-description")
  const footerAuthor = document.getElementById("footer-author")
  const footerCopyright = document.getElementById("footer-copyright")

  if (footerBrandName) footerBrandName.textContent = settings.name.main
  if (footerDescription) footerDescription.textContent = settings.description
  if (footerAuthor) footerAuthor.textContent = settings.author
  if (footerCopyright) {
    const currentYear = new Date().getFullYear()
    footerCopyright.innerHTML = `© ${currentYear} ${settings.name.main}. All rights reserved.`
  }

  // Contact links
  if (settings.contact) {
    const footerEmail = document.getElementById("footer-email")
    const footerPhone = document.getElementById("footer-phone")
    const footerWebsite = document.getElementById("footer-website")

    if (footerEmail && settings.contact.email) {
      footerEmail.href = `mailto:${settings.contact.email}`
      footerEmail.querySelector("span").textContent = settings.contact.email
    }

    if (footerPhone && settings.contact.phone) {
      footerPhone.href = `tel:${settings.contact.phone}`
      footerPhone.querySelector("span").textContent = settings.contact.phone
    }

    if (footerWebsite && settings.contact.website) {
      footerWebsite.href = settings.contact.website
      footerWebsite.target = "_blank"
      footerWebsite.rel = "noopener noreferrer"
      footerWebsite.querySelector("span").textContent = settings.contact.website.replace("https://", "")
    }
  }

  // Social links
  if (settings.social) {
    const footerGithub = document.getElementById("footer-github")
    const footerTelegram = document.getElementById("footer-telegram")
    const footerInstagram = document.getElementById("footer-instagram")

    if (footerGithub && settings.social.github) {
      footerGithub.href = settings.social.github
      footerGithub.target = "_blank"
      footerGithub.rel = "noopener noreferrer"
    }

    if (footerTelegram && settings.social.telegram) {
      footerTelegram.href = settings.social.telegram
      footerTelegram.target = "_blank"
      footerTelegram.rel = "noopener noreferrer"
    }

    if (footerInstagram && settings.social.instagram) {
      footerInstagram.href = settings.social.instagram
      footerInstagram.target = "_blank"
      footerInstagram.rel = "noopener noreferrer"
    }
  }

  // Donate links
  if (settings.donate) {
    const footerPaypal = document.getElementById("footer-paypal")
    const footerKofi = document.getElementById("footer-kofi")
    const footerSaweria = document.getElementById("footer-saweria")

    if (footerPaypal && settings.donate.paypal) {
      footerPaypal.href = settings.donate.paypal
      footerPaypal.target = "_blank"
      footerPaypal.rel = "noopener noreferrer"
    }

    if (footerKofi && settings.donate.kofi) {
      footerKofi.href = settings.donate.kofi
      footerKofi.target = "_blank"
      footerKofi.rel = "noopener noreferrer"
    }

    if (footerSaweria && settings.donate.saweria) {
      footerSaweria.href = settings.donate.saweria
      footerSaweria.target = "_blank"
      footerSaweria.rel = "noopener noreferrer"
    }
  }
}

async function setupStats() {
  try {
    const statsRes = await fetch("/stats")
    const resetRes = await fetch("/api/reset-time")

    const stats = await statsRes.json()
    const resetData = await resetRes.json()

    updateStats(stats)
    startResetTimer(resetData.msUntilReset)

    // Update stats every 10 seconds
    setInterval(async () => {
      const newStats = await fetch("/stats").then((r) => r.json())
      updateStats(newStats)
    }, 10000)
  } catch (error) {
    console.error("Failed to load stats:", error)
  }
}

function updateStats(stats) {
  const elements = {
    "total-endpoints": stats.totalEndpoints || 0,
    "total-requests": stats.totalRequest || 0,
    "today-requests": stats.requestToday || 0,
  }

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id)
    if (element) element.textContent = formatNumber(value)
  })
}

function startResetTimer(msLeft) {
  function updateTimer() {
    const totalSeconds = Math.max(0, Math.floor(msLeft / 1000))
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0")
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0")
    const seconds = String(totalSeconds % 60).padStart(2, "0")

    const timer = document.getElementById("reset-timer")
    if (timer) {
      timer.innerHTML = `<i class="fas fa-clock"></i> ${hours}:${minutes}:${seconds} Before limits reset`
    }

    msLeft -= 1000
  }

  updateTimer()
  setInterval(updateTimer, 1000)
}

function formatNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B"
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M"
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K"
  return num.toString()
}

function setupApiContent(endpoints) {
  const container = document.getElementById("api-content")
  const filtersContainer = document.getElementById("category-filters")

  if (!container || !filtersContainer) return

  container.innerHTML = ""
  filtersContainer.innerHTML = ""

  // Setup category filters
  const categories = ["All", ...endpoints.map((cat) => cat.name)]
  categories.forEach((category) => {
    const filter = document.createElement("button")
    filter.className = `category-filter ${category === "All" ? "active" : ""}`
    filter.textContent = category
    filter.addEventListener("click", () => filterByCategory(category))
    filtersContainer.appendChild(filter)
  })

  // Setup API sections
  endpoints.forEach((category) => {
    const section = document.createElement("div")
    section.className = "api-section"
    section.dataset.category = category.name

    const title = document.createElement("h2")
    title.className = "section-title"
    title.innerHTML = `<i class="fas fa-folder"></i> ${category.name}`
    section.appendChild(title)

    const grid = document.createElement("div")
    grid.className = "api-grid"

    category.items.forEach((item) => {
      const apiName = Object.keys(item)[0]
      const apiInfo = item[apiName]

      const card = createApiCard(apiName, apiInfo)
      grid.appendChild(card)
    })

    section.appendChild(grid)
    container.appendChild(section)
  })

  setupSearch()
}

function createApiCard(name, info) {
  const card = document.createElement("div")
  card.className = "api-card"

  card.innerHTML = `
    <div class="api-header">
      <div class="api-info">
        <h3>${name}</h3>
        <h5>Subcategory: <span>${info.subcategory || "-"}<span><h5>
        <p>${info.desc || "No description available"}</p>
      </div>
      <span class="method-badge">GET</span>
    </div>
    <div class="api-path">${info.path || ""}</div>
  `

  card.addEventListener("click", () => openApiModal(name, info))

  return card
}

function filterByCategory(category) {
  const filters = document.querySelectorAll(".category-filter")
  const sections = document.querySelectorAll(".api-section")

  filters.forEach((filter) => {
    filter.classList.toggle("active", filter.textContent === category)
  })

  sections.forEach((section) => {
    if (category === "All") {
      section.style.display = "block"
    } else {
      section.style.display = section.dataset.category === category ? "block" : "none"
    }
  })
}

function setupSearch() {
  const searchInput = document.getElementById("api-search")
  if (!searchInput) return

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase()
    const sections = document.querySelectorAll(".api-section")

    sections.forEach((section) => {
      const cards = section.querySelectorAll(".api-card")
      let hasVisibleCards = false

      cards.forEach((card) => {
        const title = card.querySelector("h3").textContent.toLowerCase()
        const desc = card.querySelector("p").textContent.toLowerCase()
        const matches = title.includes(query) || desc.includes(query)

        card.style.display = matches ? "block" : "none"
        if (matches) hasVisibleCards = true
      })

      // Hide section if no cards are visible
      section.style.display = hasVisibleCards ? "block" : "none"
    })
  })
}

function openApiModal(name, info) {
  const modal = document.getElementById("api-modal")
  const title = document.getElementById("modal-title")
  const description = document.getElementById("modal-description")
  const paramsContainer = document.getElementById("params-container")
  const responseContainer = document.getElementById("response-container")

  title.textContent = name
  description.textContent = info.desc || "No description available"
  paramsContainer.innerHTML = ""
  responseContainer.classList.add("hidden")

  // Parse parameters from path
  const url = new URL(info.path, window.location.origin)
  const params = url.search ? url.search.substring(1).split("&") : []

  if (params.length > 0) {
    params.forEach((param) => {
      const [key] = param.split("=")
      if (key) {
        const group = document.createElement("div")
        group.className = "form-group"
        group.innerHTML = `
          <label for="param-${key}">${key}</label>
          <input type="text" id="param-${key}" placeholder="Enter ${key}">
        `
        paramsContainer.appendChild(group)
      }
    })
  }

  modal.classList.add("active")

  // Store endpoint info for request
  modal.dataset.endpoint = info.path
}

function setupEventListeners() {
  // Modal close buttons
  document.getElementById("close-modal")?.addEventListener("click", closeModal)
  document.getElementById("close-edit-modal")?.addEventListener("click", closeEditModal)

  // Submit request
  document.getElementById("submit-request")?.addEventListener("click", submitApiRequest)

  // Admin functionality
  setupAdminEventListeners()

  // Modal backdrop clicks
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal()
      closeEditModal()
    }
  })
}

async function submitApiRequest() {
  const modal = document.getElementById("api-modal")
  const endpoint = modal.dataset.endpoint
  const paramsContainer = document.getElementById("params-container")
  const responseContainer = document.getElementById("response-container")
  const responseData = document.getElementById("response-data")
  const responseStatus = document.getElementById("response-status")
  const responseTime = document.getElementById("response-time")
  const statusInfo = document.getElementById("status-info")

  let apiUrl = endpoint

  // Collect parameters
  const inputs = paramsContainer.querySelectorAll("input")
  inputs.forEach((input) => {
    const value = input.value.trim()
    if (value) {
      const key = input.id.replace("param-", "")
      const url = new URL(apiUrl, window.location.origin)
      url.searchParams.set(key, value)
      apiUrl = url.pathname + url.search
    }
  })

  responseContainer.classList.remove("hidden")
  responseData.textContent = "Sending request..."

  const startTime = performance.now()

  try {
    const response = await fetch(apiUrl)
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)

    // Update status and time
    responseStatus.textContent = response.status
    responseStatus.className = `status-badge ${response.ok ? "success" : "error"}`
    responseTime.textContent = `${duration}ms`

    // Show status explanation
    const statusText = statusCodes[response.status] || "Unknown status code"
    statusInfo.textContent = statusText

    // Show URL with copy button (convert to full URL)
    const fullUrl = new URL(apiUrl, window.location.origin).href
    showUrlDisplay(fullUrl)

    // Handle response data
    const contentType = response.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      const data = await response.json()
      const jsonString = JSON.stringify(data, null, 2)
      responseData.textContent = jsonString

      // Add copy button for response
      addResponseCopyButton(jsonString)
    } else if (contentType.includes("image/")) {
      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      responseData.innerHTML = `<img src="${imageUrl}" alt="Response" style="max-width: 100%; height: auto; border-radius: 8px;">`

      // Hide copy button for images
      hideCopyButton()
    } else {
      const text = await response.text()
      responseData.textContent = text

      // Add copy button for response
      addResponseCopyButton(text)
    }
  } catch (error) {
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)

    responseStatus.textContent = "ERROR"
    responseStatus.className = "status-badge error"
    responseTime.textContent = `${duration}ms`
    statusInfo.textContent = "Network error or request failed"
    responseData.textContent = error.message

    // Add copy button for error text
    addResponseCopyButton(error.message)
  }
}

function showUrlDisplay(url) {
  const responseContainer = document.getElementById("response-container")
  const existingDisplay = responseContainer.querySelector(".url-display")

  if (existingDisplay) {
    existingDisplay.remove()
  }

  const urlDisplay = document.createElement("div")
  urlDisplay.className = "url-display"

  const urlHeader = document.createElement("div")
  urlHeader.className = "url-header"
  urlHeader.innerHTML = `
    <h5><i class="fas fa-link"></i> Request URL</h5>
    <button class="copy-btn" onclick="copyToClipboard('${url}')">
      <i class="fas fa-copy"></i> Copy URL
    </button>
  `

  const urlContent = document.createElement("div")
  urlContent.style.wordBreak = "break-all"
  urlContent.style.marginTop = "0.5rem"
  urlContent.textContent = url

  urlDisplay.appendChild(urlHeader)
  urlDisplay.appendChild(urlContent)

  responseContainer.insertBefore(urlDisplay, responseContainer.firstChild)
}

function addResponseCopyButton(content) {
  const responseContainer = document.getElementById("response-container")
  const existingBtn = responseContainer.querySelector(".copy-btn-result")

  if (existingBtn) {
    existingBtn.remove()
  }

  const copyBtn = document.createElement("button")
  copyBtn.className = "copy-btn copy-btn-result"
  copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Result'
  copyBtn.style.borderLeft = "3px solid var(--accent-color)"
  copyBtn.onclick = () => copyToClipboard(content)

  // Add the button after response-data
  const responseData = document.getElementById("response-data")
  responseData.parentNode.insertBefore(copyBtn, responseData.nextSibling)
}

function hideCopyButton() {
  const responseContainer = document.getElementById("response-container")
  const existingBtn = responseContainer.querySelector(".copy-btn-result")

  if (existingBtn) {
    existingBtn.style.display = "none"
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    showCopySuccess()
  } catch (error) {
    console.error("Copy failed:", error)
  }
}

function showCopySuccess() {
  const notification = document.getElementById("copy-success")
  notification.classList.add("show")
  setTimeout(() => {
    notification.classList.remove("show")
  }, 2000)
}

function closeModal() {
  document.getElementById("api-modal").classList.remove("active")
}

function closeEditModal() {
  document.getElementById("edit-modal").classList.remove("active")
}

// Routing
function setupRouting() {
  // Handle navigation links
  document.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const page = link.dataset.page
      navigateToPage(page)

      // Update URL without page reload
      const url = page === "landing" ? "/" : `/${page}`
      history.pushState({ page }, "", url)
    })
  })

  // Handle browser back/forward
  window.addEventListener("popstate", (e) => {
    const page = e.state?.page || getPageFromURL()
    navigateToPage(page)
  })

  // Load initial page
  const initialPage = getPageFromURL()
  navigateToPage(initialPage)
}

function getPageFromURL() {
  const path = window.location.pathname
  if (path === "/docs") return "docs"
  if (path === "/admin") return "admin"
  return "landing"
}

function navigateToPage(page) {
  // Hide all pages
  document.querySelectorAll(".page-content").forEach((p) => p.classList.add("hidden"))

  // Show target page
  const targetPage = document.getElementById(`${page}-page`)
  if (targetPage) {
    targetPage.classList.remove("hidden")
    currentPage = page
  }

  // Update active nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === page)
  })
}

// Theme
function setupTheme() {
  const themeBtn = document.getElementById("theme-btn")
  const themeIcon = document.getElementById("theme-icon")

  // Set default theme to dark
  const savedTheme = localStorage.getItem("theme") || "theme-dark"
  document.documentElement.className = savedTheme
  updateThemeIcon(savedTheme)

  themeBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.className
    const newTheme = currentTheme === "theme-dark" ? "theme-light" : "theme-dark"

    document.documentElement.className = newTheme
    localStorage.setItem("theme", newTheme)
    updateThemeIcon(newTheme)
  })

  function updateThemeIcon(theme) {
    themeIcon.className = theme === "theme-dark" ? "fas fa-sun" : "fas fa-moon"
  }
}

// Admin functionality
function setupAdminEventListeners() {
  const loginBtn = document.getElementById("login-btn")
  const createUserBtn = document.getElementById("create-user-btn")
  const updateUserBtn = document.getElementById("update-user-btn")

  loginBtn?.addEventListener("click", handleAdminLogin)
  createUserBtn?.addEventListener("click", handleCreateUser)
  updateUserBtn?.addEventListener("click", handleUpdateUser)

  // Admin tabs
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.dataset.tab
      switchAdminTab(tabId)
    })
  })
}

async function handleAdminLogin() {
  const secretCodeInput = document.getElementById("secret-code")
  secretCode = secretCodeInput.value

  if (secretCode === "zabsxzeta") {
    document.getElementById("admin-login").classList.add("hidden")
    document.getElementById("admin-panel").classList.remove("hidden")

    console.log("Admin login successful, loading users...")
    await loadUsers()
  } else {
    alert("Invalid secret code")
  }
}

async function handleCreateUser() {
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const apikey = document.getElementById("apikey").value
  const limit = document.getElementById("limit").value

  if (!username || !password || !apikey || !limit) {
    alert("All fields are required")
    return
  }

  try {
    const response = await fetch(
      `/system/create-users?username=${username}&password=${password}&userkey=${apikey}&limit=${limit}&secretcode=${secretCode}`,
    )
    const data = await response.json()

    if (data.status) {
      alert("User created successfully")
      clearCreateUserForm()
      await loadUsers()
    } else {
      alert(`Error: ${data.error}`)
    }
  } catch (error) {
    alert(`Error: ${error.message}`)
  }
}

async function handleUpdateUser() {
  const username = document.getElementById("edit-username").value
  const newkey = document.getElementById("edit-apikey").value
  const newlimit = document.getElementById("edit-limit").value

  try {
    const response = await fetch(
      `/system/update-apikey?username=${username}&newkey=${newkey}&newlimit=${newlimit}&secretcode=${secretCode}`,
    )
    const data = await response.json()

    if (data.status) {
      alert("User updated successfully")
      closeEditModal()
      await loadUsers()
    } else {
      alert(`Error: ${data.error}`)
    }
  } catch (error) {
    alert(`Error: ${error.message}`)
  }
}

async function loadUsers() {
  try {
    // Try to fetch users data directly from the API endpoint
    const response = await fetch(`/system/get-users?secretcode=${secretCode}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (!result.status) {
      throw new Error(result.error || "Failed to load users")
    }

    const users = result.data || result.users || []

    const tableBody = document.getElementById("users-table")
    if (!tableBody) {
      console.error("Table body element not found")
      return
    }

    tableBody.innerHTML = ""

    if (users.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 2rem;">
          <i class="fas fa-users"></i><br>
          No users found
        </td>
      `
      tableBody.appendChild(row)
      return
    }

    users.forEach((user) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${user.username}</td>
        <td><code style="background: var(--glass-bg); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">${user.apikey}</code></td>
        <td>${user.limit === null ? "Unlimited" : user.limit}</td>
        <td>${user.currentLimit === null ? "Unlimited" : user.currentLimit}</td>
        <td>
          <button class="action-btn edit" onclick="editUser('${user.username}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteUser('${user.username}')">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `
      tableBody.appendChild(row)
    })

    console.log(`Loaded ${users.length} users successfully`)
  } catch (error) {
    console.error("Error loading users:", error)

    const tableBody = document.getElementById("users-table")
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #ef4444; padding: 2rem;">
            <i class="fas fa-exclamation-triangle"></i><br>
            Error loading users: ${error.message}
          </td>
        </tr>
      `
    }

    alert(`Failed to load users: ${error.message}`)
  }
}

function editUser(username) {
  console.log("Editing user:", username)
  document.getElementById("edit-username").value = username

  // Pre-fill current data if available
  const tableRows = document.querySelectorAll("#users-table tr")
  tableRows.forEach((row) => {
    const usernameCell = row.querySelector("td:first-child")
    if (usernameCell && usernameCell.textContent === username) {
      const apikeyCell = row.querySelector("td:nth-child(2) code")
      const limitCell = row.querySelector("td:nth-child(3)")

      if (apikeyCell) {
        document.getElementById("edit-apikey").value = apikeyCell.textContent
      }
      if (limitCell) {
        const limitText = limitCell.textContent
        document.getElementById("edit-limit").value = limitText === "Unlimited" ? "unlimited" : limitText
      }
    }
  })

  document.getElementById("edit-modal").classList.add("active")
}

async function deleteUser(username) {
  if (confirm(`Are you sure you want to delete user "${username}"?\n\nThis action cannot be undone.`)) {
    try {
      console.log("Deleting user:", username)

      const response = await fetch(
        `/system/delete-users?username=${encodeURIComponent(username)}&secretcode=${secretCode}`,
      )
      const data = await response.json()

      if (data.status) {
        alert("User deleted successfully!")
        await loadUsers() // Reload the users table
      } else {
        alert(`Error deleting user: ${data.error}`)
      }
    } catch (error) {
      console.error("Delete user error:", error)
      alert(`Error deleting user: ${error.message}`)
    }
  }
}

function switchAdminTab(tabId) {
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabId)
  })

  document.querySelectorAll(".admin-content").forEach((content) => {
    content.classList.toggle("active", content.id === tabId)
  })

  // Auto-load users when switching to manage users tab
  if (tabId === "manage-users" && secretCode) {
    loadUsers()
  }
}

function clearCreateUserForm() {
  document.getElementById("username").value = ""
  document.getElementById("password").value = ""
  document.getElementById("apikey").value = ""
  document.getElementById("limit").value = ""
}

// Loader functions
function showLoader() {
  document.getElementById("page-loader").style.display = "flex"
}

function hideLoader() {
  setTimeout(() => {
    const loader = document.getElementById("page-loader")
    loader.style.opacity = "0"
    setTimeout(() => {
      loader.style.display = "none"
    }, 500)
  }, 1000)
}
