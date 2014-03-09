/*  jQuery.expandAccordion
 *  (c) 2014 AKIRA-MIAYEK
 *
 *  jQuery.expandAccordion is freely distributable under the terms of an MIT-style license.
 *
 *--------------------------------------------------------------------------*/

(function($) {
  var pluginName = 'expandAccordion';

  $.fn[pluginName] = function(options) {

    var defaults = {
      accordionHeight: 548,
      itemHeaderHeight: 44,
      headerHeight: undefined,
      footerHeight: undefined
    };

    var settings = $.extend(defaults, options);

    var _initialize = function(accordion) {
      
      // Get reference of jQuery object.
      var $accordion = $(accordion);
      
      var $header = $accordion.find('.header');
      var $main = $accordion.find('.main');
      var $footer = $accordion.find('.footer');
      
      var $items = $accordion.find('.item');
      
      // Variables.
      var accordionHeight = settings.accordionHeight;
      
      var itemHeaderHeight = settings.itemHeaderHeight;
      var closedMainHeight = itemHeaderHeight * $items.length;
      var openedItemContentHeight = accordionHeight - closedMainHeight;
      
      var headerHeight = settings.headerHeight;
      var footerHeight = settings.footerHeight;
      
      if (!headerHeight && !footerHeight) {
        headerHeight = (accordionHeight - closedMainHeight) / 2;
        footerHeight = (accordionHeight - closedMainHeight) / 2;
      } else if (!headerHeight) {
        headerHeight = accordionHeight - (footerHeight + closedMainHeight);
      } else if (!footerHeight) {
        footerHeight = accordionHeight - (headerHeight + closedMainHeight);
      }
      
      /* Cleanup */
      $accordion.removeClass('opened closed');
      $items.removeClass('opened');
      $items.find('.item_header').off('click');

      // Set height.
      $header.css('height', headerHeight);
      $footer.css('height', footerHeight);
      $main.css('height', closedMainHeight);
      $items.find('.item_header').css('height', itemHeaderHeight);
      $items.find('.item_content').css('height', 0);
      $accordion.css('height', accordionHeight);
      
      // Set event listener to Accordion Header.
      $accordion.find('.item_header').on('click', function() {
        var $clickedItem = $(this).parents('.item');
        
        if ($clickedItem.hasClass('opened')) {
          // Close clicked item.
          itemClose($clickedItem);
          
          // Close accordion.
          setTimeout(function() {
            $header.css('height', headerHeight);
            $footer.css('height', footerHeight);
            $main.css('height', closedMainHeight);
          }, 50);
          
          setTimeout(function() {
            $header.find('.inner').fadeIn(50);
            $footer.find('.inner').fadeIn(50);
          }, 500);
          
          $accordion.removeClass('opened').addClass('closed');
        } else {
          $accordion.addClass('opened');
          
          var $openedItem = $accordion.find('.item.opened');
          
          if ($openedItem.length > 0) {
            // Close opened item.
            itemClose($openedItem);
            
            // Open clicked item.
            itemOpen($clickedItem);
          } else {
            // Open accordion.            
            $header.find('.inner').fadeOut(50);
            $footer.find('.inner').fadeOut(50);
            
            // Open clicked item.
            itemOpen($clickedItem);
            
            setTimeout(function() {
              $header.css('height', 0);
              $footer.css('height', 0);
              $main.css('height', accordionHeight);
            }, 50); 
          }
        };
      });
      
      var itemOpen = function($item) {
        $item.addClass('opened');
        
        setTimeout(function() {
          $item.find('.item_content').css('height', openedItemContentHeight);
        }, 50);
        
        setTimeout(function() {
          $item.find('.item_content .inner').fadeIn(50);
          
          var event = new $.Event('itemOpened');
          $item.trigger(event);
        }, 500)
      };
      
      var itemClose = function($item) {
        $item.find('.item_content .inner').fadeOut(50)
        
        setTimeout(function() {
          $item.find('.item_content').css('height', 0);
          setTimeout(function() {
            var event = new $.Event('itemClosed');
            $item.trigger(event);
          }, 500);
        }, 50)
        
        $item.removeClass('opened');
      };
    };

  return this.each(function() {
      _initialize(this);
    });
  };

})(jQuery);