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
