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
    threshold: 0.4, // Trigger when 40% of the section is visible
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

(function () {
  const sliderComponent = document.querySelector(".hc-testimonial-cards");
  if (!sliderComponent) return; // Don't run if the component isn't on the page

  const track = sliderComponent.querySelector(".slider-track");
  const cards = Array.from(track.children);
  const nextButton = sliderComponent.querySelector("#next-btn");
  const prevButton = sliderComponent.querySelector("#prev-btn");
  const paginationContainer =
    sliderComponent.querySelector(".slider-pagination");

  let currentIndex = 0;
  let itemsVisible = 3; // Default for desktop
  let totalPages = 0;

  function createPagination() {
    paginationContainer.innerHTML = ""; // Clear old dots
    totalPages = Math.max(cards.length - itemsVisible + 1, 1);

    if (totalPages <= 1) return; // Don't show dots if not needed

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("button");
      dot.classList.add("pagination-dot");
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateSliderPosition();
      });
      paginationContainer.appendChild(dot);
    }
    updateDots();
  }

  function updateDots() {
    const dots = paginationContainer.querySelectorAll(".pagination-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function updateSliderPosition() {
    const slideWidth = track.clientWidth / itemsVisible;
    track.style.transform = "translateX(" + -currentIndex * slideWidth + "px)";
    updateDots();
  }

  function updateItemsVisible() {
    if (window.innerWidth <= 768) {
      itemsVisible = 1;
    } else if (window.innerWidth <= 1024) {
      itemsVisible = 2;
    } else {
      itemsVisible = 3;
    }

    const maxIndex = cards.length - itemsVisible;
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex < 0 ? 0 : maxIndex;
    }

    createPagination();
    updateSliderPosition();
  }

  nextButton.addEventListener("click", () => {
    const maxIndex = cards.length - itemsVisible;
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0; // Loop back to the start
    }
    updateSliderPosition();
  });

  prevButton.addEventListener("click", () => {
    const maxIndex = cards.length - itemsVisible;
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex; // Loop to the end
    }
    updateSliderPosition();
  });

  // Update on window resize
  window.addEventListener("resize", updateItemsVisible);

  // Initial setup
  updateItemsVisible();
})();

document.addEventListener("DOMContentLoaded", function () {
  const textSteps = document.querySelectorAll(".text-step");
  const images = document.querySelectorAll(".scroll-image");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.6,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const imageIdToShow = entry.target.getAttribute("data-img");

        images.forEach((img) => {
          img.classList.remove("is-active");
        });

        const imageToShow = document.getElementById(imageIdToShow);
        if (imageToShow) {
          imageToShow.classList.add("is-active");
        }
      }
    });
  }, observerOptions);

  textSteps.forEach((step) => {
    observer.observe(step);
  });
});

// JavaScript for the location switcher
document.addEventListener("DOMContentLoaded", function () {
  const locationItems = document.querySelectorAll(".location-item");
  const officeImage = document.getElementById("office-image");

  locationItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove active class from all items
      locationItems.forEach((i) => i.classList.remove("active"));

      // Add active class to the clicked item
      this.classList.add("active");

      // Change the image source
      const newImageSrc = this.getAttribute("data-image");
      officeImage.src = newImageSrc;
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Select the specific section you want to animate
  const storySection = document.querySelector(".ab-dv-section");

  // Only run the code if this section exists on the page
  if (storySection) {
    let animationHasPlayed = false;

    // This is the main animation function for the section
    function playStoryAnimation() {
      if (animationHasPlayed) return; // Don't play more than once

      const masterTl = gsap.timeline();

      // Set initial positions for all animated elements
      gsap.set(".ab-letter", { y: "101%", autoAlpha: 1 });

      const col1 = document.getElementById("col1");
      const col2 = document.getElementById("col2");
      const col3 = document.getElementById("col3");
      const col4 = document.getElementById("col4");

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
        .to(".ab-letter", {
          // Animate the letters
          y: "0%",
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.15,
        })
        .to(
          col1,
          { y: col1_final_y, duration: 1.0, ease: "power2.inOut" },
          "<0.2"
        ) // Animate numbers
        .to(col3, { y: col3_final_y, duration: 1.0, ease: "power2.inOut" }, "<")
        .to(col2, { y: 0, duration: 1.0, ease: "power2.inOut" }, "<")
        .to(col4, { y: 0, duration: 1.0, ease: "power2.inOut" }, "<");

      animationHasPlayed = true;
    }

    // Use an Intersection Observer to trigger the animation on scroll
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.4, // Trigger when 40% of the section is visible
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Play the animation with a short delay, then stop observing
          setTimeout(playStoryAnimation, 200);
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    observer.observe(storySection);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const locationItems = document.querySelectorAll(".ab-location-item");
  const officeImage = document.getElementById("office-image");
  const locationsList = document.querySelector(".ab-locations-list");

  locationItems.forEach((item) => {
    item.addEventListener("click", function () {
      locationItems.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
      locationsList.classList.add("has-active");
      const newImageSrc = this.getAttribute("data-image");
      if (newImageSrc) {
        officeImage.src = newImageSrc;
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const leftSide = document.querySelector(".left-side");

  if (!leftSide) {
    console.error("Element with class '.left-side' not found!");
    return;
  }

  const images = [
    "../../../assets/images/boardBg.webp",
    "../../../assets/images/boardBg.webp",
    "../../../assets/images/boardBg.webp",
    "../../../assets/images/boardBg.webp",
    "../../../assets/images/boardBg.webp",
  ];

  const slideInterval = 3000; // time between slides
  const startDelay = 1000; // delay before starting slideshow
  let currentIndex = 0;

  function preloadImages() {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  function startSlideshow() {
    // Set first image
    leftSide.style.setProperty(
      "--bg-image-current",
      `url(${images[currentIndex]})`
    );

    // Start loop
    setInterval(changeImage, slideInterval);
  }

  function changeImage() {
    const nextIndex = (currentIndex + 1) % images.length;
    leftSide.style.setProperty("--bg-image-next", `url(${images[nextIndex]})`);
    leftSide.classList.add("is-fading");

    leftSide.addEventListener("transitionend", function onTransitionEnd() {
      leftSide.style.setProperty(
        "--bg-image-current",
        `url(${images[nextIndex]})`
      );
      leftSide.classList.remove("is-fading");
      currentIndex = nextIndex;
      leftSide.removeEventListener("transitionend", onTransitionEnd);
    });
  }

  preloadImages();

  // Delay slideshow start by 1s
  setTimeout(startSlideshow, startDelay);
});
