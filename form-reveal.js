// ------------------------------------------------ FORM-REVEAL PLUGIN  -------------------------------------------------- //
(function($, window, undefined) {
    "use strict"; //jshint

    $.fn.formReveal = function() {

        return $(this).each(function() {

            var selector = this;
            var target;
            var targetArr = [];
            var type;
            var group;

            var FormReveal = {
                init: function() {
                    targetArr = FormReveal.getTargetArray(FormReveal.getTarget());
                    type = FormReveal.getTriggerType();
                    FormReveal.setTargetAttributes();
                    FormReveal.setState();
                    FormReveal.setEventListener();
                },
                getTarget: function() {
                    // Retrieves target to reveal by id/class
                    target = $(selector).attr('data-reveal-target');
                    return (target);
                },
                getTargetArray: function(target) {
                    $(target).each(function() {
                        targetArr.push(this);
                    });

                    return targetArr;
                },
                setTargetAttributes: function() {
                    $(targetArr).each(function() {
                        $(this).data('paddingTop', $(this).css('paddingTop'));
                        $(this).data('paddingBottom', $(this).css('paddingBottom'));
                        $(this).data('marginTop', $(this).css('marginTop'));
                        $(this).data('marginBottom', $(this).css('marginBottom'));
                        $(this).data('height', $(this).height());

                        $(this).css({ // Sets initial CSS styles
                            'height': 0,
                            'overflow': 'hidden',
                            'opacity': 0
                        });
                    });
                },
                getOuterHTML: function(element) {
                    var outerHTML = $(element).clone().wrap('<p>').parent().html();
                    return outerHTML;
                },
                getTriggerType: function() {
                    var _type = null;
                    // Determines trigger type
                    if ($(selector).attr('type') === 'radio') { // Radio buttons
                        _type = 'radio';
                    }
                    else if ($(selector).attr('type') === 'checkbox') { // Checkboxes
                        _type = 'checkbox';
                    }
                    else if ($(selector).parent().get(0).tagName === 'SELECT') { // Select Options
                        _type = 'select';
                    }
                    else { // Everything else
                        _type = 'div';
                    }

                    return _type;
                },
                setState: function() {

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
                },
                updateState: function(elem) {

                    var that = elem;

                    $('select', that).each(function() {
                        if ($(this).attr('disabled')) {
                            $(this).data('disabled', true);
                        }
                        else {
                            $(this).data('disabled', false);
                        }
                    });

                    $('input', that).each(function() {
                        if ($(this).attr('disabled')) {
                            $(this).data('disabled', true);
                        }
                        else {
                            $(this).data('disabled', false);
                        }
                    });

                },
                setEventListener: function() {
                    // Set up trigger listener based on selector type
                    if (type === 'radio') {
                        group = $(selector).attr('name');
                        $('input[name="' + group + '"]').change(function() { // listener for radio button group
                            var state = $(selector).attr('checked');
                            if (state === 'checked') {
                                FormReveal.show();
                            }
                            else {
                                FormReveal.hide();
                            }
                        });
                        $('input[name="' + group + '"]').trigger('change'); // Sets initial state
                    }

                    if (type === 'checkbox') {
                        $(selector).change(function() {
                            if ($(selector).is(':checked')) {
                                FormReveal.show();
                            }
                            else {
                                FormReveal.hide();
                            }
                        });
                        $(selector).trigger('change'); // Sets initial state
                    }

                    if (type === 'select') {
                        group = $(selector).parents('select');
                        $(group).change(function() { // listener for select list option
                            var val = $(group).val();
                            if (val === $(selector).val()) {
                                FormReveal.show();
                            }
                            else {
                                FormReveal.hide();
                            }
                        });
                        $(group).trigger('change'); // Sets initial state
                    }

                    if (type === 'div') {
                        $(selector).click(function() {
                            var _state = $(selector).data('toggle');
                            if (_state === 'on') {
                                $(selector).data('toggle', 'off');
                                FormReveal.hide();
                            }
                            else {
                                $(selector).data('toggle', 'on');
                                FormReveal.show();
                            }
                            return false; // Useful to stop buttons and links trigger a default action
                        });
                    }
                },
                show: function() {
                    $(targetArr).each(function() {

                        // Disables hidden fields to improve JavaScript validation support
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

                        $(this).stop().animate({
                            'height': $(this).data('height'),
                            'paddingTop': $(this).data('paddingTop'),
                            'paddingBottom': $(this).data('paddingTop'),
                            'marginTop': $(this).data('marginTop'),
                            'marginBottom': $(this).data('marginTop')
                        }, 300, function() {
                            $(this).stop().animate({
                                'opacity': 1
                            });
                            $(this).css({
                                'height': 'auto'
                            });
                        });
                    });
                },
                hide: function() {
                    $(targetArr).each(function() {

                        if ($(this).css('opacity') > 0) { // Checks for current active element and updates input/select states
                            FormReveal.updateState(this);
                        }

                        $(this).stop().animate({
                            'opacity': 0
                        }, 300, function() {
                            $(this).stop().animate({
                                'height': 0
                            });
                            $(this).css({
                                'paddingTop': 0,
                                'paddingBottom': 0,
                                'marginTop': 0,
                                'marginBottom': 0
                            });
                        });

                        // Disables hidden fields to improve JavaScript validation support 
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
            };
            FormReveal.init();
        });

        //TODO
        //Pass in animation speed options
    };
}(jQuery, window));

// Self Initialisation of plugin
$(function() {
    "use strict"; //jshint
    if ($('[data-reveal-target]').length > 0) {
        $('[data-reveal-target]').formReveal();
    }
});