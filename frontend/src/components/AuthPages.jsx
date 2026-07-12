import { useState } from 'react'
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from './Illustrations.jsx'
import SiteChrome from './SiteChrome.jsx'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const mobilePattern = /^\d{10}$/

function AuthInput({
  error,
  icon: Icon,
  label,
  name,
  onChange,
  placeholder,
  type = 'text',
  value,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const isPasswordField = type === 'password'

  return (
    <label className="auth-field" htmlFor={name}>
      <span className="auth-field__label">{label}</span>
      <div className={`auth-input ${error ? 'is-error' : ''}`}>
        <span className="auth-input__icon">
          <Icon />
        </span>
        <input
          id={name}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          type={isPasswordField && isVisible ? 'text' : type}
          value={value}
        />
        {isPasswordField ? (
          <button
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            className="auth-input__toggle"
            onClick={() => setIsVisible((currentValue) => !currentValue)}
            type="button"
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : null}
      </div>
      {error ? <span className="auth-field__error">{error}</span> : null}
    </label>
  )
}

function AuthHero() {
  return (
    <aside className="auth-panel auth-panel--accent">
      <span className="auth-badge">Secure Herbal Account</span>
      <h2>Nature-first shopping with a trusted personal account.</h2>
      <p>
        Save addresses, track orders, manage wishlist items, and keep your herbal wellness
        journey organised in one clean dashboard.
      </p>
      <div className="auth-benefits">
        <div className="auth-benefit">
          <strong>Order Tracking</strong>
          <span>View live status updates for every purchase.</span>
        </div>
        <div className="auth-benefit">
          <strong>Saved Address</strong>
          <span>Checkout faster with your preferred delivery details.</span>
        </div>
        <div className="auth-benefit">
          <strong>Wishlist & Cart</strong>
          <span>Keep your favourite herbal products ready for later.</span>
        </div>
      </div>
    </aside>
  )
}

function LoginPage({
  currentUser,
  data,
  flashMessage,
  onLogin,
  onLogout,
}) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')
  const [forgotMessage, setForgotMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentValue) => ({ ...currentValue, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
    setFormMessage('')
  }

  function validateForm() {
    const nextErrors = {}

    if (!formData.identifier.trim()) {
      nextErrors.identifier = 'Email or mobile number is required.'
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.'
    }

    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateForm()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const result = await onLogin(formData)

    if (!result.ok) {
      setFormMessage(result.error)
    }
  }

  return (
    <SiteChrome
      currentPage="login"
      currentUser={currentUser}
      data={data}
      flashMessage={flashMessage}
      onLogout={onLogout}
    >
      <section className="auth-page">
        <div className="auth-card surface-card">
          <div className="auth-panel auth-panel--form">
            <span className="auth-kicker">Account Access</span>
            <h1>Login to Your Account</h1>
            <p className="auth-subtitle">Welcome back! Please login to continue shopping.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <AuthInput
                error={errors.identifier}
                icon={MailIcon}
                label="Email or Mobile Number"
                name="identifier"
                onChange={handleChange}
                placeholder="Enter your email or mobile number"
                value={formData.identifier}
              />

              <AuthInput
                error={errors.password}
                icon={LockIcon}
                label="Password"
                name="password"
                onChange={handleChange}
                placeholder="Enter your password"
                type="password"
                value={formData.password}
              />

              <div className="auth-form__meta">
                <button
                  className="auth-link auth-link--inline"
                  onClick={() =>
                    setForgotMessage('Please contact support or use your registered email to reset your password.')
                  }
                  type="button"
                >
                  Forgot Password?
                </button>
              </div>

              {forgotMessage ? <p className="auth-form__helper">{forgotMessage}</p> : null}
              {formMessage ? <p className="auth-form__error">{formMessage}</p> : null}

              <button className="auth-submit" type="submit">
                Login
              </button>
            </form>

            <p className="auth-switch">
              Don&apos;t have an account? <a href="#/signup">Sign Up</a>
            </p>
            <p className="auth-switch auth-switch--admin">
              Need admin access? <a href="#/admin/login">Admin Login</a>
            </p>
          </div>

          <AuthHero />
        </div>
      </section>
    </SiteChrome>
  )
}

function SignupPage({
  currentUser,
  data,
  flashMessage,
  onLogout,
  onSignup,
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')

  function handleChange(event) {
    const { checked, name, type, value } = event.target
    setFormData((currentValue) => ({
      ...currentValue,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
    setFormMessage('')
  }

  function validateForm() {
    const nextErrors = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full Name is required.'
    }

    if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!mobilePattern.test(formData.mobile.trim())) {
      nextErrors.mobile = 'Mobile number must be exactly 10 digits.'
    }

    if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = 'Confirm Password must match Password.'
    }

    if (!formData.acceptedTerms) {
      nextErrors.acceptedTerms = 'Please accept Terms & Conditions and Privacy Policy.'
    }

    return nextErrors
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateForm()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const result = onSignup(formData)

    if (!result.ok) {
      if (result.field) {
        setErrors((currentErrors) => ({ ...currentErrors, [result.field]: result.error }))
        return
      }

      setFormMessage(result.error)
    }
  }

  return (
    <SiteChrome
      currentPage="signup"
      currentUser={currentUser}
      data={data}
      flashMessage={flashMessage}
      onLogout={onLogout}
    >
      <section className="auth-page">
        <div className="auth-card surface-card">
          <div className="auth-panel auth-panel--form">
            <span className="auth-kicker">Create Herbal Profile</span>
            <h1>Create Your Account</h1>
            <p className="auth-subtitle">
              Join us and start shopping natural herbal products.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <AuthInput
                error={errors.fullName}
                icon={UserIcon}
                label="Full Name"
                name="fullName"
                onChange={handleChange}
                placeholder="Enter your full name"
                value={formData.fullName}
              />

              <AuthInput
                error={errors.email}
                icon={MailIcon}
                label="Email Address"
                name="email"
                onChange={handleChange}
                placeholder="Enter your email address"
                value={formData.email}
              />

              <AuthInput
                error={errors.mobile}
                icon={PhoneIcon}
                label="Mobile Number"
                name="mobile"
                onChange={handleChange}
                placeholder="Enter your 10 digit mobile number"
                value={formData.mobile}
              />

              <AuthInput
                error={errors.password}
                icon={LockIcon}
                label="Password"
                name="password"
                onChange={handleChange}
                placeholder="Create a password"
                type="password"
                value={formData.password}
              />

              <AuthInput
                error={errors.confirmPassword}
                icon={LockIcon}
                label="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Confirm your password"
                type="password"
                value={formData.confirmPassword}
              />

              <label className="auth-checkbox">
                <input
                  checked={formData.acceptedTerms}
                  name="acceptedTerms"
                  onChange={handleChange}
                  type="checkbox"
                />
                <span>I agree to Terms &amp; Conditions and Privacy Policy</span>
              </label>
              {errors.acceptedTerms ? (
                <span className="auth-field__error">{errors.acceptedTerms}</span>
              ) : null}

              {formMessage ? <p className="auth-form__error">{formMessage}</p> : null}

              <button className="auth-submit" type="submit">
                Create Account
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <a href="#/login">Login</a>
            </p>
          </div>

          <AuthHero />
        </div>
      </section>
    </SiteChrome>
  )
}

export { LoginPage, SignupPage }
