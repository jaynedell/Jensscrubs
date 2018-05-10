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
