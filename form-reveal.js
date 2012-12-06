/*!
 * jQuery form-reveal plugin
 * Original author: @rodneyleviton
 * Author website: rodleviton.com
 * Licensed under the MIT license
 */

;(function($, window, document, undefined) {

    // Create the defaults
    var formReveal = 'formReveal',
        defaults = {
            speed: 500
        };

    // Plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = formReveal;
        this.init();
    }

    Plugin.prototype.init = function() {

        var element = this.element;
        var target;
        var targetArr = [];
        
        var type;
        
        var group;

        function getTarget() {
            // Retrieves target to reveal by id/class
            target = $(element).data("reveal-target");
            return (target);
        }

        function getTargetArray(target) {
            $(target).each(function() {
                targetArr.push(this);
            });

            return targetArr;
        }

        function setTargetAttributes() {
            $(targetArr).each(function() {
                $(this).data('paddingTop', $(this).css('paddingTop'));
                $(this).data('paddingBottom', $(this).css('paddingBottom'));
                $(this).data('marginTop', $(this).css('marginTop'));
                $(this).data('marginBottom', $(this).css('marginBottom'));
                $(this).data('height', $(this).height());

                $(this).css({ // Sets initial CSS styles
                    'height': 0,
                    'overflow': 'hidden',
                    'opacity': 0,
                    'paddingTop': 0,
                    'paddingBottom': 0,
                    'marginTop': 0,
                    'marginBottom': 0
                });
            });
        }

        function getOuterHTML(element) {
            var outerHTML = $(element).clone().wrap('<p>').parent().html();
            return outerHTML;
        }

        function getTriggerType() {
            var _type = null;

            // Determines trigger type
            if ($(element).attr('type') === 'radio') { // Radio buttons
                _type = 'radio';
            }
            else if ($(element).attr('type') === 'checkbox') { // Checkboxes
                _type = 'checkbox';
            }
            else if ($(element).parent()[0].nodeName === 'SELECT') { // Select Options
                _type = 'select';
            }
            else { // Everything else
                _type = 'div';
            }

            return _type;
        }

        function setState() {

            $(targetArr).each(function() {
                $('select', this).each(function() {
                    if ($(this).attr('disabled')) {
                        $(this).data('disabled', true);
                    }
                    else {
                        $(this).data('disabled', false);
                    }
                });
            });

            $(targetArr).each(function() {
                $('input', this).each(function() {
                    if ($(this).attr('disabled')) {
                        $(this).data('disabled', true);
                    }
                    else {
                        $(this).data('disabled', false);
                    }
                });
            });
        }

        function updateState(elem) {

            var _elem = elem;

            $('select', _elem).each(function() {
                if ($(this).attr('disabled')) {
                    $(this).data('disabled', true);
                }
                else {
                    $(this).data('disabled', false);
                }
            });

            $('input', _elem).each(function() {
                if ($(this).attr('disabled')) {
                    $(this).data('disabled', true);
                }
                else {
                    $(this).data('disabled', false);
                }
            });

        }

        function setEventListener() {

            // Set up trigger listener based on this.element type
            switch (type) {
            case 'radio':

                group = $(element).attr('name');
                $('input[name="' + group + '"]').change(function() { // listener for radio button group
                    var state = $(element).attr('checked');
                    if (state === 'checked') {
                        show();
                    }
                    else {
                        hide();
                    }
                });
                $('input[name="' + group + '"]').trigger('change'); // Sets initial state

                break;

            case 'checkbox':
                $(element).change(function() {
                    if ($(element).is(':checked')) {
                        show();
                    }
                    else {
                        hide();
                    }
                });
                $(element).trigger('change'); // Sets initial state
                break;

            case 'select':
                group = $(element).parents('select');
                $(group).change(function() { // listener for select list option
                    var val = $(group).val();
                    if (val === $(element).val()) {
                        show();
                    }
                    else {
                        hide();
                    }
                });
                $(group).trigger('change'); // Sets initial state
                break;

            case 'div':
                $(element).click(function() {

                    function goodbye() {
                        alert('Hello');
                    }

                    var _state = $(element).data('toggle');
                    if (_state === 'on') {
                        $(element).data('toggle', 'off');
                        hide();
                    }
                    else {
                        $(element).data('toggle', 'on');
                        show();
                    }

                    //Additional functionality to handle group of div
                    if ($(element).data("reveal-group")) {
                        var _group = $(element).data("reveal-group");
                        $("[data-reveal-group='" + _group + "']").each(function() {
                            if ((this !== element)) {
                                var _target = $(this).data("reveal-target");
                                $(this).data('toggle', 'off');
                                $(_target).stop().animate({
                                    'opacity': 0
                                }, 200, function() {
                                    $(_target).stop().animate({
                                        'height': 0
                                    }, 300);
                                    $(_target).css({
                                        'paddingTop': 0,
                                        'paddingBottom': 0,
                                        'marginTop': 0,
                                        'marginBottom': 0
                                    });
                                });
                            }
                        });
                    }

                    return false; // Useful to stop buttons and links trigger a default action

                });
                break;
            }
        }

        function show() {
            $(targetArr).each(function() {

                // Better JavaScript validation support
                $('select', this).each(function() {
                    if ($(this).data('disabled') === false) {
                        $(this).removeAttr('disabled');
                    }
                });

                $('input', this).each(function() {
                    if ($(this).data('disabled') === false) {
                        $(this).removeAttr('disabled');
                    }
                });

                $(this).stop().delay(300).animate({
                    'height': $(this).data('height'),
                    'paddingTop': $(this).data('paddingTop'),
                    'paddingBottom': $(this).data('paddingTop'),
                    'marginTop': $(this).data('marginTop'),
                    'marginBottom': $(this).data('marginTop')
                }, 300, function() {
                    $(this).stop().animate({
                        'opacity': 1
                    }, 200);
                    $(this).css({
                        'height': 'auto'
                    });
                });
            });
        }

        function hide() {
            $(targetArr).each(function() {

                if ($(this).css('opacity') > 0) { // Checks for current active element and updates input/select states
                    updateState(this);
                }

                $(this).stop().animate({
                    'opacity': 0
                }, 200, function() {
                    $(this).stop().animate({
                        'height': 0
                    }, 300);
                    $(this).css({
                        'paddingTop': 0,
                        'paddingBottom': 0,
                        'marginTop': 0,
                        'marginBottom': 0
                    });

                    //Callback onHide

                    if ($(this).data('reveal-onhide')) {
                        var _callback = $(this).data('reveal-onhide');
                        console.log(_callback);
                        _callback.call(this);
                    }
                });

                // Better JavaScript validation support
                $('select', this).each(function() {
                    if ($(this).data('disabled') === false) {
                        $(this).attr('disabled', 'disabled');
                    }
                });

                $('input', this).each(function() {
                    if ($(this).data('disabled') === false) {
                        $(this).attr('disabled', 'disabled');
                    }
                });

            });
        }

        // Setup
        targetArr = getTargetArray(getTarget());
        type = getTriggerType();
        setTargetAttributes();
        setState();
        setEventListener();

    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[formReveal] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + formReveal)) {
                $.data(this, 'plugin_' + formReveal,
                new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);

// Self Initialisation of plugin
$(function() {
    "use strict"; //jshint
    if ($('[data-reveal-target]').length > 0) {
        $('[data-reveal-target]').formReveal();
    }
});