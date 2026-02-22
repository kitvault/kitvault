# KitVault — Auto-Upload Setup Guide

Follow these steps once to wire everything up. After that, uploading a
PDF is all you need to do to add a kit to the library.

---

## STEP 1 — Install Wrangler (if you don't have it)

```bash
npm install -g wrangler
wrangler login
```

---

## STEP 2 — Create a D1 database (if you don't have one)

```bash
npx wrangler d1 create kitvault-db
```

Copy the `database_id` from the output and paste it into `wrangler.toml`:

```toml
database_id = "paste-your-id-here"
```

---

## STEP 3 — Create an R2 bucket (if you don't have one)

```bash
npx wrangler r2 bucket create kitvault-pdfs
```

Update `wrangler.toml`:

```toml
bucket_name = "kitvault-pdfs"
```

---

## STEP 4 — Fill in your account ID

Find it at: https://dash.cloudflare.com → right sidebar → Account ID

```toml
account_id = "paste-your-account-id"
```

---

## STEP 5 — Set your admin key (secret password for the upload page)

```bash
npx wrangler secret put ADMIN_KEY
```

Type a strong password when prompted. This protects your `/admin` upload page.
**Do not put this value in wrangler.toml.**

---

## STEP 6 — Deploy the Worker

```bash
cd worker
npx wrangler deploy
```

Your Worker will be live at:
`https://kitvault-worker.YOUR-SUBDOMAIN.workers.dev`

---

## STEP 7 — Point your app at the Worker

In your Vite/React project, the Worker is called via `/api/...` routes.
If you're deploying to Cloudflare Pages, add a proxy rule in your
`_redirects` file (or `wrangler.toml` for Pages):

```
/api/* https://kitvault-worker.YOUR-SUBDOMAIN.workers.dev/api/:splat 200
```

Or if you're on Cloudflare Pages with the Worker in the same account,
bind it directly via the Pages dashboard under Settings → Functions → KV/D1/R2.

---

## STEP 8 — Enable R2 → Worker event notifications (for dashboard uploads)

This step makes the Worker fire automatically when you upload a PDF
directly in the Cloudflare R2 dashboard — without going through the
upload page.

1. Go to: Cloudflare Dashboard → R2 → your bucket → **Settings**
2. Scroll to **Event notifications**
3. Click **Add notification**
4. Set:
   - Event type: `Object Created (put)`
   - Queue: create a new queue called `kitvault-r2-events`
5. Create the queue:
   ```bash
   npx wrangler queues create kitvault-r2-events
   ```
6. Redeploy the worker:
   ```bash
   npx wrangler deploy
   ```

After this, any PDF you drop into your R2 bucket via the dashboard will
automatically create a kit entry.

---

## STEP 9 — Add the Admin route to App.jsx

In your `App.jsx`, add this import at the top:

```jsx
import AdminUpload from "./components/AdminUpload.jsx";
```

And add this route inside your `<Routes>`:

```jsx
<Route path="/admin" element={<AdminUpload />} />
```

The page is already password-protected by the admin key you set in Step 5.

---

## STEP 10 — Update your frontend to load kits from D1

In `App.jsx`, replace the static `KITS` import usage with a merged list.
Add this hook near the top of your `KitVault` component:

```jsx
const [d1Kits, setD1Kits] = useState([]);

useEffect(() => {
  fetch("/api/kits")
    .then(r => r.json())
    .then(data => { if (Array.isArray(data)) setD1Kits(data); })
    .catch(() => {}); // silent fallback to static list
}, []);

// Merge: D1 kits take precedence over static kits with same id
const allKits = useMemo(() => {
  const d1Ids = new Set(d1Kits.map(k => k.id));
  return [...KITS.filter(k => !d1Ids.has(k.id)), ...d1Kits];
}, [d1Kits]);
```

Then replace every reference to `KITS` in that component with `allKits`.

---

## HOW IT WORKS END-TO-END

```
You upload:  hg-144-rx78-2-gundam-assembly.pdf
                        ↓
         Worker parses the filename:
           grade  = HG
           scale  = 1/144
           name   = Rx78 2 Gundam
                        ↓
         PDF stored in R2 bucket
         Kit entry written to D1 kits table
                        ↓
         Frontend fetches /api/kits
         New kit appears in the library instantly
```

---

## FILENAME FORMAT

```
{grade}-{scale}-{kit-name}-assembly.pdf
```

| Part | Values |
|---|---|
| grade | `hg` `mg` `rg` `pg` `sd` `eg` |
| scale | `144` `100` `60` `unk` |
| kit-name | hyphen-separated, any characters |
| suffix | must end with `-assembly.pdf` |

**Examples:**
```
hg-144-rx78-2-gundam-assembly.pdf        → HG 1/144 Rx78 2 Gundam
mg-100-strike-freedom-assembly.pdf       → MG 1/100 Strike Freedom
rg-144-unicorn-gundam-assembly.pdf       → RG 1/144 Unicorn Gundam
pg-60-rx-78-2-gundam-assembly.pdf        → PG 1/60 Rx 78 2 Gundam
sd-unk-zeromaru-assembly.pdf             → SD SD Zeromaru
```

Files that don't match this pattern are skipped and logged —
the PDF still uploads to R2, but no kit entry is created.
