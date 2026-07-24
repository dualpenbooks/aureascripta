/* Aurea Scripta - misurazione visite Google Analytics 4 (modalita' consenso, STRICT=false).
   ONLINE. Impostazione allineata a DualPen il 24/07/2026 (parere legale: rischio bassissimo).
   Il tag GA4 si carica per TUTTI ma in stato consenso NEGATO: nessun cookie, solo segnale
   anonimo e aggregato. Il banner e' un avviso informativo che si chiude con "OK".
   PER TORNARE INDIETRO: STRICT = true -> niente a Google senza consenso esplicito. */
(function () {
  var GA4 = "G-JN2BKLZ97P";
  var KEY = "as_notice";

  // false: misura anonima (senza cookie) per tutti, banner informativo. [impostazione attuale]
  // true:  nessun invio a Google senza consenso esplicito.
  var STRICT = false;

  var lang = (document.documentElement.lang || "it").slice(0, 2).toLowerCase();
  var TXT = {
    it: { msg: "Misuriamo in forma anonima le visite al sito, senza cookie di profilazione.", ok: "OK", more: "Privacy", priv: "/privacy/" },
    en: { msg: "We anonymously measure visits to this site, with no profiling cookies.", ok: "OK", more: "Privacy", priv: "/en/privacy/" },
    fr: { msg: "Nous mesurons de façon anonyme les visites du site, sans cookies de profilage.", ok: "OK", more: "Confidentialité", priv: "/fr/confidentialite/" }
  };
  var t = TXT[lang] || TXT.it;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  function noticeShown() { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function markNotice() { try { localStorage.setItem(KEY, "1"); } catch (e) {} }

  // Stato di consenso DI DEFAULT (negato): niente cookie, solo segnale anonimo/aggregato.
  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: "denied",
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
  if (!STRICT) loadGtag();

  // Contatore esatto e anonimo (GoatCounter, senza cookie): conta le visite in automatico.
  (function loadGoat() {
    var g = document.createElement("script");
    g.async = true;
    g.setAttribute("data-goatcounter", "https://aureascripta.goatcounter.com/count");
    g.src = "https://gc.zgo.at/count.js";
    document.head.appendChild(g);
  })();

  if (!noticeShown()) showNotice();

  function showNotice() {
    var bar = document.createElement("div");
    bar.setAttribute("role", "note");
    bar.setAttribute("aria-live", "polite");
    bar.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#152238;color:#f5f0e4;padding:14px 18px;font-family:Helvetica,Arial,sans-serif;font-size:.92rem;line-height:1.4;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:center;box-shadow:0 -2px 12px rgba(0,0,0,.25)";

    var msg = document.createElement("span");
    msg.textContent = t.msg;
    msg.style.cssText = "max-width:660px";

    var link = document.createElement("a");
    link.href = t.priv;
    link.textContent = t.more;
    link.style.cssText = "color:#c9a45c;text-decoration:underline;white-space:nowrap";

    var ok = document.createElement("button");
    ok.type = "button";
    ok.textContent = t.ok;
    ok.style.cssText = "background:#c9a45c;color:#26221c;border:0;border-radius:5px;padding:9px 22px;font-size:.92rem;font-weight:bold;cursor:pointer";

    ok.addEventListener("click", function () { markNotice(); bar.parentNode && bar.parentNode.removeChild(bar); });

    bar.appendChild(msg);
    bar.appendChild(link);
    bar.appendChild(ok);
    (document.body || document.documentElement).appendChild(bar);
  }
})();
