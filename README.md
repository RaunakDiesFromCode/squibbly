# QR Code Generator (React)

A customizable QR code generator built with React and [qr-code-styling](https://github.com/kozakdenys/qr-code-styling). Supports:

* Color customization
* Logo embedding
* Dot styling
* Size control
* URL shortening via TinyURL
* QR download as PNG

---

## 🚀 Features

* 🎨 Custom foreground & background color
* 🔲 Select dot styles (dots, rounded, square, extra-rounded)
* 🖼️ Add center image (via URL or local upload)
* 🔗 Optional URL shortening with TinyURL API
* 🧼 Debounced input to reduce lag
* 📥 Download QR code as PNG

---

## 🧠 Tech Stack

* React (Functional Components + Hooks)
* qr-code-styling
* Tailwind CSS (for styling)
* lodash.debounce

---

## 📦 Installation

```bash
git clone https://github.com/your-repo/qr-code-generator.git
cd qr-code-generator
npm install
npm start
```

---

## 📁 File Structure

```bash
src/
├── App.js
├── QRCodeGenerator.js  # <- main component
├── index.js
└── index.css
```

---

## 🛠️ Customization

You can extend this project to include:

* Bitly or other shortener APIs
* QR export as SVG
* Support for non-URL payloads (e.g., Wi-Fi, email, contact cards)
* Presets for social media

---

## 🔐 Notes

* TinyURL has no authentication; it's used via simple GET API.
* For production, always sanitize and validate user input.

---

## 📄 License

MIT License

---

## 🙋‍♂️ Author

Made by \[Your Name]. Contributions welcome.

---

Enjoy generating custom QR codes!
