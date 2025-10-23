# Lovely Y5 (prototype)

This repository is a Next.js + React prototype for Lovely Y5 (tienda de tecnología).

Quick start

```bash
cd lovely-y5
npm install --legacy-peer-deps
npm run dev
```

Testing

- Unit tests (Jasmine): `npx jasmine --config=jasmine.json`
- Karma setup is included but may need Chrome (or set CHROME_BIN) on Windows.

Notes

- Payments are simulated: any card data will be accepted and an order will be created.
- Admin registration requires access code: `LVLWRKR5`.
- Data is persisted in browser localStorage (products, contacts, orders, users). For production integrate a database and proper auth.

Email

- `lib/mail.js` is a stub using nodemailer. To enable real emails set `MAIL_USER` and `MAIL_PASS` environment variables (and optional `MAIL_HOST`). If not set the helper logs the mail to console.

Next steps

- Add server-side API endpoints and real DB.
- Harden auth, hash passwords and add JWT/session storage.
- Integrate payment gateway for real payments.
