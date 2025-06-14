// JavaScript Email & Password Manager with Animations and Dark Mode

class EmailPasswordManager {
  constructor() {
    // Initialize empty arrays for emails and passwords
    this.emails = []
    this.passwords = []

    // Initialize DOM elements
    this.initializeElements()

    // Set up event listeners
    this.setupEventListeners()

    // Initialize theme
    this.initializeTheme()

    // Update UI
    this.updateUI()

    console.log("📧 Email & Password Manager initialized!")
    console.log("📊 Arrays created:", { emails: this.emails, passwords: this.passwords })
  }

  initializeElements() {
    // Input elements
    this.newEmailInput = document.getElementById("newEmail")
    this.newPasswordInput = document.getElementById("newPassword")
    this.loginEmailInput = document.getElementById("loginEmail")
    this.loginPasswordInput = document.getElementById("loginPassword")

    // Button elements
    this.addCredentialsBtn = document.getElementById("addCredentialsBtn")
    this.validateBtn = document.getElementById("validateBtn")
    this.themeToggle = document.getElementById("themeToggle")

    // Display elements
    this.emailsList = document.getElementById("emailsList")
    this.passwordsList = document.getElementById("passwordsList")
    this.emailCount = document.getElementById("emailCount")
    this.passwordCount = document.getElementById("passwordCount")
    this.emailMinText = document.getElementById("emailMinText")
    this.passwordMinText = document.getElementById("passwordMinText")
    this.validationResult = document.getElementById("validationResult")

    // Status badges
    this.emailBadge = document.getElementById("emailBadge")
    this.passwordBadge = document.getElementById("passwordBadge")
    this.syncBadge = document.getElementById("syncBadge")

    // App container
    this.app = document.getElementById("app")
    this.particlesContainer = document.getElementById("particlesContainer")
  }

  setupEventListeners() {
    // Add credentials button
    this.addCredentialsBtn.addEventListener("click", () => this.addCredentials())

    // Validate credentials button
    this.validateBtn.addEventListener("click", () => this.validateCredentials())

    // Theme toggle
    this.themeToggle.addEventListener("change", () => this.toggleTheme())

    // Enter key support
    this.newEmailInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addCredentials()
    })

    this.newPasswordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addCredentials()
    })

    this.loginEmailInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.validateCredentials()
    })

    this.loginPasswordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.validateCredentials()
    })

    // Input animations
    ;[this.newEmailInput, this.newPasswordInput, this.loginEmailInput, this.loginPasswordInput].forEach((input) => {
      input.addEventListener("focus", (e) => this.animateInputFocus(e.target))
      input.addEventListener("blur", (e) => this.animateInputBlur(e.target))
    })
  }

  initializeTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme") || "light"
    if (savedTheme === "dark") {
      this.themeToggle.checked = true
      this.app.classList.remove("light-mode")
      this.app.classList.add("dark-mode")
    }
  }

  toggleTheme() {
    const isDark = this.themeToggle.checked

    if (isDark) {
      this.app.classList.remove("light-mode")
      this.app.classList.add("dark-mode")
      localStorage.setItem("theme", "dark")
      this.createThemeTransitionEffect("dark")
    } else {
      this.app.classList.remove("dark-mode")
      this.app.classList.add("light-mode")
      localStorage.setItem("theme", "light")
      this.createThemeTransitionEffect("light")
    }

    console.log(`🎨 Theme switched to: ${isDark ? "Dark" : "Light"} mode`)
  }

  createThemeTransitionEffect(theme) {
    // Create ripple effect for theme transition
    const ripple = document.createElement("div")
    ripple.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: ${theme === "dark" ? "radial-gradient(circle, #1e1b4b, #581c87)" : "radial-gradient(circle, #e0f2fe, #f3e8ff)"};
            transform: translate(-50%, -50%);
            z-index: 9999;
            pointer-events: none;
            transition: all 0.8s ease-out;
        `

    document.body.appendChild(ripple)

    // Trigger animation
    setTimeout(() => {
      ripple.style.width = "200vmax"
      ripple.style.height = "200vmax"
    }, 10)

    // Remove ripple after animation
    setTimeout(() => {
      document.body.removeChild(ripple)
    }, 800)
  }

  addCredentials() {
    const email = this.newEmailInput.value.trim()
    const password = this.newPasswordInput.value.trim()

    // Validation
    if (!email || !password) {
      this.showNotification("Please fill in both email and password fields", "error")
      return
    }

    if (!this.isValidEmail(email)) {
      this.showNotification("Please enter a valid email address", "error")
      return
    }

    // Push to arrays simultaneously
    this.emails.push(email)
    this.passwords.push(password)

    console.log(
      `✅ Added credentials: Email[${this.emails.length - 1}] = ${email}, Password[${this.passwords.length - 1}] = ${"•".repeat(password.length)}`,
    )
    console.log("📊 Current arrays:", { emails: this.emails, passwords: this.passwords })

    // Clear inputs with animation
    this.clearInputsWithAnimation()

    // Update UI
    this.updateUI()

    // Show success notification
    this.showNotification("Credentials added successfully!", "success")

    // Create particles if we reach 5 items
    if (this.emails.length >= 5) {
      this.createParticleEffect()
    }

    // Animate button
    this.animateButton(this.addCredentialsBtn)
  }

  removeCredentials(index) {
    // Remove from both arrays simultaneously using the same index
    const removedEmail = this.emails[index]
    const removedPassword = this.passwords[index]

    this.emails.splice(index, 1)
    this.passwords.splice(index, 1)

    console.log(`🗑️ Removed credentials at index ${index}: ${removedEmail}`)
    console.log("📊 Updated arrays:", { emails: this.emails, passwords: this.passwords })

    // Update UI with animation
    this.updateUI()

    this.showNotification("Credentials removed successfully!", "success")
  }

  validateCredentials() {
    const email = this.loginEmailInput.value.trim()
    const password = this.loginPasswordInput.value.trim()

    if (!email || !password) {
      this.showValidationResult("Please fill in both email and password fields", false)
      return
    }

    // Find the index of the email in the emails array
    const emailIndex = this.emails.findIndex((e) => e === email)

    console.log(`🔍 Searching for email: ${email}`)
    console.log(`📍 Email found at index: ${emailIndex}`)

    if (emailIndex === -1) {
      this.showValidationResult("Email not found in the system", false)
      console.log("❌ Email not found in emails array")
      return
    }

    // Get the password at the same index
    const correspondingPassword = this.passwords[emailIndex]
    console.log(`🔐 Checking password at index ${emailIndex}`)

    // Check if passwords match
    if (correspondingPassword === password) {
      this.showValidationResult("Login successful! Email and password match.", true)
      console.log("✅ Password validation successful")
      this.createParticleEffect()
    } else {
      this.showValidationResult("Invalid password for this email", false)
      console.log("❌ Password validation failed")
    }

    // Animate validation button
    this.animateButton(this.validateBtn)
  }

  updateUI() {
    this.updateArraysDisplay()
    this.updateCounts()
    this.updateStatusBadges()
    this.updateButtonStates()
  }

  updateArraysDisplay() {
    // Update emails list
    if (this.emails.length === 0) {
      this.emailsList.innerHTML = '<p class="empty-message">No emails added yet</p>'
    } else {
      this.emailsList.innerHTML = this.emails
        .map(
          (email, index) => `
                <div class="array-item" style="animation-delay: ${index * 0.1}s">
                    <span class="array-item-text">[${index}] ${email}</span>
                    <button class="delete-btn" onclick="window.manager.removeCredentials(${index})">🗑️</button>
                </div>
            `,
        )
        .join("")
    }

    // Update passwords list
    if (this.passwords.length === 0) {
      this.passwordsList.innerHTML = '<p class="empty-message">No passwords added yet</p>'
    } else {
      this.passwordsList.innerHTML = this.passwords
        .map(
          (password, index) => `
                <div class="array-item" style="animation-delay: ${index * 0.1}s">
                    <span class="array-item-text">[${index}] ${"•".repeat(password.length)}</span>
                    <button class="delete-btn" onclick="window.manager.removeCredentials(${index})">🗑️</button>
                </div>
            `,
        )
        .join("")
    }
  }

  updateCounts() {
    // Update count badges with animation
    this.emailCount.textContent = this.emails.length
    this.passwordCount.textContent = this.passwords.length

    // Update minimum text
    if (this.emails.length < 5) {
      this.emailMinText.textContent = ` (Add ${5 - this.emails.length} more to reach minimum)`
    } else {
      this.emailMinText.textContent = " ✅ Minimum reached!"
    }

    if (this.passwords.length < 5) {
      this.passwordMinText.textContent = ` (Add ${5 - this.passwords.length} more to reach minimum)`
    } else {
      this.passwordMinText.textContent = " ✅ Minimum reached!"
    }
  }

  updateStatusBadges() {
    // Update email badge
    this.emailBadge.textContent = `Emails: ${this.emails.length}/5 minimum`
    this.emailBadge.className = `badge ${this.emails.length >= 5 ? "badge-success" : "badge-secondary"}`

    // Update password badge
    this.passwordBadge.textContent = `Passwords: ${this.passwords.length}/5 minimum`
    this.passwordBadge.className = `badge ${this.passwords.length >= 5 ? "badge-success" : "badge-secondary"}`

    // Update sync badge
    const isSync = this.emails.length === this.passwords.length
    this.syncBadge.textContent = `Arrays Synchronized: ${isSync ? "Yes" : "No"}`
    this.syncBadge.className = `badge ${isSync ? "badge-success" : "badge-danger"}`
  }

  updateButtonStates() {
    // Update add credentials button
    const canAdd = this.newEmailInput.value.trim() && this.newPasswordInput.value.trim()
    this.addCredentialsBtn.disabled = !canAdd

    // Update validate button
    const canValidate =
      this.loginEmailInput.value.trim() && this.loginPasswordInput.value.trim() && this.emails.length > 0
    this.validateBtn.disabled = !canValidate
  }

  showValidationResult(message, isSuccess) {
    this.validationResult.className = `validation-result ${isSuccess ? "success" : "error"}`
    this.validationResult.innerHTML = `
            <span>${isSuccess ? "✅" : "❌"}</span>
            <span>${message}</span>
        `
    this.validationResult.classList.remove("hidden")

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.validationResult.classList.add("hidden")
    }, 5000)
  }

  showNotification(message, type) {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === "success" ? "#10b981" : "#ef4444"};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.animation = "slideInRight 0.3s ease-out reverse"
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  createParticleEffect() {
    const colors = this.app.classList.contains("dark-mode")
      ? ["#8b5cf6", "#ec4899", "#f59e0b"]
      : ["#3b82f6", "#10b981", "#f59e0b"]

    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const particle = document.createElement("div")
        particle.className = "particle"
        particle.style.cssText = `
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: 50%;
                    top: 50%;
                    animation: particleFloat ${2 + Math.random() * 2}s ease-out forwards;
                `

        this.particlesContainer.appendChild(particle)

        // Animate particle
        const angle = (Math.PI * 2 * i) / 20
        const velocity = 100 + Math.random() * 100
        const x = Math.cos(angle) * velocity
        const y = Math.sin(angle) * velocity

        particle.animate(
          [
            { transform: "translate(-50%, -50%) scale(0)", opacity: 1 },
            { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`, opacity: 1, offset: 0.7 },
            { transform: `translate(calc(-50% + ${x * 1.5}px), calc(-50% + ${y * 1.5}px)) scale(0)`, opacity: 0 },
          ],
          {
            duration: 2000,
            easing: "ease-out",
          },
        ).onfinish = () => {
          this.particlesContainer.removeChild(particle)
        }
      }, i * 50)
    }
  }

  animateButton(button) {
    button.style.transform = "scale(0.95)"
    setTimeout(() => {
      button.style.transform = "scale(1)"
    }, 150)
  }

  animateInputFocus(input) {
    input.style.transform = "scale(1.02)"
  }

  animateInputBlur(input) {
    input.style.transform = "scale(1)"
  }

  clearInputsWithAnimation() {
    ;[this.newEmailInput, this.newPasswordInput].forEach((input) => {
      input.style.animation = "fadeOut 0.3s ease-out"
      setTimeout(() => {
        input.value = ""
        input.style.animation = "fadeIn 0.3s ease-out"
      }, 300)
    })
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

// Initialize the manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Create global manager instance
  window.manager = new EmailPasswordManager()

  // Add input event listeners for real-time button state updates
  ;["newEmail", "newPassword", "loginEmail", "loginPassword"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      window.manager.updateButtonStates()
    })
  })

  console.log("🚀 Application fully loaded and ready!")
})

// Add additional CSS animations
const additionalStyles = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes particleFloat {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        70% { transform: translate(var(--x), var(--y)) scale(1); opacity: 1; }
        100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
    }
`

// Inject additional styles
const styleSheet = document.createElement("style")
styleSheet.textContent = additionalStyles
document.head.appendChild(styleSheet)
