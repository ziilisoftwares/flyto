# Base44 App (valmis zip)

## Vercel käyttöönotto GitHubin kautta
1) Luo tyhjä GitHub-repo.
2) Lataa tämän kansion **sisältö** repoosi (Add file → Upload files). Varmista että `package.json` on juuritasolla.
3) Vercel → Add New → Project → Import Git → valitse repo → Deploy.
4) Domain: Project → Settings → Domains.

## Paikallinen ajo
```bash
npm install
npm run dev
# http://localhost:3000
```

Media on placeholderia `public/`-kansiossa – korvaa omilla.
