const sliderControls = document.querySelector(".slider-controls");
const sliderTabs = sliderControls.querySelectorAll(".slider-tab");
const sliderIndicator = sliderControls.querySelector(".slider-indicator");

// Update the indicator
const updateIndicator = (tab, index) => {
  document.querySelector(".slider-tab.current")?.classList.remove("current");
  tab.classList.add("current");

  sliderIndicator.style.transform = `translateX(${tab.offsetLeft - 20}px)`;
  sliderIndicator.style.width = `${tab.getBoundingClientRect().width}px`;

  // Calculate the scroll position and scroll smoothly
  const scrollLeft = sliderTabs[index].offsetLeft - sliderControls.offsetWidth / 2 + sliderTabs[index].offsetWidth / 2;
  sliderControls.scrollTo({ left: scrollLeft, behavior: "smooth" });
}

// Initialize swiper instance
const swiper = new Swiper(".slider-container", {
  effect: "fade",
  speed: 5000,
  autoplay: { delay: 3000 },
  navigation: {
    prevEl: "#slide-prev",
    nextEl: "#slide-next",
  },

});

// Update the slide on tab click
sliderTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    swiper.slideTo(index);
    updateIndicator(tab, index);
  });
});

updateIndicator(sliderTabs[0], 0);
window.addEventListener("resize", () => updateIndicator(sliderTabs[swiper.activeIndex], 0));

(function (w, d, s, l, i) {
  w[l] = w[l] || []; w[l].push({
    'gtm.start':
      new Date().getTime(), event: 'gtm.js'
  }); var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
      'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-KGVQBF7');

const revokeListeners = [];
window.addRevokeListener = (callback) => {
  revokeListeners.push(callback);
};
document.addEventListener("cmplz_revoke", function (e) {
  cmplz_set_cookie('cmplz_consent_mode', 'revoked', false);
  revokeListeners.forEach((callback) => {
    callback();
  });
});

const consentListeners = [];
/**
 * Called from GTM template to set callback to be executed when user consent is provided.
 * @param callback
 */
window.addConsentUpdateListener = (callback) => {
  consentListeners.push(callback);
};
document.addEventListener("cmplz_fire_categories", function (e) {
  var consentedCategories = e.detail.categories;
  const consent = {
    'security_storage': "granted",
    'functionality_storage': "granted",
    'personalization_storage': cmplz_in_array('preferences', consentedCategories) ? 'granted' : 'denied',
    'analytics_storage': cmplz_in_array('statistics', consentedCategories) ? 'granted' : 'denied',
    'ad_storage': cmplz_in_array('marketing', consentedCategories) ? 'granted' : 'denied',
    'ad_user_data': cmplz_in_array('marketing', consentedCategories) ? 'granted' : 'denied',
    'ad_personalization': cmplz_in_array('marketing', consentedCategories) ? 'granted' : 'denied',
  };

  //don't use automatic prefixing, as the TM template needs to be sure it's cmplz_.
  let consented = [];
  for (const [key, value] of Object.entries(consent)) {
    if (value === 'granted') {
      consented.push(key);
    }
  }
  cmplz_set_cookie('cmplz_consent_mode', consented.join(','), false);
  consentListeners.forEach((callback) => {
    callback(consent);
  });
});


window.scope_array = [];
window.backend = 0;
jQuery.cachedScript = function (url, options) {
  // Allow user to set any option except for dataType, cache, and url.
  options = jQuery.extend(options || {}, {
    dataType: "script",
    cache: true,
    url: url
  });
  // Return the jqXHR object so we can chain callbacks.
  return jQuery.ajax(options);
};
jQuery(window).on("elementor/frontend/init", function () {
  elementorFrontend.hooks.addAction("frontend/element_ready/global", function ($scope, $) {
    if ("undefined" == typeof $scope) {
      return;
    }
    if ($scope.hasClass("uael-particle-yes")) {
      window.scope_array.push($scope);
      $scope.find(".uael-particle-wrapper").addClass("js-is-enabled");
    } else {
      return;
    }
    if (elementorFrontend.isEditMode() && $scope.find(".uael-particle-wrapper").hasClass("js-is-enabled") && window.backend == 0) {
      var uael_url = uael_particles_script.uael_particles_url;

      jQuery.cachedScript(uael_url);
      window.backend = 1;
    } else if (elementorFrontend.isEditMode()) {
      var uael_url = uael_particles_script.uael_particles_url;
      jQuery.cachedScript(uael_url).done(function () {
        var flag = true;
      });
    }
  });
});

// Added both `document` and `window` event listeners to address issues where some users faced problems with the `document` event not triggering as expected.
// Define cachedScript globally to avoid redefining it.

jQuery.cachedScript = function (url, options) {
  options = jQuery.extend(options || {}, {
    dataType: "script",
    cache: true,
    url: url
  });
  return jQuery.ajax(options); // Return the jqXHR object so we can chain callbacks
};

let uael_particle_loaded = false; //flag to prevent multiple script loads.

jQuery(document).on("ready elementor/popup/show", () => {
  loadParticleScript();
});

jQuery(window).one("elementor/frontend/init", () => {
  if (!uael_particle_loaded) {
    loadParticleScript();
  }
});

function loadParticleScript() {
  // Use jQuery to check for the presence of the element
  if (jQuery(".uael-particle-yes").length < 1) {
    return;
  }

  uael_particle_loaded = true;
  var uael_url = uael_particles_script.uael_particles_url;
  // Call the cachedScript function
  jQuery.cachedScript(uael_url);
}

if ('undefined' != typeof window.jQuery) {
  jQuery(document).ready(function ($) {
    $(document).on('elementor/popup/show', () => {
      let rev_cats = cmplz_categories.reverse();
      for (let key in rev_cats) {
        if (rev_cats.hasOwnProperty(key)) {
          let category = cmplz_categories[key];
          if (cmplz_has_consent(category)) {
            document.querySelectorAll('[data-category="' + category + '"]').forEach(obj => {
              cmplz_remove_placeholder(obj);
            });
          }
        }
      }

      let services = cmplz_get_services_on_page();
      for (let key in services) {
        if (services.hasOwnProperty(key)) {
          let service = services[key].service;
          let category = services[key].category;
          if (cmplz_has_service_consent(service, category)) {
            document.querySelectorAll('[data-service="' + service + '"]').forEach(obj => {
              cmplz_remove_placeholder(obj);
            });
          }
        }
      }
    });
  });
}



document.addEventListener("cmplz_enable_category", function (consentData) {
  var category = consentData.detail.category;
  var services = consentData.detail.services;
  var blockedContentContainers = [];
  let selectorVideo = '.cmplz-elementor-widget-video-playlist[data-category="' + category + '"],.elementor-widget-video[data-category="' + category + '"]';
  let selectorGeneric = '[data-cmplz-elementor-href][data-category="' + category + '"]';
  for (var skey in services) {
    if (services.hasOwnProperty(skey)) {
      let service = skey;
      selectorVideo += ',.cmplz-elementor-widget-video-playlist[data-service="' + service + '"],.elementor-widget-video[data-service="' + service + '"]';
      selectorGeneric += ',[data-cmplz-elementor-href][data-service="' + service + '"]';
    }
  }
  document.querySelectorAll(selectorVideo).forEach(obj => {
    let elementService = obj.getAttribute('data-service');
    if (cmplz_is_service_denied(elementService)) {
      return;
    }
    if (obj.classList.contains('cmplz-elementor-activated')) return;
    obj.classList.add('cmplz-elementor-activated');

    if (obj.hasAttribute('data-cmplz_elementor_widget_type')) {
      let attr = obj.getAttribute('data-cmplz_elementor_widget_type');
      obj.classList.removeAttribute('data-cmplz_elementor_widget_type');
      obj.classList.setAttribute('data-widget_type', attr);
    }
    if (obj.classList.contains('cmplz-elementor-widget-video-playlist')) {
      obj.classList.remove('cmplz-elementor-widget-video-playlist');
      obj.classList.add('elementor-widget-video-playlist');
    }
    obj.setAttribute('data-settings', obj.getAttribute('data-cmplz-elementor-settings'));
    blockedContentContainers.push(obj);
  });

  document.querySelectorAll(selectorGeneric).forEach(obj => {
    let elementService = obj.getAttribute('data-service');
    if (cmplz_is_service_denied(elementService)) {
      return;
    }
    if (obj.classList.contains('cmplz-elementor-activated')) return;

    if (obj.classList.contains('cmplz-fb-video')) {
      obj.classList.remove('cmplz-fb-video');
      obj.classList.add('fb-video');
    }

    obj.classList.add('cmplz-elementor-activated');
    obj.setAttribute('data-href', obj.getAttribute('data-cmplz-elementor-href'));
    blockedContentContainers.push(obj.closest('.elementor-widget'));
  });

  /**
   * Trigger the widgets in Elementor
   */
  for (var key in blockedContentContainers) {
    if (blockedContentContainers.hasOwnProperty(key) && blockedContentContainers[key] !== undefined) {
      let blockedContentContainer = blockedContentContainers[key];
      if (elementorFrontend.elementsHandler) {
        elementorFrontend.elementsHandler.runReadyTrigger(blockedContentContainer)
      }
      var cssIndex = blockedContentContainer.getAttribute('data-placeholder_class_index');
      blockedContentContainer.classList.remove('cmplz-blocked-content-container');
      blockedContentContainer.classList.remove('cmplz-placeholder-' + cssIndex);
    }
  }

});
const lazyloadRunObserver = () => {
  const lazyloadBackgrounds = document.querySelectorAll(`.e-con.e-parent:not(.e-lazyloaded)`);
  const lazyloadBackgroundObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let lazyloadBackground = entry.target;
        if (lazyloadBackground) {
          lazyloadBackground.classList.add('e-lazyloaded');
        }
        lazyloadBackgroundObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px 0px 200px 0px' });
  lazyloadBackgrounds.forEach((lazyloadBackground) => {
    lazyloadBackgroundObserver.observe(lazyloadBackground);
  });
};
const events = [
  'DOMContentLoaded',
  'elementor/lazyload/observe',
];
events.forEach((event) => {
  document.addEventListener(event, lazyloadRunObserver);
});
