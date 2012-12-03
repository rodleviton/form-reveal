// ------------------------------------------------ FORM-REVEAL PLUGIN  -------------------------------------------------- //

;(function ( $, window, undefined ) {
    "use strict"; //jshint

    $.fn.formReveal = function () {
        
        return $(this).each(function () {

            var selector = this;
            var target;
            var targetArr = [];
            var type;
            var group;

            var FormReveal = {
                init: function() {
                    FormReveal.createTargetArray(this.getTarget());
                    FormReveal.setTargetHeight();
                    FormReveal.setInitialStyle();
                    FormReveal.setTriggerType();
                    FormReveal.getCurrentState();
                    FormReveal.setEventListener();
                },
                getTarget: function() {
                    // Retrieves target to reveal by id
                    target = $(selector).attr('data-reveal-target');
                    return(target);
                },
                createTargetArray: function(target) {
                    $(target).each(function(){
                        targetArr.push(this);
                    });
                },
                setTargetHeight: function() {
                    $(targetArr).each(function(){

                        $(this).data('paddingTop', $(this).css('paddingTop'));
                        $(this).data('paddingBottom', $(this).css('paddingBottom'));
                        $(this).data('height', $(this).height());

                    });
                },
                getOuterHTML: function(element) {
                    var outerHTML = $(element).clone().wrap('<p>').parent().html();
                    return outerHTML;
                },
                setInitialStyle: function() {
                    $(targetArr).each(function(){
                        $(this).css({
                            'height': 0,
                            'overflow': 'hidden',
                            'opacity': 0
                        });
                    });
                },
                setTriggerType: function() {
                    // Determines trigger type
                    if ($(selector).attr('type') === 'radio') { // Radio buttons
                        type = 'radio';
                    } else if ($(selector).attr('type') === 'checkbox') { // Checkboxes
                        type = 'checkbox';
                    } else if ($(selector).parent().get(0).tagName === 'SELECT') { // Select Options
                        type = 'select';
                    } else { // Everything else
                        type = 'div';
                    }
                },
                getCurrentState: function(){
                    
                    $(targetArr).each(function(){
                        $('select', this).each(function(){
                            if($(this).attr('disabled')) {
                                $(this).data('disabled', true);
                            } else {
                                $(this).data('disabled', false);
                            }
                        });
                    });
                    
                    $(targetArr).each(function(){
                        $('input', this).each(function(){
                            if($(this).attr('disabled')) {
                                $(this).data('disabled', true);
                            } else {
                                $(this).data('disabled', false);
                            }
                        });
                    });
                },
                updateCurrentState: function(elem){

                    var that = elem;

                    $('select', that).each(function(){
                        if($(this).attr('disabled')) {
                            $(this).data('disabled', true);
                        } else {
                            $(this).data('disabled', false);
                        }
                    });

                
                    $('input', that).each(function(){
                        if($(this).attr('disabled')) {
                            $(this).data('disabled', true);
                        } else {
                            $(this).data('disabled', false);
                        }
                    });
                    
                    //To Do
                    // Add checkbox/radio disable mechanism

                },
                setEventListener: function() {
                    // Set up trigger listener based on selector type
                    if (type === 'radio') {
                        group = $(selector).attr('name');
                        $('input[name="' + group + '"]').change(function () { // listener for radio button group
                            var state = $(selector).attr('checked');
                            if (state === 'checked') {
                                FormReveal.show();
                            } else {
                                FormReveal.hide();
                            }
                        });
                        $('input[name="' + group + '"]').trigger('change'); // Sets initial state
                    }

                    if (type === 'checkbox') {
                        $(selector).change(function () {
                            if ($(selector).is(':checked')) {
                                FormReveal.show();
                            } else {
                                FormReveal.hide();
                            }
                        });
                        $(selector).trigger('change'); // Sets initial state
                    }

                    if (type === 'select') {
                        group = $(selector).parents('select');
                        $(group).change(function () { // listener for select list option
                            var val = $(group).val();
                            if (val === $(selector).val()) {
                                FormReveal.show();
                            } else {
                                FormReveal.hide();
                            }
                        });
                        $(group).trigger('change'); // Sets initial state
                    }

                    if (type === 'div') {
                        $(selector).click(function () {
                            var _state = $(selector).data('toggle');
                            if (_state === 'on') {
                                $(selector).data('toggle', 'off');
                                FormReveal.hide();
                            } else {
                                $(selector).data('toggle', 'on');
                                FormReveal.show();
                            }
                            return false; // Useful to stop buttons and links trigger a default action
                        });
                    }
                },
                show: function() {
                    $(targetArr).each(function(){

                        // Disables hidden fields to improve JavaScript validation support
                        $('select', this).each(function(){
                            if($(this).data('disabled') === false) {
                                $(this).removeAttr('disabled');
                            }
                        });
                    
                        $('input', this).each(function(){
                            if($(this).data('disabled') === false) {
                                $(this).removeAttr('disabled');
                            }
                        });
                        
                        //To Do
                        // Add checkbox/radio disable mechanism
                        
                        $(this).stop().animate({
                            'height': $(this).data('height')
                        }, 300, function () {
                            $(this).stop().animate({
                                'opacity': 1                                
                            });
                            $(this).css({'height': 'auto', 'paddingTop': $(this).data('paddingTop'), 'paddingBottom': $(this).data('paddingTop')});
                        });
                    });
                },
                hide: function() {
                    $(targetArr).each(function(){
                        
                        if($(this).css('opacity') > 0) { // Checks for current active element and updates input/select states
                            FormReveal.updateCurrentState(this);
                        }

                        $(this).stop().animate({
                            'opacity': 0
                        }, 300, function () {
                            $(this).stop().animate({
                                'height': 0
                            });
                            $(this).css({'padding': 0});
                        });

                        // Disables hidden fields to improve JavaScript validation support 
                        $('select', this).each(function(){
                            if($(this).data('disabled') === false) {
                                $(this).attr('disabled', 'disabled');
                            }
                        });
                    
                        $('input', this).each(function(){
                            if($(this).data('disabled') === false) {
                                $(this).attr('disabled', 'disabled');
                            }
                        });
                        
                        //To Do
                        // Add checkbox/radio disable mechanism

                    });
                }
            };
            FormReveal.init(); 
        });
    };
}(jQuery, window));

$(function () {
    "use strict"; //jshint
    //Initialise Plugin
    if($('[data-reveal-target]').length > 0) {
        $('[data-reveal-target]').formReveal();
    }
});