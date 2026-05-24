# Cara Setup Login Google

## 1. Buat Project di Google Cloud Console
1. Buka https://console.cloud.google.com
2. Klik **"New Project"** → beri nama (contoh: `UjianCPNS`)
3. Klik **"Create"**

## 2. Aktifkan OAuth Consent Screen
1. Di menu kiri → **"APIs & Services"** → **"OAuth consent screen"**
2. Pilih **External** → klik **Create**
3. Isi:
   - App name: `Ujian CPNS`
   - User support email: email kamu
   - Developer contact: email kamu
4. Klik **Save and Continue** sampai selesai

## 3. Buat OAuth Client ID
1. Di menu kiri → **"APIs & Services"** → **"Credentials"**
2. Klik **"+ CREATE CREDENTIALS"** → pilih **"OAuth client ID"**
3. Application type: **Web application**
4. Nama: `UjianCPNS Web`
5. **Authorized JavaScript origins** — tambahkan:
   - `http://localhost` (jika jalankan lokal)
   - `http://127.0.0.1`
   - `http://localhost:5500` (jika pakai Live Server VS Code)
   - URL hosting kamu jika sudah di-deploy
6. Klik **Create**
7. **Salin Client ID** yang muncul (format: `xxxxxxxxxxxx.apps.googleusercontent.com`)

## 4. Tempel Client ID ke Kode
Buka `index.html`, cari baris ini:

```javascript
client_id: 'GANTI_DENGAN_GOOGLE_CLIENT_ID_KAMU.apps.googleusercontent.com',
```

Ganti dengan Client ID kamu, contoh:
```javascript
client_id: '123456789012-abcdefghijklmnop.apps.googleusercontent.com',
```

## 5. Jalankan via Server (WAJIB!)
Google Login **tidak bisa** dijalankan langsung lewat `file://`.
Gunakan salah satu cara ini:
- **VS Code Live Server** (ekstensi Ritwick Dey) → klik kanan `index.html` → Open with Live Server
- **Python**: `python -m http.server 8000` lalu buka `http://localhost:8000`
- **Deploy** ke hosting (Netlify, GitHub Pages, dll.)

## Catatan
- Login Google hanya menangkap nama dan foto profil
- Data ujian tetap tersimpan di localStorage browser
- Tidak ada backend/database yang diperlukan
