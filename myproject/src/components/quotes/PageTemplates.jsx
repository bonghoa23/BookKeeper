export default function PageTemplates({ template }) {
  if (template === 'blank') {
    return null
  }

  if (template === 'lined') {
    return (
      <svg
        width="100%"
        height="600"
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="lined"
            x="0"
            y="0"
            width="100%"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="30" x2="100%" y2="30" stroke="#e5e7eb" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="600" fill="url(#lined)" />
      </svg>
    )
  }

  if (template === 'dot') {
    return (
      <svg
        width="100%"
        height="600"
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="1.5" fill="#d1d5db" />
          </pattern>
        </defs>
        <rect width="100%" height="600" fill="url(#dots)" />
      </svg>
    )
  }

  return null
}
