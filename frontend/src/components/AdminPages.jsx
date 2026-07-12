import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import {
  BrandLogo,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
} from './Illustrations.jsx'

const defaultCredentials = {
  identifier: 'admin@stherbal.com',
  password: 'admin123',
}

const dashboardSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'general', label: 'General' },
  { id: 'hero', label: 'Hero Banner' },
  { id: 'categories', label: 'Categories' },
  { id: 'shop', label: 'Shop & Products' },
  { id: 'about', label: 'About Page' },
  { id: 'contact', label: 'Contact Page' },
  { id: 'advanced', label: 'Full JSON' },
]

function cloneData(value) {
  return JSON.parse(JSON.stringify(value))
}

function prettyJson(value) {
  return JSON.stringify(value, null, 2)
}

function AdminInput({
  icon: Icon,
  label,
  name,
  onChange,
  placeholder,
  type = 'text',
  value,
  error,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const isPasswordField = type === 'password'

  return (
    <label className="admin-field">
      <span className="admin-field__label">{label}</span>
      <div className={`admin-field__control ${error ? 'is-error' : ''}`}>
        {Icon ? (
          <span className="admin-field__icon">
            <Icon />
          </span>
        ) : null}
        <input
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          type={isPasswordField && isVisible ? 'text' : type}
          value={value}
        />
        {isPasswordField ? (
          <button
            className="admin-field__toggle"
            onClick={() => setIsVisible((currentValue) => !currentValue)}
            type="button"
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : null}
      </div>
      {error ? <span className="admin-field__error">{error}</span> : null}
    </label>
  )
}

function AdminTextarea({ label, hint, onChange, rows = 8, value }) {
  return (
    <label className="admin-field">
      <span className="admin-field__label">{label}</span>
      <textarea className="admin-field__textarea" onChange={onChange} rows={rows} value={value} />
      {hint ? <span className="admin-field__hint">{hint}</span> : null}
    </label>
  )
}

function AdminSectionCard({ title, subtitle, children, actions }) {
  return (
    <section className="admin-card surface-card">
      <div className="admin-card__header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div className="admin-card__actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}

function updateArrayItem(items, index, field, value) {
  return items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
}

function AdminLoginPage({ adminSession, onAdminLogin }) {
  const [formData, setFormData] = useState(defaultCredentials)
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentValue) => ({ ...currentValue, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
    setFormMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}

    if (!formData.identifier.trim()) {
      nextErrors.identifier = 'Admin email is required.'
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setFormMessage('')

    try {
      const result = await onAdminLogin(formData)

      if (!result.ok) {
        setFormMessage(result.error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="admin-login-page">
      <div className="admin-login-card surface-card">
        <div className="admin-login-card__brand">
          <a href="#/">
            <BrandLogo />
          </a>
          <span className="admin-login-badge">Admin Access</span>
        </div>

        <div className="admin-login-card__content">
          <div className="admin-login-card__intro">
            <h1>ST Herbal India Admin Panel</h1>
            <p>
              Login karke aap homepage banners, categories, products, About page,
              Contact page aur full website content manage kar sakte ho.
            </p>
          </div>

          <div className="admin-login-hint">
            <strong>Default Login</strong>
            <span>Email: {defaultCredentials.identifier}</span>
            <span>Password: {defaultCredentials.password}</span>
          </div>

          {adminSession ? (
            <div className="admin-login-active">
              <p>You are already logged in as admin.</p>
              <a className="admin-button admin-button--primary" href="#/admin">
                Open Dashboard
              </a>
            </div>
          ) : (
            <form className="admin-login-form" onSubmit={handleSubmit}>
                <AdminInput
                  error={errors.identifier}
                  icon={MailIcon}
                  label="Admin Email"
                  name="identifier"
                  onChange={handleChange}
                  placeholder="Enter admin email"
                  value={formData.identifier}
                  type="email"
                />

              <AdminInput
                error={errors.password}
                icon={LockIcon}
                label="Password"
                name="password"
                onChange={handleChange}
                placeholder="Enter password"
                value={formData.password}
                type="password"
              />

              {formMessage ? <div className="admin-form-message is-error">{formMessage}</div> : null}

              <button className="admin-button admin-button--primary" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Logging in...' : 'Login to Dashboard'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function AdminDashboardPage({
  adminSession,
  data,
  onAdminLogout,
  onAdminSessionExpired,
  onContentSaved,
}) {
  const [draft, setDraft] = useState(() => cloneData(data))
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [productsJson, setProductsJson] = useState(() => prettyJson(data?.shop?.products ?? []))
  const [productsJsonDirty, setProductsJsonDirty] = useState(false)
  const [fullJson, setFullJson] = useState(() => prettyJson(data))
  const [fullJsonDirty, setFullJsonDirty] = useState(false)
  const notifySessionExpired = useEffectEvent(() => {
    onAdminSessionExpired?.()
  })
  const notifyContentLoaded = useEffectEvent((content) => {
    onContentSaved?.(content, { silent: true })
  })

  useEffect(() => {
    if (!productsJsonDirty) {
      setProductsJson(prettyJson(draft?.shop?.products ?? []))
    }
  }, [draft, productsJsonDirty])

  useEffect(() => {
    if (!fullJsonDirty) {
      setFullJson(prettyJson(draft))
    }
  }, [draft, fullJsonDirty])

  useEffect(() => {
    let isCancelled = false

    async function loadProtectedContent() {
      if (!adminSession?.token) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await fetch('/api/admin/content', {
          headers: {
            Authorization: `Bearer ${adminSession.token}`,
          },
        })

        if (response.status === 401) {
          notifySessionExpired()
          return
        }

        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload.error || 'Unable to load admin content.')
        }

        if (isCancelled) {
          return
        }

        const nextDraft = cloneData(payload.content)
        setDraft(nextDraft)
        setProductsJson(prettyJson(nextDraft?.shop?.products ?? []))
        setProductsJsonDirty(false)
        setFullJson(prettyJson(nextDraft))
        setFullJsonDirty(false)
        notifyContentLoaded(payload.content)
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load admin data.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadProtectedContent()

    return () => {
      isCancelled = true
    }
  }, [adminSession?.token])

  const metrics = useMemo(
    () => [
      { label: 'Hero Slides', value: draft?.hero?.slides?.length ?? 0 },
      { label: 'Categories', value: draft?.categories?.length ?? 0 },
      { label: 'Products', value: draft?.shop?.products?.length ?? 0 },
      { label: 'Home Sections', value: draft?.sections?.length ?? 0 },
    ],
    [draft],
  )

  function updateDraft(transform) {
    setDraft((currentValue) => {
      const nextDraft = cloneData(currentValue)
      transform(nextDraft)
      return nextDraft
    })
    setStatusMessage('')
    setErrorMessage('')
  }

  function replaceDraft(nextDraft) {
    setDraft(cloneData(nextDraft))
    setStatusMessage('')
    setErrorMessage('')
  }

  function applyProductsJson() {
    try {
      const parsedProducts = JSON.parse(productsJson)

      if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
        throw new Error('Products JSON must be a non-empty array.')
      }

      updateDraft((nextDraft) => {
        nextDraft.shop.products = parsedProducts
      })
      setProductsJsonDirty(false)
      setStatusMessage('Product catalog draft updated.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Products JSON is invalid.')
    }
  }

  function applyFullJson() {
    try {
      const parsedContent = JSON.parse(fullJson)
      replaceDraft(parsedContent)
      setFullJsonDirty(false)
      setProductsJsonDirty(false)
      setStatusMessage('Full JSON draft applied successfully.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Full JSON is invalid.')
    }
  }

  async function handleSave() {
    setIsSaving(true)
    setStatusMessage('')
    setErrorMessage('')

    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSession.token}`,
        },
        body: JSON.stringify(draft),
      })

      if (response.status === 401) {
        onAdminSessionExpired?.()
        return
      }

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to save content.')
      }

      replaceDraft(payload.content)
      setProductsJson(prettyJson(payload.content?.shop?.products ?? []))
      setProductsJsonDirty(false)
      setFullJson(prettyJson(payload.content))
      setFullJsonDirty(false)
      setStatusMessage(payload.message || 'Website content updated successfully.')
      onContentSaved?.(payload.content)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save website content.')
    } finally {
      setIsSaving(false)
    }
  }

  function resetToCurrentContent() {
    replaceDraft(data)
    setProductsJson(prettyJson(data?.shop?.products ?? []))
    setProductsJsonDirty(false)
    setFullJson(prettyJson(data))
    setFullJsonDirty(false)
    setStatusMessage('Draft reset to current live website content.')
  }

  const heroSlides = Array.isArray(draft?.hero?.slides) ? draft.hero.slides : []
  const categories = Array.isArray(draft?.categories) ? draft.categories : []
  const promiseCards = Array.isArray(draft?.about?.promiseCards) ? draft.about.promiseCards : []
  const aboutValues = Array.isArray(draft?.about?.values) ? draft.about.values : []
  const blogPosts = Array.isArray(draft?.about?.blog?.posts) ? draft.about.blog.posts : []
  const contactBlocks = Array.isArray(draft?.contact?.infoBlocks) ? draft.contact.infoBlocks : []

  return (
    <section className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <a href="#/">
            <BrandLogo />
          </a>
          <span className="admin-login-badge">Content Manager</span>
        </div>

        <div className="admin-sidebar__user">
          <strong>{adminSession?.displayName ?? 'ST Herbal Admin'}</strong>
          <span>{adminSession?.identifier}</span>
        </div>

        <nav className="admin-sidebar__nav">
          {dashboardSections.map((section) => (
            <button
              className={`admin-sidebar__link ${activeSection === section.id ? 'is-active' : ''}`}
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              type="button"
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar__actions">
          <a className="admin-button admin-button--ghost" href="#/" target="_blank" rel="noreferrer">
            Preview Website
          </a>
          <button className="admin-button admin-button--outline" onClick={onAdminLogout} type="button">
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar surface-card">
          <div>
            <span className="admin-topbar__eyebrow">ST Herbal India</span>
            <h1>Website Admin Dashboard</h1>
            <p>Banner se lekar footer tak sab content yahin se manage karo.</p>
          </div>

          <div className="admin-topbar__actions">
            <button className="admin-button admin-button--ghost" onClick={resetToCurrentContent} type="button">
              Reset Draft
            </button>
            <button className="admin-button admin-button--primary" disabled={isSaving} onClick={handleSave} type="button">
              {isSaving ? 'Saving...' : 'Save Website Changes'}
            </button>
          </div>
        </header>

        {statusMessage ? <div className="admin-form-message is-success">{statusMessage}</div> : null}
        {errorMessage ? <div className="admin-form-message is-error">{errorMessage}</div> : null}

        {isLoading ? (
          <div className="admin-loading surface-card">Loading secured admin content...</div>
        ) : (
          <div className="admin-content">
            {activeSection === 'overview' ? (
              <AdminSectionCard
                title="Overview"
                subtitle="Quick summary of the editable website content."
              >
                <div className="admin-metrics">
                  {metrics.map((metric) => (
                    <article className="admin-metric" key={metric.label}>
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </article>
                  ))}
                </div>

                <div className="admin-overview-grid">
                  <div className="admin-overview-item">
                    <span>Brand Name</span>
                    <strong>{draft?.header?.brand}</strong>
                  </div>
                  <div className="admin-overview-item">
                    <span>Support Phone</span>
                    <strong>{draft?.footer?.phone}</strong>
                  </div>
                  <div className="admin-overview-item">
                    <span>Store Address</span>
                    <strong>{draft?.footer?.address}</strong>
                  </div>
                  <div className="admin-overview-item">
                    <span>Shop Banner CTA</span>
                    <strong>{draft?.shop?.banner?.ctaLabel}</strong>
                  </div>
                </div>
              </AdminSectionCard>
            ) : null}

            {activeSection === 'general' ? (
              <AdminSectionCard
                title="General Site Settings"
                subtitle="Header, promo bar, footer contact and newsletter text."
              >
                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Brand Name"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.header.brand = event.target.value
                      })
                    }
                    value={draft?.header?.brand ?? ''}
                  />
                  <AdminInput
                    label="Promo Phone"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.promoBar.phone = event.target.value
                      })
                    }
                    value={draft?.promoBar?.phone ?? ''}
                  />
                  <AdminInput
                    label="Promo Note"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.promoBar.note = event.target.value
                      })
                    }
                    value={draft?.promoBar?.note ?? ''}
                  />
                  <AdminInput
                    label="Promo Highlight"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.promoBar.highlight = event.target.value
                      })
                    }
                    value={draft?.promoBar?.highlight ?? ''}
                  />
                  <AdminInput
                    label="Footer Address"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.footer.address = event.target.value
                      })
                    }
                    value={draft?.footer?.address ?? ''}
                  />
                  <AdminInput
                    label="Footer Phone"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.footer.phone = event.target.value
                      })
                    }
                    value={draft?.footer?.phone ?? ''}
                  />
                  <AdminInput
                    label="Newsletter Title"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.footer.newsletterTitle = event.target.value
                      })
                    }
                    value={draft?.footer?.newsletterTitle ?? ''}
                  />
                  <AdminInput
                    label="Newsletter Button"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.footer.newsletterCta = event.target.value
                      })
                    }
                    value={draft?.footer?.newsletterCta ?? ''}
                  />
                </div>
              </AdminSectionCard>
            ) : null}

            {activeSection === 'hero' ? (
              <AdminSectionCard
                title="Hero Banner Manager"
                subtitle="Top homepage slider ke text aur images yahin se edit karo."
                actions={
                  <button
                    className="admin-button admin-button--ghost"
                    onClick={() =>
                      updateDraft((nextDraft) => {
                        nextDraft.hero.slides.push({
                          id: `slide-${Date.now()}`,
                          title: 'New Herbal Banner',
                          subtitle: 'Edit subtitle',
                          image: '/images/hero-banner-ashwagandha-final.png',
                          alt: 'New herbal banner',
                        })
                      })
                    }
                    type="button"
                  >
                    Add Slide
                  </button>
                }
              >
                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Hero Main Title"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.hero.title = event.target.value
                      })
                    }
                    value={draft?.hero?.title ?? ''}
                  />
                  <AdminInput
                    label="Hero Main Subtitle"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.hero.subtitle = event.target.value
                      })
                    }
                    value={draft?.hero?.subtitle ?? ''}
                  />
                </div>

                <div className="admin-stack">
                  {heroSlides.map((slide, index) => (
                    <article className="admin-repeat-card" key={slide.id || index}>
                      <div className="admin-repeat-card__header">
                        <strong>Slide {index + 1}</strong>
                        {heroSlides.length > 1 ? (
                          <button
                            className="admin-text-button is-danger"
                            onClick={() =>
                              updateDraft((nextDraft) => {
                                nextDraft.hero.slides = nextDraft.hero.slides.filter(
                                  (_, slideIndex) => slideIndex !== index,
                                )
                              })
                            }
                            type="button"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>

                      <div className="admin-grid admin-grid--two">
                        <AdminInput
                          label="Slide ID"
                          onChange={(event) =>
                            updateDraft((nextDraft) => {
                              nextDraft.hero.slides = updateArrayItem(
                                nextDraft.hero.slides,
                                index,
                                'id',
                                event.target.value,
                              )
                            })
                          }
                          value={slide.id ?? ''}
                        />
                        <AdminInput
                          label="Alt Text"
                          onChange={(event) =>
                            updateDraft((nextDraft) => {
                              nextDraft.hero.slides = updateArrayItem(
                                nextDraft.hero.slides,
                                index,
                                'alt',
                                event.target.value,
                              )
                            })
                          }
                          value={slide.alt ?? ''}
                        />
                        <AdminInput
                          label="Slide Title"
                          onChange={(event) =>
                            updateDraft((nextDraft) => {
                              nextDraft.hero.slides = updateArrayItem(
                                nextDraft.hero.slides,
                                index,
                                'title',
                                event.target.value,
                              )
                            })
                          }
                          value={slide.title ?? ''}
                        />
                        <AdminInput
                          label="Slide Subtitle"
                          onChange={(event) =>
                            updateDraft((nextDraft) => {
                              nextDraft.hero.slides = updateArrayItem(
                                nextDraft.hero.slides,
                                index,
                                'subtitle',
                                event.target.value,
                              )
                            })
                          }
                          value={slide.subtitle ?? ''}
                        />
                      </div>

                      <AdminInput
                        label="Image Path / URL"
                        onChange={(event) =>
                          updateDraft((nextDraft) => {
                            nextDraft.hero.slides = updateArrayItem(
                              nextDraft.hero.slides,
                              index,
                              'image',
                              event.target.value,
                            )
                          })
                        }
                        value={slide.image ?? ''}
                      />
                    </article>
                  ))}
                </div>
              </AdminSectionCard>
            ) : null}

            {activeSection === 'categories' ? (
              <AdminSectionCard
                title="Category Cards"
                subtitle="Homepage category cards ke title, subtitle aur images yahan edit karo."
                actions={
                  <button
                    className="admin-button admin-button--ghost"
                    onClick={() =>
                      updateDraft((nextDraft) => {
                        nextDraft.categories.push({
                          id: `category-${Date.now()}`,
                          title: 'New Category',
                          subtitle: 'Category subtitle',
                          image: '/images/categories/digestive-care.avif',
                          tone: 'mint',
                        })
                      })
                    }
                    type="button"
                  >
                    Add Category
                  </button>
                }
              >
                <div className="admin-stack">
                  {categories.map((category, index) => (
                    <article className="admin-repeat-card" key={category.id || index}>
                      <div className="admin-repeat-card__header">
                        <strong>Category {index + 1}</strong>
                        {categories.length > 1 ? (
                          <button
                            className="admin-text-button is-danger"
                            onClick={() =>
                              updateDraft((nextDraft) => {
                                nextDraft.categories = nextDraft.categories.filter(
                                  (_, categoryIndex) => categoryIndex !== index,
                                )
                              })
                            }
                            type="button"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>

                      <div className="admin-grid admin-grid--two">
                        <AdminInput
                          label="Category ID"
                          onChange={(event) =>
                            updateDraft((nextDraft) => {
                              nextDraft.categories = updateArrayItem(
                                nextDraft.categories,
                                index,
                                'id',
                                event.target.value,
                              )
                            })
                          }
                          value={category.id ?? ''}
                        />
                        <AdminInput
                          label="Tone"
                          onChange={(event) =>
                            updateDraft((nextDraft) => {
                              nextDraft.categories = updateArrayItem(
                                nextDraft.categories,
                                index,
                                'tone',
                                event.target.value,
                              )
                            })
                          }
                          value={category.tone ?? ''}
                        />
                        <AdminInput
                          label="Category Title"
                          onChange={(event) =>
                            updateDraft((nextDraft) => {
                              nextDraft.categories = updateArrayItem(
                                nextDraft.categories,
                                index,
                                'title',
                                event.target.value,
                              )
                            })
                          }
                          value={category.title ?? ''}
                        />
                        <AdminInput
                          label="Category Subtitle"
                          onChange={(event) =>
                            updateDraft((nextDraft) => {
                              nextDraft.categories = updateArrayItem(
                                nextDraft.categories,
                                index,
                                'subtitle',
                                event.target.value,
                              )
                            })
                          }
                          value={category.subtitle ?? ''}
                        />
                      </div>

                      <AdminInput
                        label="Image Path / URL"
                        onChange={(event) =>
                          updateDraft((nextDraft) => {
                            nextDraft.categories = updateArrayItem(
                              nextDraft.categories,
                              index,
                              'image',
                              event.target.value,
                            )
                          })
                        }
                        value={category.image ?? ''}
                      />
                    </article>
                  ))}
                </div>
              </AdminSectionCard>
            ) : null}

            {activeSection === 'shop' ? (
              <AdminSectionCard
                title="Shop Banner & Product Catalog"
                subtitle="Shop banner ke text aur pura product catalog JSON format me manage karo."
                actions={
                  <button className="admin-button admin-button--ghost" onClick={applyProductsJson} type="button">
                    Apply Product JSON
                  </button>
                }
              >
                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Banner Eyebrow"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.shop.banner.eyebrow = event.target.value
                      })
                    }
                    value={draft?.shop?.banner?.eyebrow ?? ''}
                  />
                  <AdminInput
                    label="Banner CTA"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.shop.banner.ctaLabel = event.target.value
                      })
                    }
                    value={draft?.shop?.banner?.ctaLabel ?? ''}
                  />
                  <AdminInput
                    label="Banner Title"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.shop.banner.title = event.target.value
                      })
                    }
                    value={draft?.shop?.banner?.title ?? ''}
                  />
                  <AdminInput
                    label="Banner Image Path / URL"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.shop.banner.image = event.target.value
                      })
                    }
                    value={draft?.shop?.banner?.image ?? ''}
                  />
                </div>

                <AdminTextarea
                  hint="Yahan पूरा product array JSON me edit karo. Save se pehle Apply Product JSON dabao."
                  label="Product Catalog JSON"
                  onChange={(event) => {
                    setProductsJson(event.target.value)
                    setProductsJsonDirty(true)
                  }}
                  rows={18}
                  value={productsJson}
                />
              </AdminSectionCard>
            ) : null}

            {activeSection === 'about' ? (
              <AdminSectionCard
                title="About Page Content"
                subtitle="About hero, story section aur blog cards ko manage karo."
              >
                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Hero Eyebrow"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.eyebrow = event.target.value
                      })
                    }
                    value={draft?.about?.eyebrow ?? ''}
                  />
                  <AdminInput
                    label="Hero Title"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.heroTitle = event.target.value
                      })
                    }
                    value={draft?.about?.heroTitle ?? ''}
                  />
                  <AdminInput
                    label="Story Eyebrow"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.story.eyebrow = event.target.value
                      })
                    }
                    value={draft?.about?.story?.eyebrow ?? ''}
                  />
                  <AdminInput
                    label="Story Title"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.story.title = event.target.value
                      })
                    }
                    value={draft?.about?.story?.title ?? ''}
                  />
                  <AdminInput
                    label="Story Image"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.story.image = event.target.value
                      })
                    }
                    value={draft?.about?.story?.image ?? ''}
                  />
                  <AdminInput
                    label="Decorative Mark Image"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.about.story.markImage = event.target.value
                      })
                    }
                    value={draft?.about?.story?.markImage ?? ''}
                  />
                </div>

                <AdminTextarea
                  hint="Each line ko alag paragraph ki tarah use kiya jayega."
                  label="Story Paragraphs"
                  onChange={(event) =>
                    updateDraft((nextDraft) => {
                      nextDraft.about.story.paragraphs = event.target.value
                        .split('\n')
                        .map((value) => value.trim())
                        .filter(Boolean)
                    })
                  }
                  rows={5}
                  value={(draft?.about?.story?.paragraphs ?? []).join('\n')}
                />

                <div className="admin-overview-grid">
                  <div className="admin-overview-item">
                    <span>Promise Cards</span>
                    <strong>{promiseCards.length}</strong>
                  </div>
                  <div className="admin-overview-item">
                    <span>Values</span>
                    <strong>{aboutValues.length}</strong>
                  </div>
                  <div className="admin-overview-item">
                    <span>Blog Posts</span>
                    <strong>{blogPosts.length}</strong>
                  </div>
                  <div className="admin-overview-item">
                    <span>Advanced Edit</span>
                    <strong>Use Full JSON tab</strong>
                  </div>
                </div>
              </AdminSectionCard>
            ) : null}

            {activeSection === 'contact' ? (
              <AdminSectionCard
                title="Contact Page"
                subtitle="Contact heading, map aur support blocks yahan se control karo."
              >
                <div className="admin-grid admin-grid--two">
                  <AdminInput
                    label="Contact Eyebrow"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.contact.eyebrow = event.target.value
                      })
                    }
                    value={draft?.contact?.eyebrow ?? ''}
                  />
                  <AdminInput
                    label="Contact Hero Title"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.contact.heroTitle = event.target.value
                      })
                    }
                    value={draft?.contact?.heroTitle ?? ''}
                  />
                  <AdminInput
                    label="Google Map Embed URL"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.contact.mapUrl = event.target.value
                      })
                    }
                    value={draft?.contact?.mapUrl ?? ''}
                  />
                  <AdminInput
                    label="Form Submit Button"
                    onChange={(event) =>
                      updateDraft((nextDraft) => {
                        nextDraft.contact.formSubmitLabel = event.target.value
                      })
                    }
                    value={draft?.contact?.formSubmitLabel ?? ''}
                  />
                </div>

                <div className="admin-stack">
                  {contactBlocks.map((block, index) => (
                    <article className="admin-repeat-card" key={block.id || index}>
                      <div className="admin-repeat-card__header">
                        <strong>Info Block {index + 1}</strong>
                      </div>

                      <div className="admin-grid admin-grid--two">
                        <AdminInput
                          label="Block ID"
                          onChange={(event) =>
                            updateDraft((nextDraft) => {
                              nextDraft.contact.infoBlocks = updateArrayItem(
                                nextDraft.contact.infoBlocks,
                                index,
                                'id',
                                event.target.value,
                              )
                            })
                          }
                          value={block.id ?? ''}
                        />
                        <AdminInput
                          label="Icon Name"
                          onChange={(event) =>
                            updateDraft((nextDraft) => {
                              nextDraft.contact.infoBlocks = updateArrayItem(
                                nextDraft.contact.infoBlocks,
                                index,
                                'icon',
                                event.target.value,
                              )
                            })
                          }
                          value={block.icon ?? ''}
                        />
                        <AdminInput
                          label="Title"
                          onChange={(event) =>
                            updateDraft((nextDraft) => {
                              nextDraft.contact.infoBlocks = updateArrayItem(
                                nextDraft.contact.infoBlocks,
                                index,
                                'title',
                                event.target.value,
                              )
                            })
                          }
                          value={block.title ?? ''}
                        />
                        <AdminInput
                          label="Value"
                          onChange={(event) =>
                            updateDraft((nextDraft) => {
                              nextDraft.contact.infoBlocks = updateArrayItem(
                                nextDraft.contact.infoBlocks,
                                index,
                                'value',
                                event.target.value,
                              )
                            })
                          }
                          value={block.value ?? ''}
                        />
                      </div>

                      <AdminTextarea
                        label="Helper Note"
                        onChange={(event) =>
                          updateDraft((nextDraft) => {
                            nextDraft.contact.infoBlocks = updateArrayItem(
                              nextDraft.contact.infoBlocks,
                              index,
                              'note',
                              event.target.value,
                            )
                          })
                        }
                        rows={3}
                        value={block.note ?? ''}
                      />
                    </article>
                  ))}
                </div>
              </AdminSectionCard>
            ) : null}

            {activeSection === 'advanced' ? (
              <AdminSectionCard
                title="Full Website JSON"
                subtitle="A to Z management ke liye poora website payload yahan edit karo."
                actions={
                  <button className="admin-button admin-button--ghost" onClick={applyFullJson} type="button">
                    Apply Full JSON
                  </button>
                }
              >
                <AdminTextarea
                  hint="Raw JSON edit karne ke baad pehle Apply Full JSON dabao, phir Save Website Changes."
                  label="Full Site Content JSON"
                  onChange={(event) => {
                    setFullJson(event.target.value)
                    setFullJsonDirty(true)
                  }}
                  rows={24}
                  value={fullJson}
                />
              </AdminSectionCard>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}

export { AdminDashboardPage, AdminLoginPage }
