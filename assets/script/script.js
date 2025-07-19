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

document.addEventListener("DOMContentLoaded", function () {
  let masterTl;
  let animationHasPlayed = false; // Flag to prevent re-playing on scroll

  // This is the main animation function
  function playAnimation() {
    if (masterTl) {
      masterTl.kill(); // Kill previous timeline to prevent conflicts
    }
    masterTl = gsap.timeline();

    // Set initial positions for all animated elements
    gsap.set(".letter", { y: "101%", autoAlpha: 1 });

    const col1 = document.getElementById("col1");
    const col2 = document.getElementById("col2");
    const col3 = document.getElementById("col3");
    const col4 = document.getElementById("col4");

    // This calculation must happen inside the function to be correct on resize
    const digitHeight = col1.parentElement.clientHeight;

    // Setup for UP-scrolling columns
    const col1_final_y = -(col1.children.length - 1) * digitHeight;
    const col3_final_y = -(col3.children.length - 1) * digitHeight;
    gsap.set([col1, col3], { y: 0 });

    // Setup for DOWN-scrolling columns
    const col2_initial_y = -(col2.children.length - 1) * digitHeight;
    const col4_initial_y = -(col4.children.length - 1) * digitHeight;
    gsap.set(col2, { y: col2_initial_y });
    gsap.set(col4, { y: col4_initial_y });

    // The master animation timeline
    masterTl
      .to(".letter", {
        y: "0%",
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.15,
      })
      .to(
        col1,
        { y: col1_final_y, duration: 1.0, ease: "power2.inOut" },
        "<0.2"
      )
      .to(col3, { y: col3_final_y, duration: 1.0, ease: "power2.inOut" }, "<")
      .to(col2, { y: 0, duration: 1.0, ease: "power2.inOut" }, "<")
      .to(col4, { y: 0, duration: 1.0, ease: "power2.inOut" }, "<");

    animationHasPlayed = true;
  }

  // --- Intersection Observer to trigger animation on scroll ---
  const animatedSection = document.querySelector(".dv-section");

  // These options control when the observer triggers
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.6, // Trigger when 40% of the section is visible
  };

  // This function runs when the section's visibility changes
  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");

        if (!animationHasPlayed) {
          setTimeout(playAnimation, 200);
        }

        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  observer.observe(animatedSection);

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    if (animationHasPlayed) {
      animationHasPlayed = false;
      animatedSection.classList.remove("is-visible");
      observer.observe(animatedSection);
    }
  });
});
