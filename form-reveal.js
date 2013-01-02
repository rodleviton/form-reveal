;(function($, window, document, undefined) {

    // Create the defaults
    var formReveal = 'formReveal',
        defaults = {
            speed: 600
        };
    
    var initialTriggers = [];

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
        var defaults = this._defaults;
        var target;
        var targetArr = [];
        var type;
        var group;        

        function getSelector(el) {
            el = (el) ? el : element;
            // Retrieves target to reveal by id/class
            target = ( typeof $(el).data("reveal-target") == "object" ) ? $(el).data("reveal-target").selector : $(el).data("reveal-target");
                        
            return target;
        }

        function getTargetArray(target) {
            $(target).each(function() {
                targetArr.push(this);
            });
            return targetArr;
        }
        
        function checkGrouping(obj) {
            
            //Additional functionality to handle group of divs
            $('[data-reveal-target]').each(function() {
                
                if ($(this).data("reveal-target").group === $(element).data('reveal-target').group) {
                                                
                    if (this !== element) {

                        var _type = getTriggerType(this);
                        var _target = $(this).data("reveal-target").selector;
                        var _elemSelector = $(element).data('reveal-target').selector;
                        
                        if((_target !== undefined) && (_target !== _elemSelector)) {
                            
                            //onHide
                            $(this).trigger('formRevealHide');
                            
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
                            
                            // Better JavaScript validation support
                            $(_target + ' input').each(function() {
                                if ($(this).data('disabled') === undefined) {
                                    updateState(_target);
                                }
                                $(this).attr('disabled', 'disabled');
                            });
                            
                           
                            $(_target + ' select').each(function() {
                                if ($(this).data('disabled') === undefined) {
                                    updateState(_target);
                                }
                                $(this).attr('disabled', 'disabled');
                            });
                        }

                        switch (_type) {
                            case 'radio':
                                $(this).prop('checked', false);
                                break;

                            case 'checkbox':
                                $(this).attr('checked', false);
                                break;

                            case 'select':
                                $(this).attr('selected', false);
                                break;
                                
                            case 'div':
                                $(this).data('toggle', 'off');
                                break;
                        }
                    }
                }
            });

        }

        function setTargetAttributes() {
            $(targetArr).each(function() {

                //Prevents element values from being overidden by duplicate data-reveal-target selectors
                $(this).data('paddingTop', ($(this).data('paddingTop') === undefined) ? $(this).css('paddingTop') : $(this).data('paddingTop'));
                $(this).data('paddingBottom', ($(this).data('paddingBottom') === undefined) ? $(this).css('paddingBottom') : $(this).data('paddingBottom'));
                $(this).data('marginTop', ($(this).data('marginTop') === undefined) ? $(this).css('marginTop') : $(this).data('marginTop'));
                $(this).data('marginBottom', ($(this).data('marginBottom') === undefined) ? $(this).css('marginBottom') : $(this).data('marginBottom'));
                $(this).data('height', ($(this).data('height') === undefined) ? $(this).height() : $(this).data('height'));

                $(this).css({ // Sets initial CSS styles
                    'height': 0,
                    'overflow': 'hidden',
                    'opacity': 0,
                    'paddingTop': 0,
                    'paddingBottom': 0,
                    'marginTop': 0,
                    'marginBottom': 0
                });
                
                updateState(this);

            });
        }

        function getTriggerType(elem) {
            var _type = null;

            // Determines trigger type
            if ($(elem).attr('type') === 'radio') { // Radio buttons
                _type = 'radio';
            }
            else if ($(elem).attr('type') === 'checkbox') { // Checkboxes
                _type = 'checkbox';
            }
            else if ($(elem).parent()[0].nodeName === 'SELECT') { // Select Options
                _type = 'select';
            }
            else { // Everything else
                _type = 'div';
            }

            return _type;
        }

        function updateState(elem) {
            var _elem = $(elem);
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

            $(elem).data('initialised', true);
        }

        function findMatchingSelectors() {
            var match = false;
            $('[data-reveal-target]').each(function() {
                //( typeof $(element).data("reveal-target") == "object" ) ? $(element).data("reveal-target").selector : $(element).data("reveal-target")
                if (getSelector(this) == getSelector(element)) {
                    if( $(this).is(':checked') || $(this).is(':selected') || ($(this).data('toggle') == 'on') ) {
                        match = true;
                    }
                }
            });
            return match;
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

                        //Checks grouping
                        if ($(this).data('reveal-target')) {
                            if ($(this).data('reveal-target').group) {
                                if (this === element) {
                                    checkGrouping(this);
                                }
                            }
                        }
                    }
                    else {
                        // Checks if any checkboxes with duplicate target value exist and are checked
                        if (findMatchingSelectors() === false) {
                            hide();
                        }
                    }                    
                                        
                });                
                initialTriggers.push( function() {
                    $('input[name="' + group + '"]').trigger('change'); // Sets initial state
                });
                break;
            case 'checkbox':
                $(element).change(function() {

                    if ($(element).is(':checked')) {
                       
                        show();
                        
                        //Check if element belongs to group
                        if ($(this).data('reveal-target')) {
                            if ($(this).data('reveal-target').group) {
                                if (this === element) {
                                    checkGrouping(this);
                                }
                            }
                        }
                    }
                    else {
                        // Checks if any checkboxes with duplicate target value exist and are checked
                        if (findMatchingSelectors() === false) {
                            hide();
                        }
                    }
                    
                });
                initialTriggers.push( function() {
                    $(element).trigger('change'); // Sets initial state
                });
            
                break;
            case 'select':
                group = $(element).parents('select');
                $(group).change(function() { // listener for select list option
                    var val = $(group).val();
                    if (val === $(element).val()) {
                        show();
                        //Check if element belongs to group
                        if ($(element).data('reveal-target')) {
                            if ($(element).data('reveal-target').group) {
                                checkGrouping(element);
                            }
                        }
                    }
                    else {
                        // Checks if any checkboxes with duplicate target value exist and are checked
                        if (findMatchingSelectors() === false) {
                            hide();
                        }
                    }
                });
                initialTriggers.push( function() {
                     $(group).trigger('change'); // Sets initial state
                });               
                break;
            case 'div':
                $(element).click(function() {
                    var _state = $(element).data('toggle');
                    if (_state === 'on') {
                        $(element).data('toggle', 'off');
                        // Checks if any checkboxes with duplicate target value exist and are checked
                        if (findMatchingSelectors() === false) {
                            hide();
                        }                       
                    }
                    else {
                        $(element).data('toggle', 'on');
                        show();
                        
                        //Check if element belongs to group
                        if ($(this).data('reveal-target')) {
                            if ($(this).data('reveal-target').group) {
                                checkGrouping(this);
                            }
                        }
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
            
            //onShow
            $(element).trigger('formRevealShow');
        }

        function hide() {
            $(targetArr).each(function() {
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
                });

                // Better JavaScript validation support
                var parentDiv = this;
                $('select', parentDiv).each(function() {
                    if ($(this).data('disabled') === undefined) {
                        updateState(parentDiv);
                    }
                    $(this).attr('disabled', 'disabled');
                });

                $('input', parentDiv).each(function() {
                    if ($(this).data('disabled') === undefined) {
                        updateState(parentDiv);
                    }
                    $(this).attr('disabled', 'disabled');
                });
                
                
            });
            
            //onHide
            $(element).trigger('formRevealHide');
        }

        // Setup
        targetArr = getTargetArray(getSelector());
        type = getTriggerType(element);
        setTargetAttributes();
        setEventListener();
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[formReveal] = function(options) {
        var returnValue = this.each(function() {
            if (!$.data(this, 'plugin_' + formReveal)) {
                $.data(this, 'plugin_' + formReveal,
                new Plugin(this, options));
            }
        });
        
        $(initialTriggers).each(function(index, value) {
            value();
        });
        return returnValue;
    };
})(jQuery, window, document);