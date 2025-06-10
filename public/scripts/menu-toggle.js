document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobile-menu");
  const burgerIcon = document.getElementById("burger-icon");

  burger?.addEventListener("click", () => {
    if (!menu || !burger || !burgerIcon) return;

    const isHidden = menu.classList.toggle("hidden");
    burger.setAttribute("aria-expanded", (!isHidden).toString());

    burgerIcon.innerHTML = isHidden
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />`;
  });
});
