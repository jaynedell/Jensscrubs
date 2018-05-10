window.SwellConfig = window.SwellConfig || {};

SwellConfig.Referral = {
  opts: {
    localization: {
      referralSidebarDetailsAction: "",
      referralRegisterHeading: "Refer a friend",
      referralRegisterFormDetails: "First, please submit your email below.",
      referralRegisterFormSubmit: "Next",
      referralReferHeading: "Refer a friend",
      referralReferFormDetails: "Enter your friends' emails in the space below",
      referralReferFormEmailsDetails: "Separated by commas",
      referralShareTwitter: "Twitter"
    }
  },

  initializeReferral: function(containerSelector) {
    Swell.Referral.initializeReferral(containerSelector, SwellConfig.Referral.opts);
  }
};
