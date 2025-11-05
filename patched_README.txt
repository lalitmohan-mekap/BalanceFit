Patched files created:
- patched_index.html  (index with AdSense placeholders and lazy-load snippet)
- patched_server.js   (server with runtime injection handler)
- patched_.env.example (example env file)

Instructions:
1. Move patched_index.html -> index.html (or replace your existing index.html).
2. Move patched_server.js -> server.js (or merge its injection handler into your server).
3. Copy patched_.env.example -> .env and set ADSENSE_CLIENT and ALLOWED_HOSTS.
4. Do NOT commit the real .env to public repos.
5. Test locally: ADSENSE_CLIENT empty => ads won't be injected. Set ADSENSE_CLIENT to test value to allow injection.
6. In AdSense dashboard enable Site authorization and add your domain(s).

Files are available for download below.
