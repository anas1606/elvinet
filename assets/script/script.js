const menuToggle = document.getElementById("mobile-menu");
const mobileNav = document.getElementById("mobileNavOverlay");

menuToggle.addEventListener("click", () => {
  mobileNav.classList.toggle("active");
  menuToggle.classList.toggle("active"); 
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("active");
    menuToggle.classList.remove("active"); 
  });
});
