const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.8,
}

function Svg({ children, viewBox = '0 0 24 24', className = '' }) {
  return (
    <svg viewBox={viewBox} aria-hidden="true" className={className}>
      {children}
    </svg>
  )
}

export function BrandLogo({ dark = false }) {
  return (
    <div className={`brand-logo ${dark ? 'brand-logo--dark' : ''}`} aria-label="ST Herbal India">
      <img src="/images/brand-logo-mark.png" className="brand-logo__image" alt="ST Herbal India" />
      <div className="brand-logo__text">
        <strong>ST HERBAL</strong>
        <span>INDIA</span>
      </div>
    </div>
  )
}

export function SearchIcon() {
  return (
    <Svg>
      <circle cx="11" cy="11" r="6" {...iconProps} />
      <path d="M16.2 16.2L20 20" {...iconProps} />
    </Svg>
  )
}

export function MailIcon() {
  return (
    <Svg>
      <rect x="4" y="6.5" width="16" height="11" rx="2.4" {...iconProps} />
      <path d="M5.4 8L12 12.8L18.6 8" {...iconProps} />
    </Svg>
  )
}

export function MenuIcon() {
  return (
    <Svg>
      <path d="M5 8H19" {...iconProps} />
      <path d="M5 12H19" {...iconProps} />
      <path d="M5 16H13" {...iconProps} />
    </Svg>
  )
}

export function CloseIcon() {
  return (
    <Svg>
      <path d="M6 6L18 18" {...iconProps} />
      <path d="M18 6L6 18" {...iconProps} />
    </Svg>
  )
}

export function TruckIcon() {
  return (
    <Svg>
      <path d="M3 7H13V15H3Z" {...iconProps} />
      <path d="M13 10H17L20 13V15H13Z" {...iconProps} />
      <circle cx="7.5" cy="17.5" r="1.5" {...iconProps} />
      <circle cx="16.5" cy="17.5" r="1.5" {...iconProps} />
    </Svg>
  )
}

export function UserIcon() {
  return (
    <Svg>
      <circle cx="12" cy="8" r="3.5" {...iconProps} />
      <path d="M5 19C6.8 15.7 9 14.5 12 14.5C15 14.5 17.2 15.7 19 19" {...iconProps} />
    </Svg>
  )
}

export function BagIcon() {
  return (
    <Svg>
      <path d="M6 9H18L17 20H7Z" {...iconProps} />
      <path d="M9 9V7.8C9 6.3 10.3 5 12 5C13.7 5 15 6.3 15 7.8V9" {...iconProps} />
    </Svg>
  )
}

export function HomeIcon() {
  return (
    <Svg>
      <path d="M4.5 10.5L12 4L19.5 10.5" {...iconProps} />
      <path d="M6.5 9.6V19H17.5V9.6" {...iconProps} />
    </Svg>
  )
}

export function HeartIcon() {
  return (
    <Svg>
      <path d="M12 20C6 16.5 3 13.3 3 8.8C3 6.2 5 4.2 7.7 4.2C9.4 4.2 11 5 12 6.5C13 5 14.6 4.2 16.3 4.2C19 4.2 21 6.2 21 8.8C21 13.3 18 16.5 12 20Z" {...iconProps} />
    </Svg>
  )
}

export function PhoneIcon() {
  return (
    <Svg>
      <path d="M8 5L10.6 7.3L9.4 9.6C10.2 11.5 12.4 13.8 14.4 14.6L16.7 13.4L19 16C18.4 17.5 16.8 18.4 15.2 18.1C10.2 17.1 6.9 13.8 5.9 8.8C5.6 7.2 6.5 5.6 8 5Z" {...iconProps} />
    </Svg>
  )
}

export function SparkIcon() {
  return (
    <Svg>
      <path d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2Z" {...iconProps} />
    </Svg>
  )
}

export function ArrowIcon() {
  return (
    <Svg>
      <path d="M5 12H19" {...iconProps} />
      <path d="M13 6L19 12L13 18" {...iconProps} />
    </Svg>
  )
}

export function ChevronDownIcon() {
  return (
    <Svg>
      <path d="M6.5 9.5L12 15L17.5 9.5" {...iconProps} />
    </Svg>
  )
}

export function GridIcon() {
  return (
    <Svg>
      <rect x="4.5" y="4.5" width="6" height="6" rx="1.2" {...iconProps} />
      <rect x="13.5" y="4.5" width="6" height="6" rx="1.2" {...iconProps} />
      <rect x="4.5" y="13.5" width="6" height="6" rx="1.2" {...iconProps} />
      <rect x="13.5" y="13.5" width="6" height="6" rx="1.2" {...iconProps} />
    </Svg>
  )
}

export function ListIcon() {
  return (
    <Svg>
      <circle cx="6.2" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="6.2" cy="12" r="1.2" fill="currentColor" />
      <circle cx="6.2" cy="17.5" r="1.2" fill="currentColor" />
      <path d="M10 6.5H19" {...iconProps} />
      <path d="M10 12H19" {...iconProps} />
      <path d="M10 17.5H19" {...iconProps} />
    </Svg>
  )
}

export function ExpandIcon() {
  return (
    <Svg>
      <path d="M8 4.8H4.8V8" {...iconProps} />
      <path d="M19.2 8V4.8H16" {...iconProps} />
      <path d="M16 19.2H19.2V16" {...iconProps} />
      <path d="M4.8 16V19.2H8" {...iconProps} />
    </Svg>
  )
}

export function PlusIcon() {
  return (
    <Svg>
      <path d="M12 5V19" {...iconProps} />
      <path d="M5 12H19" {...iconProps} />
    </Svg>
  )
}

export function MinusIcon() {
  return (
    <Svg>
      <path d="M5 12H19" {...iconProps} />
    </Svg>
  )
}

export function EyeIcon() {
  return (
    <Svg>
      <path d="M2.8 12C4.8 8.5 8.1 6.5 12 6.5C15.9 6.5 19.2 8.5 21.2 12C19.2 15.5 15.9 17.5 12 17.5C8.1 17.5 4.8 15.5 2.8 12Z" {...iconProps} />
      <circle cx="12" cy="12" r="2.6" {...iconProps} />
    </Svg>
  )
}

export function EyeOffIcon() {
  return (
    <Svg>
      <path d="M4.4 4.4L19.6 19.6" {...iconProps} />
      <path d="M9.9 6.8C10.6 6.6 11.3 6.5 12 6.5C15.9 6.5 19.2 8.5 21.2 12C20.4 13.4 19.4 14.6 18.2 15.6" {...iconProps} />
      <path d="M15 15.2C14.1 15.9 13.1 16.2 12 16.2C8.1 16.2 4.8 14.3 2.8 11C3.6 9.7 4.5 8.6 5.7 7.7" {...iconProps} />
      <path d="M10.6 10.6C10.2 11 10 11.5 10 12C10 13.1 10.9 14 12 14C12.5 14 13 13.8 13.4 13.4" {...iconProps} />
    </Svg>
  )
}

export function HeartPulseIcon() {
  return (
    <Svg>
      <path d="M4 11H8L10 7L13.5 15L16 11H20" {...iconProps} />
      <path d="M12 20C6 16.5 3 13.2 3 8.8C3 6.2 5 4 7.7 4C9.4 4 11 4.9 12 6.3C13 4.9 14.6 4 16.3 4C19 4 21 6.2 21 8.8C21 13.2 18 16.5 12 20Z" {...iconProps} />
    </Svg>
  )
}

export function StrengthIcon() {
  return (
    <Svg>
      <path d="M7 11L10 8L12 10L14 8L17 11" {...iconProps} />
      <path d="M7 11V15C7 17.2 8.8 19 11 19H13C15.2 19 17 17.2 17 15V11" {...iconProps} />
      <path d="M9 8V6.5C9 5.7 9.7 5 10.5 5H13.5C14.3 5 15 5.7 15 6.5V8" {...iconProps} />
    </Svg>
  )
}

export function GlowIcon() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="4" {...iconProps} />
      <path d="M12 2V5" {...iconProps} />
      <path d="M12 19V22" {...iconProps} />
      <path d="M2 12H5" {...iconProps} />
      <path d="M19 12H22" {...iconProps} />
      <path d="M4.8 4.8L7 7" {...iconProps} />
      <path d="M17 17L19.2 19.2" {...iconProps} />
      <path d="M17 7L19.2 4.8" {...iconProps} />
      <path d="M4.8 19.2L7 17" {...iconProps} />
    </Svg>
  )
}

export function HairIcon() {
  return (
    <Svg>
      <path d="M12 5C8 5 5 8 5 12C5 15.6 7.7 18.6 11.2 19V13.6C11.2 12.4 10.7 11.3 9.9 10.5L8.5 9.1" {...iconProps} />
      <path d="M12 5C16 5 19 8 19 12C19 15.6 16.3 18.6 12.8 19V11.8C12.8 10.4 13.4 9 14.4 8L16 6.4" {...iconProps} />
    </Svg>
  )
}

export function SkinIcon() {
  return (
    <Svg>
      <path d="M12 4C9 4 6.5 6.3 6.5 9.2C6.5 12.6 9.8 14 12 20C14.2 14 17.5 12.6 17.5 9.2C17.5 6.3 15 4 12 4Z" {...iconProps} />
      <path d="M9.4 9.8C10 8.8 10.9 8.2 12 8.2C13.1 8.2 14 8.8 14.6 9.8" {...iconProps} />
    </Svg>
  )
}

export function BalanceIcon() {
  return (
    <Svg>
      <path d="M12 5V19" {...iconProps} />
      <path d="M7 7H17" {...iconProps} />
      <path d="M6 7L3 12H9L6 7Z" {...iconProps} />
      <path d="M18 7L15 12H21L18 7Z" {...iconProps} />
      <path d="M8 19H16" {...iconProps} />
    </Svg>
  )
}

export function CertifiedIcon() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="8" {...iconProps} />
      <path d="M9 12L11 14L15.5 9.5" {...iconProps} />
    </Svg>
  )
}

export function LeafIcon() {
  return (
    <Svg>
      <path d="M18 5C12 5 8 8.5 8 14C8 16.8 9.8 19 12.6 19C17.4 19 20 14.9 20 10C20 8.1 19.4 6.3 18 5Z" {...iconProps} />
      <path d="M4 19C6.5 15.5 9.8 13.5 14 12" {...iconProps} />
    </Svg>
  )
}

export function NoSideEffectsIcon() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="8" {...iconProps} />
      <path d="M7 17L17 7" {...iconProps} />
    </Svg>
  )
}

export function ShieldCheckIcon() {
  return (
    <Svg>
      <path d="M12 4L18 6.5V11.2C18 15.4 15.6 18.5 12 20C8.4 18.5 6 15.4 6 11.2V6.5Z" {...iconProps} />
      <path d="M9.2 11.7L11.1 13.6L15 9.6" {...iconProps} />
    </Svg>
  )
}

export function DeliveryIcon() {
  return (
    <Svg>
      <path d="M3 9H13V15H3Z" {...iconProps} />
      <path d="M13 10H16.8L19.5 13V15H13Z" {...iconProps} />
      <path d="M5.5 7.5H11" {...iconProps} />
      <circle cx="7.5" cy="17.5" r="1.5" {...iconProps} />
      <circle cx="16.2" cy="17.5" r="1.5" {...iconProps} />
    </Svg>
  )
}

export function WalletIcon() {
  return (
    <Svg>
      <path d="M4 7.5C4 6.7 4.7 6 5.5 6H17.5C18.3 6 19 6.7 19 7.5V16.5C19 17.3 18.3 18 17.5 18H5.5C4.7 18 4 17.3 4 16.5Z" {...iconProps} />
      <path d="M15 12H19" {...iconProps} />
      <circle cx="15.5" cy="12" r="0.8" fill="currentColor" />
    </Svg>
  )
}

export function RefreshIcon() {
  return (
    <Svg>
      <path d="M18 10C17.1 7.1 14.8 5 12 5C8.7 5 6 7.7 6 11" {...iconProps} />
      <path d="M6 11L6.2 6.8L9.8 8.8" {...iconProps} />
      <path d="M6 14C6.9 16.9 9.2 19 12 19C15.3 19 18 16.3 18 13" {...iconProps} />
      <path d="M18 13L17.8 17.2L14.2 15.2" {...iconProps} />
    </Svg>
  )
}

export function LockIcon() {
  return (
    <Svg>
      <rect x="6" y="10" width="12" height="9" rx="2" {...iconProps} />
      <path d="M9 10V8.5C9 6.6 10.3 5 12 5C13.7 5 15 6.6 15 8.5V10" {...iconProps} />
    </Svg>
  )
}

export function PinIcon() {
  return (
    <Svg>
      <path d="M12 20C8 15.7 6 12.4 6 9.5C6 6.5 8.4 4 12 4C15.6 4 18 6.5 18 9.5C18 12.4 16 15.7 12 20Z" {...iconProps} />
      <circle cx="12" cy="9.5" r="2.2" {...iconProps} />
    </Svg>
  )
}

export function HeroBottleArt() {
  return (
    <svg viewBox="0 0 340 300" className="hero-product-art" aria-hidden="true">
      <defs>
        <linearGradient id="bottleBody" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#f7d760" />
          <stop offset="100%" stopColor="#d4a52c" />
        </linearGradient>
      </defs>
      <ellipse cx="144" cy="255" rx="88" ry="22" fill="#8c5e1a" opacity="0.2" />
      <path d="M228 85C264 96 285 127 292 168C242 178 211 163 181 134C195 112 208 98 228 85Z" fill="#72c35f" />
      <path d="M204 106C238 108 262 132 267 164C234 166 210 154 185 126Z" fill="#5ba94a" />
      <path d="M76 47H185V77H76Z" fill="#1e1f23" />
      <rect x="92" y="21" width="76" height="32" rx="12" fill="#2b2d31" />
      <rect x="65" y="75" width="132" height="148" rx="18" fill="url(#bottleBody)" />
      <rect x="78" y="93" width="106" height="96" rx="12" fill="#f5efdd" opacity="0.92" />
      <circle cx="160" cy="102" r="18" fill="#ffffff" />
      <path d="M154 99C147 100 142 105 139 111" fill="none" stroke="#72c35f" strokeWidth="5" strokeLinecap="round" />
      <path d="M167 94C160 95 153 98 149 103" fill="none" stroke="#117a78" strokeWidth="5" strokeLinecap="round" />
      <text x="92" y="129" fill="#1e2d2e" fontSize="24" fontWeight="800">
        ASHWAGANDHA
      </text>
      <rect x="92" y="139" width="92" height="14" rx="7" fill="#1b7a72" />
      <rect x="92" y="161" width="83" height="8" rx="4" fill="#c2a95a" />
      <rect x="92" y="175" width="78" height="8" rx="4" fill="#d6c282" />
      <rect x="92" y="189" width="66" height="8" rx="4" fill="#dccf9f" />
      <rect x="88" y="205" width="88" height="10" rx="5" fill="#2b2d31" opacity="0.92" />
    </svg>
  )
}

export function DeliveryBannerArt() {
  return (
    <svg viewBox="0 0 200 92" className="delivery-art" aria-hidden="true">
      <rect x="18" y="36" width="112" height="28" rx="8" fill="#28a06f" />
      <rect x="110" y="28" width="34" height="36" rx="6" fill="#1c7d57" />
      <path d="M144 42H168L180 54V64H144Z" fill="#39b77f" />
      <rect x="30" y="26" width="42" height="22" rx="6" fill="#4cc58e" />
      <path d="M44 36H59" stroke="#f6fffb" strokeWidth="3.8" strokeLinecap="round" />
      <path d="M59 36L67 29" stroke="#f6fffb" strokeWidth="3.8" strokeLinecap="round" />
      <circle cx="50" cy="68" r="9" fill="#194e3f" />
      <circle cx="50" cy="68" r="4.5" fill="#f6fffb" />
      <circle cx="149" cy="68" r="9" fill="#194e3f" />
      <circle cx="149" cy="68" r="4.5" fill="#f6fffb" />
      <path d="M82 40C92 34 100 33 110 38" fill="none" stroke="#f4fffb" strokeWidth="4" strokeLinecap="round" />
      <path d="M80 50C90 43 99 42 111 48" fill="none" stroke="#d7ffea" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function bottleLabel(fill, accent, title) {
  return (
    <>
      <rect x="34" y="62" width="72" height="70" rx="10" fill={fill} />
      <rect x="42" y="74" width="56" height="10" rx="5" fill={accent} opacity="0.95" />
      <rect x="42" y="91" width="46" height="7" rx="3.5" fill="#dbe8d9" />
      <rect x="42" y="103" width="52" height="7" rx="3.5" fill="#c9d9c7" />
      <text x="42" y="123" fill="#2a2f33" fontSize="9" fontWeight="700">
        {title}
      </text>
    </>
  )
}

function BottleBase({ bodyFill, labelFill, accent, title, cap = '#1f2328' }) {
  return (
    <svg viewBox="0 0 140 180" className="product-visual" aria-hidden="true">
      <ellipse cx="70" cy="163" rx="38" ry="10" fill="#b7c6b2" opacity="0.25" />
      <rect x="46" y="18" width="48" height="18" rx="7" fill={cap} />
      <rect x="34" y="32" width="72" height="116" rx="16" fill={bodyFill} />
      {bottleLabel(labelFill, accent, title)}
    </svg>
  )
}

function ComboVisual() {
  return (
    <svg viewBox="0 0 180 180" className="product-visual" aria-hidden="true">
      <ellipse cx="92" cy="162" rx="52" ry="10" fill="#b7c6b2" opacity="0.22" />
      <rect x="24" y="50" width="74" height="82" rx="12" fill="#f5f2dd" stroke="#d7d9cb" strokeWidth="2" />
      <rect x="40" y="64" width="42" height="10" rx="5" fill="#d4b24d" />
      <rect x="40" y="82" width="34" height="7" rx="3.5" fill="#a8bf89" />
      <rect x="112" y="34" width="34" height="20" rx="8" fill="#88a849" />
      <rect x="102" y="50" width="54" height="86" rx="16" fill="#cedf8c" />
      <rect x="109" y="65" width="40" height="44" rx="9" fill="#f7f3e0" />
      <rect x="115" y="74" width="28" height="9" rx="4.5" fill="#d8b95b" />
      <rect x="115" y="90" width="22" height="6" rx="3" fill="#8db06a" />
    </svg>
  )
}

function SlimBottleVisual() {
  return (
    <svg viewBox="0 0 140 180" className="product-visual" aria-hidden="true">
      <ellipse cx="70" cy="162" rx="34" ry="10" fill="#b7c6b2" opacity="0.24" />
      <rect x="58" y="20" width="24" height="24" rx="8" fill="#2f3136" />
      <path d="M48 46H92V138C92 146 85.5 152 77.5 152H62.5C54.5 152 48 146 48 138Z" fill="#1f2b1c" />
      <path d="M38 56H102V144C102 150 97 155 91 155H49C43 155 38 150 38 144Z" fill="#d8f0a6" />
      <rect x="46" y="69" width="48" height="48" rx="10" fill="#f6f5e7" />
      <rect x="54" y="80" width="31" height="9" rx="4.5" fill="#75ae46" />
      <rect x="54" y="94" width="24" height="6" rx="3" fill="#88b78a" />
      <path d="M98 92C111 104 114 118 110 137" fill="none" stroke="#2b2d31" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function ProductVisual({ kind }) {
  switch (kind) {
    case 'heart-jar':
      return (
        <BottleBase
          bodyFill="#f6f6f6"
          labelFill="#ffffff"
          accent="#f06f63"
          title="Heart Care"
          cap="#f2f2f2"
        />
      )
    case 'juice-bottle':
      return (
        <BottleBase
          bodyFill="#e8f4dd"
          labelFill="#ffffff"
          accent="#72bb57"
          title="Heart Juice"
          cap="#62aa49"
        />
      )
    case 'noni-combo':
      return <ComboVisual />
    case 'slim-bottle':
      return <SlimBottleVisual />
    case 'capsule-bottle':
    default:
      return (
        <BottleBase
          bodyFill="#dcc15c"
          labelFill="#f2efdd"
          accent="#2c7249"
          title="Karansudha"
          cap="#1f2328"
        />
      )
  }
}
