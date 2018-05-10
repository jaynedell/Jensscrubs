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
