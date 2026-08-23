const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const themeTransitionStyle = `
    /* Smooth Theme Cross-Fade */
    html, body, *, *::before, *::after {
      transition-property: background-color, border-color, color, fill, stroke !important;
      transition-duration: 500ms !important;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
`;

// Find </style> and insert before it
html = html.replace('</style>', themeTransitionStyle + '\n  </style>');

fs.writeFileSync('index.html', html);
console.log("Patched style");
