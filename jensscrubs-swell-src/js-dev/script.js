var handleCustomerUpdated = function() {
  SwellConfig.Customer.initializeCustomer();
};

var handleSwellSetup = function() {
  SwellConfig.Campaign.initializeCampaigns(".swell-campaign-list");
  SwellConfig.Tier.initializeTiers(".swell-tier-list");
  SwellConfig.Referral.initializeReferral(".swell-referral");
  Swell.Customer.initializeCustomerHistory(
    ".swell-link__history",
    SwellConfig.Customer.opts
  );
};

if (typeof jQuery === "undefined") {
  document.addEventListener("swell:customer:updated", handleCustomerUpdated);
  document.addEventListener("swell:setup", handleSwellSetup);
} else {
  jQuery(document).on("swell:customer:updated", handleCustomerUpdated);
  jQuery(document).on("swell:setup", handleSwellSetup);
}
