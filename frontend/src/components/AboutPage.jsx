import SiteChrome from './SiteChrome.jsx'

const promiseCards = [
  {
    id: 'vision',
    title: 'Our Vision',
    text:
      'At ST Herbal India, our vision is to guide modern families toward balanced, nature-led wellness through trusted Ayurvedic care.',
  },
  {
    id: 'mission',
    title: 'Our Mission',
    text:
      'Our mission is to blend traditional herbal knowledge with quality sourcing so every product supports daily wellbeing with confidence.',
  },
  {
    id: 'promise',
    title: 'Our Promise',
    text:
      'We promise purity, consistency, and customer-first service in every capsule, powder, and wellness formula we create.',
  },
]

const valueItems = [
  {
    id: 'natural',
    number: '01',
    title: 'Natural is good',
    text: 'Every formula is designed around clean herbal ingredients and a gentle daily wellness experience.',
  },
  {
    id: 'health',
    number: '02',
    title: 'Here for your health',
    text: 'Our products combine Ayurvedic wisdom with practical routines that fit modern lifestyles.',
  },
  {
    id: 'shortcuts',
    number: '03',
    title: 'No shortcuts',
    text: 'We focus on trusted sourcing, quality checks, and simple transparent care from start to finish.',
  },
]

const blogPosts = [
  {
    id: 'product-spotlight',
    date: 'July 26, 2025',
    author: 'By Admin',
    title: 'Best Herbal Product in India for Natural Wellness | 100% Ayurvedic',
    image: '/images/products/amla-powder.png',
  },
  {
    id: 'stress-care',
    date: 'July 9, 2026',
    author: 'By DR. MOHD Suhail',
    title: 'कमजोरी और तनाव क्यों बढ़ता है और Ayurveda इसे कैसे balance करता है',
    image: '/images/categories/skin-care.avif',
  },
  {
    id: 'daily-wellness',
    date: 'July 8, 2026',
    author: 'By DR. MOHD Suhail',
    title: 'कान, त्वचा और immunity care को herbal routine के साथ कैसे मजबूत रखें',
    image: '/images/categories/mens-health.avif',
  },
]

function AboutPage({ currentUser, data, flashMessage, onLogout }) {
  return (
    <SiteChrome
      currentPage="about"
      currentUser={currentUser}
      data={data}
      flashMessage={flashMessage}
      onLogout={onLogout}
    >
      <section className="about-page">
        <section className="about-hero">
          <div className="about-hero__backdrop surface-card">
            <span className="about-page__eyebrow">about us</span>
            <h1>Where Tradition Meets Modern Wellness.</h1>
          </div>

          <div className="about-hero__cards">
            {promiseCards.map((card) => (
              <article className="about-hero__card surface-card" key={card.id}>
                <h2>{card.title}</h2>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-story">
          <div className="about-story__visual">
            <div className="about-story__glow" />
            <img
              className="about-story__image"
              src="/images/shop-banner-reference.png"
              alt="Fresh herbal ingredients and wellness care"
            />
            <img
              aria-hidden="true"
              className="about-story__mark"
              src="/images/leaf-logo.png"
              alt=""
            />
          </div>

          <div className="about-story__content">
            <span className="about-page__eyebrow">why us</span>
            <h2>We are committed to providing wholesome products that fit your lifestyle.</h2>
            <p>
              At ST Herbal India, we uphold the principles of Ayurveda by choosing
              trusted ingredients, thoughtful formulations, and customer-friendly
              wellness products that support everyday health naturally.
            </p>
            <p>
              Our goal is simple: make herbal care feel premium, approachable, and
              dependable for every home.
            </p>
          </div>
        </section>

        <section className="about-values surface-card">
          {valueItems.map((item) => (
            <article className="about-values__item" key={item.id}>
              <span className="about-values__number">{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="about-blog">
          <div className="about-blog__header">
            <span className="about-page__eyebrow">recent post</span>
            <h2 className="section-title section-title--blue">latest from our blog</h2>
          </div>

          <div className="about-blog__grid">
            {blogPosts.map((post) => (
              <article className="about-blog__card" key={post.id}>
                <div className="about-blog__image-wrap">
                  <img className="about-blog__image" src={post.image} alt={post.title} />
                </div>
                <div className="about-blog__meta">
                  <span>{post.date}</span>
                  <strong>{post.author}</strong>
                </div>
                <h3>{post.title}</h3>
              </article>
            ))}
          </div>
        </section>
      </section>
    </SiteChrome>
  )
}

export default AboutPage
