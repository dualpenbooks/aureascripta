/* Aurea Scripta - misurazione visite Google Analytics 4 con consenso esplicito.
   Il tag Google si carica SOLO dopo "Accetto" (nessun dato inviato senza consenso). */
(function () {
  var GA4 = "G-JN2BKLZ97P";
  var KEY = "as_consent";

  var lang = (document.documentElement.lang || "it").slice(0, 2).toLowerCase();
  var TXT = {
    it: { msg: "Usiamo i cookie di Google per misurare le visite al sito. Li accetti?", ok: "Accetto", no: "Rifiuto" },
    en: { msg: "We use Google cookies to measure visits to this site. Do you accept?", ok: "Accept", no: "Decline" },
    fr: { msg: "Nous utilisons des cookies Google pour mesurer les visites du site. Acceptez-vous ?", ok: "Accepter", no: "Refuser" }
  };
  var t = TXT[lang] || TXT.it;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  function readConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function writeConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var saved = readConsent();
  var granted = (saved === "yes");

  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: granted ? "granted" : "denied",
    wait_for_update: 500
  });

  var loaded = false;
  function loadGtag() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA4);
  }
  if (granted) loadGtag();

  if (!saved) showBanner();

  function grantAnalytics() {
    gtag("consent", "update", { analytics_storage: "granted" });
    loadGtag();
  }

  function showBanner() {
    var bar = document.createElement("div");
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-live", "polite");
    bar.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#152238;color:#f5f0e4;padding:14px 18px;font-family:Helvetica,Arial,sans-serif;font-size:.92rem;line-height:1.4;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:center;box-shadow:0 -2px 12px rgba(0,0,0,.25)";

    var msg = document.createElement("span");
    msg.textContent = t.msg;
    msg.style.cssText = "max-width:620px";

    var ok = document.createElement("button");
    ok.type = "button";
    ok.textContent = t.ok;
    ok.style.cssText = "background:#c9a45c;color:#26221c;border:0;border-radius:5px;padding:9px 22px;font-size:.92rem;font-weight:bold;cursor:pointer";

    var no = document.createElement("button");
    no.type = "button";
    no.textContent = t.no;
    no.style.cssText = "background:transparent;color:#f5f0e4;border:1px solid #6e675c;border-radius:5px;padding:9px 22px;font-size:.92rem;cursor:pointer";

    ok.addEventListener("click", function () { writeConsent("yes"); grantAnalytics(); bar.parentNode && bar.parentNode.removeChild(bar); });
    no.addEventListener("click", function () { writeConsent("no"); bar.parentNode && bar.parentNode.removeChild(bar); });

    bar.appendChild(msg);
    bar.appendChild(ok);
    bar.appendChild(no);
    (document.body || document.documentElement).appendChild(bar);
  }
})();
