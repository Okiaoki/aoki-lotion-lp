"use strict";

document.documentElement.classList.add("js");

const CONFIG = {
  productName: "青木化粧水",
  introPrice: "2,980円（税込）",
  regularPrice: "5,980円（税込）",
  shippingText: "送料無料",
  refundText: "30日返金保証",
  deadline: {
    header: { text: "期間限定キャンペーン実施中", urgency: "" },
    mid: { text: "本日23:59まで", urgency: "残りわずか" },
    bottom: { text: "本日23:59で終了", urgency: "本日23:59まで・残りわずか" },
    form: { text: "本日中のお申し込みで初回特典適用", urgency: "本日23:59まで" }
  },
  checkoutUrl: "https://example.com/product/aoki-lotion",
  mallUrls: {
    rakuten: "https://example.com/shop/rakuten/aoki-lotion",
    amazon: "https://example.com/shop/amazon/aoki-lotion",
    yahoo: "https://example.com/shop/yahoo/aoki-lotion"
  },
  scrollTargetId: "purchase-form"
};

const LEGAL_CONTENT = {
  tokusho: {
    title: "特定商取引法に基づく表記",
    paragraphs: [
      "販売事業者：株式会社Aoki Cosmetic",
      "運営責任者：青木 太郎",
      "所在地：〒150-0001 東京都渋谷区神宮前1-2-3",
      "電話番号：03-1234-5678（平日 10:00-18:00）",
      "メールアドレス：support@example.jp",
      "販売価格：各商品ページに税込価格で表示",
      "商品代金以外の必要料金：消費税、後払い手数料（利用時）、インターネット接続にかかる通信料",
      "お支払い方法：クレジットカード、コンビニ後払い、各種オンライン決済",
      "商品の引き渡し時期：ご注文確定後、通常1〜3営業日以内に発送",
      "返品・交換・キャンセル：商品到着後8日以内の未開封品に限り対応。初期不良時の返送料は当社負担、お客様都合の返送料はお客様負担"
    ]
  },
  privacy: {
    title: "プライバシーポリシー",
    paragraphs: [
      "当社は、氏名・住所・電話番号・メールアドレス等の個人情報を、商品の発送、決済、アフターサポート、お問い合わせ対応のために取得・利用します。",
      "取得した個人情報は、法令に基づく場合を除き、ご本人の同意なく第三者へ提供しません。",
      "業務委託先（配送会社、決済代行会社等）には、利用目的の達成に必要な範囲で情報を提供する場合があります。",
      "当社は、不正アクセス、漏えい、滅失、毀損等を防止するため、合理的な安全管理措置を講じます。",
      "ご本人からの開示・訂正・利用停止・削除の請求には、本人確認のうえ、法令に従って速やかに対応します。",
      "個人情報の取扱いに関するお問い合わせは、support@example.jp までご連絡ください。"
    ]
  },
  terms: {
    title: "利用規約",
    paragraphs: [
      "本サービスの利用者は、本規約に同意したうえで、当社が提供する商品購入および関連サービスを利用するものとします。",
      "利用者は、虚偽の登録、第三者へのなりすまし、不正アクセス、法令または公序良俗に反する行為をしてはなりません。",
      "当社は、システム保守、障害対応、法令改正等の必要がある場合、事前の告知を行ったうえで本サービスの全部または一部を変更・停止できるものとします。",
      "当社は、利用者の故意または過失によって生じた損害について、当社に重大な過失がある場合を除き責任を負いません。",
      "本規約の解釈に関して疑義が生じた場合は、誠意をもって協議し解決するものとします。",
      "本規約および本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。"
    ]
  },
  company: {
    title: "会社情報",
    paragraphs: [
      "会社名：株式会社Aoki Cosmetic",
      "代表取締役：青木 太郎",
      "設立：2020年4月1日",
      "資本金：500万円",
      "所在地：〒150-0001 東京都渋谷区神宮前1-2-3",
      "事業内容：化粧品・医薬部外品の企画、販売、ECサイト運営",
      "営業時間：平日 10:00-18:00（土日祝日・年末年始を除く）"
    ]
  }
};

/* ---------- ユーティリティ ---------- */

function isSp() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function createToastController() {
  const toast = document.getElementById("externalToast");
  if (!toast) return { show: () => {} };

  let timerId = null;

  function show() {
    toast.hidden = false;
    toast.classList.add("is-visible");
    if (timerId) window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      toast.hidden = true;
    }, 3000);
  }

  return { show };
}

function openCheckoutWithFallback(url) {
  const nextTab = window.open("", "_blank");
  if (nextTab) {
    nextTab.opener = null;
    nextTab.location.href = url;
    return;
  }
  window.location.href = url;
}

/* ---------- 表示系 ---------- */

function applyConfigText() {
  document.querySelectorAll("[data-config-text]").forEach((el) => {
    const key = el.dataset.configText;
    if (!key || !(key in CONFIG)) return;
    el.textContent = CONFIG[key];
  });

  const floatingMain = document.querySelector(".floating-cta__main");
  const floatingNote = document.querySelector(".floating-cta__note");
  if (floatingMain) floatingMain.textContent = `初回 ${CONFIG.introPrice.replace("（税込）", "")}`;
  if (floatingNote) floatingNote.textContent = `税込・${CONFIG.shippingText}`;
}

function renderOfferBlocks() {
  const template = document.getElementById("offerTemplate");
  if (!template) return;

  function resolveDeadlineKey(position) {
    if (position === "top" || position === "header") return "header";
    if (position === "top2") return "mid";
    if (position === "mid" || position === "bottom" || position === "form") return position;
    return "header";
  }

  document.querySelectorAll("[data-offer-target]").forEach((target) => {
    const fragment = template.content.cloneNode(true);

    fragment.querySelectorAll("[data-offer-text]").forEach((el) => {
      const key = el.dataset.offerText;
      if (!key || key === "deadlineText" || key === "deadlineUrgency") return;
      if (!(key in CONFIG)) return;
      el.textContent = CONFIG[key];
    });

    const ctaContainer = target.closest(".cta");
    const ctaEl = ctaContainer ? ctaContainer.querySelector("[data-cta]") : null;
    const position = ctaEl?.dataset?.cta || "header";
    const deadlineKey = resolveDeadlineKey(position);
    const deadlineConfig = CONFIG.deadline[deadlineKey] || CONFIG.deadline.header;

    const deadlineTextEl = fragment.querySelector('[data-offer-text="deadlineText"]');
    if (deadlineTextEl) {
      deadlineTextEl.textContent = deadlineConfig.text;
    }

    const urgencyEl = fragment.querySelector('[data-offer-text="deadlineUrgency"]');
    if (urgencyEl) {
      const urgencyText = deadlineConfig.urgency || "";
      if (urgencyText.trim() === "") {
        urgencyEl.remove();
      } else {
        urgencyEl.textContent = urgencyText;
      }
    }

    target.innerHTML = "";
    target.appendChild(fragment);
  });
}

/* 本日23:59へ向けたカウントダウン（毎日リセット＝販促LPの定番演出） */
function startCountdown() {
  const timers = document.querySelectorAll("[data-countdown]");
  if (timers.length === 0) return;

  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const diff = Math.max(0, end.getTime() - now.getTime());
    const h = pad(Math.floor(diff / 3600000));
    const m = pad(Math.floor((diff % 3600000) / 60000));
    const s = pad(Math.floor((diff % 60000) / 1000));

    timers.forEach((timer) => {
      const hEl = timer.querySelector('[data-cd="h"]');
      const mEl = timer.querySelector('[data-cd="m"]');
      const sEl = timer.querySelector('[data-cd="s"]');
      if (hEl) hEl.textContent = h;
      if (mEl) mEl.textContent = m;
      if (sEl) sEl.textContent = s;
    });
  }

  tick();
  window.setInterval(tick, 1000);
}

/* スクロール出現 */
function bindReveals() {
  const targets = document.querySelectorAll(".rv");
  if (targets.length === 0) return;

  /* ?qa=1 は撮影QC用の一括表示スイッチ（遅延画像も即読み込み） */
  const forceShow = new URLSearchParams(window.location.search).has("qa");
  if (forceShow || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-in"));
    if (forceShow) {
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = "eager"; });
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------- 導線系 ---------- */

function bindSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    if (anchor.hasAttribute("data-cta") || anchor.hasAttribute("data-legal") || anchor.hasAttribute("data-mall")) return;

    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function bindExternalCheckoutCtas() {
  const toast = createToastController();
  const scrollOnlyPositions = new Set(["header", "top", "top2"]);

  function scrollToTarget() {
    const target = document.getElementById(CONFIG.scrollTargetId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelectorAll("[data-cta]").forEach((ctaEl) => {
    if (ctaEl.dataset.ctaBound === "1") return;
    ctaEl.dataset.ctaBound = "1";

    const position = ctaEl.dataset.cta || "unknown";
    if (position === "form") return;
    const isScrollOnly = scrollOnlyPositions.has(position);
    const tag = ctaEl.tagName.toLowerCase();
    if (tag === "a") {
      if (isScrollOnly) {
        ctaEl.setAttribute("href", `#${CONFIG.scrollTargetId}`);
        ctaEl.removeAttribute("target");
        ctaEl.removeAttribute("rel");
      } else {
        ctaEl.setAttribute("href", CONFIG.checkoutUrl);
        ctaEl.setAttribute("target", "_blank");
        ctaEl.setAttribute("rel", "noopener noreferrer");
      }
    }

    ctaEl.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      console.log("cta_click", { position, url: CONFIG.checkoutUrl });
      if (isScrollOnly) {
        scrollToTarget();
        return;
      }

      toast.show();
      openCheckoutWithFallback(CONFIG.checkoutUrl);
    });
  });
}

/* 楽天/Amazon/Yahoo! モール誘導ボタン */
function bindMallButtons() {
  const toast = createToastController();

  document.querySelectorAll("[data-mall]").forEach((btn) => {
    const mall = btn.dataset.mall || "unknown";
    const url = CONFIG.mallUrls[mall] || CONFIG.checkoutUrl;

    btn.setAttribute("href", url);
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener noreferrer");

    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      console.log("mall_click", { mall, url });
      toast.show();
      openCheckoutWithFallback(url);
    });
  });
}

/* 追従CTA：FV通過後に表示、フォーム表示中は隠す */
function bindFloatingCta() {
  const bar = document.getElementById("floatingCta");
  if (!bar) return;

  const fv = document.querySelector(".fv");
  const formSection = document.querySelector("[data-track-view='form']");

  if (!("IntersectionObserver" in window)) {
    bar.classList.add("is-shown");
    return;
  }

  let pastFv = false;
  let formVisible = false;
  let formViewTracked = false;

  function sync() {
    if (pastFv && !formVisible) {
      bar.classList.add("is-shown");
      bar.classList.remove("is-hidden");
    } else {
      bar.classList.remove("is-shown");
      bar.classList.add("is-hidden");
    }
  }

  if (fv) {
    new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        pastFv = !entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 }
    ).observe(fv);
  } else {
    pastFv = true;
  }

  if (formSection) {
    new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        formVisible = entry.isIntersecting;
        if (formVisible && !formViewTracked) {
          formViewTracked = true;
          console.log("form_view");
        }
        sync();
      },
      { threshold: 0 }
    ).observe(formSection);
  }

  sync();
}

function bindFaqTracking() {
  document.querySelectorAll("details[data-faq]").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      console.log("faq_open", { id: item.dataset.faq });
    });
  });
}

/* ---------- モーダル ---------- */

function createModalController(modal, closeSelector, onClose, options = {}) {
  if (!modal) return null;
  let lastFocusedElement = null;
  const closeOnEsc = options.closeOnEsc !== false;

  function getFocusableElements() {
    return modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }

  function onModalKeydown(event) {
    if (modal.hidden) return;

    if (event.key === "Escape") {
      if (!closeOnEsc) return;
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== "Tab") return;
    const focusables = getFocusableElements();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function open(initialFocusSelector) {
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("is-modal-open");
    document.addEventListener("keydown", onModalKeydown);

    const initialFocus = initialFocusSelector ? modal.querySelector(initialFocusSelector) : null;
    if (initialFocus) {
      initialFocus.focus();
      return;
    }

    const focusables = getFocusableElements();
    if (focusables.length > 0) focusables[0].focus();
  }

  function close() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("is-modal-open");
    document.removeEventListener("keydown", onModalKeydown);
    if (typeof onClose === "function") onClose();
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  }

  modal.addEventListener("click", (event) => {
    if (event.target.matches(closeSelector)) close();
  });

  return { open, close };
}

function bindLegalModal() {
  const modal = document.getElementById("legalModal");
  const titleEl = document.getElementById("legalModalTitle");
  const bodyEl = document.getElementById("legalModalBody");
  if (!modal || !titleEl || !bodyEl) return;
  const legalController = createModalController(modal, "[data-legal-close]");
  if (!legalController) return;

  function openLegalModal(type) {
    const legal = LEGAL_CONTENT[type];
    if (!legal) return;

    titleEl.textContent = legal.title;
    bodyEl.innerHTML = "";

    legal.paragraphs.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      bodyEl.appendChild(p);
    });

    legalController.open();

    console.log("legal_open", { type });
  }

  document.querySelectorAll("[data-legal]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openLegalModal(link.dataset.legal);
    });
  });
}

function bindDemoIntroModal() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") !== "1") return;

  const modal = document.getElementById("demoIntroModal");
  const neverShowInput = document.getElementById("demoIntroNeverShow");
  if (!modal) return;

  const storageKeys = {
    seen: "aoki_lp_demo_intro_seen",
    hide: "aoki_lp_demo_intro_hide"
  };

  function getStorageValue(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_error) {
      return null;
    }
  }

  function setStorageValue(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_error) {
      /* localStorage不可環境でもモーダル自体は動作させる */
    }
  }

  if (getStorageValue(storageKeys.hide) === "1" || getStorageValue(storageKeys.seen) === "1") return;

  const demoController = createModalController(modal, "[data-demo-close]", () => {
    setStorageValue(storageKeys.seen, "1");
    if (neverShowInput && neverShowInput.checked) {
      setStorageValue(storageKeys.hide, "1");
    }
  }, { closeOnEsc: false });
  if (!demoController) return;

  demoController.open(".demo-intro-modal__dialog");
}

/* ---------- 購入前確認フォーム ---------- */

function bindOrderFormUi() {
  const form = document.getElementById("orderForm");
  const stepNextBtn = document.getElementById("stepNextBtn");
  const stepBackBtn = document.getElementById("stepBackBtn");
  const formNotice = document.getElementById("formNotice");
  const toast = createToastController();

  if (!form) return;

  function goToStep2() {
    if (!isSp()) return;
    form.classList.add("is-step2");
    const step2El = document.getElementById("formStep2");
    if (step2El) step2El.scrollIntoView({ behavior: "smooth", block: "start" });
    console.log("checkout_step_next");
  }

  function goToStep1() {
    if (!isSp()) return;
    form.classList.remove("is-step2");
    const step1El = document.getElementById("formStep1");
    if (step1El) step1El.scrollIntoView({ behavior: "smooth", block: "start" });
    console.log("checkout_step_back");
  }

  if (stepNextBtn) stepNextBtn.addEventListener("click", goToStep2);
  if (stepBackBtn) stepBackBtn.addEventListener("click", goToStep1);

  function setFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    if (!field || !errorEl) return;
    field.setAttribute("aria-invalid", message ? "true" : "false");
    errorEl.textContent = message;
  }

  function getTrimmedValue(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field || typeof field.value !== "string") return "";
    return field.value.trim();
  }

  function clearFormErrors() {
    setFieldError("name", "nameError", "");
    setFieldError("email", "emailError", "");
    setFieldError("tel", "telError", "");
    setFieldError("zip", "zipError", "");
    setFieldError("address", "addressError", "");
    const termsError = document.getElementById("termsError");
    if (termsError) termsError.textContent = "";
    if (formNotice) {
      formNotice.hidden = true;
      formNotice.textContent = "入力内容を確認してください";
    }
  }

  function validateOptionalForm() {
    clearFormErrors();
    const errors = [];

    const name = getTrimmedValue("name");
    const email = getTrimmedValue("email");
    const tel = getTrimmedValue("tel");
    const zip = getTrimmedValue("zip");
    const address = getTrimmedValue("address");

    if (name && name.length < 2) {
      errors.push({ fieldId: "name", errorId: "nameError", message: "お名前は2文字以上で入力してください。" });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ fieldId: "email", errorId: "emailError", message: "メールアドレスの形式が正しくありません。" });
    }

    if (tel && !/^[0-9+\-()\s]{9,15}$/.test(tel)) {
      errors.push({ fieldId: "tel", errorId: "telError", message: "電話番号の形式が正しくありません。" });
    }

    if (zip && !/^\d{3}-?\d{4}$/.test(zip)) {
      errors.push({ fieldId: "zip", errorId: "zipError", message: "郵便番号は「123-4567」形式で入力してください。" });
    }

    if (address && address.length < 5) {
      errors.push({ fieldId: "address", errorId: "addressError", message: "住所は5文字以上で入力してください。" });
    }

    errors.forEach(({ fieldId, errorId, message }) => setFieldError(fieldId, errorId, message));

    if (errors.length > 0) {
      if (formNotice) {
        formNotice.hidden = false;
        formNotice.textContent = "入力内容に誤りがあります。未入力のまま進むことも可能です。";
      }
      return false;
    }

    return true;
  }

  ["name", "email", "tel", "zip", "address"].forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.addEventListener("input", () => {
      validateOptionalForm();
    });
  });

  document.querySelectorAll('[data-cta="form"]').forEach((ctaEl) => {
    if (ctaEl.dataset.formBound === "1") return;
    ctaEl.dataset.formBound = "1";

    ctaEl.addEventListener("click", (event) => {
      const isValid = validateOptionalForm();
      if (!isValid) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      toast.show();
      openCheckoutWithFallback(CONFIG.checkoutUrl);
    });
  });
}

/* ---------- 初期化 ---------- */

applyConfigText();
renderOfferBlocks();
startCountdown();
bindReveals();
bindSmoothScroll();
bindExternalCheckoutCtas();
bindMallButtons();
bindFloatingCta();
bindFaqTracking();
bindLegalModal();
bindDemoIntroModal();
bindOrderFormUi();
