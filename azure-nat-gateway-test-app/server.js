import express from "express";

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Outbound IP Check · Azure NAT Gateway</title>
        <style>
          :root { color-scheme: dark; --bg: #07111f; --panel: rgba(13, 31, 53, .78); --text: #f4f8ff; --muted: #a7b7ce; --line: rgba(174, 202, 240, .16); --accent: #55b7ff; --accent-2: #7d6bff; --success: #49d6a3; --danger: #ff8598; }
          * { box-sizing: border-box; }
          body { margin: 0; min-height: 100vh; color: var(--text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--bg); }
          body::before, body::after { content: ""; position: fixed; z-index: -1; width: 42rem; height: 42rem; border-radius: 50%; filter: blur(2px); opacity: .28; }
          body::before { top: -20rem; left: -16rem; background: #146cbb; }
          body::after { right: -18rem; bottom: -23rem; background: #563cbf; }
          main { width: min(1040px, calc(100% - 40px)); margin: 0 auto; padding: 72px 0 48px; }
          .eyebrow { display: inline-flex; gap: 8px; align-items: center; color: #b9dfff; font-size: .78rem; font-weight: 750; letter-spacing: .11em; text-transform: uppercase; }
          .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--success); box-shadow: 0 0 0 5px rgba(73,214,163,.12); }
          h1 { max-width: 760px; margin: 18px 0 14px; font-size: clamp(2.35rem, 6vw, 4.8rem); line-height: 1.02; letter-spacing: -.055em; }
          .lede { max-width: 650px; margin: 0; color: var(--muted); font-size: 1.08rem; line-height: 1.7; }
          .grid { display: grid; grid-template-columns: minmax(0, 1.32fr) minmax(260px, .68fr); gap: 20px; margin-top: 42px; }
          .card { border: 1px solid var(--line); border-radius: 20px; background: var(--panel); backdrop-filter: blur(18px); box-shadow: 0 22px 56px rgba(0, 0, 0, .22); }
          .check-card { padding: clamp(24px, 4vw, 38px); }
          .label { margin: 0 0 9px; color: var(--muted); font-size: .82rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
          .ip { min-height: 62px; margin: 0; font-family: "SFMono-Regular", Consolas, monospace; font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 650; letter-spacing: -.05em; overflow-wrap: anywhere; }
          .helper { min-height: 26px; margin: 12px 0 24px; color: var(--muted); line-height: 1.55; }
          button { display: inline-flex; align-items: center; justify-content: center; gap: 10px; border: 0; border-radius: 11px; padding: 13px 18px; color: #061321; background: linear-gradient(135deg, #7bd0ff, #76aaff); font: inherit; font-weight: 750; cursor: pointer; box-shadow: 0 10px 24px rgba(72, 167, 255, .22); transition: transform .18s ease, filter .18s ease; }
          button:hover { transform: translateY(-2px); filter: brightness(1.06); } button:disabled { cursor: wait; opacity: .75; transform: none; }
          .spinner { display: none; width: 15px; height: 15px; border: 2px solid rgba(6,19,33,.28); border-top-color: #061321; border-radius: 50%; animation: spin .8s linear infinite; } .loading .spinner { display: block; } @keyframes spin { to { transform: rotate(360deg); } }
          .details { padding: 26px; } .details h2 { margin: 0 0 18px; font-size: 1rem; letter-spacing: -.015em; }
          .detail { padding: 14px 0; border-top: 1px solid var(--line); } .detail:first-of-type { border-top: 0; padding-top: 0; } .detail strong { display: block; margin-bottom: 5px; font-size: .88rem; } .detail span { color: var(--muted); font-size: .86rem; line-height: 1.45; }
          .controls { display: flex; flex-wrap: wrap; gap: 10px; }
          .secondary { color: #d9edff; background: rgba(126, 180, 232, .1); border: 1px solid rgba(174, 202, 240, .22); box-shadow: none; }
          .compare { display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-top: 22px; padding-top: 20px; border-top: 1px solid var(--line); }
          .compare label { grid-column: 1 / -1; color: var(--muted); font-size: .8rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
          .compare input { width: 100%; min-width: 0; padding: 12px 13px; border: 1px solid var(--line); border-radius: 10px; outline: none; color: var(--text); background: rgba(1, 12, 26, .35); font: inherit; }
          .compare input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(85, 183, 255, .12); }
          .match { display: none; margin: 14px 0 0; font-size: .88rem; font-weight: 650; }.match.visible { display: block; }.match.yes { color: var(--success); }.match.no { color: #ffca6a; }
          .timeline { display: grid; grid-template-columns: 10px 1fr; gap: 0 12px; margin-top: 20px; border-top: 1px solid var(--line); padding-top: 20px; }.timeline i { width: 9px; height: 9px; margin-top: 5px; border: 2px solid #6685a7; border-radius: 50%; background: #132942; }.timeline i.active { border-color: var(--success); background: var(--success); box-shadow: 0 0 0 4px rgba(73,214,163,.1); }.timeline span { padding: 0 0 18px; color: var(--muted); font-size: .86rem; line-height: 1.45; }.timeline span strong { display: block; color: var(--text); }
          .footer { display: flex; justify-content: space-between; gap: 16px; margin-top: 22px; color: #8091aa; font-size: .83rem; } code { color: #b9dfff; }.toast { position: fixed; right: 22px; bottom: 22px; padding: 12px 15px; border: 1px solid rgba(73,214,163,.35); border-radius: 10px; color: #d9fff2; background: #103428; box-shadow: 0 16px 36px rgba(0,0,0,.3); opacity: 0; transform: translateY(10px); pointer-events: none; transition: .22s ease; }.toast.show { opacity: 1; transform: translateY(0); }
          .error { color: var(--danger); } .success { color: var(--success); }
          @media (max-width: 720px) { main { width: min(100% - 28px, 1040px); padding-top: 46px; } .grid { grid-template-columns: 1fr; margin-top: 30px; } .footer { display: block; line-height: 1.8; } }
        </style>
      </head>
      <body>
        <main>
          <div class="eyebrow"><span class="dot"></span> Azure App Service diagnostic</div>
          <h1>See your app’s outbound identity.</h1>
          <p class="lede">Confirm that traffic leaving your App Service is routed through the public IP attached to your Azure NAT Gateway.</p>
          <section class="grid" aria-label="Outbound IP diagnostic">
            <div class="card check-card">
              <p class="label">Detected public outbound IP</p>
              <p class="ip" id="ip" aria-live="polite">Ready to check</p>
              <p class="helper" id="message">Run the diagnostic to ask an external service which IP it sees.</p>
              <div class="controls"><button id="check" type="button"><span class="spinner"></span><span id="buttonText">Check outbound IP</span></button><button id="copy" class="secondary" type="button" disabled>Copy IP</button></div>
              <div class="compare"><label for="expected">Compare against expected NAT public IP</label><input id="expected" inputmode="numeric" autocomplete="off" placeholder="e.g. 20.51.12.34" /><button id="compare" class="secondary" type="button">Compare</button></div>
              <p class="match" id="match" aria-live="polite"></p>
            </div>
            <aside class="card details">
              <h2>What a successful result means</h2>
              <div class="detail"><strong>VNet integration</strong><span>Your App Service traffic is sent through its integrated subnet.</span></div>
              <div class="detail"><strong>NAT Gateway</strong><span>The subnet’s NAT Gateway provides a predictable public egress IP.</span></div>
              <div class="detail"><strong>Expected value</strong><span>Match this result to your NAT Gateway Public IP or Public IP Prefix.</span></div>
              <div class="timeline" aria-label="Diagnostic progress"><i class="active"></i><span><strong>App online</strong>Ready to make an outbound request.</span><i id="requestStep"></i><span><strong>External check</strong><span id="requestStatus">Waiting for you to run the diagnostic.</span></span><i id="resultStep"></i><span><strong>Result</strong><span id="resultStatus">No public IP detected yet.</span></span></div>
            </aside>
          </section>
          <footer class="footer"><span>Endpoint: <code>/ip</code></span><span>Health check: <code>/health</code></span></footer>
        </main><div class="toast" id="toast" role="status">IP copied to clipboard</div>
        <script>
          const check = document.getElementById('check');
          const ip = document.getElementById('ip');
          const message = document.getElementById('message');
          const buttonText = document.getElementById('buttonText');
          const copy = document.getElementById('copy');
          const expected = document.getElementById('expected');
          const compare = document.getElementById('compare');
          const match = document.getElementById('match');
          const requestStep = document.getElementById('requestStep');
          const resultStep = document.getElementById('resultStep');
          const requestStatus = document.getElementById('requestStatus');
          const resultStatus = document.getElementById('resultStatus');
          const toast = document.getElementById('toast');
          let detectedIp = '';
          function compareIp() {
            const value = expected.value.trim();
            match.className = 'match';
            if (!value || !detectedIp) return;
            const isMatch = value === detectedIp;
            match.textContent = isMatch ? 'Match confirmed: this is the configured NAT public IP.' : 'No match yet. Check the NAT Gateway public IP or public IP prefix.';
            match.className = 'match visible ' + (isMatch ? 'yes' : 'no');
          }
          async function checkIp() {
            check.disabled = true; check.classList.add('loading'); buttonText.textContent = 'Checking…';
            ip.className = 'ip'; ip.textContent = 'Contacting service…'; message.className = 'helper'; message.textContent = 'Reaching the external IP discovery service.';
            try {
              const response = await fetch('/ip', { headers: { Accept: 'application/json' } });
              const data = await response.json();
              if (!response.ok || !data.success) throw new Error(data.error || 'Unable to check the outbound IP.');
              detectedIp = data.outboundPublicIp; ip.className = 'ip success'; ip.textContent = detectedIp; message.textContent = data.note; copy.disabled = false; requestStep.className = 'active'; resultStep.className = 'active'; requestStatus.textContent = 'External service reached successfully.'; resultStatus.textContent = 'Public IP detected. Compare it with your NAT IP.'; compareIp();
            } catch (error) {
              detectedIp = ''; copy.disabled = true; ip.className = 'ip error'; ip.textContent = 'Check failed'; message.className = 'helper error'; message.textContent = error.message; requestStatus.textContent = 'Could not reach the external service.'; resultStatus.textContent = 'No public IP was returned.';
            } finally {
              check.disabled = false; check.classList.remove('loading'); buttonText.textContent = 'Check again';
            }
          }
          check.addEventListener('click', checkIp);
          compare.addEventListener('click', compareIp);
          expected.addEventListener('input', compareIp);
          copy.addEventListener('click', async () => { try { await navigator.clipboard.writeText(detectedIp); toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1800); } catch { message.className = 'helper error'; message.textContent = 'Clipboard access was not available. Select and copy the IP manually.'; } });
        </script>
      </body>
    </html>
  `);
});

app.get("/ip", async (req, res) => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (!response.ok) throw new Error(`ipify returned ${response.status}`);
    const data = await response.json();

    res.json({
      success: true,
      outboundPublicIp: data.ip,
      message: "This is the public IP seen by the external service.",
      note: "When VNet Integration + NAT Gateway are configured correctly, this should be the NAT Gateway public IP."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
