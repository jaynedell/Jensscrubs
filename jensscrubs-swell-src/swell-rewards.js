window.SwellConfig = window.SwellConfig || {};

SwellConfig.Campaign = {
  opts: {
    options: {
      useJqueryConfirm: true,
      jqueryConfirmOpts: {

        type: "",
        animationSpeed: 0
      }
    },

    templates: {
      campaign: '\
        <li class="swell-campaign">\
          <div class="swell-campaign-content" data-display-mode="modal" data-campaign-id="<%= campaign.id %>">\
            <div class="swell-campaign-aside">\
              <img class="swell-campaign-image" src="<%= campaign.background_image_url %>" alt="<%= campaign.title %>" />\
              <i class="swell-campaign-icon fa <%= campaign.icon %>"></i>\
            </div>\
            <div class="swell-campaign-main">\
              <div class="swell-campaign-type">\
                <span><%= campaign.title %>\
              </div>\
              <div class="swell-campaign-value">\
                <span><%= campaign.reward_text %></span>\
              </div>\
            </div>\
          </div>\
        </li>\
      '
    }
  },

  initializeCampaigns: function(containerSelector) {
    Swell.Campaign.initializeCampaigns(containerSelector, SwellConfig.Campaign.opts);
    spapi.$('[data-campaign-id="363650"]').closest('.swell-campaign').remove();
    if (!spapi.authenticated) {
      spapi.$(document).off('click', '.swell-campaign-content');
      $('.swell-campaign').addClass('swell-campaign-inactive');
    }
  }
}

window.SwellConfig = SwellConfig || {};

SwellConfig.Customer = {
  opts: {
    options: {
      useJqueryConfirm: false,
      jqueryConfirmOpts: {
        boxWidth: "auto",
        useBootstrap: false,
        backgroundDismiss: true,
        closeIcon: true,
        type: "",
        typeAnimated: false,
        animateFromElement: false,
        smoothContent: false,
        animationSpeed: 0
      }
    }
  },

  initializeCustomer: function() {
    var customerDetails = swellAPI.getCustomerDetails();
    var points = customerDetails.pointsBalance;

    var pointsToFixed = (points / 20).toFixed(2);
    $('.swell-point-converted').text('$' + pointsToFixed);

    if (points < 100) {
      $('.swell-link__redemption').closest('.swell-link-container').before('<p class="swell-section-details">Earn a minimum of 100 points to redeem your store credit.</p>');
      $('.swell-link__redemption').addClass('swell-link__disabled');
    }

    else {
      $(document).on('click', '.swell-link__redemption', function(e) {
        e.preventDefault();
        var $this = $(this);
        $this.html('<i class="fa fa-spin fa-spinner"></i>');
        $this.closest('.swell-link-container').find('.swell-error').remove();

        var onSuccess = function() {
          location.reload();
        };

        var onError = function() {
          $this.html('Redeem Credit');
          $this.closest('.swell-link-container').append('<p class="swell-error">Oops! Not eligible to redeem point balance for credit.</p>');
        };

        setTimeout(function() {
          swellAPI.convertPointsToDiscount({
            amount: points
          }, onSuccess, onError);
        }, 1000);
      });
    }
  }
};

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

window.SwellConfig = window.SwellConfig || {};

SwellConfig.Tier = {
  opts: {
    templates: {
      tier: '<li class="swell-tier swell-tier-<%= tier.class_name %>">\
          <div data-tier-id="<%= tier.id %>" class="swell-tier-content">\
            <div class="swell-tier-heading">\
              <div class="swell-tier-name"><%= tier.name %></div>\
              <div class="swell-tier-description"><%= tier.description %></div>\
            </div>\
            <div class="swell-tier-main">\
              <div class="swell-tier-multiplier"><%= tier.points_multiplier %>X Point Multiplier</div>\
            </div>\
          </div>\
        </li>'
    }
  },

  initializeDummyTier: function() {
    spapi.$.each(spapi.activeVipTiers, function(index, activeVipTier) { activeVipTier.rank++; });
    spapi.activeVipTiers.unshift({
      amount_spent_cents: 0,
      description: 'Automatic Entry',
      id: 0,
      name: 'Silver',
      points_earned: 0,
      points_multiplier: '1',
      purchases_made: 0,
      rank: 0
    });
  },

  initializeTiers: function(containerSelector) {
    SwellConfig.Tier.initializeDummyTier();
    Swell.Tier.initializeTiers(containerSelector, SwellConfig.Tier.opts);
    if (spapi.authenticated) {
      SwellConfig.Tier.initializeTierStatus();
    }
  },

  initializeTierStatus: function() {
    var customerDetails = swellAPI.getCustomerDetails();
    var customerTier = customerDetails.vipTier != null ? customerDetails.vipTier : spapi.activeVipTiers[0];
    var customerTierId = customerTier.id;
    var customerTierRank = customerTier.rank;
    var nextTier = spapi.activeVipTiers[customerTier.rank + 1];
    var pointsRemaining = 0;
    var pointsRemainingConverted = "";
    var referralsRemaining = 0;

    spapi.$.each($('.swell-tier'), function(index, tier) {
      if ($(tier).find('.swell-tier-content').data('tierId') == customerTierId) {
        $(tier).addClass('swell-tier-current').prepend('<div class="swell-tier-progress">Current Tier</div>');
      }
      else if (nextTier && $(tier).find('.swell-tier-content').data('tierId') == nextTier.id) {
        pointsRemaining = (nextTier.amount_spent_cents - customerDetails.vipTierStats.amountSpentCents) / 100;
        pointsRemainingConverted = "$" + pointsRemaining.toFixed(2);
        referralsRemaining = nextTier.referrals_completed - customerDetails.vipTierStats.referralsCompleted

        $(tier).addClass('swell-tier-next').prepend('<div class="swell-tier-progress"></div>');
        if (pointsRemaining > 0) {
          $(tier).find('.swell-tier-progress').append('<span class="swell-encouragement-points">Spend <span class="swell-points-remaining-converted">' + pointsRemainingConverted + '</span> More</span>');
        }

        if (referralsRemaining > 0) {
          if (referralsRemaining == 1) {
            $(tier).find('.swell-tier-progress').append('<span class="swell-encouragement-referrals">Make <span class="swell-referrals-remaining">' + referralsRemaining + '</span> More Complete Referral</span>');
          }
          else {
            $(tier).find('.swell-tier-progress').append('<span class="swell-encouragement-referrals">Make <span class="swell-referrals-remaining">' + referralsRemaining + '</span> More Complete Referral</span>');
          }
        }
      }
      else {
        $(tier).addClass('swell-tier-inactive').prepend('<div class="swell-tier-progress">&nbsp;</div>');
      }
    });

    var tierStatus = customerDetails.vipTier ? customerDetails.vipTier.name : spapi.activeVipTiers[0].name;
    $('.swell-tier-status').text(tierStatus);
  }
}

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
