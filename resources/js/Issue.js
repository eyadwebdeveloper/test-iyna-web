$(function () {
    $(window).on("load", function () {
      $(".loader-container").fadeOut(
        (callback = function () {
          $(".loaded-content").fadeIn("fast");
          $("body").css("overflow-x", "auto");
        })
      );
    });
  
    // ===================================================================
  
    $(".offcanvas ul li a").click(function (event) {
      event.preventDefault();
    });
  
    $(".offcanvas ul li a button").on("click", function () {
      // $("html, body").scrollTop($("#section-" + $(this).attr("section-no")).offset().top - $("#timer-container").innerHeight() - 20);
      $("html, body").scrollTop($("#section-" + $(this).attr("section-no")).offset().top);
    });
  
    // ===================================================================
  
    const tooltips = document.querySelectorAll("tooltip");
    tooltips.forEach((tooltip) => new bootstrap.Tooltip(tooltip));
  
    let tooltipMouseTracker = 0;
    let tolerance = 250;
  
    $(`[data-bs-toggle="tooltip"]`).on("mouseleave", function () {
      let tooltipId = $(this).attr("aria-describedby");
      tooltipMouseTracker--;
      $(`.tooltip`).on("mouseenter", function () {
        tooltipMouseTracker++;
      });
      $(`.tooltip`).on("mouseleave", function () {
        tooltipMouseTracker--;
        setTimeout(function () {
          if (!tooltipMouseTracker) {
            $(`[aria-describedby=${tooltipId}]`).tooltip("hide");
          }
        }, tolerance);
      });
      setTimeout(function () {
        if (!tooltipMouseTracker) {
          $(`[aria-describedby=${tooltipId}]`).tooltip("hide");
        }
      }, tolerance);
    });
  
    $('[data-bs-toggle="tooltip"]').on("mouseenter", function () {
      $(this).tooltip("show");
      tooltipMouseTracker++;
    });
  
    $('[data-bs-toggle="tooltip"]').on("click", function () {
      $(this).tooltip("hide");
      let referenceNo = $(this).attr("reference-no");
      let referenceElement = `p[reference-no="${referenceNo}"]`;
      $(referenceElement).removeClass("reference-highlight");
      $("html, body").scrollTop($(referenceElement).offset().top - (window.innerHeight / 2 - $(referenceElement).innerHeight() / 2));
      $(referenceElement).addClass("reference-highlight");
    });
  
    // ===================================================================
  
    fetch(`js/issue${$("body").attr("issue-no")}_references.json`)
      .then((response) => {
        return response.json();
      })
      .then((referencesObject) => {
        // for (const article in referencesObject.articles) {
        for (let i = 0; i < parseInt(referencesObject.noofArticles); i++) {
          for (let j = 0; j < parseInt(referencesObject.articles[`article${i + 1}`].noofreferences); j++) {
            // $(`[reference-no="${i + 1}.${j + 1}"]`).attr("data-bs-title", referencesObject.articles[`article${i + 1}`].references[j]);
            // $(`[reference-no="${i + 1}.${j + 1}"]`).tooltip.setContent({ ".tooltip-inner": referencesObject.articles[`article${i + 1}`].references[j] });
            // const newTooltip = bootstrap.Tooltip.getInstance($(`[reference-no="${i + 1}.${j + 1}"]`));
            let selector = `tooltip[reference-no="${i + 1}.${j + 1}"]`;
            // console.log(`length: ${$(selector).length}`);
            // console.log($(selector));
            for (let k = 0; k < $(selector).length; k++) {
              // console.log($(selector).get(k));
              // console.log(`i => ${i}, j => ${j}, k => ${k}`);
              const newTooltip = bootstrap.Tooltip.getInstance($(selector).get(k));
              newTooltip.setContent({ ".tooltip-inner": referencesObject.articles[`article${i + 1}`].references[j] });
            }
            $(`p[reference-no="${i + 1}.${j + 1}"]`).html(referencesObject.articles[`article${i + 1}`].references[j]);
          }
        }
      });
  
    // ===================================================================
  
    // $(window).scroll(function () {
    //   // console.log(`section-2 : ${isInViewport(document.getElementById("section-2"))}`);
    //   let noofSections = $("#offcanvas-nav-list").attr("no-of-sections");
    //   for (let i = 1; i <= noofSections; i++) {
    //     // console.log(`section-${i} : ${isInViewport(document.getElementById(`section-${i}`))}`);
    //     if (isInViewport(document.getElementById(`section-${i}`))) {
    //       $(`#offcanvas-nav-list a[href="#section-${i}"]`).addClass("custom-active");
    //       for (let j = 1; j <= noofSections; j++) {
    //         if (j !== i) {
    //           // console.log(`section-${j} : not-active`);
    //           $(`#offcanvas-nav-list a[href="#section-${j}"]`).removeClass("custom-active");
    //         }
    //       }
    //       break;
    //     }
    //   }
    // });
  
    // ===================================================================
  
    const toasts = document.querySelectorAll(".toast");
    toasts.forEach((toast) => new bootstrap.Toast(toast));
  
    // ===================================================================
  
    $(".copy-section-link").on("click", function () {
      sectionHref = $(this).attr("section-href");
      sectionHref = sectionHref.split(".");
      navigator.clipboard.writeText(`https://www.iyna-oct.site/issue-1#articles?article=${parseInt(sectionHref[1]) - 1}`);
  
      const toast = new bootstrap.Toast(document.getElementById("copied-toast"));
      toast.show();
    });
  
    // ===================================================================
  
  });
  
  const { createApp } = Vue;
  
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  
  createApp({
    data() {
      return {
        currentSection: urlParams.has("article") ? `section-${parseInt(urlParams.get("article")) + 1}` : "section-2",
      };
    },
    mounted() {
      $(`#offcanvas-nav-list a[href="#${this.currentSection}"]`).addClass("custom-active");
    },
    updated() {
      let noofSections = $("#offcanvas-nav-list").attr("no-of-sections");
      $(`#offcanvas-nav-list a[href="#${this.currentSection}"]`).addClass("custom-active");
      for (let i = 1; i <= noofSections; i++) {
        if (this.currentSection != `section-${i}`) {
          $(`#offcanvas-nav-list a[href="#section-${i}"]`).removeClass("custom-active");
        }
      }
    },
  }).mount("#app");
  
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    // return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    return rect.top <= (window.innerHeight / 2 || document.documentElement.clientHeight / 2) && rect.left >= 0 && rect.bottom >= (window.innerHeight - window.innerHeight / 2 || document.documentElement.clientHeight - document.documentElement.clientHeight / 2) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  }