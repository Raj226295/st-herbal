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
  const contact = data.contact ?? {}
  const infoBlocks = Array.isArray(contact.infoBlocks) ? contact.infoBlocks : []
  const iconMap = {
    mail: MailIcon,
    phone: PhoneIcon,
    pin: PinIcon,
  }

  function updateField(field, value) {
    setFormState((currentValue) => ({ ...currentValue, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setStatusMessage(contact.successMessage ?? 'Thank you. Your message has been saved successfully.')
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
          <span className="about-page__eyebrow">{contact.eyebrow ?? 'contact us'}</span>
          <h1>{contact.heroTitle ?? 'we are at your disposal 7 days a week!'}</h1>
        </div>

        <section className="contact-map surface-card">
          <iframe
            className="contact-map__frame"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={contact.mapUrl ?? 'https://www.google.com/maps?q=Dwarka,New+Delhi&z=12&output=embed'}
            title="ST Herbal India location map"
          />
        </section>

        <section className="contact-layout">
          <div className="contact-form-block">
            <h2 className="section-title section-title--blue">
              {contact.formTitle ?? 'leave us a message'}
            </h2>

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
                placeholder={contact.formPlaceholder ?? 'Your Review'}
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
                <span>
                  {contact.formCheckboxLabel ??
                    'Save my name, email, and phone details for the next message.'}
                </span>
              </label>

              {statusMessage ? <div className="shop-action-message">{statusMessage}</div> : null}

              <button className="contact-form__submit" type="submit">
                {contact.formSubmitLabel ?? 'submit'}
              </button>
            </form>
          </div>

          <aside className="contact-info-block">
            <h2 className="section-title section-title--blue">
              {contact.infoTitle ?? 'contact'}
            </h2>

            <div className="contact-info-list">
              {infoBlocks.map((block) => {
                const Icon = iconMap[block.icon] ?? MailIcon
                const value =
                  block.id === 'location'
                    ? block.value || data.footer.address
                    : block.id === 'phone'
                      ? block.value || data.footer.phone
                      : block.value

                return (
                  <article className="contact-info-item" key={block.id}>
                    <span className="contact-info-item__icon">
                      <Icon />
                    </span>
                    <div>
                      <h3>{block.title}</h3>
                      <p>{value}</p>
                      {block.note ? <small>{block.note}</small> : null}
                    </div>
                  </article>
                )
              })}
            </div>
          </aside>
        </section>
      </section>
    </SiteChrome>
  )
}

export default ContactPage
