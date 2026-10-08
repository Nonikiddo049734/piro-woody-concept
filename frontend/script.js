/**
 * PIRO WOODY CONCEPTS — INTERACTIVE CLIENTSIDE CONTROLLER
 * High performance, zero dependency, responsive interactions & WhatsApp integration
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. STICKY HEADER & ACTIVE NAV HIGHLIGHT
     ========================================================================== */
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // IntersectionObserver for active navigation links
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));


  /* ==========================================================================
     2. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });


  /* ==========================================================================
     3. PORTFOLIO FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });


  /* ==========================================================================
     4. PROJECT DETAIL MODAL / LIGHTBOX
     ========================================================================== */
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-project-img');
  const modalTitle = document.getElementById('modal-project-title');
  const modalCategory = document.getElementById('modal-project-category');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalWaLink = document.getElementById('modal-wa-inquire');

  function openProjectModal(card) {
    const title = card.getAttribute('data-title');
    const img = card.getAttribute('data-img');
    const desc = card.getAttribute('data-desc');
    const categoryElem = card.querySelector('.project-category');
    const categoryText = categoryElem ? categoryElem.textContent : 'Interior Project';

    modalTitle.textContent = title;
    modalImg.src = img;
    modalImg.alt = title;
    modalCategory.textContent = categoryText;
    modalDesc.textContent = desc;

    // Prefill WhatsApp direct message with specific project name
    const waText = encodeURIComponent(`Hello Piro Woody Concepts, I am interested in your project "${title}" (${categoryText}). Could you provide more details or an estimate?`);
    modalWaLink.href = `https://wa.me/2348137808170?text=${waText}`;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => openProjectModal(card));
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }


  /* ==========================================================================
     5. SERVICE CARD "REQUEST SERVICE" BUTTONS
     ========================================================================== */
  const serviceActionBtns = document.querySelectorAll('.btn-service-action');
  const serviceDropdown = document.getElementById('service-needed');
  const contactSection = document.getElementById('contact');

  serviceActionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const serviceName = btn.getAttribute('data-service');
      
      if (serviceDropdown) {
        // Select matching option
        for (let i = 0; i < serviceDropdown.options.length; i++) {
          if (serviceDropdown.options[i].value === serviceName) {
            serviceDropdown.selectedIndex = i;
            break;
          }
        }
      }

      // Smooth scroll to form
      contactSection.scrollIntoView({ behavior: 'smooth' });
      
      // Flash form input focus
      setTimeout(() => {
        const nameInput = document.getElementById('full-name');
        if (nameInput) nameInput.focus();
      }, 600);
    });
  });


  /* ==========================================================================
     6. VERIFIED BUSINESS BANNER MODAL
     ========================================================================== */
  const bannerModal = document.getElementById('banner-modal');
  const viewBannerBtn = document.getElementById('btn-view-banner-modal');
  const bannerModalClose = document.getElementById('banner-modal-close');

  function openBannerModal() {
    if (bannerModal) {
      bannerModal.classList.add('active');
      bannerModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBannerModal() {
    if (bannerModal) {
      bannerModal.classList.remove('active');
      bannerModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (viewBannerBtn) viewBannerBtn.addEventListener('click', openBannerModal);
  if (bannerModalClose) bannerModalClose.addEventListener('click', closeBannerModal);
  if (bannerModal) {
    bannerModal.addEventListener('click', (e) => {
      if (e.target === bannerModal) closeBannerModal();
    });
  }


  /* ==========================================================================
     7. PRIVACY POLICY & TERMS MODALS
     ========================================================================== */
  const policyModal = document.getElementById('policy-modal');
  const policyModalTitle = document.getElementById('policy-modal-title');
  const policyModalClose = document.getElementById('policy-modal-close');
  const btnPolicyClose = document.getElementById('btn-policy-close');
  const linkPrivacy = document.getElementById('link-privacy');
  const linkTerms = document.getElementById('link-terms');

  function openPolicyModal(type) {
    if (policyModal) {
      policyModalTitle.textContent = type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions';
      policyModal.classList.add('active');
      policyModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closePolicyModal() {
    if (policyModal) {
      policyModal.classList.remove('active');
      policyModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (linkPrivacy) {
    linkPrivacy.addEventListener('click', (e) => {
      e.preventDefault();
      openPolicyModal('privacy');
    });
  }

  if (linkTerms) {
    linkTerms.addEventListener('click', (e) => {
      e.preventDefault();
      openPolicyModal('terms');
    });
  }

  if (policyModalClose) policyModalClose.addEventListener('click', closePolicyModal);
  if (btnPolicyClose) btnPolicyClose.addEventListener('click', closePolicyModal);
  if (policyModal) {
    policyModal.addEventListener('click', (e) => {
      if (e.target === policyModal) closePolicyModal();
    });
  }


  /* ==========================================================================
     8. GLOBAL ESCAPE KEY LISTENER FOR ALL MODALS
     ========================================================================== */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeProjectModal();
      closeBannerModal();
      closePolicyModal();
    }
  });


  /* ==========================================================================
     9. FRONTEND ENQUIRY FORM VALIDATION & WHATSAPP CONVERSION
     ========================================================================== */
  const enquiryForm = document.getElementById('enquiry-form');
  const successBox = document.getElementById('form-success-message');
  const successUserName = document.getElementById('success-user-name');
  const successWaLink = document.getElementById('success-wa-link');
  const btnSendAnother = document.getElementById('btn-send-another');
  const btnSubmitEnquiry = document.getElementById('btn-submit-enquiry');

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Fields
      const fullName = document.getElementById('full-name');
      const phone = document.getElementById('phone-number');
      const email = document.getElementById('email-address');
      const service = document.getElementById('service-needed');
      const location = document.getElementById('project-location');
      const description = document.getElementById('project-description');

      // Helper function to validate
      function checkField(input, errorId, condition) {
        const errorElem = document.getElementById(errorId);
        if (!condition) {
          input.classList.add('has-error');
          if (errorElem) errorElem.classList.add('visible');
          isValid = false;
        } else {
          input.classList.remove('has-error');
          if (errorElem) errorElem.classList.remove('visible');
        }
      }

      checkField(fullName, 'error-fullName', fullName.value.trim().length >= 2);
      checkField(phone, 'error-phone', phone.value.trim().length >= 8);
      checkField(service, 'error-service', service.value.trim().length > 0);
      checkField(location, 'error-location', location.value.trim().length > 0);
      checkField(description, 'error-description', description.value.trim().length >= 5);

      if (email.value.trim().length > 0) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        checkField(email, 'error-email', emailPattern.test(email.value.trim()));
      } else {
        email.classList.remove('has-error');
        const errEmail = document.getElementById('error-email');
        if (errEmail) errEmail.classList.remove('visible');
      }

      if (!isValid) {
        // Scroll first invalid input into view
        const firstError = enquiryForm.querySelector('.has-error');
        if (firstError) firstError.focus();
        return;
      }

      // UI Submitting animation state
      btnSubmitEnquiry.disabled = true;
      btnSubmitEnquiry.innerHTML = '<span>Processing Enquiry...</span>';

      setTimeout(() => {
        // Prepare formatted WhatsApp deep link message
        const waMsg = encodeURIComponent(
          `*NEW INTERIOR ENQUIRY — PIRO WOODY CONCEPTS*\n\n` +
          `*Name:* ${fullName.value.trim()}\n` +
          `*Phone:* ${phone.value.trim()}\n` +
          (email.value.trim() ? `*Email:* ${email.value.trim()}\n` : '') +
          `*Service Needed:* ${service.value}\n` +
          `*Location:* ${location.value}\n` +
          `*Project Details:* ${description.value.trim()}\n\n` +
          `_Sent via Piro Woody Concepts Website_`
        );

        const waUrl = `https://wa.me/2348137808170?text=${waMsg}`;
        successWaLink.href = waUrl;
        successUserName.textContent = fullName.value.trim();

        // Switch to success view
        enquiryForm.style.display = 'none';
        successBox.style.display = 'block';

        btnSubmitEnquiry.disabled = false;
        btnSubmitEnquiry.innerHTML = `<span>Send Enquiry</span><img src="assets/icons/arrow-right.svg" alt="" class="icon-btn">`;
      }, 700);
    });
  }

  // Reset form handler
  if (btnSendAnother) {
    btnSendAnother.addEventListener('click', () => {
      enquiryForm.reset();
      enquiryForm.style.display = 'flex';
      successBox.style.display = 'none';
    });
  }

  // Remove errors on input change
  const inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('has-error');
      const err = input.parentElement.querySelector('.form-error');
      if (err) err.classList.remove('visible');
    });
  });

});
