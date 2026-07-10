import { useState } from 'react'
import { MailIcon, PhoneIcon, PinIcon } from './Illustrations.jsx'
import SiteChrome from './SiteChrome.jsx'

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
  saveInfo: false,
}

function ContactPage({ currentUser, data, flashMessage, onLogout }) {
  const [formState, setFormState] = useState(initialFormState)
  const [statusMessage, setStatusMessage] = useState('')

  function updateField(field, value) {
    setFormState((currentValue) => ({ ...currentValue, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setStatusMessage('Thank you. Your message has been saved successfully.')
    setFormState(initialFormState)
  }

  return (
    <SiteChrome
      currentPage="contact"
      currentUser={currentUser}
      data={data}
      flashMessage={flashMessage}
      onLogout={onLogout}
    >
      <section className="contact-page">
        <div className="contact-page__hero">
          <span className="about-page__eyebrow">contact us</span>
          <h1>we are at your disposal 7 days a week!</h1>
        </div>

        <section className="contact-map surface-card">
          <iframe
            className="contact-map__frame"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Dwarka,New+Delhi&z=12&output=embed"
            title="ST Herbal India location map"
          />
        </section>

        <section className="contact-layout">
          <div className="contact-form-block">
            <h2 className="section-title section-title--blue">leave us a message</h2>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__row">
                <input
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Name *"
                  required
                  type="text"
                  value={formState.name}
                />
                <input
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="Email *"
                  required
                  type="email"
                  value={formState.email}
                />
                <input
                  onChange={(event) => updateField('phone', event.target.value)}
                  placeholder="Phone"
                  type="tel"
                  value={formState.phone}
                />
              </div>

              <textarea
                onChange={(event) => updateField('message', event.target.value)}
                placeholder="Your Review"
                required
                rows={7}
                value={formState.message}
              />

              <label className="contact-form__checkbox">
                <input
                  checked={formState.saveInfo}
                  onChange={(event) => updateField('saveInfo', event.target.checked)}
                  type="checkbox"
                />
                <span>Save my name, email, and phone details for the next message.</span>
              </label>

              {statusMessage ? <div className="shop-action-message">{statusMessage}</div> : null}

              <button className="contact-form__submit" type="submit">
                submit
              </button>
            </form>
          </div>

          <aside className="contact-info-block">
            <h2 className="section-title section-title--blue">contact</h2>

            <div className="contact-info-list">
              <article className="contact-info-item">
                <span className="contact-info-item__icon">
                  <PinIcon />
                </span>
                <div>
                  <h3>Store Location</h3>
                  <p>{data.footer.address}</p>
                </div>
              </article>

              <article className="contact-info-item">
                <span className="contact-info-item__icon">
                  <PhoneIcon />
                </span>
                <div>
                  <h3>Phone</h3>
                  <p>{data.footer.phone}</p>
                </div>
              </article>

              <article className="contact-info-item">
                <span className="contact-info-item__icon">
                  <MailIcon />
                </span>
                <div>
                  <h3>Customer Support</h3>
                  <p>support@stherbalindia.com</p>
                  <small>For product information, order status, and general support.</small>
                </div>
              </article>
            </div>
          </aside>
        </section>
      </section>
    </SiteChrome>
  )
}

export default ContactPage
