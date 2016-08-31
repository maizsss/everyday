(function () {

'use strict';
/*===========================
Framework 7
===========================*/
window.Framework7 = function (params) {
    // App
    var app = this;

    // Version
    app.version = '1.4.2';

    // Default Parameters
    app.params = {
        cache: true,
        cacheIgnore: [],
        cacheIgnoreGetParameters: false,
        cacheDuration: 1000 * 60 * 10, // Ten minutes
        preloadPreviousPage: true,
        uniqueHistory: false,
        uniqueHistoryIgnoreGetParameters: false,
        dynamicPageUrl: 'content-{{index}}',
        allowDuplicateUrls: false,
        router: true,
        // Push State
        pushState: false,
        pushStateRoot: undefined,
        pushStateNoAnimation: false,
        pushStateSeparator: '#!/',
        pushStateOnLoad: true,
        // Fast clicks
        fastClicks: true,
        fastClicksDistanceThreshold: 10,
        fastClicksDelayBetweenClicks: 50,
        // Tap Hold
        tapHold: false,
        tapHoldDelay: 750,
        tapHoldPreventClicks: true,
        // Active State
        activeState: true,
        activeStateElements: 'a, button, label, span',
        // Animate Nav Back Icon
        animateNavBackIcon: false,
        // Swipe Back
        swipeBackPage: true,
        swipeBackPageThreshold: 0,
        swipeBackPageActiveArea: 30,
        swipeBackPageAnimateShadow: true,
        swipeBackPageAnimateOpacity: true,
        // Ajax
        ajaxLinks: undefined, // or CSS selector
        // External Links
        externalLinks: '.external', // CSS selector
        // Sortable
        sortable: true,
        // Scroll toolbars
        hideNavbarOnPageScroll: false,
        hideToolbarOnPageScroll: false,
        hideTabbarOnPageScroll: false,
        showBarsOnPageScrollEnd: true,
        showBarsOnPageScrollTop: true,
        // Swipeout
        swipeout: true,
        swipeoutActionsNoFold: false,
        swipeoutNoFollow: false,
        // Smart Select Back link template
        smartSelectOpenIn: 'page', // or 'popup' or 'picker'
        smartSelectBackText: 'Back',
        smartSelectPopupCloseText: 'Close',
        smartSelectPickerCloseText: 'Done',
        smartSelectSearchbar: false,
        smartSelectBackOnSelect: false,
        // Tap Navbar or Statusbar to scroll to top
        scrollTopOnNavbarClick: false,
        scrollTopOnStatusbarClick: false,
        // Panels
        swipePanel: false, // or 'left' or 'right'
        swipePanelActiveArea: 0,
        swipePanelCloseOpposite: true,
        swipePanelOnlyClose: false,
        swipePanelNoFollow: false,
        swipePanelThreshold: 0,
        panelsCloseByOutside: true,
        // Modals
        modalButtonOk: 'OK',
        modalButtonCancel: 'Cancel',
        modalUsernamePlaceholder: 'Username',
        modalPasswordPlaceholder: 'Password',
        modalTitle: 'Framework7',
        modalCloseByOutside: false,
        actionsCloseByOutside: true,
        popupCloseByOutside: true,
        modalPreloaderTitle: 'Loading... ',
        modalStack: true,
        // Lazy Load
        imagesLazyLoadThreshold: 0,
        imagesLazyLoadSequential: true,
        // Name space
        viewClass: 'view',
        viewMainClass: 'view-main',
        viewsClass: 'views',
        // Notifications defaults
        notificationCloseOnClick: false,
        notificationCloseIcon: true,
        notificationCloseButtonText: 'Close',
        // Animate Pages
        animatePages: true,
        // Template7
        templates: {},
        template7Data: {},
        template7Pages: false,
        precompileTemplates: false,
        // Material
        material: false,
        materialPageLoadDelay: 0,
        materialPreloaderSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="75" width="75" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="8"/></svg>',
        materialPreloaderHtml:
            '<span class="preloader-inner">' +
                '<span class="preloader-inner-gap"></span>' +
                '<span class="preloader-inner-left">' +
                    '<span class="preloader-inner-half-circle"></span>' +
                '</span>' +
                '<span class="preloader-inner-right">' +
                    '<span class="preloader-inner-half-circle"></span>' +
                '</span>' +
            '</span>',
        materialRipple: true,
        materialRippleElements: '.ripple, a.link, a.item-link, .button, .modal-button, .tab-link, .label-radio, .label-checkbox, .actions-modal-button, a.searchbar-clear, a.floating-button, .floating-button > a, .speed-dial-buttons a',
        // Auto init
        init: true,
    };

    // Extend defaults with parameters
    for (var param in params) {
        app.params[param] = params[param];
    }

    // DOM lib
    var $ = Dom7;

    // Template7 lib
    var t7 = Template7;
    app._compiledTemplates = {};

    // Touch events
    app.touchEvents = {
        start: app.support.touch ? 'touchstart' : 'mousedown',
        move: app.support.touch ? 'touchmove' : 'mousemove',
        end: app.support.touch ? 'touchend' : 'mouseup'
    };

    // Link to local storage
    app.ls = window.localStorage;

    // RTL
    app.rtl = $('body').css('direction') === 'rtl';
    if (app.rtl) $('html').attr('dir', 'rtl');

    // Overwrite statusbar overlay
    if (typeof app.params.statusbarOverlay !== 'undefined') {
        if (app.params.statusbarOverlay) $('html').addClass('with-statusbar-overlay');
        else $('html').removeClass('with-statusbar-overlay');
    }

    

/*======================================================
************   Views   ************
======================================================*/
app.views = [];
var View = function (selector, params) {
    var defaults = {
        dynamicNavbar: false,
        domCache: false,
        linksView: undefined,
        reloadPages: false,
        uniqueHistory: app.params.uniqueHistory,
        uniqueHistoryIgnoreGetParameters: app.params.uniqueHistoryIgnoreGetParameters,
        allowDuplicateUrls: app.params.allowDuplicateUrls,
        swipeBackPage: app.params.swipeBackPage,
        swipeBackPageAnimateShadow: app.params.swipeBackPageAnimateShadow,
        swipeBackPageAnimateOpacity: app.params.swipeBackPageAnimateOpacity,
        swipeBackPageActiveArea: app.params.swipeBackPageActiveArea,
        swipeBackPageThreshold: app.params.swipeBackPageThreshold,
        animatePages: app.params.animatePages,
        preloadPreviousPage: app.params.preloadPreviousPage
    };
    var i;

    // Params
    params = params || {};

    // Disable dynamic navbar for material theme
    if (params.dynamicNavbar && app.params.material) params.dynamicNavbar = false;

    // Extend params with defaults
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        }
    }
    // View
    var view = this;
    view.params = params;

    // Selector
    view.selector = selector;

    // Container
    var container = $(selector);
    view.container = container[0];

    // Fix Selector

    if (typeof selector !== 'string') {
        // Supposed to be HTMLElement or Dom7
        selector = (container.attr('id') ? '#' + container.attr('id') : '') + (container.attr('class') ? '.' + container.attr('class').replace(/ /g, '.').replace('.active', '') : '');
        view.selector = selector;
    }

    // Is main
    view.main = container.hasClass(app.params.viewMainClass);

    // Content cache
    view.contentCache = {};

    // Pages cache
    view.pagesCache = {};

    // Store View in element for easy access
    container[0].f7View = view;

    // Pages
    view.pagesContainer = container.find('.pages')[0];
    view.initialPages = [];
    view.initialPagesUrl = [];
    view.initialNavbars = [];
    if (view.params.domCache) {
        var initialPages = container.find('.page');
        for (i = 0; i < initialPages.length; i++) {
            view.initialPages.push(initialPages[i]);
            view.initialPagesUrl.push('#' + initialPages.eq(i).attr('data-page'));
        }
        if (view.params.dynamicNavbar) {
            var initialNavbars = container.find('.navbar-inner');
            for (i = 0; i < initialNavbars.length; i++) {
                view.initialNavbars.push(initialNavbars[i]);
            }
        }

    }

    view.allowPageChange = true;

    // Location
    var docLocation = document.location.href;

    // History
    view.history = [];
    var viewURL = docLocation;
    var pushStateSeparator = app.params.pushStateSeparator;
    var pushStateRoot = app.params.pushStateRoot;
    if (app.params.pushState && view.main) {
        if (pushStateRoot) {
            viewURL = pushStateRoot;
        }
        else {
            if (viewURL.indexOf(pushStateSeparator) >= 0 && viewURL.indexOf(pushStateSeparator + '#') < 0) viewURL = viewURL.split(pushStateSeparator)[0];
        }

    }

    // Active Page
    var currentPage, currentPageData;
    if (!view.activePage) {
        currentPage = $(view.pagesContainer).find('.page-on-center');
        if (currentPage.length === 0) {
            currentPage = $(view.pagesContainer).find('.page:not(.cached)');
            currentPage = currentPage.eq(currentPage.length - 1);
        }
        if (currentPage.length > 0) {
            currentPageData = currentPage[0].f7PageData;
        }
    }

    // View startup URL
    if (view.params.domCache && currentPage) {
        view.url = container.attr('data-url') || view.params.url || '#' + currentPage.attr('data-page');   
        view.pagesCache[view.url] = currentPage.attr('data-page');
    }
    else view.url = container.attr('data-url') || view.params.url || viewURL;

    // Update current page Data
    if (currentPageData) {
        currentPageData.view = view;
        currentPageData.url = view.url;
        if (view.params.domCache && view.params.dynamicNavbar && !currentPageData.navbarInnerContainer) {
            currentPageData.navbarInnerContainer = view.initialNavbars[view.initialPages.indexOf(currentPageData.container)];
        }
        view.activePage = currentPageData;
        currentPage[0].f7PageData = currentPageData;
    }

    // Store to history main view's url
    if (view.url) {
        view.history.push(view.url);
    }

    // Touch events
    var isTouched = false,
        isMoved = false,
        touchesStart = {},
        isScrolling,
        activePage = [],
        previousPage = [],
        viewContainerWidth,
        touchesDiff,
        allowViewTouchMove = true,
        touchStartTime,
        activeNavbar = [],
        previousNavbar = [],
        activeNavElements,
        previousNavElements,
        activeNavBackIcon,
        previousNavBackIcon,
        dynamicNavbar,
        pageShadow,
        el;

    view.handleTouchStart = function (e) {
        if (!allowViewTouchMove || !view.params.swipeBackPage || isTouched || app.swipeoutOpenedEl || !view.allowPageChange) return;
        isMoved = false;
        isTouched = true;
        isScrolling = undefined;
        touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
        touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
        touchStartTime = (new Date()).getTime();
        dynamicNavbar = view.params.dynamicNavbar && container.find('.navbar-inner').length > 1;
    };

    view.handleTouchMove = function (e) {
        if (!isTouched) return;
        var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
        var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
        if (typeof isScrolling === 'undefined') {
            isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
        }
        if (isScrolling || e.f7PreventSwipeBack || app.preventSwipeBack) {
            isTouched = false;
            return;
        }
        if (!isMoved) {
            var cancel = false;
            // Calc values during first move fired
            viewContainerWidth = container.width();
            var target = $(e.target);
            var swipeout = target.hasClass('swipeout') ? target : target.parents('.swipeout');
            if (swipeout.length > 0) {
                if (!app.rtl && swipeout.find('.swipeout-actions-left').length > 0) cancel = true;
                if (app.rtl && swipeout.find('.swipeout-actions-right').length > 0) cancel = true;
            }
            activePage = target.is('.page') ? target : target.parents('.page');
            if (activePage.hasClass('no-swipeback')) cancel = true;
            previousPage = container.find('.page-on-left:not(.cached)');
            var notFromBorder = touchesStart.x - container.offset().left > view.params.swipeBackPageActiveArea;
            if (app.rtl) {
                notFromBorder = touchesStart.x < container.offset().left - container[0].scrollLeft + viewContainerWidth - view.params.swipeBackPageActiveArea;
            }
            else {
                notFromBorder = touchesStart.x - container.offset().left > view.params.swipeBackPageActiveArea;
            }
            if (notFromBorder) cancel = true;
            if (previousPage.length === 0 || activePage.length === 0) cancel = true;
            if (cancel) {
                isTouched = false;
                return;
            }

            if (view.params.swipeBackPageAnimateShadow && !app.device.android) {
                pageShadow = activePage.find('.swipeback-page-shadow');
                if (pageShadow.length === 0) {
                    pageShadow = $('<div class="swipeback-page-shadow"></div>');
                    activePage.append(pageShadow);
                }
            }

            if (dynamicNavbar) {
                activeNavbar = container.find('.navbar-on-center:not(.cached)');
                previousNavbar = container.find('.navbar-on-left:not(.cached)');
                activeNavElements = activeNavbar.find('.left, .center, .right, .subnavbar, .fading');
                previousNavElements = previousNavbar.find('.left, .center, .right, .subnavbar, .fading');
                if (app.params.animateNavBackIcon) {
                    activeNavBackIcon = activeNavbar.find('.left.sliding .back .icon');
                    previousNavBackIcon = previousNavbar.find('.left.sliding .back .icon');
                }
            }

            // Close/Hide Any Picker
            if ($('.picker-modal.modal-in').length > 0) {
                app.closeModal($('.picker-modal.modal-in'));
            }
        }
        e.f7PreventPanelSwipe = true;
        isMoved = true;
        e.preventDefault();

        // RTL inverter
        var inverter = app.rtl ? -1 : 1;

        // Touches diff
        touchesDiff = (pageX - touchesStart.x - view.params.swipeBackPageThreshold) * inverter;
        if (touchesDiff < 0) touchesDiff = 0;
        var percentage = touchesDiff / viewContainerWidth;

        // Swipe Back Callback
        var callbackData = {
            percentage: percentage,
            activePage: activePage[0],
            previousPage: previousPage[0],
            activeNavbar: activeNavbar[0],
            previousNavbar: previousNavbar[0]
        };
        if (view.params.onSwipeBackMove) {
            view.params.onSwipeBackMove(callbackData);
        }
        container.trigger('swipeBackMove', callbackData);

        // Transform pages
        var activePageTranslate = touchesDiff * inverter;
        var previousPageTranslate = (touchesDiff / 5 - viewContainerWidth / 5) * inverter;
        if (app.device.pixelRatio === 1) {
            activePageTranslate = Math.round(activePageTranslate);
            previousPageTranslate = Math.round(previousPageTranslate);
        }

        activePage.transform('translate3d(' + activePageTranslate + 'px,0,0)');
        if (view.params.swipeBackPageAnimateShadow && !app.device.android) pageShadow[0].style.opacity = 1 - 1 * percentage;

        previousPage.transform('translate3d(' + previousPageTranslate + 'px,0,0)');
        if (view.params.swipeBackPageAnimateOpacity) previousPage[0].style.opacity = 0.9 + 0.1 * percentage;

        // Dynamic Navbars Animation
        if (dynamicNavbar) {
            var i;
            for (i = 0; i < activeNavElements.length; i++) {
                el = $(activeNavElements[i]);
                if (!el.is('.subnavbar.sliding')) el[0].style.opacity = (1 - percentage * 1.3);
                if (el[0].className.indexOf('sliding') >= 0) {
                    var activeNavTranslate = percentage * el[0].f7NavbarRightOffset;
                    if (app.device.pixelRatio === 1) activeNavTranslate = Math.round(activeNavTranslate);
                    el.transform('translate3d(' + activeNavTranslate + 'px,0,0)');
                    if (app.params.animateNavBackIcon) {
                        if (el[0].className.indexOf('left') >= 0 && activeNavBackIcon.length > 0) {
                            activeNavBackIcon.transform('translate3d(' + -activeNavTranslate + 'px,0,0)');
                        }
                    }
                }
            }
            for (i = 0; i < previousNavElements.length; i++) {
                el = $(previousNavElements[i]);
                if (!el.is('.subnavbar.sliding')) el[0].style.opacity = percentage * 1.3 - 0.3;
                if (el[0].className.indexOf('sliding') >= 0) {
                    var previousNavTranslate = el[0].f7NavbarLeftOffset * (1 - percentage);
                    if (app.device.pixelRatio === 1) previousNavTranslate = Math.round(previousNavTranslate);
                    el.transform('translate3d(' + previousNavTranslate + 'px,0,0)');
                    if (app.params.animateNavBackIcon) {
                        if (el[0].className.indexOf('left') >= 0 && previousNavBackIcon.length > 0) {
                            previousNavBackIcon.transform('translate3d(' + -previousNavTranslate + 'px,0,0)');
                        }
                    }
                }
            }
        }
    };

    view.handleTouchEnd = function (e) {
        if (!isTouched || !isMoved) {
            isTouched = false;
            isMoved = false;
            return;
        }
        isTouched = false;
        isMoved = false;
        if (touchesDiff === 0) {
            $([activePage[0], previousPage[0]]).transform('').css({opacity: '', boxShadow: ''});
            if (dynamicNavbar) {
                activeNavElements.transform('').css({opacity: ''});
                previousNavElements.transform('').css({opacity: ''});
                if (activeNavBackIcon && activeNavBackIcon.length > 0) activeNavBackIcon.transform('');
                if (previousNavBackIcon && activeNavBackIcon.length > 0) previousNavBackIcon.transform('');
            }
            return;
        }
        var timeDiff = (new Date()).getTime() - touchStartTime;
        var pageChanged = false;
        // Swipe back to previous page
        if (
                timeDiff < 300 && touchesDiff > 10 ||
                timeDiff >= 300 && touchesDiff > viewContainerWidth / 2
            ) {
            activePage.removeClass('page-on-center').addClass('page-on-right');
            previousPage.removeClass('page-on-left').addClass('page-on-center');
            if (dynamicNavbar) {
                activeNavbar.removeClass('navbar-on-center').addClass('navbar-on-right');
                previousNavbar.removeClass('navbar-on-left').addClass('navbar-on-center');
            }
            pageChanged = true;
        }
        // Reset custom styles
        // Add transitioning class for transition-duration
        $([activePage[0], previousPage[0]]).transform('').css({opacity: '', boxShadow: ''}).addClass('page-transitioning');
        if (dynamicNavbar) {
            activeNavElements.css({opacity: ''})
            .each(function () {
                var translate = pageChanged ? this.f7NavbarRightOffset : 0;
                var sliding = $(this);
                sliding.transform('translate3d(' + translate + 'px,0,0)');
                if (app.params.animateNavBackIcon) {
                    if (sliding.hasClass('left') && activeNavBackIcon.length > 0) {
                        activeNavBackIcon.addClass('page-transitioning').transform('translate3d(' + -translate + 'px,0,0)');
                    }
                }

            }).addClass('page-transitioning');

            previousNavElements.transform('').css({opacity: ''}).each(function () {
                var translate = pageChanged ? 0 : this.f7NavbarLeftOffset;
                var sliding = $(this);
                sliding.transform('translate3d(' + translate + 'px,0,0)');
                if (app.params.animateNavBackIcon) {
                    if (sliding.hasClass('left') && previousNavBackIcon.length > 0) {
                        previousNavBackIcon.addClass('page-transitioning').transform('translate3d(' + -translate + 'px,0,0)');
                    }
                }
            }).addClass('page-transitioning');
        }
        allowViewTouchMove = false;
        view.allowPageChange = false;
        // Swipe Back Callback
        var callbackData = {
            activePage: activePage[0],
            previousPage: previousPage[0],
            activeNavbar: activeNavbar[0],
            previousNavbar: previousNavbar[0]
        };
        if (pageChanged) {
            // Update View's URL
            var url = view.history[view.history.length - 2];
            view.url = url;

            // Page before animation callback
            app.pageBackCallback('before', view, {pageContainer: activePage[0], url: url, position: 'center', newPage: previousPage, oldPage: activePage, swipeBack: true});
            app.pageAnimCallback('before', view, {pageContainer: previousPage[0], url: url, position: 'left', newPage: previousPage, oldPage: activePage, swipeBack: true});

            if (view.params.onSwipeBackBeforeChange) {
                view.params.onSwipeBackBeforeChange(callbackData);
            }
            container.trigger('swipeBackBeforeChange', callbackData);
        }
        else {
            if (view.params.onSwipeBackBeforeReset) {
                view.params.onSwipeBackBeforeReset(callbackData);
            }
            container.trigger('swipeBackBeforeReset', callbackData);
        }

        activePage.transitionEnd(function () {
            $([activePage[0], previousPage[0]]).removeClass('page-transitioning');
            if (dynamicNavbar) {
                activeNavElements.removeClass('page-transitioning').css({opacity: ''});
                previousNavElements.removeClass('page-transitioning').css({opacity: ''});
                if (activeNavBackIcon && activeNavBackIcon.length > 0) activeNavBackIcon.removeClass('page-transitioning');
                if (previousNavBackIcon && previousNavBackIcon.length > 0) previousNavBackIcon.removeClass('page-transitioning');
            }
            allowViewTouchMove = true;
            view.allowPageChange = true;
            if (pageChanged) {
                if (app.params.pushState && view.main) history.back();
                // Page after animation callback
                app.pageBackCallback('after', view, {pageContainer: activePage[0], url: url, position: 'center', newPage: previousPage, oldPage: activePage, swipeBack: true});
                app.pageAnimCallback('after', view, {pageContainer: previousPage[0], url: url, position: 'left', newPage: previousPage, oldPage: activePage, swipeBack: true});
                app.router.afterBack(view, activePage, previousPage);

                if (view.params.onSwipeBackAfterChange) {
                    view.params.onSwipeBackAfterChange(callbackData);
                }
                container.trigger('swipeBackAfterChange', callbackData);
            }
            else {
                if (view.params.onSwipeBackAfterReset) {
                    view.params.onSwipeBackAfterReset(callbackData);
                }
                container.trigger('swipeBackAfterReset', callbackData);
            }
            if (pageShadow && pageShadow.length > 0) pageShadow.remove();
        });
    };
    view.attachEvents = function (detach) {
        var action = detach ? 'off' : 'on';
        container[action](app.touchEvents.start, view.handleTouchStart);
        container[action](app.touchEvents.move, view.handleTouchMove);
        container[action](app.touchEvents.end, view.handleTouchEnd);
    };
    view.detachEvents = function () {
        view.attachEvents(true);
    };

    // Init
    if (view.params.swipeBackPage && !app.params.material) {
        view.attachEvents();
    }

    // Add view to app
    app.views.push(view);
    if (view.main) app.mainView = view;

    // Router 
    view.router = {
        load: function (options) {
            return app.router.load(view, options);
        },
        back: function (options) {
            return app.router.back(view, options);  
        },
        // Shortcuts
        loadPage: function (options) {
            options = options || {};
            if (typeof options === 'string') {
                var url = options;
                options = {};
                if (url && url.indexOf('#') === 0 && view.params.domCache) {
                    options.pageName = url.split('#')[1];
                }
                else options.url = url;
            }
            return app.router.load(view, options);
        },
        loadContent: function (content) {
            return app.router.load(view, {content: content});
        },
        reloadPage: function (url) {
            return app.router.load(view, {url: url, reload: true});
        },
        reloadContent: function (content) {
            return app.router.load(view, {content: content, reload: true});
        },
        reloadPreviousPage: function (url) {
            return app.router.load(view, {url: url, reloadPrevious: true, reload: true});
        },
        reloadPreviousContent: function (content) {
            return app.router.load(view, {content: content, reloadPrevious: true, reload: true});
        },
        refreshPage: function () {
            var options = {
                url: view.url,
                reload: true,
                ignoreCache: true
            };
            if (options.url && options.url.indexOf('#') === 0) {
                if (view.params.domCache && view.pagesCache[options.url]) {
                    options.pageName = view.pagesCache[options.url];
                    options.url = undefined;
                    delete options.url;
                }
                else if (view.contentCache[options.url]) {
                    options.content = view.contentCache[options.url];
                    options.url = undefined;
                    delete options.url;
                }
            }
            return app.router.load(view, options);
        },
        refreshPreviousPage: function () {
            var options = {
                url: view.history[view.history.length - 2],
                reload: true,
                reloadPrevious: true,
                ignoreCache: true
            };
            if (options.url && options.url.indexOf('#') === 0 && view.params.domCache && view.pagesCache[options.url]) {
                options.pageName = view.pagesCache[options.url];
                options.url = undefined;
                delete options.url;
            }
            return app.router.load(view, options);
        }
    };

    // Aliases for temporary backward compatibility
    view.loadPage = view.router.loadPage;
    view.loadContent = view.router.loadContent;
    view.reloadPage = view.router.reloadPage;
    view.reloadContent = view.router.reloadContent;
    view.reloadPreviousPage = view.router.reloadPreviousPage;
    view.reloadPreviousContent = view.router.reloadPreviousContent;
    view.refreshPage = view.router.refreshPage;
    view.refreshPreviousPage = view.router.refreshPreviousPage;
    view.back = view.router.back;

    // Bars methods
    view.hideNavbar = function () {
        return app.hideNavbar(container.find('.navbar'));
    };
    view.showNavbar = function () {
        return app.showNavbar(container.find('.navbar'));
    };
    view.hideToolbar = function () {
        return app.hideToolbar(container.find('.toolbar'));
    };
    view.showToolbar = function () {
        return app.showToolbar(container.find('.toolbar'));
    };

    // Push State on load
    if (app.params.pushState && app.params.pushStateOnLoad && view.main) {
        var pushStateUrl;
        var pushStateUrlSplit = docLocation.split(pushStateSeparator)[1];
        if (pushStateRoot) {
            pushStateUrl = docLocation.split(app.params.pushStateRoot + pushStateSeparator)[1];
        }
        else if (pushStateSeparator && docLocation.indexOf(pushStateSeparator) >= 0 && docLocation.indexOf(pushStateSeparator + '#') < 0) {
            pushStateUrl = pushStateUrlSplit;
        }
        var pushStateAnimatePages = app.params.pushStateNoAnimation ? false : undefined;
        var historyState = history.state;
        if (pushStateUrl) {
            if (pushStateUrl.indexOf('#') >= 0 && view.params.domCache && historyState && historyState.pageName && 'viewIndex' in historyState) {
                app.router.load(view, {pageName: historyState.pageName, url: historyState.url, animatePages: pushStateAnimatePages, pushState: false});
            }
            else if (pushStateUrl.indexOf('#') >= 0 && view.params.domCache && view.initialPagesUrl.indexOf(pushStateUrl) >= 0) {
                app.router.load(view, {pageName: pushStateUrl.replace('#',''), animatePages: pushStateAnimatePages, pushState: false});
            }
            else app.router.load(view, {url: pushStateUrl, animatePages: pushStateAnimatePages, pushState: false});
        }
        else if (view.params.domCache && docLocation.indexOf(pushStateSeparator + '#') >= 0) {
            if (historyState && historyState.pageName && 'viewIndex' in historyState) {
                app.router.load(view, {pageName: historyState.pageName, url: historyState.url, animatePages: pushStateAnimatePages, pushState: false});
            }
            else if (pushStateSeparator && pushStateUrlSplit.indexOf('#') === 0) {
                if (view.initialPagesUrl.indexOf(pushStateUrlSplit)) {
                    app.router.load(view, {pageName: pushStateUrlSplit.replace('#', ''), animatePages: pushStateAnimatePages, pushState: false});
                }
            }
        }
    }

    // Destroy
    view.destroy = function () {
        view.detachEvents();
        view = undefined;
    };

    // Plugin hook
    app.pluginHook('addView', view);

    // Return view
    return view;
};

app.addView = function (selector, params) {
    return new View(selector, params);
};

app.getCurrentView = function (index) {
    var popoverView = $('.popover.modal-in .view');
    var popupView = $('.popup.modal-in .view');
    var panelView = $('.panel.active .view');
    var appViews = $('.views');
    // Find active view as tab
    var appView = appViews.children('.view');
    // Propably in tabs or split view
    if (appView.length > 1) {
        if (appView.hasClass('tab')) {
            // Tabs
            appView = appViews.children('.view.active');
        }
        else {
            // Split View, leave appView intact
        }
    }
    if (popoverView.length > 0 && popoverView[0].f7View) return popoverView[0].f7View;
    if (popupView.length > 0 && popupView[0].f7View) return popupView[0].f7View;
    if (panelView.length > 0 && panelView[0].f7View) return panelView[0].f7View;
    if (appView.length > 0) {
        if (appView.length === 1 && appView[0].f7View) return appView[0].f7View;
        if (appView.length > 1) {
            var currentViews = [];
            for (var i = 0; i < appView.length; i++) {
                if (appView[i].f7View) currentViews.push(appView[i].f7View);
            }
            if (currentViews.length > 0 && typeof index !== 'undefined') return currentViews[index];
            if (currentViews.length > 1) return currentViews;
            if (currentViews.length === 1) return currentViews[0];
            return undefined;
        }
    }
    return undefined;
};

/*======================================================
************   Navbars && Toolbars   ************
======================================================*/
// On Navbar Init Callback
app.navbarInitCallback = function (view, pageContainer, navbarContainer, navbarInnerContainer) {
    if (!navbarContainer && navbarInnerContainer) navbarContainer = $(navbarInnerContainer).parent('.navbar')[0];
    if (navbarInnerContainer.f7NavbarInitialized && view && !view.params.domCache) return;
    var navbarData = {
        container: navbarContainer,
        innerContainer: navbarInnerContainer
    };
    var pageData = pageContainer && pageContainer.f7PageData;

    var eventData = {
        page: pageData,
        navbar: navbarData
    };

    if (navbarInnerContainer.f7NavbarInitialized && ((view && view.params.domCache) || (!view && $(navbarContainer).parents('.popup, .popover, .login-screen, .modal, .actions-modal, .picker-modal').length > 0))) {
        // Reinit Navbar
        app.reinitNavbar(navbarContainer, navbarInnerContainer);

        // Plugin hook
        app.pluginHook('navbarReinit', eventData);

        // Event
        $(navbarInnerContainer).trigger('navbarReinit', eventData);
        return;
    }
    navbarInnerContainer.f7NavbarInitialized = true;
    // Before Init
    app.pluginHook('navbarBeforeInit', navbarData, pageData);
    $(navbarInnerContainer).trigger('navbarBeforeInit', eventData);

    // Initialize Navbar
    app.initNavbar(navbarContainer, navbarInnerContainer);

    // On init
    app.pluginHook('navbarInit', navbarData, pageData);
    $(navbarInnerContainer).trigger('navbarInit', eventData);
};
// Navbar Remove Callback
app.navbarRemoveCallback = function (view, pageContainer, navbarContainer, navbarInnerContainer) {
    if (!navbarContainer && navbarInnerContainer) navbarContainer = $(navbarInnerContainer).parent('.navbar')[0];
    var navbarData = {
        container: navbarContainer,
        innerContainer: navbarInnerContainer
    };
    var pageData = pageContainer.f7PageData;

    var eventData = {
        page: pageData,
        navbar: navbarData
    };
    app.pluginHook('navbarBeforeRemove', navbarData, pageData);
    $(navbarInnerContainer).trigger('navbarBeforeRemove', eventData);
};
app.initNavbar = function (navbarContainer, navbarInnerContainer) {
    // Init Subnavbar Searchbar
    if (app.initSearchbar) app.initSearchbar(navbarInnerContainer);
};
app.reinitNavbar = function (navbarContainer, navbarInnerContainer) {
    // Re init navbar methods
};
app.initNavbarWithCallback = function (navbarContainer) {
    navbarContainer = $(navbarContainer);
    var viewContainer = navbarContainer.parents('.' + app.params.viewClass);
    var view;
    if (viewContainer.length === 0) return;
    if (navbarContainer.parents('.navbar-through').length === 0 && viewContainer.find('.navbar-through').length === 0) return;
    view = viewContainer[0].f7View || undefined;

    navbarContainer.find('.navbar-inner').each(function () {
        var navbarInnerContainer = this;
        var pageContainer;
        if ($(navbarInnerContainer).attr('data-page')) {
            // For dom cache
            pageContainer = viewContainer.find('.page[data-page="' + $(navbarInnerContainer).attr('data-page') + '"]')[0];
        }
        if (!pageContainer) {
            var pages = viewContainer.find('.page');
            if (pages.length === 1) {
                pageContainer = pages[0];
            }
            else {
                viewContainer.find('.page').each(function () {
                    if (this.f7PageData && this.f7PageData.navbarInnerContainer === navbarInnerContainer) {
                        pageContainer = this;
                    }
                });
            }
        }
        app.navbarInitCallback(view, pageContainer, navbarContainer[0], navbarInnerContainer);
    });
};

// Size Navbars
app.sizeNavbars = function (viewContainer) {
    if (app.params.material) return;
    var navbarInner = viewContainer ? $(viewContainer).find('.navbar .navbar-inner:not(.cached)') : $('.navbar .navbar-inner:not(.cached)');
    navbarInner.each(function () {
        var n = $(this);
        if (n.hasClass('cached')) return;
        var left = app.rtl ? n.find('.right') : n.find('.left'),
            right = app.rtl ? n.find('.left') : n.find('.right'),
            center = n.find('.center'),
            subnavbar = n.find('.subnavbar'),
            noLeft = left.length === 0,
            noRight = right.length === 0,
            leftWidth = noLeft ? 0 : left.outerWidth(true),
            rightWidth = noRight ? 0 : right.outerWidth(true),
            centerWidth = center.outerWidth(true),
            navbarStyles = n.styles(),
            navbarWidth = n[0].offsetWidth - parseInt(navbarStyles.paddingLeft, 10) - parseInt(navbarStyles.paddingRight, 10),
            onLeft = n.hasClass('navbar-on-left'),
            currLeft, diff;

        if (noRight) {
            currLeft = navbarWidth - centerWidth;
        }
        if (noLeft) {
            currLeft = 0;
        }
        if (!noLeft && !noRight) {
            currLeft = (navbarWidth - rightWidth - centerWidth + leftWidth) / 2;
        }
        var requiredLeft = (navbarWidth - centerWidth) / 2;
        if (navbarWidth - leftWidth - rightWidth > centerWidth) {
            if (requiredLeft < leftWidth) {
                requiredLeft = leftWidth;
            }
            if (requiredLeft + centerWidth > navbarWidth - rightWidth) {
                requiredLeft = navbarWidth - rightWidth - centerWidth;
            }
            diff = requiredLeft - currLeft;
        }
        else {
            diff = 0;
        }
        // RTL inverter
        var inverter = app.rtl ? -1 : 1;

        if (center.hasClass('sliding')) {
            center[0].f7NavbarLeftOffset = -(currLeft + diff) * inverter;
            center[0].f7NavbarRightOffset = (navbarWidth - currLeft - diff - centerWidth) * inverter;
            if (onLeft) {
                if (app.params.animateNavBackIcon) {
                    var activeNavbarBackLink = n.parent().find('.navbar-on-center').find('.left.sliding .back .icon ~ span');
                    if (activeNavbarBackLink.length > 0) {
                        center[0].f7NavbarLeftOffset += activeNavbarBackLink[0].offsetLeft;
                    }
                }
                center.transform('translate3d(' + center[0].f7NavbarLeftOffset + 'px, 0, 0)');
            }
        }
        if (!noLeft && left.hasClass('sliding')) {
            if (app.rtl) {
                left[0].f7NavbarLeftOffset = -(navbarWidth - left[0].offsetWidth) / 2 * inverter;
                left[0].f7NavbarRightOffset = leftWidth * inverter;
            }
            else {
                left[0].f7NavbarLeftOffset = -leftWidth;
                left[0].f7NavbarRightOffset = (navbarWidth - left[0].offsetWidth) / 2;
                if (app.params.animateNavBackIcon && left.find('.back .icon').length > 0) {
                    left[0].f7NavbarRightOffset -= left.find('.back .icon')[0].offsetWidth;
                }
            }
            if (onLeft) left.transform('translate3d(' + left[0].f7NavbarLeftOffset + 'px, 0, 0)');
        }
        if (!noRight && right.hasClass('sliding')) {
            if (app.rtl) {
                right[0].f7NavbarLeftOffset = -rightWidth * inverter;
                right[0].f7NavbarRightOffset = (navbarWidth - right[0].offsetWidth) / 2 * inverter;
            }
            else {
                right[0].f7NavbarLeftOffset = -(navbarWidth - right[0].offsetWidth) / 2;
                right[0].f7NavbarRightOffset = rightWidth;
            }
            if (onLeft) right.transform('translate3d(' + right[0].f7NavbarLeftOffset + 'px, 0, 0)');
        }
        if (subnavbar.length && subnavbar.hasClass('sliding')) {
            subnavbar[0].f7NavbarLeftOffset = app.rtl ? subnavbar[0].offsetWidth : -subnavbar[0].offsetWidth;
            subnavbar[0].f7NavbarRightOffset = -subnavbar[0].f7NavbarLeftOffset;
        }

        // Center left
        var centerLeft = diff;
        if (app.rtl && noLeft && noRight && center.length > 0) centerLeft = -centerLeft;
        center.css({left: centerLeft + 'px'});
        
    });
};

// Hide/Show Navbars/Toolbars
app.hideNavbar = function (navbarContainer) {
    $(navbarContainer).addClass('navbar-hidden');
    return true;
};
app.showNavbar = function (navbarContainer) {
    var navbar = $(navbarContainer);
    navbar.addClass('navbar-hiding').removeClass('navbar-hidden').transitionEnd(function () {
        navbar.removeClass('navbar-hiding');
    });
    return true;
};
app.hideToolbar = function (toolbarContainer) {
    $(toolbarContainer).addClass('toolbar-hidden');
    return true;
};
app.showToolbar = function (toolbarContainer) {
    var toolbar = $(toolbarContainer);
    toolbar.addClass('toolbar-hiding').removeClass('toolbar-hidden').transitionEnd(function () {
        toolbar.removeClass('toolbar-hiding');
    });
};

/*======================================================
************   XHR   ************
======================================================*/
// XHR Caching
app.cache = [];
app.removeFromCache = function (url) {
    var index = false;
    for (var i = 0; i < app.cache.length; i++) {
        if (app.cache[i].url === url) index = i;
    }
    if (index !== false) app.cache.splice(index, 1);
};

// XHR
app.xhr = false;
app.get = function (url, view, ignoreCache, callback) {
    // should we ignore get params or not
    var _url = url;
    if (app.params.cacheIgnoreGetParameters && url.indexOf('?') >= 0) {
        _url = url.split('?')[0];
    }
    if (app.params.cache && !ignoreCache && url.indexOf('nocache') < 0 && app.params.cacheIgnore.indexOf(_url) < 0) {
        // Check is the url cached
        for (var i = 0; i < app.cache.length; i++) {
            if (app.cache[i].url === _url) {
                // Check expiration
                if ((new Date()).getTime() - app.cache[i].time < app.params.cacheDuration) {
                    // Load from cache
                    callback(app.cache[i].content);
                    return false;
                }
            }
        }
    }

    app.xhr = $.ajax({
        url: url,
        method: 'GET',
        beforeSend: app.params.onAjaxStart,
        complete: function (xhr) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
                if (app.params.cache) {
                    app.removeFromCache(_url);
                    app.cache.push({
                        url: _url,
                        time: (new Date()).getTime(),
                        content: xhr.responseText
                    });
                }
                callback(xhr.responseText, false);
            }
            else {
                callback(xhr.responseText, true);
            }
            if (app.params.onAjaxComplete) app.params.onAjaxComplete(xhr);
        },
        error: function (xhr) {
            callback(xhr.responseText, true);
            if (app.params.onAjaxError) app.params.onAjaxError(xhr);
        }
    });
    if (view) view.xhr = app.xhr;

    return app.xhr;
};

/*======================================================
************   Pages   ************
======================================================*/
// Page Callbacks API
app.pageCallbacks = {};

app.onPage = function (callbackName, pageName, callback) {
    if (pageName && pageName.split(' ').length > 1) {
        var pageNames = pageName.split(' ');
        var returnCallbacks = [];
        for (var i = 0; i < pageNames.length; i++) {
            returnCallbacks.push(app.onPage(callbackName, pageNames[i], callback));
        }
        returnCallbacks.remove = function () {
            for (var i = 0; i < returnCallbacks.length; i++) {
                returnCallbacks[i].remove();
            }
        };
        returnCallbacks.trigger = function () {
            for (var i = 0; i < returnCallbacks.length; i++) {
                returnCallbacks[i].trigger();
            }
        };
        return returnCallbacks;
    }
    var callbacks = app.pageCallbacks[callbackName][pageName];
    if (!callbacks) {
        callbacks = app.pageCallbacks[callbackName][pageName] = [];
    }
    app.pageCallbacks[callbackName][pageName].push(callback);
    return {
        remove: function () {
            var removeIndex;
            for (var i = 0; i < callbacks.length; i++) {
                if (callbacks[i].toString() === callback.toString()) {
                    removeIndex = i;
                }
            }
            if (typeof removeIndex !== 'undefined') callbacks.splice(removeIndex, 1);
        },
        trigger: callback
    };
};

//Create callbacks methods dynamically
function createPageCallback(callbackName) {
    var capitalized = callbackName.replace(/^./, function (match) {
        return match.toUpperCase();
    });
    app['onPage' + capitalized] = function (pageName, callback) {
        return app.onPage(callbackName, pageName, callback);
    };
}

var pageCallbacksNames = ('beforeInit init reinit beforeAnimation afterAnimation back afterBack beforeRemove').split(' ');
for (var i = 0; i < pageCallbacksNames.length; i++) {
    app.pageCallbacks[pageCallbacksNames[i]] = {};
    createPageCallback(pageCallbacksNames[i]);
}

app.triggerPageCallbacks = function (callbackName, pageName, pageData) {
    var allPagesCallbacks = app.pageCallbacks[callbackName]['*'];
    if (allPagesCallbacks) {
        for (var j = 0; j < allPagesCallbacks.length; j++) {
            allPagesCallbacks[j](pageData);
        }
    }
    var callbacks = app.pageCallbacks[callbackName][pageName];
    if (!callbacks || callbacks.length === 0) return;
    for (var i = 0; i < callbacks.length; i++) {
        callbacks[i](pageData);
    }
};

// On Page Init Callback
app.pageInitCallback = function (view, params) {
    var pageContainer = params.pageContainer;
    if (pageContainer.f7PageInitialized && view && !view.params.domCache) return;

    var pageQuery = params.query;
    if (!pageQuery) {
        if (params.url && params.url.indexOf('?') > 0) {
            pageQuery = $.parseUrlQuery(params.url || '');
        }
        else if (pageContainer.f7PageData && pageContainer.f7PageData.query) {
            pageQuery = pageContainer.f7PageData.query;
        }
        else {
            pageQuery = {};
        }
    }

    // Page Data
    var pageData = {
        container: pageContainer,
        url: params.url,
        query: pageQuery,
        name: $(pageContainer).attr('data-page'),
        view: view,
        from: params.position,
        context: params.context,
        navbarInnerContainer: params.navbarInnerContainer,
        fromPage: params.fromPage
    };
    if (params.fromPage && !params.fromPage.navbarInnerContainer && params.oldNavbarInnerContainer) {
        params.fromPage.navbarInnerContainer = params.oldNavbarInnerContainer;
    }

    if (pageContainer.f7PageInitialized && ((view && view.params.domCache) || (!view && $(pageContainer).parents('.popup, .popover, .login-screen, .modal, .actions-modal, .picker-modal').length > 0))) {
        // Reinit Page
        app.reinitPage(pageContainer);

        // Callbacks
        app.pluginHook('pageReinit', pageData);
        if (app.params.onPageReinit) app.params.onPageReinit(app, pageData);
        app.triggerPageCallbacks('reinit', pageData.name, pageData);
        $(pageData.container).trigger('pageReinit', {page: pageData});
        return;
    }
    pageContainer.f7PageInitialized = true;

    // Store pagedata in page
    pageContainer.f7PageData = pageData;

    // Update View's activePage
    if (view && !params.preloadOnly && !params.reloadPrevious) {
        // Add data-page on view
        $(view.container).attr('data-page', pageData.name);
        // Update View active page data
        view.activePage = pageData;
    }

    // Before Init Callbacks
    app.pluginHook('pageBeforeInit', pageData);
    if (app.params.onPageBeforeInit) app.params.onPageBeforeInit(app, pageData);
    app.triggerPageCallbacks('beforeInit', pageData.name, pageData);
    $(pageData.container).trigger('pageBeforeInit', {page: pageData});

    // Init page
    app.initPage(pageContainer);

    // Init Callback
    app.pluginHook('pageInit', pageData);
    if (app.params.onPageInit) app.params.onPageInit(app, pageData);
    app.triggerPageCallbacks('init', pageData.name, pageData);
    $(pageData.container).trigger('pageInit', {page: pageData});
};
app.pageRemoveCallback = function (view, pageContainer, position) {
    var pageContext;
    if (pageContainer.f7PageData) pageContext = pageContainer.f7PageData.context;
    // Page Data
    var pageData = {
        container: pageContainer,
        name: $(pageContainer).attr('data-page'),
        view: view,
        url: pageContainer.f7PageData && pageContainer.f7PageData.url,
        query: pageContainer.f7PageData && pageContainer.f7PageData.query,
        navbarInnerContainer: pageContainer.f7PageData && pageContainer.f7PageData.navbarInnerContainer,
        from: position,
        context: pageContext
    };
    // Before Init Callback
    app.pluginHook('pageBeforeRemove', pageData);
    if (app.params.onPageBeforeRemove) app.params.onPageBeforeRemove(app, pageData);
    app.triggerPageCallbacks('beforeRemove', pageData.name, pageData);
    $(pageData.container).trigger('pageBeforeRemove', {page: pageData});
};
app.pageBackCallback = function (callback, view, params) {
    // Page Data
    var pageContainer = params.pageContainer;
    var pageContext;
    if (pageContainer.f7PageData) pageContext = pageContainer.f7PageData.context;

    var pageData = {
        container: pageContainer,
        name: $(pageContainer).attr('data-page'),
        url: pageContainer.f7PageData && pageContainer.f7PageData.url,
        query: pageContainer.f7PageData && pageContainer.f7PageData.query,
        view: view,
        from: params.position,
        context: pageContext,
        navbarInnerContainer: pageContainer.f7PageData && pageContainer.f7PageData.navbarInnerContainer,
        swipeBack: params.swipeBack
    };

    if (callback === 'after') {
        app.pluginHook('pageAfterBack', pageData);
        if (app.params.onPageAfterBack) app.params.onPageAfterBack(app, pageData);
        app.triggerPageCallbacks('afterBack', pageData.name, pageData);
        $(pageContainer).trigger('pageAfterBack', {page: pageData});

    }
    if (callback === 'before') {
        app.pluginHook('pageBack', pageData);
        if (app.params.onPageBack) app.params.onPageBack(app, pageData);
        app.triggerPageCallbacks('back', pageData.name, pageData);
        $(pageData.container).trigger('pageBack', {page: pageData});
    }
};
app.pageAnimCallback = function (callback, view, params) {
    var pageContainer = params.pageContainer;
    var pageContext;
    if (pageContainer.f7PageData) pageContext = pageContainer.f7PageData.context;

    var pageQuery = params.query;
    if (!pageQuery) {
        if (params.url && params.url.indexOf('?') > 0) {
            pageQuery = $.parseUrlQuery(params.url || '');
        }
        else if (pageContainer.f7PageData && pageContainer.f7PageData.query) {
            pageQuery = pageContainer.f7PageData.query;
        }
        else {
            pageQuery = {};
        }
    }
    // Page Data
    var pageData = {
        container: pageContainer,
        url: params.url,
        query: pageQuery,
        name: $(pageContainer).attr('data-page'),
        view: view,
        from: params.position,
        context: pageContext,
        swipeBack: params.swipeBack,
        navbarInnerContainer: pageContainer.f7PageData && pageContainer.f7PageData.navbarInnerContainer,
        fromPage: params.fromPage
    };
    var oldPage = params.oldPage,
        newPage = params.newPage;

    // Update page date
    pageContainer.f7PageData = pageData;

    if (callback === 'after') {
        app.pluginHook('pageAfterAnimation', pageData);
        if (app.params.onPageAfterAnimation) app.params.onPageAfterAnimation(app, pageData);
        app.triggerPageCallbacks('afterAnimation', pageData.name, pageData);
        $(pageData.container).trigger('pageAfterAnimation', {page: pageData});

    }
    if (callback === 'before') {
        // Add data-page on view
        $(view.container).attr('data-page', pageData.name);

        // Update View's activePage
        if (view) view.activePage = pageData;

        // Hide/show navbar dynamically
        if (newPage.hasClass('no-navbar') && !oldPage.hasClass('no-navbar')) {
            view.hideNavbar();
        }
        if (!newPage.hasClass('no-navbar') && (oldPage.hasClass('no-navbar') || oldPage.hasClass('no-navbar-by-scroll'))) {
            view.showNavbar();
        }
        // Hide/show navbar toolbar
        if (newPage.hasClass('no-toolbar') && !oldPage.hasClass('no-toolbar')) {
            view.hideToolbar();
        }
        if (!newPage.hasClass('no-toolbar') && (oldPage.hasClass('no-toolbar') || oldPage.hasClass('no-toolbar-by-scroll'))) {
            view.showToolbar();
        }
        // Hide/show tabbar
        var tabBar;
        if (newPage.hasClass('no-tabbar') && !oldPage.hasClass('no-tabbar')) {
            tabBar = $(view.container).find('.tabbar');
            if (tabBar.length === 0) tabBar = $(view.container).parents('.' + app.params.viewsClass).find('.tabbar');
            app.hideToolbar(tabBar);
        }
        if (!newPage.hasClass('no-tabbar') && (oldPage.hasClass('no-tabbar') || oldPage.hasClass('no-tabbar-by-scroll'))) {
            tabBar = $(view.container).find('.tabbar');
            if (tabBar.length === 0) tabBar = $(view.container).parents('.' + app.params.viewsClass).find('.tabbar');
            app.showToolbar(tabBar);
        }

        oldPage.removeClass('no-navbar-by-scroll no-toolbar-by-scroll');
        // Callbacks
        app.pluginHook('pageBeforeAnimation', pageData);
        if (app.params.onPageBeforeAnimation) app.params.onPageBeforeAnimation(app, pageData);
        app.triggerPageCallbacks('beforeAnimation', pageData.name, pageData);
        $(pageData.container).trigger('pageBeforeAnimation', {page: pageData});
    }
};

// Init Page Events and Manipulations
app.initPage = function (pageContainer) {
    pageContainer = $(pageContainer);
    if (pageContainer.length === 0) return;
    // Size navbars on page load
    if (app.sizeNavbars) app.sizeNavbars(pageContainer.parents('.' + app.params.viewClass)[0]);
    // Init messages
    if (app.initPageMessages) app.initPageMessages(pageContainer);
    // Init forms storage
    if (app.initFormsStorage) app.initFormsStorage(pageContainer);
    // Init smart select
    if (app.initSmartSelects) app.initSmartSelects(pageContainer);
    // Init slider
    if (app.initPageSwiper) app.initPageSwiper(pageContainer);
    // Init pull to refres
    if (app.initPullToRefresh) app.initPullToRefresh(pageContainer);
    // Init infinite scroll
    if (app.initPageInfiniteScroll) app.initPageInfiniteScroll(pageContainer);
    // Init searchbar
    if (app.initSearchbar) app.initSearchbar(pageContainer);
    // Init message bar
    if (app.initPageMessagebar) app.initPageMessagebar(pageContainer);
    // Init scroll toolbars
    if (app.initPageScrollToolbars) app.initPageScrollToolbars(pageContainer);
    // Init lazy images
    if (app.initImagesLazyLoad) app.initImagesLazyLoad(pageContainer);
    // Init progress bars
    if (app.initPageProgressbar) app.initPageProgressbar(pageContainer);
    // Init resizeable textareas
    if (app.initPageResizableTextarea) app.initPageResizableTextarea(pageContainer);
    // Init Material Preloader
    if (app.params.material && app.initPageMaterialPreloader) app.initPageMaterialPreloader(pageContainer);
    // Init Material Inputs
    if (app.params.material && app.initPageMaterialInputs) app.initPageMaterialInputs(pageContainer);
    // Init Material Tabbar
    if (app.params.material && app.initPageMaterialTabbar) app.initPageMaterialTabbar(pageContainer);
};
app.reinitPage = function (pageContainer) {
    pageContainer = $(pageContainer);
    if (pageContainer.length === 0) return;
    // Size navbars on page reinit
    if (app.sizeNavbars) app.sizeNavbars(pageContainer.parents('.' + app.params.viewClass)[0]);
    // Reinit slider
    if (app.reinitPageSwiper) app.reinitPageSwiper(pageContainer);
    // Reinit lazy load
    if (app.reinitLazyLoad) app.reinitLazyLoad(pageContainer);
};
app.initPageWithCallback = function (pageContainer) {
    pageContainer = $(pageContainer);
    var viewContainer = pageContainer.parents('.' + app.params.viewClass);
    if (viewContainer.length === 0) return;
    var view = viewContainer[0].f7View || undefined;
    var url = view && view.url ? view.url : undefined;
    if (viewContainer && pageContainer.attr('data-page')) {
        viewContainer.attr('data-page', pageContainer.attr('data-page'));
    }
    app.pageInitCallback(view, {pageContainer: pageContainer[0], url: url, position: 'center'});
};
/*======================================================
************   Navigation / Router   ************
======================================================*/
app.router = {
    // Temporary DOM Element
    temporaryDom: document.createElement('div'),

    // Find page or navbar in passed container which are related to View
    findElement: function (selector, container, view, notCached) {
        container = $(container);
        if (notCached) selector = selector + ':not(.cached)';
        var found = container.find(selector);
        if (found.length > 1) {
            if (typeof view.selector === 'string') {
                // Search in related view
                found = container.find(view.selector + ' ' + selector);
            }
            if (found.length > 1) {
                // Search in main view
                found = container.find('.' + app.params.viewMainClass + ' ' + selector);
            }
        }
        if (found.length === 1) return found;
        else {
            // Try to find non cached
            if (!notCached) found = app.router.findElement(selector, container, view, true);
            if (found && found.length === 1) return found;
            else return undefined;
        }
    },

    // Set pages classess for animationEnd
    animatePages: function (leftPage, rightPage, direction, view) {
        // Loading new page
        var removeClasses = 'page-on-center page-on-right page-on-left';
        if (direction === 'to-left') {
            leftPage.removeClass(removeClasses).addClass('page-from-center-to-left');
            rightPage.removeClass(removeClasses).addClass('page-from-right-to-center');
        }
        // Go back
        if (direction === 'to-right') {
            leftPage.removeClass(removeClasses).addClass('page-from-left-to-center');
            rightPage.removeClass(removeClasses).addClass('page-from-center-to-right');

        }
    },

    // Prepare navbar before animarion
    prepareNavbar: function (newNavbarInner, oldNavbarInner, newNavbarPosition) {
        $(newNavbarInner).find('.sliding').each(function () {
            var sliding = $(this);
            var slidingOffset = newNavbarPosition === 'right' ? this.f7NavbarRightOffset : this.f7NavbarLeftOffset;

            if (app.params.animateNavBackIcon) {
                if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                    sliding.find('.back .icon').transform('translate3d(' + (-slidingOffset) + 'px,0,0)');
                }
            }
            sliding.transform('translate3d(' + slidingOffset + 'px,0,0)');
        });
    },

    // Set navbars classess for animation
    animateNavbars: function (leftNavbarInner, rightNavbarInner, direction, view) {
        // Loading new page
        var removeClasses = 'navbar-on-right navbar-on-center navbar-on-left';
        if (direction === 'to-left') {
            rightNavbarInner.removeClass(removeClasses).addClass('navbar-from-right-to-center');
            rightNavbarInner.find('.sliding').each(function () {
                var sliding = $(this);
                sliding.transform('translate3d(0px,0,0)');
                if (app.params.animateNavBackIcon) {
                    if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                        sliding.find('.back .icon').transform('translate3d(0px,0,0)');
                    }
                }
            });

            leftNavbarInner.removeClass(removeClasses).addClass('navbar-from-center-to-left');
            leftNavbarInner.find('.sliding').each(function () {
                var sliding = $(this);
                var rightText;
                if (app.params.animateNavBackIcon) {
                    if (sliding.hasClass('center') && rightNavbarInner.find('.sliding.left .back .icon').length > 0) {
                        rightText = rightNavbarInner.find('.sliding.left .back span');
                        if (rightText.length > 0) this.f7NavbarLeftOffset += rightText[0].offsetLeft;
                    }
                    if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                        sliding.find('.back .icon').transform('translate3d(' + (-this.f7NavbarLeftOffset) + 'px,0,0)');
                    }
                }
                sliding.transform('translate3d(' + (this.f7NavbarLeftOffset) + 'px,0,0)');
            });
        }
        // Go back
        if (direction === 'to-right') {
            leftNavbarInner.removeClass(removeClasses).addClass('navbar-from-left-to-center');
            leftNavbarInner.find('.sliding').each(function () {
                var sliding = $(this);
                sliding.transform('translate3d(0px,0,0)');
                if (app.params.animateNavBackIcon) {
                    if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                        sliding.find('.back .icon').transform('translate3d(0px,0,0)');
                    }
                }
            });

            rightNavbarInner.removeClass(removeClasses).addClass('navbar-from-center-to-right');
            rightNavbarInner.find('.sliding').each(function () {
                var sliding = $(this);
                if (app.params.animateNavBackIcon) {
                    if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                        sliding.find('.back .icon').transform('translate3d(' + (-this.f7NavbarRightOffset) + 'px,0,0)');
                    }
                }
                sliding.transform('translate3d(' + (this.f7NavbarRightOffset) + 'px,0,0)');
            });
        }
    },

    preprocess: function(view, content, url, next) {
        // Plugin hook
        app.pluginHook('routerPreprocess', view, content, url, next);

        // Preprocess by plugin
        content = app.pluginProcess('preprocess', content);

        if (view && view.params && view.params.preprocess) {
            content = view.params.preprocess(content, url, next);
            if (typeof content !== 'undefined') {
                next(content);
            }
        }
        else if (app.params.preprocess) {
            content = app.params.preprocess(content, url, next);
            if (typeof content !== 'undefined') {
                next(content);
            }
        }
        else {
            next(content);
        }
    },
    preroute: function(view, options) {
        app.pluginHook('routerPreroute', view, options);
        if ((app.params.preroute && app.params.preroute(view, options) === false) || (view && view.params.preroute && view.params.preroute(view, options) === false)) {
            return true;
        }
        else {
            return false;
        }
    },

    template7Render: function (view, options) {
        var url = options.url,
            content = options.content, //initial content
            t7_rendered_content = options.content, // will be rendered using Template7
            context = options.context, // Context data for Template7
            contextName = options.contextName,
            template = options.template, // Template 7 compiled template
            pageName = options.pageName;

        var t7_ctx, t7_template;
        if (typeof content === 'string') {
            if (url) {
                if (app.template7Cache[url] && !options.ignoreCache) t7_template = t7.cache[url];
                else {
                    t7_template = t7.compile(content);
                    t7.cache[url] = t7_template;
                }
            }
            else t7_template = t7.compile(content);
        }
        else if (template) {
            t7_template = template;
        }

        if (context) t7_ctx = context;
        else {
            if (contextName) {
                if (contextName.indexOf('.') >= 0) {
                    var _ctx_path = contextName.split('.');
                    var _ctx = t7.data[_ctx_path[0]];
                    for (var i = 1; i < _ctx_path.length; i++) {
                        if (_ctx_path[i]) _ctx = _ctx[_ctx_path[i]];
                    }
                    t7_ctx = _ctx;
                }
                else t7_ctx = t7.data[contextName];
            }
            if (!t7_ctx && url) {
                t7_ctx = t7.data['url:' + url];
            }
            if (!t7_ctx && typeof content === 'string' && !template) {
                //try to find by page name in content
                var pageNameMatch = content.match(/(data-page=["'][^"^']*["'])/);
                if (pageNameMatch) {
                    var page = pageNameMatch[0].split('data-page=')[1].replace(/['"]/g, '');
                    if (page) t7_ctx = t7.data['page:' + page];
                }
            }
            if (!t7_ctx && template && t7.templates) {
                // Try to find matched template name in t7.templates
                for (var templateName in t7.templates) {
                    if (t7.templates[templateName] === template) t7_ctx = t7.data[templateName];
                }
            }
            if (!t7_ctx) t7_ctx = {};
        }

        if (t7_template && t7_ctx) {
            if (typeof t7_ctx === 'function') t7_ctx = t7_ctx();
            if (url) {
                // Extend data with URL query
                var query = $.parseUrlQuery(url);
                t7_ctx.url_query = {};
                for (var key in query) {
                    t7_ctx.url_query[key] = query[key];
                }
            }
            t7_rendered_content = t7_template(t7_ctx);
        }

        return {content: t7_rendered_content, context: t7_ctx};
    }
};


app.router._load = function (view, options) {
    options = options || {};

    var url = options.url,
        content = options.content, //initial content
        t7_rendered = {content: options.content},
        template = options.template, // Template 7 compiled template
        pageName = options.pageName,
        viewContainer = $(view.container),
        pagesContainer = $(view.pagesContainer),
        animatePages = options.animatePages,
        newPage, oldPage, pagesInView, i, oldNavbarInner, newNavbarInner, navbar, dynamicNavbar, reloadPosition,
        isDynamicPage = typeof url === 'undefined' && content || template,
        pushState = options.pushState;

    if (typeof animatePages === 'undefined') animatePages = view.params.animatePages;

    // Plugin hook
    app.pluginHook('routerLoad', view, options);

    // Render with Template7
    if (app.params.template7Pages && typeof content === 'string' || template) {
        t7_rendered = app.router.template7Render(view, options);
        if (t7_rendered.content && !content) {
            content = t7_rendered.content;
        }
    }

    app.router.temporaryDom.innerHTML = '';

    // Parse DOM
    if (!pageName) {
        if ((typeof content === 'string') || (url && (typeof content === 'string'))) {
            app.router.temporaryDom.innerHTML = t7_rendered.content;
        } else {
            if ('length' in content && content.length > 1) {
                for (var ci = 0; ci < content.length; ci++) {
                    $(app.router.temporaryDom).append(content[ci]);
                }
            } else {
                $(app.router.temporaryDom).append(content);
            }
        }
    }

    // Reload position
    reloadPosition = options.reload && (options.reloadPrevious ? 'left' : 'center');

    // Find new page
    if (pageName) newPage = pagesContainer.find('.page[data-page="' + pageName + '"]');
    else {
        newPage = app.router.findElement('.page', app.router.temporaryDom, view);
    }

    // If page not found exit
    if (!newPage || newPage.length === 0 || (pageName && view.activePage && view.activePage.name === pageName)) {
        view.allowPageChange = true;
        return;
    }

    newPage.addClass(options.reload ? 'page-on-' + reloadPosition : 'page-on-right');

    // Find old page (should be the last one) and remove older pages
    pagesInView = pagesContainer.children('.page:not(.cached)');

    if (options.reload && options.reloadPrevious && pagesInView.length === 1)  {
        view.allowPageChange = true;
        return;
    }

    if (options.reload) {
        oldPage = pagesInView.eq(pagesInView.length - 1);
    }
    else {
        if (pagesInView.length > 1) {
            for (i = 0; i < pagesInView.length - 2; i++) {
                if (!view.params.domCache) {
                    app.pageRemoveCallback(view, pagesInView[i], 'left');
                    $(pagesInView[i]).remove();
                }
                else {
                    $(pagesInView[i]).addClass('cached');
                }
            }
            if (!view.params.domCache) {
                app.pageRemoveCallback(view, pagesInView[i], 'left');
                $(pagesInView[i]).remove();
            }
            else {
                $(pagesInView[i]).addClass('cached');
            }
        }
        oldPage = pagesContainer.children('.page:not(.cached)');
    }
    if(view.params.domCache) newPage.removeClass('cached');

    // Dynamic navbar
    if (view.params.dynamicNavbar) {
        dynamicNavbar = true;
        // Find navbar
        if (pageName) {
            newNavbarInner = viewContainer.find('.navbar-inner[data-page="' + pageName + '"]');
        }
        else {
            newNavbarInner = app.router.findElement('.navbar-inner', app.router.temporaryDom, view);
        }
        if (!newNavbarInner || newNavbarInner.length === 0) {
            dynamicNavbar = false;
        }
        navbar = viewContainer.find('.navbar');
        if (options.reload) {
            oldNavbarInner = navbar.find('.navbar-inner:not(.cached):last-child');
        }
        else {
            oldNavbarInner = navbar.find('.navbar-inner:not(.cached)');

            if (oldNavbarInner.length > 0) {
                for (i = 0; i < oldNavbarInner.length - 1; i++) {
                    if (!view.params.domCache) {
                        app.navbarRemoveCallback(view, pagesInView[i], navbar[0], oldNavbarInner[i]);
                        $(oldNavbarInner[i]).remove();
                    }
                    else
                        $(oldNavbarInner[i]).addClass('cached');
                }
                if (!newNavbarInner && oldNavbarInner.length === 1) {
                    if (!view.params.domCache) {
                        app.navbarRemoveCallback(view, pagesInView[0], navbar[0], oldNavbarInner[0]);
                        $(oldNavbarInner[0]).remove();
                    }
                    else
                        $(oldNavbarInner[0]).addClass('cached');
                }
                oldNavbarInner = navbar.find('.navbar-inner:not(.cached)');
            }
        }
    }
    if (dynamicNavbar) {
        newNavbarInner.addClass(options.reload ? 'navbar-on-' + reloadPosition : 'navbar-on-right');
        if(view.params.domCache) newNavbarInner.removeClass('cached');
        newPage[0].f7RelatedNavbar = newNavbarInner[0];
        newNavbarInner[0].f7RelatedPage = newPage[0];
    }

    // save content areas into view's cache
    if (!url) {
        var newPageName = pageName || newPage.attr('data-page');
        if (isDynamicPage) url = '#' + app.params.dynamicPageUrl.replace(/{{name}}/g, newPageName).replace(/{{index}}/g, view.history.length - (options.reload ? 1 : 0));
        else url = '#' + newPageName;
        if (!view.params.domCache) {
            view.contentCache[url] = content;
        }
        if (view.params.domCache && pageName) {
            view.pagesCache[url] = pageName;
        }
    }

    // Push State
    if (app.params.pushState && !options.reloadPrevious && view.main)  {
        if (typeof pushState === 'undefined') pushState = true;
        var pushStateRoot = app.params.pushStateRoot || '';
        var method = options.reload ? 'replaceState' : 'pushState';
        if (pushState) {
            if (!isDynamicPage && !pageName) {
                history[method]({url: url, viewIndex: app.views.indexOf(view)}, '', pushStateRoot + app.params.pushStateSeparator + url);
            }
            else if (isDynamicPage && content) {
                history[method]({content: typeof content === 'string' ? content : '', url: url, viewIndex: app.views.indexOf(view)}, '', pushStateRoot + app.params.pushStateSeparator + url);
            }
            else if (pageName) {
                history[method]({pageName: pageName, url: url, viewIndex: app.views.indexOf(view)}, '', pushStateRoot + app.params.pushStateSeparator + url);
            }
        }
    }

    // Update View history
    view.url = url;
    if (options.reload) {
        var lastUrl = view.history[view.history.length - (options.reloadPrevious ? 2 : 1)];
        if (lastUrl &&
            lastUrl.indexOf('#') === 0 &&
            lastUrl in view.contentCache &&
            lastUrl !== url &&
            view.history.indexOf(lastUrl) === -1) {
            view.contentCache[lastUrl] = null;
            delete view.contentCache[lastUrl];
        }
        view.history[view.history.length - (options.reloadPrevious ? 2 : 1)] = url;
    }
    else {
        view.history.push(url);
    }

    // Unique history
    var historyBecameUnique = false;
    if (view.params.uniqueHistory) {
        var _history = view.history;
        var _url = url;
        if (view.params.uniqueHistoryIgnoreGetParameters) {
            _history = [];
            _url = url.split('?')[0];
            for (i = 0; i < view.history.length; i++) {
                _history.push(view.history[i].split('?')[0]);
            }
        }

        if (_history.indexOf(_url) !== _history.lastIndexOf(_url)) {
            view.history = view.history.slice(0, _history.indexOf(_url));
            view.history.push(url);
            historyBecameUnique = true;
        }
    }
    // Dom manipulations
    if (options.reloadPrevious) {
        oldPage = oldPage.prev('.page');
        newPage.insertBefore(oldPage);
        if (dynamicNavbar) {
            oldNavbarInner = oldNavbarInner.prev('.navbar-inner');
            newNavbarInner.insertAfter(oldNavbarInner);
        }
    }
    else {
        pagesContainer.append(newPage[0]);
        if (dynamicNavbar) navbar.append(newNavbarInner[0]);
    }
    // Remove Old Page And Navbar
    if (options.reload) {
        if (view.params.domCache && view.initialPages.indexOf(oldPage[0]) >= 0) {
            oldPage.addClass('cached');
            if (dynamicNavbar) oldNavbarInner.addClass('cached');
        }
        else {
            app.pageRemoveCallback(view, oldPage[0], reloadPosition);
            if (dynamicNavbar) app.navbarRemoveCallback(view, oldPage[0], navbar[0], oldNavbarInner[0]);
            oldPage.remove();
            if (dynamicNavbar) oldNavbarInner.remove();
        }
    }

    // Page Init Events
    app.pageInitCallback(view, {
        pageContainer: newPage[0],
        url: url,
        position: options.reload ? reloadPosition : 'right',
        navbarInnerContainer: dynamicNavbar ? newNavbarInner && newNavbarInner[0] : undefined,
        oldNavbarInnerContainer: dynamicNavbar ? oldNavbarInner && oldNavbarInner[0] : undefined,
        context: t7_rendered.context,
        query: options.query,
        fromPage: oldPage && oldPage.length && oldPage[0].f7PageData,
        reload: options.reload,
        reloadPrevious: options.reloadPrevious
    });

    // Navbar init event
    if (dynamicNavbar) {
        app.navbarInitCallback(view, newPage[0], navbar[0], newNavbarInner[0], url, options.reload ? reloadPosition : 'right');
    }

    if (options.reload) {
        view.allowPageChange = true;
        if (historyBecameUnique) view.refreshPreviousPage();
        return;
    }

    if (dynamicNavbar && animatePages) {
        app.router.prepareNavbar(newNavbarInner, oldNavbarInner, 'right');
    }
    // Force reLayout
    var clientLeft = newPage[0].clientLeft;

    // Before Anim Callback
    app.pageAnimCallback('before', view, {
        pageContainer: newPage[0],
        url: url,
        position: 'right',
        oldPage: oldPage,
        newPage: newPage,
        query: options.query,
        fromPage: oldPage && oldPage.length && oldPage[0].f7PageData
    });

    function afterAnimation() {
        view.allowPageChange = true;
        newPage.removeClass('page-from-right-to-center page-on-right page-on-left').addClass('page-on-center');
        oldPage.removeClass('page-from-center-to-left page-on-center page-on-right').addClass('page-on-left');
        if (dynamicNavbar) {
            newNavbarInner.removeClass('navbar-from-right-to-center navbar-on-left navbar-on-right').addClass('navbar-on-center');
            oldNavbarInner.removeClass('navbar-from-center-to-left navbar-on-center navbar-on-right').addClass('navbar-on-left');
        }
        app.pageAnimCallback('after', view, {
            pageContainer: newPage[0],
            url: url,
            position: 'right',
            oldPage: oldPage,
            newPage: newPage,
            query: options.query,
            fromPage: oldPage && oldPage.length && oldPage[0].f7PageData
        });
        if (app.params.pushState && view.main) app.pushStateClearQueue();
        if (!(view.params.swipeBackPage || view.params.preloadPreviousPage)) {
            if (view.params.domCache) {
                oldPage.addClass('cached');
                if (dynamicNavbar) oldNavbarInner.addClass('cached');
            }
            else {
                if (!(url.indexOf('#') === 0 && newPage.attr('data-page').indexOf('smart-select-') === 0)) {
                    app.pageRemoveCallback(view, oldPage[0], 'left');
                    if (dynamicNavbar) app.navbarRemoveCallback(view, oldPage[0], navbar[0], oldNavbarInner[0]);
                    oldPage.remove();
                    if (dynamicNavbar) oldNavbarInner.remove();
                }
            }
        }
        if (view.params.uniqueHistory && historyBecameUnique) {
            view.refreshPreviousPage();
        }
    }
    if (animatePages) {
        // Set pages before animation
        if (app.params.material && app.params.materialPageLoadDelay) {
            setTimeout(function () {
                app.router.animatePages(oldPage, newPage, 'to-left', view);
            }, app.params.materialPageLoadDelay);
        }
        else {
            app.router.animatePages(oldPage, newPage, 'to-left', view);
        }

        // Dynamic navbar animation
        if (dynamicNavbar) {
            setTimeout(function() {
                app.router.animateNavbars(oldNavbarInner, newNavbarInner, 'to-left', view);
            }, 0);
        }
        newPage.animationEnd(function (e) {
            afterAnimation();
        });
    }
    else {
        if (dynamicNavbar) newNavbarInner.find('.sliding, .sliding .back .icon').transform('');
        afterAnimation();
    }

};

app.router.load = function (view, options) {
    if (app.router.preroute(view, options)) {
        return false;
    }
    options = options || {};
    var url = options.url;
    var content = options.content;
    var pageName = options.pageName;
    if (pageName) {
        if (pageName.indexOf('?') > 0) {
            options.query = $.parseUrlQuery(pageName);
            options.pageName = pageName = pageName.split('?')[0];
        }
    }
    var template = options.template;
    if (view.params.reloadPages === true) options.reload = true;

    if (!view.allowPageChange) return false;
    if (url && view.url === url && !options.reload && !view.params.allowDuplicateUrls) return false;
    view.allowPageChange = false;
    if (app.xhr && view.xhr && view.xhr === app.xhr) {
        app.xhr.abort();
        app.xhr = false;
    }
    function proceed(content) {
        app.router.preprocess(view, content, url, function (content) {
            options.content = content;
            app.router._load(view, options);
        });
    }
    if (content || pageName) {
        proceed(content);
        return;
    }
    else if (template) {
        app.router._load(view, options);
        return;
    }

    if (!options.url || options.url === '#') {
        view.allowPageChange = true;
        return;
    }
    app.get(options.url, view, options.ignoreCache, function (content, error) {
        if (error) {
            view.allowPageChange = true;
            return;
        }
        proceed(content);
    });
};

app.router._back = function (view, options) {
    options = options || {};
    var url = options.url,
        content = options.content,
        t7_rendered = {content: options.content}, // will be rendered using Template7
        template = options.template, // Template 7 compiled template
        animatePages = options.animatePages,
        preloadOnly = options.preloadOnly,
        pushState = options.pushState,
        ignoreCache = options.ignoreCache,
        force = options.force,
        pageName = options.pageName;

    var viewContainer = $(view.container),
        pagesContainer = $(view.pagesContainer),
        pagesInView = pagesContainer.children('.page:not(.cached)'),
        oldPage, newPage, oldNavbarInner, newNavbarInner, navbar, navbarInners, dynamicNavbar, manipulateDom = true;

    if (typeof animatePages === 'undefined') animatePages = view.params.animatePages;

    app.pluginHook('routerBack', view, options);

    // Render with Template7
    if (app.params.template7Pages && typeof content === 'string' || template) {
        t7_rendered = app.router.template7Render(view, options);
        if (t7_rendered.content && !content) {
            content = t7_rendered.content;
        }
    }

    // Animation
    function afterAnimation() {
        app.pageBackCallback('after', view, {
            pageContainer: oldPage[0],
            url: url,
            position: 'center',
            oldPage: oldPage,
            newPage: newPage,
        });
        app.pageAnimCallback('after', view, {
            pageContainer: newPage[0],
            url: url,
            position: 'left',
            oldPage: oldPage,
            newPage: newPage,
            query: options.query,
            fromPage: oldPage && oldPage.length && oldPage[0].f7PageData
        });
        app.router.afterBack(view, oldPage[0], newPage[0]);
    }
    function animateBack() {
        // Page before animation callback
        app.pageBackCallback('before', view, {
            pageContainer: oldPage[0],
            url: url,
            position: 'center',
            oldPage: oldPage,
            newPage: newPage,
        });
        app.pageAnimCallback('before', view, {
            pageContainer: newPage[0],
            url: url,
            position: 'left',
            oldPage: oldPage,
            newPage: newPage,
            query: options.query,
            fromPage: oldPage && oldPage.length && oldPage[0].f7PageData
        });

        if (animatePages) {
            // Set pages before animation
            app.router.animatePages(newPage, oldPage, 'to-right', view);

            // Dynamic navbar animation
            if (dynamicNavbar) {
                setTimeout(function () {
                    app.router.animateNavbars(newNavbarInner, oldNavbarInner, 'to-right', view);
                }, 0);
            }

            newPage.animationEnd(function () {
                afterAnimation();
            });
        }
        else {
            if (dynamicNavbar) newNavbarInner.find('.sliding, .sliding .back .icon').transform('');
            afterAnimation();
        }
    }

    function parseNewPage() {
        app.router.temporaryDom.innerHTML = '';
        // Parse DOM
        if ((typeof content === 'string') || (url && (typeof content === 'string'))) {
            app.router.temporaryDom.innerHTML = t7_rendered.content;
        } else {
            if ('length' in content && content.length > 1) {
                for (var ci = 0; ci < content.length; ci++) {
                    $(app.router.temporaryDom).append(content[ci]);
                }
            } else {
                $(app.router.temporaryDom).append(content);
            }
        }
        newPage = app.router.findElement('.page', app.router.temporaryDom, view);

        if (view.params.dynamicNavbar) {
            // Find navbar
            newNavbarInner = app.router.findElement('.navbar-inner', app.router.temporaryDom, view);
        }
    }
    function setPages() {
        // If pages not found or there are still more than one, exit
        if (!newPage || newPage.length === 0) {
            view.allowPageChange = true;
            return;
        }
        if (view.params.dynamicNavbar && typeof dynamicNavbar === 'undefined') {
            if (!newNavbarInner || newNavbarInner.length === 0) {
                dynamicNavbar = false;
            }
            else {
                dynamicNavbar = true;
            }
        }

        newPage.addClass('page-on-left').removeClass('cached');
        if (dynamicNavbar) {
            navbar = viewContainer.find('.navbar');
            navbarInners = viewContainer.find('.navbar-inner:not(.cached)');
            newNavbarInner.addClass('navbar-on-left').removeClass('cached');
        }
        // Remove/hide previous page in force mode
        if (force) {
            var pageToRemove, navbarToRemove;
            pageToRemove = $(pagesInView[pagesInView.length - 2]);

            if (dynamicNavbar) navbarToRemove = $(pageToRemove[0] && pageToRemove[0].f7RelatedNavbar || navbarInners[navbarInners.length - 2]);
            if (view.params.domCache && view.initialPages.indexOf(pageToRemove[0]) >= 0) {
                if (pageToRemove.length && pageToRemove[0] !== newPage[0]) pageToRemove.addClass('cached');
                if (dynamicNavbar && navbarToRemove.length && navbarToRemove[0] !== newNavbarInner[0]) {
                    navbarToRemove.addClass('cached');
                }
            }
            else {
                var removeNavbar = dynamicNavbar && navbarToRemove.length;
                if (pageToRemove.length) {
                    app.pageRemoveCallback(view, pageToRemove[0], 'right');
                    if (removeNavbar) {
                        app.navbarRemoveCallback(view, pageToRemove[0], navbar[0], navbarToRemove[0]);
                    }
                    pageToRemove.remove();
                    if (removeNavbar) navbarToRemove.remove();
                }
                else if (removeNavbar) {
                    app.navbarRemoveCallback(view, pageToRemove[0], navbar[0], navbarToRemove[0]);
                    navbarToRemove.remove();
                }
            }
            pagesInView = pagesContainer.children('.page:not(.cached)');
            if (dynamicNavbar) {
                navbarInners = viewContainer.find('.navbar-inner:not(.cached)');
            }
            if (view.history.indexOf(url) >= 0) {
                view.history = view.history.slice(0, view.history.indexOf(url) + 2);
            }
            else {
                if (view.history[[view.history.length - 2]]) {
                    view.history[view.history.length - 2] = url;
                }
                else {
                    view.history.unshift(url);
                }
            }
        }

        oldPage = $(pagesInView[pagesInView.length - 1]);
        if (view.params.domCache) {
            if (oldPage[0] === newPage[0]) {
                oldPage = pagesContainer.children('.page.page-on-center');
                if (oldPage.length === 0 && view.activePage) oldPage = $(view.activePage.container);
            }
        }

        if (dynamicNavbar && !oldNavbarInner) {
            oldNavbarInner = $(navbarInners[navbarInners.length - 1]);
            if (view.params.domCache) {
                if (oldNavbarInner[0] === newNavbarInner[0]) {
                    oldNavbarInner = navbar.children('.navbar-inner.navbar-on-center:not(.cached)');
                }
                if (oldNavbarInner.length === 0) {
                    oldNavbarInner = navbar.children('.navbar-inner[data-page="'+oldPage.attr('data-page')+'"]');
                }
            }
            if (oldNavbarInner.length === 0 || newNavbarInner[0] === oldNavbarInner[0]) dynamicNavbar = false;
        }

        if (dynamicNavbar) {
            if (manipulateDom) newNavbarInner.insertBefore(oldNavbarInner);
            newNavbarInner[0].f7RelatedPage = newPage[0];
            newPage[0].f7RelatedNavbar = newNavbarInner[0];
        }
        if (manipulateDom) newPage.insertBefore(oldPage);

        // Page Init Events
        app.pageInitCallback(view, {
            pageContainer: newPage[0],
            url: url,
            position: 'left',
            navbarInnerContainer: dynamicNavbar ? newNavbarInner[0] : undefined,
            oldNavbarInnerContainer: dynamicNavbar ? oldNavbarInner && oldNavbarInner[0] : undefined,
            context: t7_rendered.context,
            query: options.query,
            fromPage: oldPage && oldPage.length && oldPage[0].f7PageData,
            preloadOnly: preloadOnly
        });
        if (dynamicNavbar) {
            app.navbarInitCallback(view, newPage[0], navbar[0], newNavbarInner[0], url, 'right');
        }

        if (dynamicNavbar && newNavbarInner.hasClass('navbar-on-left') && animatePages) {
            app.router.prepareNavbar(newNavbarInner,  oldNavbarInner, 'left');
        }

        if (preloadOnly) {
            view.allowPageChange = true;
            return;
        }

        // Update View's URL
        view.url = url;

        // Force reLayout
        var clientLeft = newPage[0].clientLeft;

        animateBack();

        // Push state
        if (app.params.pushState && view.main)  {
            if (typeof pushState === 'undefined') pushState = true;
            if (!preloadOnly && history.state && pushState) {
                history.back();
            }
        }
        return;
    }

    // Simple go back when we have pages on left
    if (pagesInView.length > 1 && !force) {
        // Exit if only preloadOnly
        if (preloadOnly) {
            view.allowPageChange = true;
            return;
        }
        // Update View's URL
        view.url = view.history[view.history.length - 2];
        url = view.url;

        // Define old and new pages
        newPage = $(pagesInView[pagesInView.length - 2]);
        oldPage = $(pagesInView[pagesInView.length - 1]);

        // Dynamic navbar
        if (view.params.dynamicNavbar) {
            dynamicNavbar = true;
            // Find navbar
            navbarInners = viewContainer.find('.navbar-inner:not(.cached)');
            newNavbarInner = $(navbarInners[0]);
            oldNavbarInner = $(navbarInners[1]);
            if (newNavbarInner.length === 0 || oldNavbarInner.length === 0 || oldNavbarInner[0] === newNavbarInner[0]) {
                dynamicNavbar = false;
            }
        }
        manipulateDom = false;
        setPages();
        return;
    }

    if (!force) {
        // Go back when there is no pages on left
        if (!preloadOnly) {
            view.url = view.history[view.history.length - 2];
            url = view.url;
        }

        if (content) {
            parseNewPage();
            setPages();
            return;
        }
        else if (pageName) {
            // Get dom cached pages
            newPage = $(viewContainer).find('.page[data-page="' + pageName + '"]');
            if (view.params.dynamicNavbar) {
                newNavbarInner = $(viewContainer).find('.navbar-inner[data-page="' + pageName + '"]');
                if (newNavbarInner.length === 0 && newPage[0].f7RelatedNavbar) {
                    newNavbarInner = $(newPage[0].f7RelatedNavbar);
                }
                if (newNavbarInner.length === 0 && newPage[0].f7PageData) {
                    newNavbarInner = $(newPage[0].f7PageData.navbarInnerContainer);
                }
            }
            setPages();
            return;
        }
        else {
            view.allowPageChange = true;
            return;
        }
    }
    else {
        if (url && url === view.url || pageName && view.activePage && view.activePage.name === pageName) {
            view.allowPageChange = true;
            return;
        }
        // Go back with force url
        if (content) {
            parseNewPage();
            setPages();
            return;
        }
        else if (pageName && view.params.domCache) {
            if (pageName) url = '#' + pageName;

            newPage = $(viewContainer).find('.page[data-page="' + pageName + '"]');
            if (newPage[0].f7PageData && newPage[0].f7PageData.url) {
                url = newPage[0].f7PageData.url;
            }
            if (view.params.dynamicNavbar) {
                newNavbarInner = $(viewContainer).find('.navbar-inner[data-page="' + pageName + '"]');
                if (newNavbarInner.length === 0 && newPage[0].f7RelatedNavbar) {
                    newNavbarInner = $(newPage[0].f7RelatedNavbar);
                }
                if (newNavbarInner.length === 0 && newPage[0].f7PageData) {
                    newNavbarInner = $(newPage[0].f7PageData.navbarInnerContainer);
                }
            }
            setPages();
            return;
        }
        else {
            view.allowPageChange = true;
            return;
        }
    }

};
app.router.back = function (view, options) {
    if (app.router.preroute(view, options)) {
        return false;
    }
    options = options || {};
    var url = options.url;
    var content = options.content;
    var pageName = options.pageName;
    if (pageName) {
        if (pageName.indexOf('?') > 0) {
            options.query = $.parseUrlQuery(pageName);
            options.pageName = pageName = pageName.split('?')[0];
        }
    }
    var force = options.force;
    if (!view.allowPageChange) return false;
    view.allowPageChange = false;
    if (app.xhr && view.xhr && view.xhr === app.xhr) {
        app.xhr.abort();
        app.xhr = false;
    }
    var pagesInView = $(view.pagesContainer).find('.page:not(.cached)');

    function proceed(content) {
        app.router.preprocess(view, content, url, function (content) {
            options.content = content;
            app.router._back(view, options);
        });
    }
    if (pagesInView.length > 1 && !force) {
        // Simple go back to previos page in view
        app.router._back(view, options);
        return;
    }
    if (!force) {
        url = options.url = view.history[view.history.length - 2];
        if (!url) {
            view.allowPageChange = true;
            return;
        }
        if (url.indexOf('#') === 0 && view.contentCache[url]) {
            proceed(view.contentCache[url]);
            return;
        }
        else if (url.indexOf('#') === 0 && view.params.domCache) {
            if (!pageName) options.pageName = url.split('#')[1];
            proceed();
            return;
        }
        else if (url.indexOf('#') !== 0) {
            // Load ajax page
            app.get(options.url, view, options.ignoreCache, function (content, error) {
                if (error) {
                    view.allowPageChange = true;
                    return;
                }
                proceed(content);
            });
            return;
        }
    }
    else {
        // Go back with force url
        if (!url && content) {
            proceed(content);
            return;
        }
        else if (!url && pageName) {
            if (pageName) url = '#' + pageName;
            proceed();
            return;
        }
        else if (url) {
            app.get(options.url, view, options.ignoreCache, function (content, error) {
                if (error) {
                    view.allowPageChange = true;
                    return;
                }
                proceed(content);
            });
            return;
        }
    }
    view.allowPageChange = true;
    return;
};

app.router.afterBack = function (view, oldPage, newPage) {
    // Remove old page and set classes on new one
    oldPage = $(oldPage);
    newPage = $(newPage);

    if (view.params.domCache && view.initialPages.indexOf(oldPage[0]) >= 0) {
        oldPage.removeClass('page-from-center-to-right').addClass('cached');
    }
    else {
        app.pageRemoveCallback(view, oldPage[0], 'right');
        oldPage.remove();
    }

    newPage.removeClass('page-from-left-to-center page-on-left').addClass('page-on-center');
    view.allowPageChange = true;

    // Update View's History
    var previousURL = view.history.pop();

    var newNavbar;

    // Updated dynamic navbar
    if (view.params.dynamicNavbar) {
        var inners = $(view.container).find('.navbar-inner:not(.cached)');
        var oldNavbar = $(oldPage[0].f7RelatedNavbar || inners[1]);
        if (view.params.domCache && view.initialNavbars.indexOf(oldNavbar[0]) >= 0) {
            oldNavbar.removeClass('navbar-from-center-to-right').addClass('cached');
        }
        else {
            app.navbarRemoveCallback(view, oldPage[0], undefined, oldNavbar[0]);
            oldNavbar.remove();
        }
        newNavbar = $(inners[0]).removeClass('navbar-on-left navbar-from-left-to-center').addClass('navbar-on-center');
    }

    // Remove pages in dom cache
    if (view.params.domCache) {
        $(view.container).find('.page.cached').each(function () {
            var page = $(this);
            var index = page.index();
            var pageUrl = page[0].f7PageData && page[0].f7PageData.url;
            if (pageUrl && view.history.indexOf(pageUrl) < 0 && view.initialPages.indexOf(this) < 0) {
                app.pageRemoveCallback(view, page[0], 'right');
                if (page[0].f7RelatedNavbar && view.params.dynamicNavbar) app.navbarRemoveCallback(view, page[0], undefined, page[0].f7RelatedNavbar);
                page.remove();
                if (page[0].f7RelatedNavbar && view.params.dynamicNavbar) $(page[0].f7RelatedNavbar).remove();
            }
        });
    }

    // Check previous page is content based only and remove it from content cache
    if (!view.params.domCache &&
        previousURL &&
        previousURL.indexOf('#') > -1 &&
        (previousURL in view.contentCache) &&
        // If the same page is in the history multiple times, don't remove it.
        view.history.indexOf(previousURL) === -1) {
        view.contentCache[previousURL] = null;
        delete view.contentCache[previousURL];
    }

    if (app.params.pushState && view.main) app.pushStateClearQueue();

    // Preload previous page
    if (view.params.preloadPreviousPage) {
        if (view.params.domCache && view.history.length > 1) {
            var preloadUrl = view.history[view.history.length - 2];
            var previousPage;
            var previousNavbar;
            if (preloadUrl && view.pagesCache[preloadUrl]) {
                // Load by page name
                previousPage = $(view.container).find('.page[data-page="' + view.pagesCache[preloadUrl] + '"]');
                if (previousPage.next('.page')[0] !== newPage[0]) previousPage.insertBefore(newPage);
                if (newNavbar) {
                    previousNavbar = $(view.container).find('.navbar-inner[data-page="' + view.pagesCache[preloadUrl] + '"]');
                    if(!previousNavbar || previousNavbar.length === 0) previousNavbar = newNavbar.prev('.navbar-inner.cached');
                    if (previousNavbar.next('.navbar-inner')[0] !== newNavbar[0]) previousNavbar.insertBefore(newNavbar);
                }
            }
            else {
                // Just load previous page
                previousPage = newPage.prev('.page.cached');
                if (newNavbar) previousNavbar = newNavbar.prev('.navbar-inner.cached');
            }
            if (previousPage && previousPage.length > 0) previousPage.removeClass('cached page-on-right page-on-center').addClass('page-on-left');
            if (previousNavbar && previousNavbar.length > 0) previousNavbar.removeClass('cached navbar-on-right navbar-on-center').addClass('navbar-on-left');
        }
        else {
            app.router.back(view, {preloadOnly: true});
        }
    }
};

/*======================================================
************   Modals   ************
======================================================*/
var _modalTemplateTempDiv = document.createElement('div');
app.modalStack = [];
app.modalStackClearQueue = function () {
    if (app.modalStack.length) {
        (app.modalStack.shift())();
    }
};
app.modal = function (params) {
    params = params || {};
    var modalHTML = '';
    if (app.params.modalTemplate) {
        if (!app._compiledTemplates.modal) app._compiledTemplates.modal = t7.compile(app.params.modalTemplate);
        modalHTML = app._compiledTemplates.modal(params);
    }
    else {
        var buttonsHTML = '';
        if (params.buttons && params.buttons.length > 0) {
            for (var i = 0; i < params.buttons.length; i++) {
                buttonsHTML += '<span class="modal-button' + (params.buttons[i].bold ? ' modal-button-bold' : '') + '">' + params.buttons[i].text + '</span>';
            }
        }
        var titleHTML = params.title ? '<div class="modal-title">' + params.title + '</div>' : '';
        var textHTML = params.text ? '<div class="modal-text">' + params.text + '</div>' : '';
        var afterTextHTML = params.afterText ? params.afterText : '';
        var noButtons = !params.buttons || params.buttons.length === 0 ? 'modal-no-buttons' : '';
        var verticalButtons = params.verticalButtons ? 'modal-buttons-vertical': '';
        var modalButtonsHTML = params.buttons && params.buttons.length > 0 ? '<div class="modal-buttons modal-buttons-' + params.buttons.length + ' ' + verticalButtons + '">' + buttonsHTML + '</div>' : '';
        modalHTML = '<div class="modal ' + noButtons + ' ' + (params.cssClass || '') + '"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div>' + modalButtonsHTML + '</div>';
    }

    _modalTemplateTempDiv.innerHTML = modalHTML;

    var modal = $(_modalTemplateTempDiv).children();

    $('body').append(modal[0]);

    // Add events on buttons
    modal.find('.modal-button').each(function (index, el) {
        $(el).on('click', function (e) {
            if (params.buttons[index].close !== false) app.closeModal(modal);
            if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
            if (params.onClick) params.onClick(modal, index);
        });
    });
    app.openModal(modal);
    return modal[0];
};
app.alert = function (text, title, callbackOk) {
    if (typeof title === 'function') {
        callbackOk = arguments[1];
        title = undefined;
    }
    return app.modal({
        text: text || '',
        title: typeof title === 'undefined' ? app.params.modalTitle : title,
        buttons: [ {text: app.params.modalButtonOk, bold: true, onClick: callbackOk} ]
    });
};
app.confirm = function (text, title, callbackOk, callbackCancel) {
    if (typeof title === 'function') {
        callbackCancel = arguments[2];
        callbackOk = arguments[1];
        title = undefined;
    }
    return app.modal({
        text: text || '',
        title: typeof title === 'undefined' ? app.params.modalTitle : title,
        buttons: [
            {text: app.params.modalButtonCancel, onClick: callbackCancel},
            {text: app.params.modalButtonOk, bold: true, onClick: callbackOk}
        ]
    });
};
app.prompt = function (text, title, callbackOk, callbackCancel) {
    if (typeof title === 'function') {
        callbackCancel = arguments[2];
        callbackOk = arguments[1];
        title = undefined;
    }
    return app.modal({
        text: text || '',
        title: typeof title === 'undefined' ? app.params.modalTitle : title,
        afterText: '<div class="input-field"><input type="text" class="modal-text-input"></div>',
        buttons: [
            {
                text: app.params.modalButtonCancel
            },
            {
                text: app.params.modalButtonOk,
                bold: true
            }
        ],
        onClick: function (modal, index) {
            if (index === 0 && callbackCancel) callbackCancel($(modal).find('.modal-text-input').val());
            if (index === 1 && callbackOk) callbackOk($(modal).find('.modal-text-input').val());
        }
    });
};
app.modalLogin = function (text, title, callbackOk, callbackCancel) {
    if (typeof title === 'function') {
        callbackCancel = arguments[2];
        callbackOk = arguments[1];
        title = undefined;
    }
    return app.modal({
        text: text || '',
        title: typeof title === 'undefined' ? app.params.modalTitle : title,
        afterText: '<div class="input-field modal-input-double"><input type="text" name="modal-username" placeholder="' + app.params.modalUsernamePlaceholder + '" class="modal-text-input"></div><div class="input-field modal-input-double"><input type="password" name="modal-password" placeholder="' + app.params.modalPasswordPlaceholder + '" class="modal-text-input"></div>',
        buttons: [
            {
                text: app.params.modalButtonCancel
            },
            {
                text: app.params.modalButtonOk,
                bold: true
            }
        ],
        onClick: function (modal, index) {
            var username = $(modal).find('.modal-text-input[name="modal-username"]').val();
            var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
            if (index === 0 && callbackCancel) callbackCancel(username, password);
            if (index === 1 && callbackOk) callbackOk(username, password);
        }
    });
};
app.modalPassword = function (text, title, callbackOk, callbackCancel) {
    if (typeof title === 'function') {
        callbackCancel = arguments[2];
        callbackOk = arguments[1];
        title = undefined;
    }
    return app.modal({
        text: text || '',
        title: typeof title === 'undefined' ? app.params.modalTitle : title,
        afterText: '<div class="input-field"><input type="password" name="modal-password" placeholder="' + app.params.modalPasswordPlaceholder + '" class="modal-text-input"></div>',
        buttons: [
            {
                text: app.params.modalButtonCancel
            },
            {
                text: app.params.modalButtonOk,
                bold: true
            }
        ],
        onClick: function (modal, index) {
            var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
            if (index === 0 && callbackCancel) callbackCancel(password);
            if (index === 1 && callbackOk) callbackOk(password);
        }
    });
};
app.showPreloader = function (title) {
    return app.modal({
        title: title || app.params.modalPreloaderTitle,
        text: '<div class="preloader">' + (app.params.material ? app.params.materialPreloaderHtml : '') + '</div>',
        cssClass: 'modal-preloader'
    });
};
app.hidePreloader = function () {
    app.closeModal('.modal.modal-in');
};
app.showIndicator = function () {
    $('body').append('<div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white">' + (app.params.material ? app.params.materialPreloaderHtml : '') + '</span></div>');
};
app.hideIndicator = function () {
    $('.preloader-indicator-overlay, .preloader-indicator-modal').remove();
};
// Action Sheet
app.actions = function (target, params) {
    var toPopover = false, modal, groupSelector, buttonSelector;
    if (arguments.length === 1) {
        // Actions
        params = target;
    }
    else {
        // Popover
        if (app.device.ios) {
            if (app.device.ipad) toPopover = true;
        }
        else {
            if ($(window).width() >= 768) toPopover = true;
        }
    }
    params = params || [];

    if (params.length > 0 && !$.isArray(params[0])) {
        params = [params];
    }
    var modalHTML;
    if (toPopover) {
        var actionsToPopoverTemplate = app.params.modalActionsToPopoverTemplate ||
            '<div class="popover actions-popover">' +
              '<div class="popover-inner">' +
                '{{#each this}}' +
                '<div class="list-block">' +
                  '<ul>' +
                    '{{#each this}}' +
                    '{{#if label}}' +
                    '<li class="actions-popover-label {{#if color}}color-{{color}}{{/if}} {{#if bold}}actions-popover-bold{{/if}}">{{text}}</li>' +
                    '{{else}}' +
                    '<li><a href="#" class="item-link list-button {{#if color}}color-{{color}}{{/if}} {{#if bg}}bg-{{bg}}{{/if}} {{#if bold}}actions-popover-bold{{/if}} {{#if disabled}}disabled{{/if}}">{{text}}</a></li>' +
                    '{{/if}}' +
                    '{{/each}}' +
                  '</ul>' +
                '</div>' +
                '{{/each}}' +
              '</div>' +
            '</div>';
        if (!app._compiledTemplates.actionsToPopover) {
            app._compiledTemplates.actionsToPopover = t7.compile(actionsToPopoverTemplate);
        }
        var popoverHTML = app._compiledTemplates.actionsToPopover(params);
        modal = $(app.popover(popoverHTML, target, true));
        groupSelector = '.list-block ul';
        buttonSelector = '.list-button';
    }
    else {
        if (app.params.modalActionsTemplate) {
            if (!app._compiledTemplates.actions) app._compiledTemplates.actions = t7.compile(app.params.modalActionsTemplate);
            modalHTML = app._compiledTemplates.actions(params);
        }
        else {
            var buttonsHTML = '';
            for (var i = 0; i < params.length; i++) {
                for (var j = 0; j < params[i].length; j++) {
                    if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
                    var button = params[i][j];
                    var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
                    if (button.bold) buttonClass += ' actions-modal-button-bold';
                    if (button.color) buttonClass += ' color-' + button.color;
                    if (button.bg) buttonClass += ' bg-' + button.bg;
                    if (button.disabled) buttonClass += ' disabled';
                    buttonsHTML += '<div class="' + buttonClass + '">' + button.text + '</div>';
                    if (j === params[i].length - 1) buttonsHTML += '</div>';
                }
            }
            modalHTML = '<div class="actions-modal">' + buttonsHTML + '</div>';
        }
        _modalTemplateTempDiv.innerHTML = modalHTML;
        modal = $(_modalTemplateTempDiv).children();
        $('body').append(modal[0]);
        groupSelector = '.actions-modal-group';
        buttonSelector = '.actions-modal-button';
    }

    var groups = modal.find(groupSelector);
    groups.each(function (index, el) {
        var groupIndex = index;
        $(el).children().each(function (index, el) {
            var buttonIndex = index;
            var buttonParams = params[groupIndex][buttonIndex];
            var clickTarget;
            if (!toPopover && $(el).is(buttonSelector)) clickTarget = $(el);
            if (toPopover && $(el).find(buttonSelector).length > 0) clickTarget = $(el).find(buttonSelector);

            if (clickTarget) {
                clickTarget.on('click', function (e) {
                    if (buttonParams.close !== false) app.closeModal(modal);
                    if (buttonParams.onClick) buttonParams.onClick(modal, e);
                });
            }
        });
    });
    if (!toPopover) app.openModal(modal);
    return modal[0];
};
app.popover = function (modal, target, removeOnClose) {
    if (typeof removeOnClose === 'undefined') removeOnClose = true;
    if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
        var _modal = document.createElement('div');
        _modal.innerHTML = modal.trim();
        if (_modal.childNodes.length > 0) {
            modal = _modal.childNodes[0];
            if (removeOnClose) modal.classList.add('remove-on-close');
            $('body').append(modal);
        }
        else return false; //nothing found
    }
    modal = $(modal);
    target = $(target);
    if (modal.length === 0 || target.length === 0) return false;
    if (modal.parents('body').length === 0) {
        if (removeOnClose) modal.addClass('remove-on-close');
        $('body').append(modal[0]);
    }
    if (modal.find('.popover-angle').length === 0 && !app.params.material) {
        modal.append('<div class="popover-angle"></div>');
    }
    modal.show();

    var material = app.params.material;

    function sizePopover() {
        modal.css({left: '', top: ''});
        var modalWidth =  modal.width();
        var modalHeight =  modal.height(); // 13 - height of angle
        var modalAngle, modalAngleSize = 0, modalAngleLeft, modalAngleTop;
        if (!material) {
            modalAngle = modal.find('.popover-angle');
            modalAngleSize = modalAngle.width() / 2;
            modalAngle.removeClass('on-left on-right on-top on-bottom').css({left: '', top: ''});
        }
        else {
            modal.removeClass('popover-on-left popover-on-right popover-on-top popover-on-bottom').css({left: '', top: ''});
        }

        var targetWidth = target.outerWidth();
        var targetHeight = target.outerHeight();
        var targetOffset = target.offset();
        var targetParentPage = target.parents('.page');
        if (targetParentPage.length > 0) {
            targetOffset.top = targetOffset.top - targetParentPage[0].scrollTop;
        }

        var windowHeight = $(window).height();
        var windowWidth = $(window).width();

        var modalTop = 0;
        var modalLeft = 0;
        var diff = 0;
        // Top Position
        var modalPosition = material ? 'bottom' : 'top';
        if (material) {
            if (modalHeight < windowHeight - targetOffset.top - targetHeight) {
                // On bottom
                modalPosition = 'bottom';
                modalTop = targetOffset.top;
            }
            else if (modalHeight < targetOffset.top) {
                // On top
                modalTop = targetOffset.top - modalHeight + targetHeight;
                modalPosition = 'top';
            }
            else {
                // On middle
                modalPosition = 'bottom';
                modalTop = targetOffset.top;
            }

            if (modalTop <= 0) {
                modalTop = 8;
            }
            else if (modalTop + modalHeight >= windowHeight) {
                modalTop = windowHeight - modalHeight - 8;
            }

            // Horizontal Position
            modalLeft = targetOffset.left;
            if (modalLeft + modalWidth >= windowWidth - 8) {
                modalLeft = targetOffset.left + targetWidth - modalWidth - 8;
            }
            if (modalLeft < 8) {
                modalLeft = 8;
            }
            if (modalPosition === 'top') {
                modal.addClass('popover-on-top');
            }
            if (modalPosition === 'bottom') {
                modal.addClass('popover-on-bottom');
            }
            if (target.hasClass('floating-button-to-popover') && !modal.hasClass('modal-in')) {
                modal.addClass('popover-floating-button');
                var diffX = (modalLeft + modalWidth / 2) - (targetOffset.left + targetWidth / 2),
                    diffY = (modalTop + modalHeight / 2) - (targetOffset.top + targetHeight / 2);
                target
                    .addClass('floating-button-to-popover-in')
                    .transform('translate3d(' + diffX + 'px, ' + diffY + 'px,0)')
                    .transitionEnd(function (e) {
                        if (!target.hasClass('floating-button-to-popover-in')) return;
                        target
                            .addClass('floating-button-to-popover-scale')
                            .transform('translate3d(' + diffX + 'px, ' + diffY + 'px,0) scale(' + (modalWidth/targetWidth) + ', ' + (modalHeight/targetHeight) + ')');
                    });

                modal.once('close', function () {
                    target
                        .removeClass('floating-button-to-popover-in floating-button-to-popover-scale')
                        .addClass('floating-button-to-popover-out')
                        .transform('')
                        .transitionEnd(function (e) {
                            target.removeClass('floating-button-to-popover-out');
                        });
                });
                modal.once('closed', function () {
                    modal.removeClass('popover-floating-button');
                });
            }

        }
        else {
            if ((modalHeight + modalAngleSize) < targetOffset.top) {
                // On top
                modalTop = targetOffset.top - modalHeight - modalAngleSize;
            }
            else if ((modalHeight + modalAngleSize) < windowHeight - targetOffset.top - targetHeight) {
                // On bottom
                modalPosition = 'bottom';
                modalTop = targetOffset.top + targetHeight + modalAngleSize;
            }
            else {
                // On middle
                modalPosition = 'middle';
                modalTop = targetHeight / 2 + targetOffset.top - modalHeight / 2;
                diff = modalTop;
                if (modalTop <= 0) {
                    modalTop = 5;
                }
                else if (modalTop + modalHeight >= windowHeight) {
                    modalTop = windowHeight - modalHeight - 5;
                }
                diff = diff - modalTop;
            }

            // Horizontal Position
            if (modalPosition === 'top' || modalPosition === 'bottom') {
                modalLeft = targetWidth / 2 + targetOffset.left - modalWidth / 2;
                diff = modalLeft;
                if (modalLeft < 5) modalLeft = 5;
                if (modalLeft + modalWidth > windowWidth) modalLeft = windowWidth - modalWidth - 5;
                if (modalPosition === 'top') {
                    modalAngle.addClass('on-bottom');
                }
                if (modalPosition === 'bottom') {
                    modalAngle.addClass('on-top');
                }
                diff = diff - modalLeft;
                modalAngleLeft = (modalWidth / 2 - modalAngleSize + diff);
                modalAngleLeft = Math.max(Math.min(modalAngleLeft, modalWidth - modalAngleSize * 2 - 13), 13);
                modalAngle.css({left: modalAngleLeft + 'px'});

            }
            else if (modalPosition === 'middle') {
                modalLeft = targetOffset.left - modalWidth - modalAngleSize;
                modalAngle.addClass('on-right');
                if (modalLeft < 5 || (modalLeft + modalWidth > windowWidth)) {
                    if (modalLeft < 5) modalLeft = targetOffset.left + targetWidth + modalAngleSize;
                    if (modalLeft + modalWidth > windowWidth) modalLeft = windowWidth - modalWidth - 5;
                    modalAngle.removeClass('on-right').addClass('on-left');
                }
                modalAngleTop = (modalHeight / 2 - modalAngleSize + diff);
                modalAngleTop = Math.max(Math.min(modalAngleTop, modalHeight - modalAngleSize * 2 - 13), 13);
                modalAngle.css({top: modalAngleTop + 'px'});
            }
        }


        // Apply Styles
        modal.css({top: modalTop + 'px', left: modalLeft + 'px'});
    }

    sizePopover();

    $(window).on('resize', sizePopover);

    modal.on('close', function () {
        $(window).off('resize', sizePopover);
    });

    app.openModal(modal);
    return modal[0];
};
app.popup = function (modal, removeOnClose) {
    if (typeof removeOnClose === 'undefined') removeOnClose = true;
    if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
        var _modal = document.createElement('div');
        _modal.innerHTML = modal.trim();
        if (_modal.childNodes.length > 0) {
            modal = _modal.childNodes[0];
            if (removeOnClose) modal.classList.add('remove-on-close');
            $('body').append(modal);
        }
        else return false; //nothing found
    }
    modal = $(modal);
    if (modal.length === 0) return false;
    if (modal.parents('body').length === 0) {
        if (removeOnClose) modal.addClass('remove-on-close');
        $('body').append(modal[0]);
    }
    modal.show();

    app.openModal(modal);
    return modal[0];
};
app.pickerModal = function (modal, removeOnClose) {
    if (typeof removeOnClose === 'undefined') removeOnClose = true;
    if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
        modal = $(modal);
        if (modal.length > 0) {
            if (removeOnClose) modal.addClass('remove-on-close');
            $('body').append(modal[0]);
        }
        else return false; //nothing found
    }
    modal = $(modal);
    if (modal.length === 0) return false;
    if (modal.parents('body').length === 0) {
        if (removeOnClose) modal.addClass('remove-on-close');
        $('body').append(modal[0]);
    }
    if ($('.picker-modal.modal-in:not(.modal-out)').length > 0 && !modal.hasClass('modal-in')) {
        app.closeModal('.picker-modal.modal-in:not(.modal-out)');
    }
    modal.show();
    app.openModal(modal);
    return modal[0];
};
app.loginScreen = function (modal) {
    if (!modal) modal = '.login-screen';
    modal = $(modal);
    if (modal.length === 0) return false;
    if ($('.login-screen.modal-in:not(.modal-out)').length > 0 && !modal.hasClass('modal-in')) {
        app.closeModal('.login-screen.modal-in:not(.modal-out)');
    }
    modal.show();
    
    app.openModal(modal);
    return modal[0];
};
app.openModal = function (modal) {
    modal = $(modal);
    var isModal = modal.hasClass('modal');
    if ($('.modal.modal-in:not(.modal-out)').length && app.params.modalStack && isModal) {
        app.modalStack.push(function () {
            app.openModal(modal);
        });
        return;
    }
    // do nothing if this modal already shown
    if (true === modal.data('f7-modal-shown')) {
        return;
    }
    modal.data('f7-modal-shown', true);
    modal.once('close', function() {
       modal.removeData('f7-modal-shown');
    });
    var isPopover = modal.hasClass('popover');
    var isPopup = modal.hasClass('popup');
    var isLoginScreen = modal.hasClass('login-screen');
    var isPickerModal = modal.hasClass('picker-modal');
    if (isModal) {
        modal.show();
        modal.css({
            marginTop: - Math.round(modal.outerHeight() / 2) + 'px'
        });
    }

    var overlay;
    if (!isLoginScreen && !isPickerModal) {
        if ($('.modal-overlay').length === 0 && !isPopup) {
            $('body').append('<div class="modal-overlay"></div>');
        }
        if ($('.popup-overlay').length === 0 && isPopup) {
            $('body').append('<div class="popup-overlay"></div>');
        }
        overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
    }
    if (app.params.material && isPickerModal) {
        if (modal.hasClass('picker-calendar')) {
            if ($('.picker-modal-overlay').length === 0 && !isPopup) {
                $('body').append('<div class="picker-modal-overlay"></div>');
            }
            overlay = $('.picker-modal-overlay');
        }
    }

    //Make sure that styles are applied, trigger relayout;
    var clientLeft = modal[0].clientLeft;

    // Trugger open event
    modal.trigger('open');

    // Picker modal body class
    if (isPickerModal) {
        $('body').addClass('with-picker-modal');
    }

    // Init Pages and Navbars in modal
    if (modal.find('.' + app.params.viewClass).length > 0) {
        modal.find('.page').each(function () {
            app.initPageWithCallback(this);
        });
        modal.find('.navbar').each(function () {
            app.initNavbarWithCallback(this); 
        });
    }

    // Classes for transition in
    if (!isLoginScreen && !isPickerModal) overlay.addClass('modal-overlay-visible');
    if (app.params.material && isPickerModal && overlay) overlay.addClass('modal-overlay-visible');
    modal.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
        if (modal.hasClass('modal-out')) modal.trigger('closed');
        else modal.trigger('opened');
    });
    return true;
};
app.closeModal = function (modal) {
    modal = $(modal || '.modal-in');
    if (typeof modal !== 'undefined' && modal.length === 0) {
        return;
    }
    var isModal = modal.hasClass('modal');
    var isPopover = modal.hasClass('popover');
    var isPopup = modal.hasClass('popup');
    var isLoginScreen = modal.hasClass('login-screen');
    var isPickerModal = modal.hasClass('picker-modal');

    var removeOnClose = modal.hasClass('remove-on-close');

    var overlay;
    
    if (isPopup) overlay = $('.popup-overlay');
    else {
        if (isPickerModal && app.params.material) overlay = $('.picker-modal-overlay');
        else if (!isPickerModal) overlay = $('.modal-overlay');
    }

    if (isPopup){
        if (modal.length === $('.popup.modal-in').length) {
            overlay.removeClass('modal-overlay-visible');
        }
    }
    else if (overlay && overlay.length > 0) {
        overlay.removeClass('modal-overlay-visible');
    }

    modal.trigger('close');

    // Picker modal body class
    if (isPickerModal) {
        $('body').removeClass('with-picker-modal');
        $('body').addClass('picker-modal-closing');
    }

    if (!(isPopover && !app.params.material)) {
        modal.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else {
                modal.trigger('opened');
                if (isPopover) return;
            }

            if (isPickerModal) {
                $('body').removeClass('picker-modal-closing');
            }
            if (isPopup || isLoginScreen || isPickerModal || isPopover) {
                modal.removeClass('modal-out').hide();
                if (removeOnClose && modal.length > 0) {
                    modal.remove();
                }
            }
            else {
                modal.remove();
            }
        });
        if (isModal && app.params.modalStack) {
            app.modalStackClearQueue();
        }
    }
    else {
        modal.removeClass('modal-in modal-out').trigger('closed').hide();
        if (removeOnClose) {
            modal.remove();
        }
    }
    return true;
};

/*======================================================
************   Panels   ************
======================================================*/
app.allowPanelOpen = true;
app.openPanel = function (panelPosition) {
    if (!app.allowPanelOpen) return false;
    var panel = $('.panel-' + panelPosition);
    if (panel.length === 0 || panel.hasClass('active')) return false;
    app.closePanel(); // Close if some panel is opened
    app.allowPanelOpen = false;
    var effect = panel.hasClass('panel-reveal') ? 'reveal' : 'cover';
    panel.css({display: 'block'}).addClass('active');
    panel.trigger('open');
    if (app.params.material) {
        $('.panel-overlay').show();
    }
    if (panel.find('.' + app.params.viewClass).length > 0) {
        if (app.sizeNavbars) app.sizeNavbars(panel.find('.' + app.params.viewClass)[0]);
    }

    // Trigger reLayout
    var clientLeft = panel[0].clientLeft;
    
    // Transition End;
    var transitionEndTarget = effect === 'reveal' ? $('.' + app.params.viewsClass) : panel;
    var openedTriggered = false;
    
    function panelTransitionEnd() {
        transitionEndTarget.transitionEnd(function (e) {
            if ($(e.target).is(transitionEndTarget)) {
                if (panel.hasClass('active')) {
                    panel.trigger('opened');
                }
                else {
                    panel.trigger('closed');
                }
                if (app.params.material) $('.panel-overlay').css({display: ''});
                app.allowPanelOpen = true;
            }
            else panelTransitionEnd();
        });
    }
    panelTransitionEnd();

    $('body').addClass('with-panel-' + panelPosition + '-' + effect);
    return true;
};
app.closePanel = function () {
    var activePanel = $('.panel.active');
    if (activePanel.length === 0) return false;
    var effect = activePanel.hasClass('panel-reveal') ? 'reveal' : 'cover';
    var panelPosition = activePanel.hasClass('panel-left') ? 'left' : 'right';
    activePanel.removeClass('active');
    var transitionEndTarget = effect === 'reveal' ? $('.' + app.params.viewsClass) : activePanel;
    activePanel.trigger('close');
    app.allowPanelOpen = false;

    transitionEndTarget.transitionEnd(function () {
        if (activePanel.hasClass('active')) return;
        activePanel.css({display: ''});
        activePanel.trigger('closed');
        $('body').removeClass('panel-closing');
        app.allowPanelOpen = true;
    });

    $('body').addClass('panel-closing').removeClass('with-panel-' + panelPosition + '-' + effect);
};
/*======================================================
************   Swipe panels   ************
======================================================*/
app.initSwipePanels = function () {
    var panel, side;
    if (app.params.swipePanel) {
        panel = $('.panel.panel-' + app.params.swipePanel);
        side = app.params.swipePanel;
        if (panel.length === 0) return;
    }
    else {
        if (app.params.swipePanelOnlyClose) {
            if ($('.panel').length === 0) return;
        }
        else return;
    }
    
    var panelOverlay = $('.panel-overlay');
    var isTouched, isMoved, isScrolling, touchesStart = {}, touchStartTime, touchesDiff, translate, overlayOpacity, opened, panelWidth, effect, direction;
    var views = $('.' + app.params.viewsClass);

    function handleTouchStart(e) {
        if (!app.allowPanelOpen || (!app.params.swipePanel && !app.params.swipePanelOnlyClose) || isTouched) return;
        if ($('.modal-in, .photo-browser-in').length > 0) return;
        if (!(app.params.swipePanelCloseOpposite || app.params.swipePanelOnlyClose)) {
            if ($('.panel.active').length > 0 && !panel.hasClass('active')) return;
        }
        touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
        touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
        if (app.params.swipePanelCloseOpposite || app.params.swipePanelOnlyClose) {
            if ($('.panel.active').length > 0) {
                side = $('.panel.active').hasClass('panel-left') ? 'left' : 'right';
            }
            else {
                if (app.params.swipePanelOnlyClose) return;
                side = app.params.swipePanel;
            }
            if (!side) return;
        }
        panel = $('.panel.panel-' + side);
        opened = panel.hasClass('active');
        if (app.params.swipePanelActiveArea && !opened) {
            if (side === 'left') {
                if (touchesStart.x > app.params.swipePanelActiveArea) return;
            }
            if (side === 'right') {
                if (touchesStart.x < window.innerWidth - app.params.swipePanelActiveArea) return;
            }
        }
        isMoved = false;
        isTouched = true;
        isScrolling = undefined;
        
        touchStartTime = (new Date()).getTime();
        direction = undefined;
    }
    function handleTouchMove(e) {
        if (!isTouched) return;
        if (e.f7PreventPanelSwipe) return;
        var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
        var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
        if (typeof isScrolling === 'undefined') {
            isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
        }
        if (isScrolling) {
            isTouched = false;
            return;
        }
        if (!direction) {
            if (pageX > touchesStart.x) {
                direction = 'to-right';
            }
            else {
                direction = 'to-left';
            }

            if (
                side === 'left' &&
                (
                    direction === 'to-left' && !panel.hasClass('active')
                ) ||
                side === 'right' &&
                (
                    direction === 'to-right' && !panel.hasClass('active')
                )
            )
            {
                isTouched = false;
                return;
            }
        }

        if (app.params.swipePanelNoFollow) {
            var timeDiff = (new Date()).getTime() - touchStartTime;
            if (timeDiff < 300) {
                if (direction === 'to-left') {
                    if (side === 'right') app.openPanel(side);
                    if (side === 'left' && panel.hasClass('active')) app.closePanel();
                }
                if (direction === 'to-right') {
                    if (side === 'left') app.openPanel(side);
                    if (side === 'right' && panel.hasClass('active')) app.closePanel();
                }
            }
            isTouched = false;
            isMoved = false;
            return;
        }

        if (!isMoved) {
            effect = panel.hasClass('panel-cover') ? 'cover' : 'reveal';
            if (!opened) {
                panel.show();
                panelOverlay.show();
            }
            panelWidth = panel[0].offsetWidth;
            panel.transition(0);
            if (panel.find('.' + app.params.viewClass).length > 0) {
                if (app.sizeNavbars) app.sizeNavbars(panel.find('.' + app.params.viewClass)[0]);
            }
        }

        isMoved = true;

        e.preventDefault();
        var threshold = opened ? 0 : -app.params.swipePanelThreshold;
        if (side === 'right') threshold = -threshold;
        
        touchesDiff = pageX - touchesStart.x + threshold;

        if (side === 'right') {
            translate = touchesDiff  - (opened ? panelWidth : 0);
            if (translate > 0) translate = 0;
            if (translate < -panelWidth) {
                translate = -panelWidth;
            }
        }
        else {
            translate = touchesDiff  + (opened ? panelWidth : 0);
            if (translate < 0) translate = 0;
            if (translate > panelWidth) {
                translate = panelWidth;
            }
        }
        if (effect === 'reveal') {
            views.transform('translate3d(' + translate + 'px,0,0)').transition(0);
            panelOverlay.transform('translate3d(' + translate + 'px,0,0)').transition(0);
            
            app.pluginHook('swipePanelSetTransform', views[0], panel[0], Math.abs(translate / panelWidth));
        }
        else {
            panel.transform('translate3d(' + translate + 'px,0,0)').transition(0);
            if (app.params.material) {
                panelOverlay.transition(0);
                overlayOpacity = Math.abs(translate/panelWidth);
                panelOverlay.css({opacity: overlayOpacity});
            }
            app.pluginHook('swipePanelSetTransform', views[0], panel[0], Math.abs(translate / panelWidth));
        }
    }
    function handleTouchEnd(e) {
        if (!isTouched || !isMoved) {
            isTouched = false;
            isMoved = false;
            return;
        }
        isTouched = false;
        isMoved = false;
        var timeDiff = (new Date()).getTime() - touchStartTime;
        var action;
        var edge = (translate === 0 || Math.abs(translate) === panelWidth);

        if (!opened) {
            if (translate === 0) {
                action = 'reset';
            }
            else if (
                timeDiff < 300 && Math.abs(translate) > 0 ||
                timeDiff >= 300 && (Math.abs(translate) >= panelWidth / 2)
            ) {
                action = 'swap';
            }
            else {
                action = 'reset';
            }
        }
        else {
            if (translate === -panelWidth) {
                action = 'reset';
            }
            else if (
                timeDiff < 300 && Math.abs(translate) >= 0 ||
                timeDiff >= 300 && (Math.abs(translate) <= panelWidth / 2)
            ) {
                if (side === 'left' && translate === panelWidth) action = 'reset';
                else action = 'swap';
            }
            else {
                action = 'reset';
            }
        }
        if (action === 'swap') {
            app.allowPanelOpen = true;
            if (opened) {
                app.closePanel();
                if (edge) {
                    panel.css({display: ''});
                    $('body').removeClass('panel-closing');
                }
            }
            else {
                app.openPanel(side);
            }
            if (edge) app.allowPanelOpen = true;
        }
        if (action === 'reset') {
            if (opened) {
                app.allowPanelOpen = true;
                app.openPanel(side);
            }
            else {
                app.closePanel();
                if (edge) {
                    app.allowPanelOpen = true;
                    panel.css({display: ''});
                }
                else {
                    var target = effect === 'reveal' ? views : panel;
                    panel.trigger('close');
                    $('body').addClass('panel-closing');
                    target.transitionEnd(function () {
                        panel.trigger('closed');
                        panel.css({display: ''});
                        $('body').removeClass('panel-closing');
                        app.allowPanelOpen = true;
                    });
                }
            }
        }
        if (effect === 'reveal') {
            views.transition('');
            views.transform('');
        }
        panel.transition('').transform('');
        panelOverlay.css({display: ''}).transform('').transition('').css('opacity', '');
    }
    $(document).on(app.touchEvents.start, handleTouchStart);
    $(document).on(app.touchEvents.move, handleTouchMove);
    $(document).on(app.touchEvents.end, handleTouchEnd);
};

/*======================================================
************   Pull To Refresh   ************
======================================================*/
app.initPullToRefresh = function (pageContainer) {
    var eventsTarget = $(pageContainer);
    if (!eventsTarget.hasClass('pull-to-refresh-content')) {
        eventsTarget = eventsTarget.find('.pull-to-refresh-content');
    }
    if (!eventsTarget || eventsTarget.length === 0) return;

    var touchId, isTouched, isMoved, touchesStart = {}, isScrolling, touchesDiff, touchStartTime, container, refresh = false, useTranslate = false, startTranslate = 0, translate, scrollTop, wasScrolled, layer, triggerDistance, dynamicTriggerDistance, pullStarted;
    var page = eventsTarget.hasClass('page') ? eventsTarget : eventsTarget.parents('.page');
    var hasNavbar = false;
    if (page.find('.navbar').length > 0 || page.parents('.navbar-fixed, .navbar-through').length > 0 || page.hasClass('navbar-fixed') || page.hasClass('navbar-through')) hasNavbar = true;
    if (page.hasClass('no-navbar')) hasNavbar = false;
    if (!hasNavbar) eventsTarget.addClass('pull-to-refresh-no-navbar');

    container = eventsTarget;

    // Define trigger distance
    if (container.attr('data-ptr-distance')) {
        dynamicTriggerDistance = true;
    }
    else {
        triggerDistance = 44;   
    }
    
    function handleTouchStart(e) {
        if (isTouched) {
            if (app.device.os === 'android') {
                if ('targetTouches' in e && e.targetTouches.length > 1) return;
            }
            else return;
        }
        
        /*jshint validthis:true */
        container = $(this);
        if (container.hasClass('refreshing')) {
            return;
        }
        
        isMoved = false;
        pullStarted = false;
        isTouched = true;
        isScrolling = undefined;
        wasScrolled = undefined;
        if (e.type === 'touchstart') touchId = e.targetTouches[0].identifier;
        touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
        touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
        touchStartTime = (new Date()).getTime();
        
    }
    
    function handleTouchMove(e) {
        if (!isTouched) return;
        var pageX, pageY, touch;
        if (e.type === 'touchmove') {
            if (touchId && e.touches) {
                for (var i = 0; i < e.touches.length; i++) {
                    if (e.touches[i].identifier === touchId) {
                        touch = e.touches[i];
                    }
                }
            }
            if (!touch) touch = e.targetTouches[0];
            pageX = touch.pageX;
            pageY = touch.pageY;
        }
        else {
            pageX = e.pageX;
            pageY = e.pageY;
        }
        if (!pageX || !pageY) return;
            

        if (typeof isScrolling === 'undefined') {
            isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
        }
        if (!isScrolling) {
            isTouched = false;
            return;
        }

        scrollTop = container[0].scrollTop;
        if (typeof wasScrolled === 'undefined' && scrollTop !== 0) wasScrolled = true; 

        if (!isMoved) {
            /*jshint validthis:true */
            container.removeClass('transitioning');
            if (scrollTop > container[0].offsetHeight) {
                isTouched = false;
                return;
            }
            if (dynamicTriggerDistance) {
                triggerDistance = container.attr('data-ptr-distance');
                if (triggerDistance.indexOf('%') >= 0) triggerDistance = container[0].offsetHeight * parseInt(triggerDistance, 10) / 100;
            }
            startTranslate = container.hasClass('refreshing') ? triggerDistance : 0;
            if (container[0].scrollHeight === container[0].offsetHeight || app.device.os !== 'ios') {
                useTranslate = true;
            }
            else {
                useTranslate = false;
            }
        }
        isMoved = true;
        touchesDiff = pageY - touchesStart.y;
        
        if (touchesDiff > 0 && scrollTop <= 0 || scrollTop < 0) {
            // iOS 8 fix
            if (app.device.os === 'ios' && parseInt(app.device.osVersion.split('.')[0], 10) > 7 && scrollTop === 0 && !wasScrolled) useTranslate = true;

            if (useTranslate) {
                e.preventDefault();
                translate = (Math.pow(touchesDiff, 0.85) + startTranslate);
                container.transform('translate3d(0,' + translate + 'px,0)');
            }
            if ((useTranslate && Math.pow(touchesDiff, 0.85) > triggerDistance) || (!useTranslate && touchesDiff >= triggerDistance * 2)) {
                refresh = true;
                container.addClass('pull-up').removeClass('pull-down');
            }
            else {
                refresh = false;
                container.removeClass('pull-up').addClass('pull-down');
            }
            if (!pullStarted) {
                container.trigger('pullstart');
                pullStarted = true;
            }
            container.trigger('pullmove', {
                event: e,
                scrollTop: scrollTop,
                translate: translate,
                touchesDiff: touchesDiff
            });
        }
        else {
            pullStarted = false;
            container.removeClass('pull-up pull-down');
            refresh = false;
            return;
        }
    }
    function handleTouchEnd(e) {
        if (e.type === 'touchend' && e.changedTouches && e.changedTouches.length > 0 && touchId) {
            if (e.changedTouches[0].identifier !== touchId) return;
        }
        if (!isTouched || !isMoved) {
            isTouched = false;
            isMoved = false;
            return;
        }
        if (translate) {
            container.addClass('transitioning');
            translate = 0;
        }
        container.transform('');
        if (refresh) {
            container.addClass('refreshing');
            container.trigger('refresh', {
                done: function () {
                    app.pullToRefreshDone(container);
                }
            });
        }
        else {
            container.removeClass('pull-down');
        }
        isTouched = false;
        isMoved = false;
        if (pullStarted) container.trigger('pullend');
    }

    // Attach Events
    eventsTarget.on(app.touchEvents.start, handleTouchStart);
    eventsTarget.on(app.touchEvents.move, handleTouchMove);
    eventsTarget.on(app.touchEvents.end, handleTouchEnd);

    // Detach Events on page remove
    if (page.length === 0) return;
    function destroyPullToRefresh() {
        eventsTarget.off(app.touchEvents.start, handleTouchStart);
        eventsTarget.off(app.touchEvents.move, handleTouchMove);
        eventsTarget.off(app.touchEvents.end, handleTouchEnd);
    }
    eventsTarget[0].f7DestroyPullToRefresh = destroyPullToRefresh;
    function detachEvents() {
        destroyPullToRefresh();
        page.off('pageBeforeRemove', detachEvents);
    }
    page.on('pageBeforeRemove', detachEvents);

};

app.pullToRefreshDone = function (container) {
    container = $(container);
    if (container.length === 0) container = $('.pull-to-refresh-content.refreshing');
    container.removeClass('refreshing').addClass('transitioning');
    container.transitionEnd(function () {
        container.removeClass('transitioning pull-up pull-down');
        container.trigger('refreshdone');
    });
};
app.pullToRefreshTrigger = function (container) {
    container = $(container);
    if (container.length === 0) container = $('.pull-to-refresh-content');
    if (container.hasClass('refreshing')) return;
    container.addClass('transitioning refreshing');
    container.trigger('refresh', {
        done: function () {
            app.pullToRefreshDone(container);
        }
    });
};

app.destroyPullToRefresh = function (pageContainer) {
    pageContainer = $(pageContainer);
    var pullToRefreshContent = pageContainer.hasClass('pull-to-refresh-content') ? pageContainer : pageContainer.find('.pull-to-refresh-content');
    if (pullToRefreshContent.length === 0) return;
    if (pullToRefreshContent[0].f7DestroyPullToRefresh) pullToRefreshContent[0].f7DestroyPullToRefresh();
};

/* ===============================================================================
************   Infinite Scroll   ************
=============================================================================== */
function handleInfiniteScroll() {
    /*jshint validthis:true */
    var inf = $(this);
    var scrollTop = inf[0].scrollTop;
    var scrollHeight = inf[0].scrollHeight;
    var height = inf[0].offsetHeight;
    var distance = inf[0].getAttribute('data-distance');
    var virtualListContainer = inf.find('.virtual-list');
    var virtualList;
    var onTop = inf.hasClass('infinite-scroll-top');
    if (!distance) distance = 50;
    if (typeof distance === 'string' && distance.indexOf('%') >= 0) {
        distance = parseInt(distance, 10) / 100 * height;
    }
    if (distance > height) distance = height;
    if (onTop) {
        if (scrollTop < distance) {
            inf.trigger('infinite');
        }
    }
    else {
        if (scrollTop + height >= scrollHeight - distance) {
            if (virtualListContainer.length > 0) {
                virtualList = virtualListContainer[0].f7VirtualList;
                if (virtualList && !virtualList.reachEnd) return;
            }
            inf.trigger('infinite');
        }
    }

}
app.attachInfiniteScroll = function (infiniteContent) {
    $(infiniteContent).on('scroll', handleInfiniteScroll);
};
app.detachInfiniteScroll = function (infiniteContent) {
    $(infiniteContent).off('scroll', handleInfiniteScroll);
};

app.initPageInfiniteScroll = function (pageContainer) {
    pageContainer = $(pageContainer);
    var infiniteContent = pageContainer.find('.infinite-scroll');
    if (infiniteContent.length === 0) return;
    app.attachInfiniteScroll(infiniteContent);
    function detachEvents() {
        app.detachInfiniteScroll(infiniteContent);
        pageContainer.off('pageBeforeRemove', detachEvents);
    }
    pageContainer.on('pageBeforeRemove', detachEvents);
};
/*=============================================================
************   Hide/show Toolbar/Navbar on scroll   ************
=============================================================*/
app.initPageScrollToolbars = function (pageContainer) {
    pageContainer = $(pageContainer);
    var scrollContent = pageContainer.find('.page-content');
    if (scrollContent.length === 0) return;
    var hideNavbar = (app.params.hideNavbarOnPageScroll || scrollContent.hasClass('hide-navbar-on-scroll') || scrollContent.hasClass('hide-bars-on-scroll')) && !(scrollContent.hasClass('keep-navbar-on-scroll') || scrollContent.hasClass('keep-bars-on-scroll'));
    var hideToolbar = (app.params.hideToolbarOnPageScroll || scrollContent.hasClass('hide-toolbar-on-scroll') || scrollContent.hasClass('hide-bars-on-scroll')) && !(scrollContent.hasClass('keep-toolbar-on-scroll') || scrollContent.hasClass('keep-bars-on-scroll'));
    var hideTabbar = (app.params.hideTabbarOnPageScroll || scrollContent.hasClass('hide-tabbar-on-scroll')) && !(scrollContent.hasClass('keep-tabbar-on-scroll'));

    if (!(hideNavbar || hideToolbar || hideTabbar)) return;
    
    var viewContainer = scrollContent.parents('.' + app.params.viewClass);
    if (viewContainer.length === 0) return;

    var navbar = viewContainer.find('.navbar'), 
        toolbar = viewContainer.find('.toolbar'), 
        tabbar;
    if (hideTabbar) {
        tabbar = viewContainer.find('.tabbar');
        if (tabbar.length === 0) tabbar = viewContainer.parents('.' + app.params.viewsClass).find('.tabbar');
    }

    var hasNavbar = navbar.length > 0,
        hasToolbar = toolbar.length > 0,
        hasTabbar = tabbar && tabbar.length > 0;

    var previousScroll, currentScroll;
        previousScroll = currentScroll = scrollContent[0].scrollTop;

    var scrollHeight, offsetHeight, reachEnd, action, navbarHidden, toolbarHidden, tabbarHidden;

    var toolbarHeight = (hasToolbar && hideToolbar) ? toolbar[0].offsetHeight : 0;
    var tabbarHeight = (hasTabbar && hideTabbar) ? tabbar[0].offsetHeight : 0;
    var bottomBarHeight = tabbarHeight || toolbarHeight;

    function handleScroll(e) {
        if (pageContainer.hasClass('page-on-left')) return;
        currentScroll = scrollContent[0].scrollTop;
        scrollHeight = scrollContent[0].scrollHeight;
        offsetHeight = scrollContent[0].offsetHeight;
        reachEnd =  currentScroll + offsetHeight >= scrollHeight - bottomBarHeight;
        navbarHidden = navbar.hasClass('navbar-hidden');
        toolbarHidden = toolbar.hasClass('toolbar-hidden');
        tabbarHidden = tabbar && tabbar.hasClass('toolbar-hidden');

        if (reachEnd) {
            if (app.params.showBarsOnPageScrollEnd) {
                action = 'show';
            }
        }
        else if (previousScroll > currentScroll) {
            if (app.params.showBarsOnPageScrollTop || currentScroll <= 44) {
                action = 'show';
            }
            else {
                action = 'hide';
            }
        }
        else {
            if (currentScroll > 44) {
                action = 'hide';
            }
            else {
                action = 'show';
            }
        }

        if (action === 'show') {
            if (hasNavbar && hideNavbar && navbarHidden) {
                app.showNavbar(navbar);
                pageContainer.removeClass('no-navbar-by-scroll'); 
                navbarHidden = false;
            }
            if (hasToolbar && hideToolbar && toolbarHidden) {
                app.showToolbar(toolbar);
                pageContainer.removeClass('no-toolbar-by-scroll'); 
                toolbarHidden = false;
            }
            if (hasTabbar && hideTabbar && tabbarHidden) {
                app.showToolbar(tabbar);
                pageContainer.removeClass('no-tabbar-by-scroll'); 
                tabbarHidden = false;
            }
        }
        else {
            if (hasNavbar && hideNavbar && !navbarHidden) {
                app.hideNavbar(navbar);
                pageContainer.addClass('no-navbar-by-scroll'); 
                navbarHidden = true;
            }
            if (hasToolbar && hideToolbar && !toolbarHidden) {
                app.hideToolbar(toolbar);
                pageContainer.addClass('no-toolbar-by-scroll'); 
                toolbarHidden = true;
            }
            if (hasTabbar && hideTabbar && !tabbarHidden) {
                app.hideToolbar(tabbar);
                pageContainer.addClass('no-tabbar-by-scroll'); 
                tabbarHidden = true;
            }
        }
            
        previousScroll = currentScroll;
    }
    scrollContent.on('scroll', handleScroll);
    scrollContent[0].f7ScrollToolbarsHandler = handleScroll;
};
app.destroyScrollToolbars = function (pageContainer) {
    pageContainer = $(pageContainer);
    var scrollContent = pageContainer.find('.page-content');
    if (scrollContent.length === 0) return;
    var handler = scrollContent[0].f7ScrollToolbarsHandler;
    if (!handler) return;
    scrollContent.off('scroll', scrollContent[0].f7ScrollToolbarsHandler);
};
/* ===============================================================================
************   Tabs   ************
=============================================================================== */
app.showTab = function (tab, tabLink, force) {
    var newTab = $(tab);
    if (arguments.length === 2) {
        if (typeof tabLink === 'boolean') {
            force = tabLink;
        }
    }
    if (newTab.length === 0) return false;
    if (newTab.hasClass('active')) {
        if (force) newTab.trigger('show');
        return false;
    }
    var tabs = newTab.parent('.tabs');
    if (tabs.length === 0) return false;

    // Return swipeouts in hidden tabs
    app.allowSwipeout = true;

    // Animated tabs
    var isAnimatedTabs = tabs.parent().hasClass('tabs-animated-wrap');
    if (isAnimatedTabs) {
        var tabTranslate = (app.rtl ? newTab.index() : -newTab.index()) * 100;
        tabs.transform('translate3d(' + tabTranslate + '%,0,0)');
    }

    // Swipeable tabs
    var isSwipeableTabs = tabs.parent().hasClass('tabs-swipeable-wrap'), swiper;
    if (isSwipeableTabs) {
        swiper = tabs.parent()[0].swiper;
        if (swiper.activeIndex !== newTab.index()) swiper.slideTo(newTab.index(), undefined, false);
    }

    // Remove active class from old tabs
    var oldTab = tabs.children('.tab.active').removeClass('active');
    // Add active class to new tab
    newTab.addClass('active');
    // Trigger 'show' event on new tab
    newTab.trigger('show');

    // Update navbars in new tab
    if (!isAnimatedTabs && !isSwipeableTabs && newTab.find('.navbar').length > 0) {
        // Find tab's view
        var viewContainer;
        if (newTab.hasClass(app.params.viewClass)) viewContainer = newTab[0];
        else viewContainer = newTab.parents('.' + app.params.viewClass)[0];
        app.sizeNavbars(viewContainer);
    }

    // Find related link for new tab
    if (tabLink) tabLink = $(tabLink);
    else {
        // Search by id
        if (typeof tab === 'string') tabLink = $('.tab-link[href="' + tab + '"]');
        else tabLink = $('.tab-link[href="#' + newTab.attr('id') + '"]');
        // Search by data-tab
        if (!tabLink || tabLink && tabLink.length === 0) {
            $('[data-tab]').each(function () {
                if (newTab.is($(this).attr('data-tab'))) tabLink = $(this);
            });
        }
    }
    if (tabLink.length === 0) return;

    // Find related link for old tab
    var oldTabLink;
    if (oldTab && oldTab.length > 0) {
        // Search by id
        var oldTabId = oldTab.attr('id');
        if (oldTabId) oldTabLink = $('.tab-link[href="#' + oldTabId + '"]');
        // Search by data-tab
        if (!oldTabLink || oldTabLink && oldTabLink.length === 0) {
            $('[data-tab]').each(function () {
                if (oldTab.is($(this).attr('data-tab'))) oldTabLink = $(this);
            });
        }
    }

    // Update links' classes
    if (tabLink && tabLink.length > 0) {
        tabLink.addClass('active');
        // Material Highlight
        if (app.params.material) {
            var tabbar = tabLink.parents('.tabbar');
            if (tabbar.length > 0) {
                if (tabbar.find('.tab-link-highlight').length === 0) {
                    tabbar.find('.toolbar-inner').append('<span class="tab-link-highlight"></span>');
                }
                app.materialTabbarSetHighlight(tabbar, tabLink);
            }
        }
    }
    if (oldTabLink && oldTabLink.length > 0) oldTabLink.removeClass('active');

    return true;
};
/*===============================================================================
************   Fast Clicks   ************
************   Inspired by https://github.com/ftlabs/fastclick   ************
===============================================================================*/
app.initFastClicks = function () {
    if (app.params.activeState) {
        $('html').addClass('watch-active-state');
    }
    if (app.device.ios && app.device.webView) {
        // Strange hack required for iOS 8 webview to work on inputs
        window.addEventListener('touchstart', function () {});
    }

    var touchStartX, touchStartY, touchStartTime, targetElement, trackClick, activeSelection, scrollParent, lastClickTime, isMoved, tapHoldFired, tapHoldTimeout;
    var activableElement, activeTimeout, needsFastClick, needsFastClickTimeOut;
    var rippleWave, rippleTarget, rippleTransform, rippleTimeout;
    function findActivableElement(el) {
        var target = $(el);
        var parents = target.parents(app.params.activeStateElements);
        var activable;
        if (target.is(app.params.activeStateElements)) {
            activable = target;
        }
        if (parents.length > 0) {
            activable = activable ? activable.add(parents) : parents;
        }
        return activable ? activable : target;
    }
    function isInsideScrollableView(el) {
        var pageContent = el.parents('.page-content, .panel');

        if (pageContent.length === 0) {
            return false;
        }

        // This event handler covers the "tap to stop scrolling".
        if (pageContent.prop('scrollHandlerSet') !== 'yes') {
            pageContent.on('scroll', function() {
              clearTimeout(activeTimeout);
              clearTimeout(rippleTimeout);
            });
            pageContent.prop('scrollHandlerSet', 'yes');
        }

        return true;
    }
    function addActive() {
        if (!activableElement) return;
        activableElement.addClass('active-state');
    }
    function removeActive(el) {
        if (!activableElement) return;
        activableElement.removeClass('active-state');
        activableElement = null;
    }
    function isFormElement(el) {
        var nodes = ('input select textarea label').split(' ');
        if (el.nodeName && nodes.indexOf(el.nodeName.toLowerCase()) >= 0) return true;
        return false;
    }
    function androidNeedsBlur(el) {
        var noBlur = ('button input textarea select').split(' ');
        if (document.activeElement && el !== document.activeElement && document.activeElement !== document.body) {
            if (noBlur.indexOf(el.nodeName.toLowerCase()) >= 0) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
    function targetNeedsFastClick(el) {
        var $el = $(el);
        if (el.nodeName.toLowerCase() === 'input' && el.type === 'file') return false;
        if ($el.hasClass('no-fastclick') || $el.parents('.no-fastclick').length > 0) return false;
        return true;
    }
    function targetNeedsFocus(el) {
        if (document.activeElement === el) {
            return false;
        }
        var tag = el.nodeName.toLowerCase();
        var skipInputs = ('button checkbox file image radio submit').split(' ');
        if (el.disabled || el.readOnly) return false;
        if (tag === 'textarea') return true;
        if (tag === 'select') {
            if (app.device.android) return false;
            else return true;
        }
        if (tag === 'input' && skipInputs.indexOf(el.type) < 0) return true;
    }
    function targetNeedsPrevent(el) {
        el = $(el);
        var prevent = true;
        if (el.is('label') || el.parents('label').length > 0) {
            if (app.device.android) {
                prevent = false;
            }
            else if (app.device.ios && el.is('input')) {
                prevent = true;
            }
            else prevent = false;
        }
        return prevent;
    }

    // Mouse Handlers
    function handleMouseDown (e) {
        findActivableElement(e.target).addClass('active-state');
        if ('which' in e && e.which === 3) {
            setTimeout(function () {
                $('.active-state').removeClass('active-state');
            }, 0);
        }
        if (app.params.material && app.params.materialRipple) {
            touchStartX = e.pageX;
            touchStartY = e.pageY;
            rippleTouchStart(e.target, e.pageX, e.pageY);
        }
    }
    function handleMouseMove (e) {
        $('.active-state').removeClass('active-state');
        if (app.params.material && app.params.materialRipple) {
            rippleTouchMove();
        }
    }
    function handleMouseUp (e) {
        $('.active-state').removeClass('active-state');
        if (app.params.material && app.params.materialRipple) {
            rippleTouchEnd();
        }
    }

    // Material Touch Ripple Effect
    function findRippleElement(el) {
        var needsRipple = app.params.materialRippleElements;
        var $el = $(el);
        if ($el.is(needsRipple)) {
            if ($el.hasClass('no-ripple')) {
                return false;
            }
            return $el;
        }
        else if ($el.parents(needsRipple).length > 0) {
            var rippleParent = $el.parents(needsRipple).eq(0);
            if (rippleParent.hasClass('no-ripple')) {
                return false;
            }
            return rippleParent;
        }
        else return false;
    }
    function createRipple(x, y, el) {
        var box = el[0].getBoundingClientRect();
        var center = {
            x: x - box.left,
            y: y - box.top
        },
            height = box.height,
            width = box.width;
        var diameter = Math.max(Math.pow((Math.pow(height, 2) + Math.pow(width, 2)), 0.5), 48);

        rippleWave = $(
            '<div class="ripple-wave" style="width: ' + diameter + 'px; height: '+diameter+'px; margin-top:-'+diameter/2+'px; margin-left:-'+diameter/2+'px; left:'+center.x+'px; top:'+center.y+'px;"></div>'
        );
        el.prepend(rippleWave);
        var clientLeft = rippleWave[0].clientLeft;
        rippleTransform = 'translate3d('+(-center.x + width/2)+'px, '+(-center.y + height/2)+'px, 0) scale(1)';
        rippleWave.transform(rippleTransform);
    }

    function removeRipple() {
        if (!rippleWave) return;
        var toRemove = rippleWave;

        var removeTimeout = setTimeout(function () {
            toRemove.remove();
        }, 400);

        rippleWave
            .addClass('ripple-wave-fill')
            .transform(rippleTransform.replace('scale(1)', 'scale(1.01)'))
            .transitionEnd(function () {
                clearTimeout(removeTimeout);

                var rippleWave = $(this)
                    .addClass('ripple-wave-out')
                    .transform(rippleTransform.replace('scale(1)', 'scale(1.01)'));

                removeTimeout = setTimeout(function () {
                    rippleWave.remove();
                }, 700);

                setTimeout(function () {
                    rippleWave.transitionEnd(function(){
                        clearTimeout(removeTimeout);
                        $(this).remove();
                    });
                }, 0);
            });

        rippleWave = rippleTarget = undefined;
    }

    function rippleTouchStart (el, x, y) {
        rippleTarget = findRippleElement(el);
        if (!rippleTarget || rippleTarget.length === 0) {
            rippleTarget = undefined;
            return;
        }
        if (!isInsideScrollableView(rippleTarget)) {
            createRipple(touchStartX, touchStartY, rippleTarget);
        }
        else {
            rippleTimeout = setTimeout(function () {
                createRipple(touchStartX, touchStartY, rippleTarget);
            }, 80);
        }
    }
    function rippleTouchMove() {
        clearTimeout(rippleTimeout);
        removeRipple();
    }
    function rippleTouchEnd() {
        if (rippleWave) {
            removeRipple();
        }
        else if (rippleTarget && !isMoved) {
            clearTimeout(rippleTimeout);
            createRipple(touchStartX, touchStartY, rippleTarget);
            setTimeout(removeRipple, 0);
        }
        else {
            removeRipple();
        }
    }

    // Send Click
    function sendClick(e) {
        var touch = e.changedTouches[0];
        var evt = document.createEvent('MouseEvents');
        var eventType = 'click';
        if (app.device.android && targetElement.nodeName.toLowerCase() === 'select') {
            eventType = 'mousedown';
        }
        evt.initMouseEvent(eventType, true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        evt.forwardedTouchEvent = true;
        targetElement.dispatchEvent(evt);
    }

    // Touch Handlers
    function handleTouchStart(e) {
        isMoved = false;
        tapHoldFired = false;
        if (e.targetTouches.length > 1) {
            if (activableElement) removeActive();
            return true;
        }
        if (e.touches.length > 1 && activableElement) {
            removeActive();
        }
        if (app.params.tapHold) {
            if (tapHoldTimeout) clearTimeout(tapHoldTimeout);
            tapHoldTimeout = setTimeout(function () {
                if (e && e.touches && e.touches.length > 1) return;
                tapHoldFired = true;
                e.preventDefault();
                $(e.target).trigger('taphold');
            }, app.params.tapHoldDelay);
        }
        if (needsFastClickTimeOut) clearTimeout(needsFastClickTimeOut);
        needsFastClick = targetNeedsFastClick(e.target);

        if (!needsFastClick) {
            trackClick = false;
            return true;
        }
        if (app.device.ios) {
            var selection = window.getSelection();
            if (selection.rangeCount && selection.focusNode !== document.body && (!selection.isCollapsed || document.activeElement === selection.focusNode)) {
                activeSelection = true;
                return true;
            }
            else {
                activeSelection = false;
            }
        }
        if (app.device.android)  {
            if (androidNeedsBlur(e.target)) {
                document.activeElement.blur();
            }
        }

        trackClick = true;
        targetElement = e.target;
        touchStartTime = (new Date()).getTime();
        touchStartX = e.targetTouches[0].pageX;
        touchStartY = e.targetTouches[0].pageY;

        // Detect scroll parent
        if (app.device.ios) {
            scrollParent = undefined;
            $(targetElement).parents().each(function () {
                var parent = this;
                if (parent.scrollHeight > parent.offsetHeight && !scrollParent) {
                    scrollParent = parent;
                    scrollParent.f7ScrollTop = scrollParent.scrollTop;
                }
            });
        }
        if ((e.timeStamp - lastClickTime) < app.params.fastClicksDelayBetweenClicks) {
            e.preventDefault();
        }

        if (app.params.activeState) {
            activableElement = findActivableElement(targetElement);
            // If it's inside a scrollable view, we don't trigger active-state yet,
            // because it can be a scroll instead. Based on the link:
            // http://labnote.beedesk.com/click-scroll-and-pseudo-active-on-mobile-webk
            if (!isInsideScrollableView(activableElement)) {
                addActive();
            } else {
                activeTimeout = setTimeout(addActive, 80);
            }
        }
        if (app.params.material && app.params.materialRipple) {
            rippleTouchStart(targetElement, touchStartX, touchStartY);
        }
    }
    function handleTouchMove(e) {
        if (!trackClick) return;
        var _isMoved = false;
        var distance = app.params.fastClicksDistanceThreshold;
        if (distance) {
            var pageX = e.targetTouches[0].pageX;
            var pageY = e.targetTouches[0].pageY;
            if (Math.abs(pageX - touchStartX) > distance ||  Math.abs(pageY - touchStartY) > distance) {
                _isMoved = true;
            }
        }
        else {
            _isMoved = true;
        }
        if (_isMoved) {
            trackClick = false;
            targetElement = null;
            isMoved = true;
            if (app.params.tapHold) {
                clearTimeout(tapHoldTimeout);
            }
			if (app.params.activeState) {
				clearTimeout(activeTimeout);
				removeActive();
			}
            if (app.params.material && app.params.materialRipple) {
                rippleTouchMove();
            }
        }
    }
    function handleTouchEnd(e) {
        clearTimeout(activeTimeout);
        clearTimeout(tapHoldTimeout);

        if (!trackClick) {
            if (!activeSelection && needsFastClick) {
                if (!(app.device.android && !e.cancelable)) {
                    e.preventDefault();
                }
            }
            return true;
        }

        if (document.activeElement === e.target) {
            if (app.params.activeState) removeActive();
            if (app.params.material && app.params.materialRipple) {
                rippleTouchEnd();
            }
            return true;
        }

        if (!activeSelection) {
            e.preventDefault();
        }

        if ((e.timeStamp - lastClickTime) < app.params.fastClicksDelayBetweenClicks) {
            setTimeout(removeActive, 0);
            return true;
        }

        lastClickTime = e.timeStamp;

        trackClick = false;

        if (app.device.ios && scrollParent) {
            if (scrollParent.scrollTop !== scrollParent.f7ScrollTop) {
                return false;
            }
        }

        // Add active-state here because, in a very fast tap, the timeout didn't
        // have the chance to execute. Removing active-state in a timeout gives
        // the chance to the animation execute.
        if (app.params.activeState) {
            addActive();
            setTimeout(removeActive, 0);
        }
        // Remove Ripple
        if (app.params.material && app.params.materialRipple) {
            rippleTouchEnd();
        }

        // Trigger focus when required
        if (targetNeedsFocus(targetElement)) {
            if (app.device.ios && app.device.webView) {
                if ((event.timeStamp - touchStartTime) > 159) {
                    targetElement = null;
                    return false;
                }
                targetElement.focus();
                return false;
            }
            else {
                targetElement.focus();
            }
        }

        // Blur active elements
        if (document.activeElement && targetElement !== document.activeElement && document.activeElement !== document.body && targetElement.nodeName.toLowerCase() !== 'label') {
            document.activeElement.blur();
        }

        // Send click
        e.preventDefault();
        sendClick(e);
        return false;
    }
    function handleTouchCancel(e) {
        trackClick = false;
        targetElement = null;

        // Remove Active State
        clearTimeout(activeTimeout);
        clearTimeout(tapHoldTimeout);
        if (app.params.activeState) {
            removeActive();
        }

        // Remove Ripple
        if (app.params.material && app.params.materialRipple) {
            rippleTouchEnd();
        }
    }

    function handleClick(e) {
        var allowClick = false;

        if (trackClick) {
            targetElement = null;
            trackClick = false;
            return true;
        }
        if (e.target.type === 'submit' && e.detail === 0) {
            return true;
        }
        if (!targetElement) {
            if (!isFormElement(e.target)) {
                allowClick =  true;
            }
        }
        if (!needsFastClick) {
            allowClick = true;
        }
        if (document.activeElement === targetElement) {
            allowClick =  true;
        }
        if (e.forwardedTouchEvent) {
            allowClick =  true;
        }
        if (!e.cancelable) {
            allowClick =  true;
        }
        if (app.params.tapHold && app.params.tapHoldPreventClicks && tapHoldFired) {
            allowClick = false;
        }
        if (!allowClick) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            if (targetElement) {
                if (targetNeedsPrevent(targetElement) || isMoved) {
                    e.preventDefault();
                }
            }
            else {
                e.preventDefault();
            }
            targetElement = null;
        }
        needsFastClickTimeOut = setTimeout(function () {
            needsFastClick = false;
        }, (app.device.ios || app.device.androidChrome ? 100 : 400));

        if (app.params.tapHold) {
            tapHoldTimeout = setTimeout(function () {
                tapHoldFired = false;
            }, (app.device.ios || app.device.androidChrome ? 100 : 400));
        }

        return allowClick;
    }
    if (app.support.touch) {
        document.addEventListener('click', handleClick, true);

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('touchcancel', handleTouchCancel);
    }
    else {
        if (app.params.activeState) {
            document.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    }
    if (app.params.material && app.params.materialRipple) {
        document.addEventListener('contextmenu', function (e) {
            if (activableElement) removeActive();
            rippleTouchEnd();
        });
    }

};

/*===============================================================================
************   Handle clicks and make them fast (on tap);   ************
===============================================================================*/
app.initClickEvents = function () {
    function handleScrollTop(e) {
        /*jshint validthis:true */
        var clicked = $(this);
        var target = $(e.target);
        var isLink = clicked[0].nodeName.toLowerCase() === 'a' ||
                     clicked.parents('a').length > 0 ||
                     target[0].nodeName.toLowerCase() === 'a' ||
                     target.parents('a').length > 0;

        if (isLink) return;
        var pageContent, page;
        if (app.params.scrollTopOnNavbarClick && clicked.is('.navbar .center')) {
            // Find active page
            var navbar = clicked.parents('.navbar');

            // Static Layout
            pageContent = navbar.parents('.page-content');

            if (pageContent.length === 0) {
                // Fixed Layout
                if (navbar.parents('.page').length > 0) {
                    pageContent = navbar.parents('.page').find('.page-content');
                }
                // Through Layout
                if (pageContent.length === 0) {
                    if (navbar.nextAll('.pages').length > 0) {
                        pageContent = navbar.nextAll('.pages').find('.page:not(.page-on-left):not(.page-on-right):not(.cached)').find('.page-content');
                    }
                }
            }
        }
        if (app.params.scrollTopOnStatusbarClick && clicked.is('.statusbar-overlay')) {
            if ($('.popup.modal-in').length > 0) {
                // Check for opened popup
                pageContent = $('.popup.modal-in').find('.page:not(.page-on-left):not(.page-on-right):not(.cached)').find('.page-content');
            }
            else if ($('.panel.active').length > 0) {
                // Check for opened panel
                pageContent = $('.panel.active').find('.page:not(.page-on-left):not(.page-on-right):not(.cached)').find('.page-content');
            }
            else if ($('.views > .view.active').length > 0) {
                // View in tab bar app layout
                pageContent = $('.views > .view.active').find('.page:not(.page-on-left):not(.page-on-right):not(.cached)').find('.page-content');
            }
            else {
                // Usual case
                pageContent = $('.views').find('.page:not(.page-on-left):not(.page-on-right):not(.cached)').find('.page-content');
            }
        }

        if (pageContent && pageContent.length > 0) {
            // Check for tab
            if (pageContent.hasClass('tab')) {
                pageContent = pageContent.parent('.tabs').children('.page-content.active');
            }
            if (pageContent.length > 0) pageContent.scrollTop(0, 300);
        }
    }
    function handleClicks(e) {
        /*jshint validthis:true */
        var clicked = $(this);
        var url = clicked.attr('href');
        var isLink = clicked[0].nodeName.toLowerCase() === 'a';

        // Check if link is external
        if (isLink) {
            if (clicked.is(app.params.externalLinks) || (url && url.indexOf('javascript:') >= 0)) {
                if(url && clicked.attr('target') === '_system') {
                    e.preventDefault();
                    window.open(url, '_system');
                }
                return;
            }
        }

        // Collect Clicked data- attributes
        var clickedData = clicked.dataset();

        // Smart Select
        if (clicked.hasClass('smart-select')) {
            if (app.smartSelectOpen) app.smartSelectOpen(clicked);
        }

        // Open Panel
        if (clicked.hasClass('open-panel')) {
            if ($('.panel').length === 1) {
                if ($('.panel').hasClass('panel-left')) app.openPanel('left');
                else app.openPanel('right');
            }
            else {
                if (clickedData.panel === 'right') app.openPanel('right');
                else app.openPanel('left');
            }
        }
        // Close Panel
        if (clicked.hasClass('close-panel')) {
            app.closePanel();
        }

        if (clicked.hasClass('panel-overlay') && app.params.panelsCloseByOutside) {
            app.closePanel();
        }
        // Popover
        if (clicked.hasClass('open-popover')) {
            var popover;
            if (clickedData.popover) {
                popover = clickedData.popover;
            }
            else popover = '.popover';
            app.popover(popover, clicked);
        }
        if (clicked.hasClass('close-popover')) {
            app.closeModal('.popover.modal-in');
        }
        // Popup
        var popup;
        if (clicked.hasClass('open-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup';
            app.popup(popup);
        }
        if (clicked.hasClass('close-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup.modal-in';
            app.closeModal(popup);
        }
        // Login Screen
        var loginScreen;
        if (clicked.hasClass('open-login-screen')) {
            if (clickedData.loginScreen) {
                loginScreen = clickedData.loginScreen;
            }
            else loginScreen = '.login-screen';
            app.loginScreen(loginScreen);
        }
        if (clicked.hasClass('close-login-screen')) {
            app.closeModal('.login-screen.modal-in');
        }
        // Close Modal
        if (clicked.hasClass('modal-overlay')) {
            if ($('.modal.modal-in').length > 0 && app.params.modalCloseByOutside)
                app.closeModal('.modal.modal-in');
            if ($('.actions-modal.modal-in').length > 0 && app.params.actionsCloseByOutside)
                app.closeModal('.actions-modal.modal-in');

            if ($('.popover.modal-in').length > 0) app.closeModal('.popover.modal-in');
        }
        if (clicked.hasClass('popup-overlay')) {
            if ($('.popup.modal-in').length > 0 && app.params.popupCloseByOutside)
                app.closeModal('.popup.modal-in');
        }
        if (clicked.hasClass('picker-modal-overlay')) {
            if ($('.picker-modal.modal-in').length > 0)
                app.closeModal('.picker-modal.modal-in');
        }

        // Picker
        if (clicked.hasClass('close-picker')) {
            var pickerToClose = $('.picker-modal.modal-in');
            if (pickerToClose.length > 0) {
                app.closeModal(pickerToClose);
            }
            else {
                pickerToClose = $('.popover.modal-in .picker-modal');
                if (pickerToClose.length > 0) {
                    app.closeModal(pickerToClose.parents('.popover'));
                }
            }
        }
        if (clicked.hasClass('open-picker')) {
            var pickerToOpen;
            if (clickedData.picker) {
                pickerToOpen = clickedData.picker;
            }
            else pickerToOpen = '.picker-modal';
            app.pickerModal(pickerToOpen, clicked);
        }

        // Tabs
        var isTabLink;
        if (clicked.hasClass('tab-link')) {
            isTabLink = true;
            app.showTab(clickedData.tab || clicked.attr('href'), clicked);
        }
        // Swipeout Close
        if (clicked.hasClass('swipeout-close')) {
            app.swipeoutClose(clicked.parents('.swipeout-opened'));
        }
        // Swipeout Delete
        if (clicked.hasClass('swipeout-delete')) {
            if (clickedData.confirm) {
                var text = clickedData.confirm;
                var title = clickedData.confirmTitle;
                if (title) {
                    app.confirm(text, title, function () {
                        app.swipeoutDelete(clicked.parents('.swipeout'));
                    }, function () {
                        if (clickedData.closeOnCancel) app.swipeoutClose(clicked.parents('.swipeout'));
                    });
                }
                else {
                    app.confirm(text, function () {
                        app.swipeoutDelete(clicked.parents('.swipeout'));
                    }, function () {
                        if (clickedData.closeOnCancel) app.swipeoutClose(clicked.parents('.swipeout'));
                    });
                }
            }
            else {
                app.swipeoutDelete(clicked.parents('.swipeout'));
            }

        }
        // Sortable
        if (clicked.hasClass('toggle-sortable')) {
            app.sortableToggle(clickedData.sortable);
        }
        if (clicked.hasClass('open-sortable')) {
            app.sortableOpen(clickedData.sortable);
        }
        if (clicked.hasClass('close-sortable')) {
            app.sortableClose(clickedData.sortable);
        }
        // Accordion
        if (clicked.hasClass('accordion-item-toggle') || (clicked.hasClass('item-link') && clicked.parent().hasClass('accordion-item'))) {
            var accordionItem = clicked.parent('.accordion-item');
            if (accordionItem.length === 0) accordionItem = clicked.parents('.accordion-item');
            if (accordionItem.length === 0) accordionItem = clicked.parents('li');
            app.accordionToggle(accordionItem);
        }

        // Speed Dial
        if (app.params.material) {
            if (clicked.hasClass('floating-button') && clicked.parent().hasClass('speed-dial')) {
                clicked.parent().toggleClass('speed-dial-opened');
            }
            if (clicked.hasClass('close-speed-dial')) {
                $('.speed-dial-opened').removeClass('speed-dial-opened');
            }
        }

        // Load Page
        if (app.params.ajaxLinks && !clicked.is(app.params.ajaxLinks) || !isLink || !app.params.router) {
            return;
        }
        if (isLink) {
            e.preventDefault();
        }

        var validUrl = url && url.length > 0 && url !== '#' && !isTabLink;
        var template = clickedData.template;
        if (validUrl || clicked.hasClass('back') || template) {
            var view;
            if (clickedData.view) {
                view = $(clickedData.view)[0].f7View;
            }
            else {
                view = clicked.parents('.' + app.params.viewClass)[0] && clicked.parents('.' + app.params.viewClass)[0].f7View;
                if (view && view.params.linksView) {
                    if (typeof view.params.linksView === 'string') view = $(view.params.linksView)[0].f7View;
                    else if (view.params.linksView instanceof View) view = view.params.linksView;
                }
            }
            if (!view) {
                if (app.mainView) view = app.mainView;
            }
            if (!view) return;

            var pageName;
            if (!template) {
                if (url.indexOf('#') === 0 && url !== '#')  {
                    if (view.params.domCache) {
                        pageName = url.split('#')[1];
                    }
                    else return;
                }
                if (url === '#' && !clicked.hasClass('back')) return;
            }
            else {
                url = undefined;
            }

            var animatePages;
            if (typeof clickedData.animatePages !== 'undefined') {
                animatePages = clickedData.animatePages;
            }
            else {
                if (clicked.hasClass('with-animation')) animatePages = true;
                if (clicked.hasClass('no-animation')) animatePages = false;
            }

            var options = {
                animatePages: animatePages,
                ignoreCache: clickedData.ignoreCache,
                force: clickedData.force,
                reload: clickedData.reload,
                reloadPrevious: clickedData.reloadPrevious,
                pageName: pageName,
                pushState: clickedData.pushState,
                url: url
            };

            if (app.params.template7Pages) {
                options.contextName = clickedData.contextName;
                var context = clickedData.context;
                if (context) {
                    options.context = JSON.parse(context);
                }
            }
            if (template && template in t7.templates) {
                options.template = t7.templates[template];
            }

            if (clicked.hasClass('back')) view.router.back(options);
            else view.router.load(options);
        }
    }
    $(document).on('click', 'a, .open-panel, .close-panel, .panel-overlay, .modal-overlay, .popup-overlay, .swipeout-delete, .swipeout-close, .close-popup, .open-popup, .open-popover, .open-login-screen, .close-login-screen .smart-select, .toggle-sortable, .open-sortable, .close-sortable, .accordion-item-toggle, .close-picker, .picker-modal-overlay', handleClicks);
    if (app.params.scrollTopOnNavbarClick || app.params.scrollTopOnStatusbarClick) {
        $(document).on('click', '.statusbar-overlay, .navbar .center', handleScrollTop);
    }

    // Prevent scrolling on overlays
    function preventScrolling(e) {
        e.preventDefault();
    }
    if (app.support.touch && !app.device.android) {
        $(document).on((app.params.fastClicks ? 'touchstart' : 'touchmove'), '.panel-overlay, .modal-overlay, .preloader-indicator-overlay, .popup-overlay, .searchbar-overlay', preventScrolling);
    }
};

/*======================================================
************   App Resize Actions   ************
======================================================*/
// Prevent iPad horizontal body scrolling when soft keyboard is opened
function _fixIpadBodyScrolLeft() {
    if (app.device.ipad) {
        document.body.scrollLeft = 0;
        setTimeout(function () {
            document.body.scrollLeft = 0;
        }, 0);
    }
}
app.initResize = function () {
    $(window).on('resize', app.resize);
    $(window).on('orientationchange', app.orientationchange);
};
app.resize = function () {
    if (app.sizeNavbars) app.sizeNavbars();
    _fixIpadBodyScrolLeft();
    
};
app.orientationchange = function () {
    if (app.device && app.device.minimalUi) {
        if (window.orientation === 90 || window.orientation === -90) document.body.scrollTop = 0;
    }
    _fixIpadBodyScrolLeft();
};

/*===============================================================================
************   Store and parse forms data   ************
===============================================================================*/
app.formsData = {};
app.formStoreData = function (formId, formJSON) {
    // Store form data in app.formsData
    app.formsData[formId] = formJSON;

    // Store form data in local storage also
    app.ls['f7form-' + formId] = JSON.stringify(formJSON);
};
app.formDeleteData = function (formId) {
    // Delete form data from app.formsData
    if (app.formsData[formId]) {
        app.formsData[formId] = '';
        delete app.formsData[formId];
    }

    // Delete form data from local storage also
    if (app.ls['f7form-' + formId]) {
        app.ls['f7form-' + formId] = '';
        app.ls.removeItem('f7form-' + formId);
    }
};
app.formGetData = function (formId) {
    // First of all check in local storage
    if (app.ls['f7form-' + formId]) {
        return JSON.parse(app.ls['f7form-' + formId]);
    }
    // Try to get it from formsData obj
    else if (app.formsData[formId]) return app.formsData[formId];
};
app.formToJSON = function (form) {
    form = $(form);
    if (form.length !== 1) return false;

    // Form data
    var formData = {};

    // Skip input types
    var skipTypes = ['submit', 'image', 'button', 'file'];
    var skipNames = [];
    form.find('input, select, textarea').each(function () {
        var input = $(this);
        var name = input.attr('name');
        var type = input.attr('type');
        var tag = this.nodeName.toLowerCase();
        if (skipTypes.indexOf(type) >= 0) return;
        if (skipNames.indexOf(name) >= 0 || !name) return;
        if (tag === 'select' && input.prop('multiple')) {
            skipNames.push(name);
            formData[name] = [];
            form.find('select[name="' + name + '"] option').each(function () {
                if (this.selected) formData[name].push(this.value);
            });
        }
        else {
            switch (type) {
                case 'checkbox' :
                    skipNames.push(name);
                    formData[name] = [];
                    form.find('input[name="' + name + '"]').each(function () {
                        if (this.checked) formData[name].push(this.value);
                    });
                    break;
                case 'radio' :
                    skipNames.push(name);
                    form.find('input[name="' + name + '"]').each(function () {
                        if (this.checked) formData[name] = this.value;
                    });
                    break;
                default :
                    formData[name] = input.val();
                    break;
            }
        }
            
    });
    form.trigger('formToJSON', {formData: formData});

    return formData;
};
app.formFromJSON = function (form, formData) {
    form = $(form);
    if (form.length !== 1) return false;

    // Skip input types
    var skipTypes = ['submit', 'image', 'button', 'file'];
    var skipNames = [];

    form.find('input, select, textarea').each(function () {
        var input = $(this);
        var name = input.attr('name');
        var type = input.attr('type');
        var tag = this.nodeName.toLowerCase();
        if (!formData[name]) return;
        if (skipTypes.indexOf(type) >= 0) return;
        if (skipNames.indexOf(name) >= 0 || !name) return;
        if (tag === 'select' && input.prop('multiple')) {
            skipNames.push(name);
            form.find('select[name="' + name + '"] option').each(function () {
                if (formData[name].indexOf(this.value) >= 0) this.selected = true;
                else this.selected = false;
            });
        }
        else {
            switch (type) {
                case 'checkbox' :
                    skipNames.push(name);
                    form.find('input[name="' + name + '"]').each(function () {
                        if (formData[name].indexOf(this.value) >= 0) this.checked = true;
                        else this.checked = false;
                    });
                    break;
                case 'radio' :
                    skipNames.push(name);
                    form.find('input[name="' + name + '"]').each(function () {
                        if (formData[name] === this.value) this.checked = true;
                        else this.checked = false;
                    });
                    break;
                default :
                    input.val(formData[name]);
                    break;
            }
        }
            
    });
    form.trigger('formFromJSON', {formData: formData});
};
app.initFormsStorage = function (pageContainer) {
    pageContainer = $(pageContainer);
    var forms = pageContainer.find('form.store-data');
    if (forms.length === 0) return;
    
    // Parse forms data and fill form if there is such data
    forms.each(function () {
        var id = this.getAttribute('id');
        if (!id) return;
        var formData = app.formGetData(id);
        if (formData) app.formFromJSON(this, formData);
    });
    // Update forms data on inputs change
    function storeForm() {
        /*jshint validthis:true */
        var form = $(this);
        var formId = form[0].id;
        if (!formId) return;
        var formJSON = app.formToJSON(form);
        if (!formJSON) return;
        app.formStoreData(formId, formJSON);
        form.trigger('store', {data: formJSON});
    }
    forms.on('change submit', storeForm);

    // Detach Listeners
    function pageBeforeRemove() {
        forms.off('change submit', storeForm);
        pageContainer.off('pageBeforeRemove', pageBeforeRemove);
    }
    pageContainer.on('pageBeforeRemove', pageBeforeRemove);
};
/*======================================================
************   Handle Browser's History   ************
======================================================*/
app.pushStateQueue = [];
app.pushStateClearQueue = function () {
    if (app.pushStateQueue.length === 0) return;
    var queue = app.pushStateQueue.pop();
    var animatePages;
    if (app.params.pushStateNoAnimation === true) animatePages = false;
    if (queue.action === 'back') {
        app.router.back(queue.view, {animatePages: animatePages});
    }
    if (queue.action === 'loadPage') {
        app.router.load(queue.view, {url: queue.stateUrl, animatePages: animatePages, pushState: false});
    }
    if (queue.action === 'loadContent') {
        app.router.load(queue.view, {content: queue.stateContent, animatePages: animatePages, pushState: false});
    }
    if (queue.action === 'loadPageName') {
        app.router.load(queue.view, {pageName: queue.statePageName, url: queue.stateUrl, animatePages: animatePages, pushState: false});
    }
};

app.initPushState = function () {
    var blockPopstate = true;
    $(window).on('load', function () {
        setTimeout(function () {
            blockPopstate = false;
        }, 0);
    });

    if (document.readyState && document.readyState === 'complete') {
        blockPopstate = false;
    }

    function handlePopState(e) {
        if (blockPopstate) return;
        var mainView = app.mainView;
        if (!mainView) return;
        var state = e.state;
        if (!state) {
            state = {
                viewIndex: app.views.indexOf(mainView),
                url : mainView.history[0]
            };
        }
        if (state.viewIndex < 0) return;
        var view = app.views[state.viewIndex];
        var stateUrl = state && state.url || undefined;
        var stateContent = state && state.content || undefined;
        var statePageName = state && state.pageName || undefined;
        var animatePages;

        if (app.params.pushStateNoAnimation === true) animatePages = false;

        if (stateUrl !== view.url) {
            if (view.history.indexOf(stateUrl) >= 0) {
                // Go Back
                if (view.allowPageChange) {
                    app.router.back(view, {url:undefined, animatePages: animatePages, pushState: false, preloadOnly:false});
                }
                else {
                    app.pushStateQueue.push({
                        action: 'back',
                        view: view
                    });
                }
            }
            else if (stateContent) {
                // Load Page
                if (view.allowPageChange) {
                    app.router.load(view, {content:stateContent, animatePages: animatePages, pushState: false});
                }
                else {
                    app.pushStateQueue.unshift({
                        action: 'loadContent',
                        stateContent: stateContent,
                        view: view
                    });
                }

            }
            else if (statePageName) {
                // Load Page by page name with Dom Cache
                if (view.allowPageChange) {
                    app.router.load(view, {pageName:statePageName, url: stateUrl, animatePages: animatePages, pushState: false});
                }
                else {
                    app.pushStateQueue.unshift({
                        action: 'loadPageName',
                        statePageName: statePageName,
                        view: view
                    });
                }
            }
            else  {
                // Load Page
                if (view.allowPageChange) {
                    app.router.load(view, {url:stateUrl, animatePages: animatePages, pushState: false});
                }
                else {
                    app.pushStateQueue.unshift({
                        action: 'loadPage',
                        stateUrl: stateUrl,
                        view: view
                    });
                }
            }
        }
    }
    $(window).on('popstate', handlePopState);
};

/*======================================================
************   Picker   ************
======================================================*/
var Picker = function (params) {
    var p = this;
    var defaults = {
        updateValuesOnMomentum: false,
        updateValuesOnTouchmove: true,
        rotateEffect: false,
        momentumRatio: 7,
        freeMode: false,
        // Common settings
        closeByOutsideClick: true,
        scrollToInput: true,
        inputReadOnly: true,
        convertToPopover: true,
        onlyInPopover: false,
        toolbar: true,
        toolbarCloseText: 'Done',
        toolbarTemplate: 
            '<div class="toolbar">' +
                '<div class="toolbar-inner">' +
                    '<div class="left"></div>' +
                    '<div class="right">' +
                        '<a href="#" class="link close-picker">{{closeText}}</a>' +
                    '</div>' +
                '</div>' +
            '</div>'
    };
    params = params || {};
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        }
    }
    p.params = params;
    p.cols = [];
    p.initialized = false;
    
    // Inline flag
    p.inline = p.params.container ? true : false;

    // 3D Transforms origin bug, only on safari
    var originBug = app.device.ios || (navigator.userAgent.toLowerCase().indexOf('safari') >= 0 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0) && !app.device.android;

    // Should be converted to popover
    function isPopover() {
        var toPopover = false;
        if (!p.params.convertToPopover && !p.params.onlyInPopover) return toPopover;
        if (!p.inline && p.params.input) {
            if (p.params.onlyInPopover) toPopover = true;
            else {
                if (app.device.ios) {
                    toPopover = app.device.ipad ? true : false;
                }
                else {
                    if ($(window).width() >= 768) toPopover = true;
                }
            }
        } 
        return toPopover; 
    }
    function inPopover() {
        if (p.opened && p.container && p.container.length > 0 && p.container.parents('.popover').length > 0) return true;
        else return false;
    }

    // Value
    p.setValue = function (arrValues, transition) {
        var valueIndex = 0;
        if (p.cols.length === 0) {
            p.value = arrValues;
            p.updateValue(arrValues);
            return;
        }
        for (var i = 0; i < p.cols.length; i++) {
            if (p.cols[i] && !p.cols[i].divider) {
                p.cols[i].setValue(arrValues[valueIndex], transition);
                valueIndex++;
            }
        }
    };
    p.updateValue = function (forceValues) {
        var newValue = forceValues || [];
        var newDisplayValue = [];
        for (var i = 0; i < p.cols.length; i++) {
            if (!p.cols[i].divider) {
                newValue.push(p.cols[i].value);
                newDisplayValue.push(p.cols[i].displayValue);
            }
        }
        if (newValue.indexOf(undefined) >= 0) {
            return;
        }
        p.value = newValue;
        p.displayValue = newDisplayValue;
        if (p.params.onChange) {
            p.params.onChange(p, p.value, p.displayValue);
        }
        if (p.input && p.input.length > 0) {
            $(p.input).val(p.params.formatValue ? p.params.formatValue(p, p.value, p.displayValue) : p.value.join(' '));
            $(p.input).trigger('change');
        }
    };

    // Columns Handlers
    p.initPickerCol = function (colElement, updateItems) {
        var colContainer = $(colElement);
        var colIndex = colContainer.index();
        var col = p.cols[colIndex];
        if (col.divider) return;
        col.container = colContainer;
        col.wrapper = col.container.find('.picker-items-col-wrapper');
        col.items = col.wrapper.find('.picker-item');
        
        var i, j;
        var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
        col.replaceValues = function (values, displayValues) {
            col.destroyEvents();
            col.values = values;
            col.displayValues = displayValues;
            var newItemsHTML = p.columnHTML(col, true);
            col.wrapper.html(newItemsHTML);
            col.items = col.wrapper.find('.picker-item');
            col.calcSize();
            col.setValue(col.values[0], 0, true);
            col.initEvents();
        };
        col.calcSize = function () {
            if (p.params.rotateEffect) {
                col.container.removeClass('picker-items-col-absolute');
                if (!col.width) col.container.css({width:''});
            }
            var colWidth, colHeight;
            colWidth = 0;
            colHeight = col.container[0].offsetHeight;
            wrapperHeight = col.wrapper[0].offsetHeight;
            itemHeight = col.items[0].offsetHeight;
            itemsHeight = itemHeight * col.items.length;
            minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
            maxTranslate = colHeight / 2 - itemHeight / 2;    
            if (col.width) {
                colWidth = col.width;
                if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
                col.container.css({width: colWidth});
            }
            if (p.params.rotateEffect) {
                if (!col.width) {
                    col.items.each(function () {
                        var item = $(this);
                        item.css({width:'auto'});
                        colWidth = Math.max(colWidth, item[0].offsetWidth);
                        item.css({width:''});
                    });
                    col.container.css({width: (colWidth + 2) + 'px'});
                }
                col.container.addClass('picker-items-col-absolute');
            }
        };
        col.calcSize();
        
        col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)').transition(0);


        var activeIndex = 0;
        var animationFrameId;

        // Set Value Function
        col.setValue = function (newValue, transition, valueCallbacks) {
            if (typeof transition === 'undefined') transition = '';
            var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
            if(typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
                return;
            }
            var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
            // Update wrapper
            col.wrapper.transition(transition);
            col.wrapper.transform('translate3d(0,' + (newTranslate) + 'px,0)');
                
            // Watch items
            if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex ) {
                $.cancelAnimationFrame(animationFrameId);
                col.wrapper.transitionEnd(function(){
                    $.cancelAnimationFrame(animationFrameId);
                });
                updateDuringScroll();
            }

            // Update items
            col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
        };

        col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
            if (typeof translate === 'undefined') {
                translate = $.getTranslate(col.wrapper[0], 'y');
            }
            if(typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate)/itemHeight);
            if (activeIndex < 0) activeIndex = 0;
            if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
            var previousActiveIndex = col.activeIndex;
            col.activeIndex = activeIndex;
            col.wrapper.find('.picker-selected').removeClass('picker-selected');

            col.items.transition(transition);
            
            var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');
                
            // Set 3D rotate effect
            if (p.params.rotateEffect) {
                var percentage = (translate - (Math.floor((translate - maxTranslate)/itemHeight) * itemHeight + maxTranslate)) / itemHeight;
                
                col.items.each(function () {
                    var item = $(this);
                    var itemOffsetTop = item.index() * itemHeight;
                    var translateOffset = maxTranslate - translate;
                    var itemOffset = itemOffsetTop - translateOffset;
                    var percentage = itemOffset / itemHeight;

                    var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;
                    
                    var angle = (-18*percentage);
                    if (angle > 180) angle = 180;
                    if (angle < -180) angle = -180;
                    // Far class
                    if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');
                    else item.removeClass('picker-item-far');
                    // Set transform
                    item.transform('translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
                });
            }

            if (valueCallbacks || typeof valueCallbacks === 'undefined') {
                // Update values
                col.value = selectedItem.attr('data-picker-value');
                col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
                // On change callback
                if (previousActiveIndex !== activeIndex) {
                    if (col.onChange) {
                        col.onChange(p, col.value, col.displayValue);
                    }
                    p.updateValue();
                }
            }
        };

        function updateDuringScroll() {
            animationFrameId = $.requestAnimationFrame(function () {
                col.updateItems(undefined, undefined, 0);
                updateDuringScroll();
            });
        }

        // Update items on init
        if (updateItems) col.updateItems(0, maxTranslate, 0);

        var allowItemClick = true;
        var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;
        function handleTouchStart (e) {
            if (isMoved || isTouched) return;
            e.preventDefault();
            isTouched = true;
            touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = (new Date()).getTime();
            
            allowItemClick = true;
            startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
        }
        function handleTouchMove (e) {
            if (!isTouched) return;
            e.preventDefault();
            allowItemClick = false;
            touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (!isMoved) {
                // First move
                $.cancelAnimationFrame(animationFrameId);
                isMoved = true;
                startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
                col.wrapper.transition(0);
            }
            e.preventDefault();

            var diff = touchCurrentY - touchStartY;
            currentTranslate = startTranslate + diff;
            returnTo = undefined;

            // Normalize translate
            if (currentTranslate < minTranslate) {
                currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
                returnTo = 'min';
            }
            if (currentTranslate > maxTranslate) {
                currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
                returnTo = 'max';
            }
            // Transform wrapper
            col.wrapper.transform('translate3d(0,' + currentTranslate + 'px,0)');

            // Update items
            col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);
            
            // Calc velocity
            velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
            velocityTime = (new Date()).getTime();
            prevTranslate = currentTranslate;
        }
        function handleTouchEnd (e) {
            if (!isTouched || !isMoved) {
                isTouched = isMoved = false;
                return;
            }
            isTouched = isMoved = false;
            col.wrapper.transition('');
            if (returnTo) {
                if (returnTo === 'min') {
                    col.wrapper.transform('translate3d(0,' + minTranslate + 'px,0)');
                }
                else col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)');
            }
            touchEndTime = new Date().getTime();
            var velocity, newTranslate;
            if (touchEndTime - touchStartTime > 300) {
                newTranslate = currentTranslate;
            }
            else {
                velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
                newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
            }

            newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

            // Active Index
            var activeIndex = -Math.floor((newTranslate - maxTranslate)/itemHeight);

            // Normalize translate
            if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

            // Transform wrapper
            col.wrapper.transform('translate3d(0,' + (parseInt(newTranslate,10)) + 'px,0)');

            // Update items
            col.updateItems(activeIndex, newTranslate, '', true);

            // Watch items
            if (p.params.updateValuesOnMomentum) {
                updateDuringScroll();
                col.wrapper.transitionEnd(function(){
                    $.cancelAnimationFrame(animationFrameId);
                });
            }

            // Allow click
            setTimeout(function () {
                allowItemClick = true;
            }, 100);
        }

        function handleClick(e) {
            if (!allowItemClick) return;
            $.cancelAnimationFrame(animationFrameId);
            /*jshint validthis:true */
            var value = $(this).attr('data-picker-value');
            col.setValue(value);
        }

        col.initEvents = function (detach) {
            var method = detach ? 'off' : 'on';
            col.container[method](app.touchEvents.start, handleTouchStart);
            col.container[method](app.touchEvents.move, handleTouchMove);
            col.container[method](app.touchEvents.end, handleTouchEnd);
            col.items[method]('click', handleClick);
        };
        col.destroyEvents = function () {
            col.initEvents(true);
        };

        col.container[0].f7DestroyPickerCol = function () {
            col.destroyEvents();
        };

        col.initEvents();

    };
    p.destroyPickerCol = function (colContainer) {
        colContainer = $(colContainer);
        if ('f7DestroyPickerCol' in colContainer[0]) colContainer[0].f7DestroyPickerCol();
    };
    // Resize cols
    function resizeCols() {
        if (!p.opened) return;
        for (var i = 0; i < p.cols.length; i++) {
            if (!p.cols[i].divider) {
                p.cols[i].calcSize();
                p.cols[i].setValue(p.cols[i].value, 0, false);
            }
        }
    }
    $(window).on('resize', resizeCols);

    // HTML Layout
    p.columnHTML = function (col, onlyItems) {
        var columnItemsHTML = '';
        var columnHTML = '';
        if (col.divider) {
            columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
        }
        else {
            for (var j = 0; j < col.values.length; j++) {
                columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + '</div>';
            }
            columnHTML += '<div class="picker-items-col ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + '</div></div>';
        }
        return onlyItems ? columnItemsHTML : columnHTML;
    };
    p.layout = function () {
        var pickerHTML = '';
        var pickerClass = '';
        var i;
        p.cols = [];
        var colsHTML = '';
        for (i = 0; i < p.params.cols.length; i++) {
            var col = p.params.cols[i];
            colsHTML += p.columnHTML(p.params.cols[i]);
            p.cols.push(col);
        }
        pickerClass = 'picker-modal picker-columns ' + (p.params.cssClass || '') + (p.params.rotateEffect ? ' picker-3d' : '');
        pickerHTML =
            '<div class="' + (pickerClass) + '">' +
                (p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '') +
                '<div class="picker-modal-inner picker-items">' +
                    colsHTML +
                    '<div class="picker-center-highlight"></div>' +
                '</div>' +
            '</div>';
            
        p.pickerHTML = pickerHTML;    
    };

    // Input Events
    function openOnInput(e) {
        e.preventDefault();
        if (p.opened) return;
        p.open();
        if (p.params.scrollToInput && !isPopover()) {
            var pageContent = p.input.parents('.page-content');
            if (pageContent.length === 0) return;

            var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                newPaddingBottom;
            var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
            if (inputTop > pageHeight) {
                var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                if (scrollTop + pageHeight > pageScrollHeight) {
                    newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                    if (pageHeight === pageScrollHeight) {
                        newPaddingBottom = p.container.height();
                    }
                    pageContent.css({'padding-bottom': (newPaddingBottom) + 'px'});
                }
                pageContent.scrollTop(scrollTop, 300);
            }
        }
    }
    function closeOnHTMLClick(e) {
        if (inPopover()) return;
        if (p.input && p.input.length > 0) {
            if (e.target !== p.input[0] && $(e.target).parents('.picker-modal').length === 0) p.close();
        }
        else {
            if ($(e.target).parents('.picker-modal').length === 0) p.close();   
        }
    }

    if (p.params.input) {
        p.input = $(p.params.input);
        if (p.input.length > 0) {
            if (p.params.inputReadOnly) p.input.prop('readOnly', true);
            if (!p.inline) {
                p.input.on('click', openOnInput);    
            }
            if (p.params.inputReadOnly) {
                p.input.on('focus mousedown', function (e) {
                    e.preventDefault();
                });
            }
        }
            
    }
    
    if (!p.inline && p.params.closeByOutsideClick) $('html').on('click', closeOnHTMLClick);

    // Open
    function onPickerClose() {
        p.opened = false;
        if (p.input && p.input.length > 0) {
            p.input.parents('.page-content').css({'padding-bottom': ''});
            if (app.params.material) p.input.trigger('blur');
        }
        if (p.params.onClose) p.params.onClose(p);

        // Destroy events
        p.container.find('.picker-items-col').each(function () {
            p.destroyPickerCol(this);
        });
    }

    p.opened = false;
    p.open = function () {
        var toPopover = isPopover();

        if (!p.opened) {

            // Layout
            p.layout();

            // Append
            if (toPopover) {
                p.pickerHTML = '<div class="popover popover-picker-columns"><div class="popover-inner">' + p.pickerHTML + '</div></div>';
                p.popover = app.popover(p.pickerHTML, p.params.input, true);
                p.container = $(p.popover).find('.picker-modal');
                $(p.popover).on('close', function () {
                    onPickerClose();
                });
            }
            else if (p.inline) {
                p.container = $(p.pickerHTML);
                p.container.addClass('picker-modal-inline');
                $(p.params.container).append(p.container);
            }
            else {
                p.container = $(app.pickerModal(p.pickerHTML));
                $(p.container)
                .on('close', function () {
                    onPickerClose();
                });
            }

            // Store picker instance
            p.container[0].f7Picker = p;

            // Init Events
            p.container.find('.picker-items-col').each(function () {
                var updateItems = true;
                if ((!p.initialized && p.params.value) || (p.initialized && p.value)) updateItems = false;
                p.initPickerCol(this, updateItems);
            });
            
            // Set value
            if (!p.initialized) {
                if (p.value) p.setValue(p.value, 0);
                else if (p.params.value) {
                    p.setValue(p.params.value, 0);
                }
            }
            else {
                if (p.value) p.setValue(p.value, 0);
            }

            // Material Focus
            if (p.input && p.input.length > 0 && app.params.material) {
                p.input.trigger('focus');
            }
        }

        // Set flag
        p.opened = true;
        p.initialized = true;

        if (p.params.onOpen) p.params.onOpen(p);
    };

    // Close
    p.close = function () {
        if (!p.opened || p.inline) return;
        if (inPopover()) {
            app.closeModal(p.popover);
            return;
        }
        else {
            app.closeModal(p.container);
            return;
        }
    };

    // Destroy
    p.destroy = function () {
        p.close();
        if (p.params.input && p.input.length > 0) {
            p.input.off('click focus', openOnInput);
        }
        $('html').off('click', closeOnHTMLClick);
        $(window).off('resize', resizeCols);
    };

    if (p.inline) {
        p.open();
    }
    else {
        if (!p.initialized && p.params.value) p.setValue(p.params.value);
    }

    return p;
};
app.picker = function (params) {
    return new Picker(params);
};
/*======================================================
************   Calendar   ************
======================================================*/
var Calendar = function (params) {
    var p = this;
    var defaults = {
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        firstDay: 1, // First day of the week, Monday
        weekendDays: [0, 6], // Sunday and Saturday
        multiple: false,
        rangePicker: false,
        dateFormat: 'yyyy-mm-dd',
        direction: 'horizontal', // or 'vertical'
        minDate: null,
        maxDate: null,
        disabled: null, // dates range of disabled days
        events: null, // dates range of days with events
        rangesClasses: null, //array with custom classes date ranges
        touchMove: true,
        animate: true,
        closeOnSelect: false,
        monthPicker: true,
        monthPickerTemplate:
            '<div class="picker-calendar-month-picker">' +
                '<a href="#" class="link icon-only picker-calendar-prev-month"><i class="icon icon-prev"></i></a>' +
                '<span class="current-month-value"></span>' +
                '<a href="#" class="link icon-only picker-calendar-next-month"><i class="icon icon-next"></i></a>' +
            '</div>',
        yearPicker: true,
        yearPickerTemplate:
            '<div class="picker-calendar-year-picker">' +
                '<a href="#" class="link icon-only picker-calendar-prev-year"><i class="icon icon-prev"></i></a>' +
                '<span class="current-year-value"></span>' +
                '<a href="#" class="link icon-only picker-calendar-next-year"><i class="icon icon-next"></i></a>' +
            '</div>',
        weekHeader: true,
        // Common settings
        closeByOutsideClick: true,
        scrollToInput: true,
        inputReadOnly: true,
        convertToPopover: true,
        onlyInPopover: false,
        toolbar: true,
        toolbarCloseText: 'Done',
        headerPlaceholder: 'Select date',
        header: app.params.material,
        footer: app.params.material,
        toolbarTemplate:
            '<div class="toolbar">' +
                '<div class="toolbar-inner">' +
                    '{{monthPicker}}' +
                    '{{yearPicker}}' +
                '</div>' +
            '</div>',
        headerTemplate:
            '<div class="picker-header">' +
                '<div class="picker-calendar-selected-date">{{placeholder}}</div>' +
            '</div>',
        footerTemplate:
            '<div class="picker-footer">' +
                '<a href="#" class="button close-picker">{{closeText}}</a>' +
            '</div>',

        /* Callbacks
        onMonthAdd
        onChange
        onOpen
        onClose
        onDayClick
        onMonthYearChangeStart
        onMonthYearChangeEnd
        */
    };
    params = params || {};
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        }
    }
    p.params = params;
    p.initialized = false;

    // Inline flag
    p.inline = p.params.container ? true : false;

    // Is horizontal
    p.isH = p.params.direction === 'horizontal';

    // RTL inverter
    var inverter = p.isH ? (app.rtl ? -1 : 1) : 1;

    // Animating flag
    p.animating = false;

    // Should be converted to popover
    function isPopover() {
        var toPopover = false;
        if (!p.params.convertToPopover && !p.params.onlyInPopover) return toPopover;
        if (!p.inline && p.params.input) {
            if (p.params.onlyInPopover) toPopover = true;
            else {
                if (app.device.ios) {
                    toPopover = app.device.ipad ? true : false;
                }
                else {
                    if ($(window).width() >= 768) toPopover = true;
                }
            }
        }
        return toPopover;
    }
    function inPopover() {
        if (p.opened && p.container && p.container.length > 0 && p.container.parents('.popover').length > 0) return true;
        else return false;
    }

    // Format date
    function formatDate(date) {
        date = new Date(date);
        var year = date.getFullYear();
        var month = date.getMonth();
        var month1 = month + 1;
        var day = date.getDate();
        var weekDay = date.getDay();

        return p.params.dateFormat
            .replace(/yyyy/g, year)
            .replace(/yy/g, (year + '').substring(2))
            .replace(/mm/g, month1 < 10 ? '0' + month1 : month1)
            .replace(/m(\W+)/g, month1 + '$1')
            .replace(/MM/g, p.params.monthNames[month])
            .replace(/M(\W+)/g, p.params.monthNamesShort[month] + '$1')
            .replace(/dd/g, day < 10 ? '0' + day : day)
            .replace(/d(\W+)/g, day + '$1')
            .replace(/DD/g, p.params.dayNames[weekDay])
            .replace(/D(\W+)/g, p.params.dayNamesShort[weekDay] + '$1');
    }


    // Value
    p.addValue = function (value) {
        if (p.params.multiple) {
            if (!p.value) p.value = [];
            var inValuesIndex;
            for (var i = 0; i < p.value.length; i++) {
                if (new Date(value).getTime() === new Date(p.value[i]).getTime()) {
                    inValuesIndex = i;
                }
            }
            if (typeof inValuesIndex === 'undefined') {
                p.value.push(value);
            }
            else {
                p.value.splice(inValuesIndex, 1);
            }
            p.updateValue();
        }
        else if (p.params.rangePicker) {
            if (!p.value) p.value = [];
            if (p.value.length === 2 || p.value.length === 0) {
                p.value = [];
            }
            if (p.value[0] !== value) p.value.push(value);
            else p.value = [];
            p.value.sort(function (a,b) {
                return a - b;
            });
            p.updateValue();
        }
        else {
            p.value = [value];
            p.updateValue();
        }
    };
    p.setValue = function (arrValues) {
        p.value = arrValues;
        p.updateValue();
    };
    p.updateValue = function (onlyHeader) {
        var i, inputValue;
        if (p.container && p.container.length > 0) {
            p.wrapper.find('.picker-calendar-day-selected').removeClass('picker-calendar-day-selected');
            var valueDate;
            if (p.params.rangePicker && p.value.length === 2) {
                for (i = p.value[0]; i <= p.value[1]; i += 24*60*60*1000) {
                    valueDate = new Date(i);
                    p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + '-' + valueDate.getMonth() + '-' + valueDate.getDate() + '"]').addClass('picker-calendar-day-selected');
                }
            }
            else {
                for (i = 0; i < p.value.length; i++) {
                    valueDate = new Date(p.value[i]);
                    p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + '-' + valueDate.getMonth() + '-' + valueDate.getDate() + '"]').addClass('picker-calendar-day-selected');
                }
            }
        }

        if (p.params.onChange) {
            p.params.onChange(p, p.value);
        }
        if ((p.input && p.input.length > 0) || (app.params.material && p.params.header)) {
            if (p.params.formatValue) inputValue = p.params.formatValue(p, p.value);
            else {
                inputValue = [];
                for (i = 0; i < p.value.length; i++) {
                    inputValue.push(formatDate(p.value[i]));
                }
                inputValue = inputValue.join(p.params.rangePicker ? ' - ' : ', ');
            }
            if (app.params.material && p.params.header && p.container && p.container.length > 0) {
                p.container.find('.picker-calendar-selected-date').text(inputValue);
            }
            if (p.input && p.input.length > 0 && !onlyHeader) {
                $(p.input).val(inputValue);
                $(p.input).trigger('change');
            }

        }
    };

    // Columns Handlers
    p.initCalendarEvents = function () {
        var col;
        var allowItemClick = true;
        var isTouched, isMoved, touchStartX, touchStartY, touchCurrentX, touchCurrentY, touchStartTime, touchEndTime, startTranslate, currentTranslate, wrapperWidth, wrapperHeight, percentage, touchesDiff, isScrolling;
        function handleTouchStart (e) {
            if (isMoved || isTouched) return;
            // e.preventDefault();
            isTouched = true;
            touchStartX = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = (new Date()).getTime();
            percentage = 0;
            allowItemClick = true;
            isScrolling = undefined;
            startTranslate = currentTranslate = p.monthsTranslate;
        }
        function handleTouchMove (e) {
            if (!isTouched) return;

            touchCurrentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (typeof isScrolling === 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX));
            }
            if (p.isH && isScrolling) {
                isTouched = false;
                return;
            }
            e.preventDefault();
            if (p.animating) {
                isTouched = false;
                return;
            }
            allowItemClick = false;
            if (!isMoved) {
                // First move
                isMoved = true;
                wrapperWidth = p.wrapper[0].offsetWidth;
                wrapperHeight = p.wrapper[0].offsetHeight;
                p.wrapper.transition(0);
            }
            e.preventDefault();

            touchesDiff = p.isH ? touchCurrentX - touchStartX : touchCurrentY - touchStartY;
            percentage = touchesDiff/(p.isH ? wrapperWidth : wrapperHeight);
            currentTranslate = (p.monthsTranslate * inverter + percentage) * 100;

            // Transform wrapper
            p.wrapper.transform('translate3d(' + (p.isH ? currentTranslate : 0) + '%, ' + (p.isH ? 0 : currentTranslate) + '%, 0)');

        }
        function handleTouchEnd (e) {
            if (!isTouched || !isMoved) {
                isTouched = isMoved = false;
                return;
            }
            isTouched = isMoved = false;

            touchEndTime = new Date().getTime();
            if (touchEndTime - touchStartTime < 300) {
                if (Math.abs(touchesDiff) < 10) {
                    p.resetMonth();
                }
                else if (touchesDiff >= 10) {
                    if (app.rtl) p.nextMonth();
                    else p.prevMonth();
                }
                else {
                    if (app.rtl) p.prevMonth();
                    else p.nextMonth();
                }
            }
            else {
                if (percentage <= -0.5) {
                    if (app.rtl) p.prevMonth();
                    else p.nextMonth();
                }
                else if (percentage >= 0.5) {
                    if (app.rtl) p.nextMonth();
                    else p.prevMonth();
                }
                else {
                    p.resetMonth();
                }
            }

            // Allow click
            setTimeout(function () {
                allowItemClick = true;
            }, 100);
        }

        function handleDayClick(e) {
            if (!allowItemClick) return;
            var day = $(e.target).parents('.picker-calendar-day');
            if (day.length === 0 && $(e.target).hasClass('picker-calendar-day')) {
                day = $(e.target);
            }
            if (day.length === 0) return;
            if (day.hasClass('picker-calendar-day-selected') && !(p.params.multiple || p.params.rangePicker)) return;
            if (day.hasClass('picker-calendar-day-disabled')) return;
            if (!p.params.rangePicker) {
                if (day.hasClass('picker-calendar-day-next')) p.nextMonth();
                if (day.hasClass('picker-calendar-day-prev')) p.prevMonth();
            }
            var dateYear = day.attr('data-year');
            var dateMonth = day.attr('data-month');
            var dateDay = day.attr('data-day');
            if (p.params.onDayClick) {
                p.params.onDayClick(p, day[0], dateYear, dateMonth, dateDay);
            }
            p.addValue(new Date(dateYear, dateMonth, dateDay).getTime());
            if (p.params.closeOnSelect) {
                if (p.params.rangePicker && p.value.length === 2 || !p.params.rangePicker) p.close();
            }
        }

        p.container.find('.picker-calendar-prev-month').on('click', p.prevMonth);
        p.container.find('.picker-calendar-next-month').on('click', p.nextMonth);
        p.container.find('.picker-calendar-prev-year').on('click', p.prevYear);
        p.container.find('.picker-calendar-next-year').on('click', p.nextYear);
        p.wrapper.on('click', handleDayClick);
        if (p.params.touchMove) {
            p.wrapper.on(app.touchEvents.start, handleTouchStart);
            p.wrapper.on(app.touchEvents.move, handleTouchMove);
            p.wrapper.on(app.touchEvents.end, handleTouchEnd);
        }

        p.container[0].f7DestroyCalendarEvents = function () {
            p.container.find('.picker-calendar-prev-month').off('click', p.prevMonth);
            p.container.find('.picker-calendar-next-month').off('click', p.nextMonth);
            p.container.find('.picker-calendar-prev-year').off('click', p.prevYear);
            p.container.find('.picker-calendar-next-year').off('click', p.nextYear);
            p.wrapper.off('click', handleDayClick);
            if (p.params.touchMove) {
                p.wrapper.off(app.touchEvents.start, handleTouchStart);
                p.wrapper.off(app.touchEvents.move, handleTouchMove);
                p.wrapper.off(app.touchEvents.end, handleTouchEnd);
            }
        };


    };
    p.destroyCalendarEvents = function (colContainer) {
        if ('f7DestroyCalendarEvents' in p.container[0]) p.container[0].f7DestroyCalendarEvents();
    };

    // Scan Dates Range
    p.dateInRange = function (dayDate, range) {
        var match = false;
        var i;
        if (!range) return false;
        if ($.isArray(range)) {
            for (i = 0; i < range.length; i ++) {
                if (range[i].from || range[i].to) {
                    if (range[i].from && range[i].to) {
                        if ((dayDate <= new Date(range[i].to).getTime()) && (dayDate >= new Date(range[i].from).getTime())) {
                            match = true;
                        }
                    }
                    else if (range[i].from) {
                        if (dayDate >= new Date(range[i].from).getTime()) {
                            match = true;
                        }
                    }
                    else if (range[i].to) {
                        if (dayDate <= new Date(range[i].to).getTime()) {
                            match = true;
                        }
                    }
                } else if (dayDate === new Date(range[i]).getTime()) {
                    match = true;
                }
            }
        }
        else if (range.from || range.to) {
            if (range.from && range.to) {
                if ((dayDate <= new Date(range.to).getTime()) && (dayDate >= new Date(range.from).getTime())) {
                    match = true;
                }
            }
            else if (range.from) {
                if (dayDate >= new Date(range.from).getTime()) {
                    match = true;
                }
            }
            else if (range.to) {
                if (dayDate <= new Date(range.to).getTime()) {
                    match = true;
                }
            }
        }
        else if (typeof range === 'function') {
            match = range(new Date(dayDate));
        }
        return match;
    };
    // Calendar Methods
    p.daysInMonth = function (date) {
        var d = new Date(date);
        return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    };
    p.monthHTML = function (date, offset) {
        date = new Date(date);
        var year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate();
        if (offset === 'next') {
            if (month === 11) date = new Date(year + 1, 0);
            else date = new Date(year, month + 1, 1);
        }
        if (offset === 'prev') {
            if (month === 0) date = new Date(year - 1, 11);
            else date = new Date(year, month - 1, 1);
        }
        if (offset === 'next' || offset === 'prev') {
            month = date.getMonth();
            year = date.getFullYear();
        }
        var daysInPrevMonth = p.daysInMonth(new Date(date.getFullYear(), date.getMonth()).getTime() - 10 * 24 * 60 * 60 * 1000),
            daysInMonth = p.daysInMonth(date),
            firstDayOfMonthIndex = new Date(date.getFullYear(), date.getMonth()).getDay();
        if (firstDayOfMonthIndex === 0) firstDayOfMonthIndex = 7;

        var dayDate, currentValues = [], i, j, k,
            rows = 6, cols = 7,
            monthHTML = '',
            dayIndex = 0 + (p.params.firstDay - 1),
            today = new Date().setHours(0,0,0,0),
            minDate = p.params.minDate ? new Date(p.params.minDate).getTime() : null,
            maxDate = p.params.maxDate ? new Date(p.params.maxDate).getTime() : null,
            disabled,
            hasEvent;

        if (p.value && p.value.length) {
            for (i = 0; i < p.value.length; i++) {
                currentValues.push(new Date(p.value[i]).setHours(0,0,0,0));
            }
        }

        for (i = 1; i <= rows; i++) {
            var rowHTML = '';
            var row = i;
            for (j = 1; j <= cols; j++) {
                var col = j;
                dayIndex ++;
                var dayNumber = dayIndex - firstDayOfMonthIndex;
                var weekDayIndex = (col - 1 + p.params.firstDay > 6) ? (col - 1 - 7 + p.params.firstDay) : (col - 1 + p.params.firstDay);
                var addClass = '';
                if (dayNumber < 0) {
                    dayNumber = daysInPrevMonth + dayNumber + 1;
                    addClass += ' picker-calendar-day-prev';
                    dayDate = new Date(month - 1 < 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1, dayNumber).getTime();
                }
                else {
                    dayNumber = dayNumber + 1;
                    if (dayNumber > daysInMonth) {
                        dayNumber = dayNumber - daysInMonth;
                        addClass += ' picker-calendar-day-next';
                        dayDate = new Date(month + 1 > 11 ? year + 1 : year, month + 1 > 11 ? 0 : month + 1, dayNumber).getTime();
                    }
                    else {
                        dayDate = new Date(year, month, dayNumber).getTime();
                    }
                }
                // Today
                if (dayDate === today) addClass += ' picker-calendar-day-today';
                // Selected
                if (p.params.rangePicker && currentValues.length === 2) {
                    if (dayDate >= currentValues[0] && dayDate <= currentValues[1]) addClass += ' picker-calendar-day-selected';
                }
                else {
                    if (currentValues.indexOf(dayDate) >= 0) addClass += ' picker-calendar-day-selected';
                }
                // Weekend
                if (p.params.weekendDays.indexOf(weekDayIndex) >= 0) {
                    addClass += ' picker-calendar-day-weekend';
                }
                // Has Events
                hasEvent = false;
                if (p.params.events) {
                    if (p.dateInRange(dayDate, p.params.events)) {
                        hasEvent = true;
                    }
                }
                if (hasEvent) {
                    addClass += ' picker-calendar-day-has-events';
                }
                // Custom Ranges
                if (p.params.rangesClasses) {
                    for (k = 0; k < p.params.rangesClasses.length; k++) {
                        if (p.dateInRange(dayDate, p.params.rangesClasses[k].range)) {
                            addClass += ' ' + p.params.rangesClasses[k].cssClass;
                        }
                    }
                }
                // Disabled
                disabled = false;
                if ((minDate && dayDate < minDate) || (maxDate && dayDate > maxDate)) {
                    disabled = true;
                }
                if (p.params.disabled) {
                    if (p.dateInRange(dayDate, p.params.disabled)) {
                        disabled = true;
                    }
                }
                if (disabled) {
                    addClass += ' picker-calendar-day-disabled';
                }


                dayDate = new Date(dayDate);
                var dayYear = dayDate.getFullYear();
                var dayMonth = dayDate.getMonth();
                rowHTML += '<div data-year="' + dayYear + '" data-month="' + dayMonth + '" data-day="' + dayNumber + '" class="picker-calendar-day' + (addClass) + '" data-date="' + (dayYear + '-' + dayMonth + '-' + dayNumber) + '"><span>'+dayNumber+'</span></div>';
            }
            monthHTML += '<div class="picker-calendar-row">' + rowHTML + '</div>';
        }
        monthHTML = '<div class="picker-calendar-month" data-year="' + year + '" data-month="' + month + '">' + monthHTML + '</div>';
        return monthHTML;
    };
    p.animating = false;
    p.updateCurrentMonthYear = function (dir) {
        if (typeof dir === 'undefined') {
            p.currentMonth = parseInt(p.months.eq(1).attr('data-month'), 10);
            p.currentYear = parseInt(p.months.eq(1).attr('data-year'), 10);
        }
        else {
            p.currentMonth = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-month'), 10);
            p.currentYear = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-year'), 10);
        }
        p.container.find('.current-month-value').text(p.params.monthNames[p.currentMonth]);
        p.container.find('.current-year-value').text(p.currentYear);

    };
    p.onMonthChangeStart = function (dir) {
        p.updateCurrentMonthYear(dir);
        p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
        var currentIndex = dir === 'next' ? p.months.length - 1 : 0;

        p.months.eq(currentIndex).addClass('picker-calendar-month-current');
        p.months.eq(dir === 'next' ? currentIndex - 1 : currentIndex + 1).addClass(dir === 'next' ? 'picker-calendar-month-prev' : 'picker-calendar-month-next');

        if (p.params.onMonthYearChangeStart) {
            p.params.onMonthYearChangeStart(p, p.currentYear, p.currentMonth);
        }
    };
    p.onMonthChangeEnd = function (dir, rebuildBoth) {
        p.animating = false;
        var nextMonthHTML, prevMonthHTML, newMonthHTML;
        p.wrapper.find('.picker-calendar-month:not(.picker-calendar-month-prev):not(.picker-calendar-month-current):not(.picker-calendar-month-next)').remove();

        if (typeof dir === 'undefined') {
            dir = 'next';
            rebuildBoth = true;
        }
        if (!rebuildBoth) {
            newMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), dir);
        }
        else {
            p.wrapper.find('.picker-calendar-month-next, .picker-calendar-month-prev').remove();
            prevMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'prev');
            nextMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'next');
        }
        if (dir === 'next' || rebuildBoth) {
            p.wrapper.append(newMonthHTML || nextMonthHTML);
        }
        if (dir === 'prev' || rebuildBoth) {
            p.wrapper.prepend(newMonthHTML || prevMonthHTML);
        }
        p.months = p.wrapper.find('.picker-calendar-month');
        p.setMonthsTranslate(p.monthsTranslate);
        if (p.params.onMonthAdd) {
            p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
        }
        if (p.params.onMonthYearChangeEnd) {
            p.params.onMonthYearChangeEnd(p, p.currentYear, p.currentMonth);
        }
    };
    p.setMonthsTranslate = function (translate) {
        translate = translate || p.monthsTranslate || 0;
        if (typeof p.monthsTranslate === 'undefined') p.monthsTranslate = translate;
        p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
        var prevMonthTranslate = -(translate + 1) * 100 * inverter;
        var currentMonthTranslate = -translate * 100 * inverter;
        var nextMonthTranslate = -(translate - 1) * 100 * inverter;
        p.months.eq(0).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
        p.months.eq(1).transform('translate3d(' + (p.isH ? currentMonthTranslate : 0) + '%, ' + (p.isH ? 0 : currentMonthTranslate) + '%, 0)').addClass('picker-calendar-month-current');
        p.months.eq(2).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
    };
    p.nextMonth = function (transition) {
        if (typeof transition === 'undefined' || typeof transition === 'object') {
            transition = '';
            if (!p.params.animate) transition = 0;
        }
        var nextMonth = parseInt(p.months.eq(p.months.length - 1).attr('data-month'), 10);
        var nextYear = parseInt(p.months.eq(p.months.length - 1).attr('data-year'), 10);
        var nextDate = new Date(nextYear, nextMonth);
        var nextDateTime = nextDate.getTime();
        var transitionEndCallback = p.animating ? false : true;
        if (p.params.maxDate) {
            if (nextDateTime > new Date(p.params.maxDate).getTime()) {
                return p.resetMonth();
            }
        }
        p.monthsTranslate --;
        if (nextMonth === p.currentMonth) {
            var nextMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
            var nextMonthHTML = $(p.monthHTML(nextDateTime, 'next')).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
            p.wrapper.append(nextMonthHTML[0]);
            p.months = p.wrapper.find('.picker-calendar-month');
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, p.months.eq(p.months.length - 1)[0]);
            }
        }
        p.animating = true;
        p.onMonthChangeStart('next');
        var translate = (p.monthsTranslate * 100) * inverter;

        p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
        if (transitionEndCallback) {
            p.wrapper.transitionEnd(function () {
                p.onMonthChangeEnd('next');
            });
        }
        if (!p.params.animate) {
            p.onMonthChangeEnd('next');
        }
    };
    p.prevMonth = function (transition) {
        if (typeof transition === 'undefined' || typeof transition === 'object') {
            transition = '';
            if (!p.params.animate) transition = 0;
        }
        var prevMonth = parseInt(p.months.eq(0).attr('data-month'), 10);
        var prevYear = parseInt(p.months.eq(0).attr('data-year'), 10);
        var prevDate = new Date(prevYear, prevMonth + 1, -1);
        var prevDateTime = prevDate.getTime();
        var transitionEndCallback = p.animating ? false : true;
        if (p.params.minDate) {
            if (prevDateTime < new Date(p.params.minDate).getTime()) {
                return p.resetMonth();
            }
        }
        p.monthsTranslate ++;
        if (prevMonth === p.currentMonth) {
            var prevMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
            var prevMonthHTML = $(p.monthHTML(prevDateTime, 'prev')).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
            p.wrapper.prepend(prevMonthHTML[0]);
            p.months = p.wrapper.find('.picker-calendar-month');
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, p.months.eq(0)[0]);
            }
        }
        p.animating = true;
        p.onMonthChangeStart('prev');
        var translate = (p.monthsTranslate * 100) * inverter;
        p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
        if (transitionEndCallback) {
            p.wrapper.transitionEnd(function () {
                p.onMonthChangeEnd('prev');
            });
        }
        if (!p.params.animate) {
            p.onMonthChangeEnd('prev');
        }
    };
    p.resetMonth = function (transition) {
        if (typeof transition === 'undefined') transition = '';
        var translate = (p.monthsTranslate * 100) * inverter;
        p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
    };
    p.setYearMonth = function (year, month, transition) {
        if (typeof year === 'undefined') year = p.currentYear;
        if (typeof month === 'undefined') month = p.currentMonth;
        if (typeof transition === 'undefined' || typeof transition === 'object') {
            transition = '';
            if (!p.params.animate) transition = 0;
        }
        var targetDate;
        if (year < p.currentYear) {
            targetDate = new Date(year, month + 1, -1).getTime();
        }
        else {
            targetDate = new Date(year, month).getTime();
        }
        if (p.params.maxDate && targetDate > new Date(p.params.maxDate).getTime()) {
            return false;
        }
        if (p.params.minDate && targetDate < new Date(p.params.minDate).getTime()) {
            return false;
        }
        var currentDate = new Date(p.currentYear, p.currentMonth).getTime();
        var dir = targetDate > currentDate ? 'next' : 'prev';
        var newMonthHTML = p.monthHTML(new Date(year, month));
        p.monthsTranslate = p.monthsTranslate || 0;
        var prevTranslate = p.monthsTranslate;
        var monthTranslate, wrapperTranslate;
        var transitionEndCallback = p.animating ? false : true;
        if (targetDate > currentDate) {
            // To next
            p.monthsTranslate --;
            if (!p.animating) p.months.eq(p.months.length - 1).remove();
            p.wrapper.append(newMonthHTML);
            p.months = p.wrapper.find('.picker-calendar-month');
            monthTranslate = -(prevTranslate - 1) * 100 * inverter;
            p.months.eq(p.months.length - 1).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
        }
        else {
            // To prev
            p.monthsTranslate ++;
            if (!p.animating) p.months.eq(0).remove();
            p.wrapper.prepend(newMonthHTML);
            p.months = p.wrapper.find('.picker-calendar-month');
            monthTranslate = -(prevTranslate + 1) * 100 * inverter;
            p.months.eq(0).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
        }
        if (p.params.onMonthAdd) {
            p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
        }
        p.animating = true;
        p.onMonthChangeStart(dir);
        wrapperTranslate = (p.monthsTranslate * 100) * inverter;
        p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? wrapperTranslate : 0) + '%, ' + (p.isH ? 0 : wrapperTranslate) + '%, 0)');
        if (transitionEndCallback) {
           p.wrapper.transitionEnd(function () {
                p.onMonthChangeEnd(dir, true);
            });
        }
        if (!p.params.animate) {
            p.onMonthChangeEnd(dir);
        }
    };
    p.nextYear = function () {
        p.setYearMonth(p.currentYear + 1);
    };
    p.prevYear = function () {
        p.setYearMonth(p.currentYear - 1);
    };


    // HTML Layout
    p.layout = function () {
        var pickerHTML = '';
        var pickerClass = '';
        var i;

        var layoutDate = p.value && p.value.length ? p.value[0] : new Date().setHours(0,0,0,0);
        var prevMonthHTML = p.monthHTML(layoutDate, 'prev');
        var currentMonthHTML = p.monthHTML(layoutDate);
        var nextMonthHTML = p.monthHTML(layoutDate, 'next');
        var monthsHTML = '<div class="picker-calendar-months"><div class="picker-calendar-months-wrapper">' + (prevMonthHTML + currentMonthHTML + nextMonthHTML) + '</div></div>';
        // Week days header
        var weekHeaderHTML = '';
        if (p.params.weekHeader) {
            for (i = 0; i < 7; i++) {
                var weekDayIndex = (i + p.params.firstDay > 6) ? (i - 7 + p.params.firstDay) : (i + p.params.firstDay);
                var dayName = p.params.dayNamesShort[weekDayIndex];
                weekHeaderHTML += '<div class="picker-calendar-week-day ' + ((p.params.weekendDays.indexOf(weekDayIndex) >= 0) ? 'picker-calendar-week-day-weekend' : '') + '"> ' + dayName + '</div>';

            }
            weekHeaderHTML = '<div class="picker-calendar-week-days">' + weekHeaderHTML + '</div>';
        }
        pickerClass = 'picker-modal picker-calendar' +
                    (p.params.rangePicker ? ' picker-calendar-range' : '') +
                    (p.params.cssClass ? ' ' + p.params.cssClass : '');
        var toolbarHTML = p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '';
        if (p.params.toolbar) {
            toolbarHTML = p.params.toolbarTemplate
                .replace(/{{closeText}}/g, p.params.toolbarCloseText)
                .replace(/{{monthPicker}}/g, (p.params.monthPicker ? p.params.monthPickerTemplate : ''))
                .replace(/{{yearPicker}}/g, (p.params.yearPicker ? p.params.yearPickerTemplate : ''));
        }
        var headerHTML = p.params.header ? p.params.headerTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText).replace(/{{placeholder}}/g, p.params.headerPlaceholder) : '';
        var footerHTML = p.params.footer ? p.params.footerTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '';

        pickerHTML =
            '<div class="' + (pickerClass) + '">' +
                headerHTML +
                footerHTML +
                toolbarHTML +
                '<div class="picker-modal-inner">' +
                    weekHeaderHTML +
                    monthsHTML +
                '</div>' +
            '</div>';


        p.pickerHTML = pickerHTML;
    };

    // Input Events
    function openOnInput(e) {
        e.preventDefault();
        if (p.opened) return;
        p.open();
        if (p.params.scrollToInput && !isPopover() && !app.params.material) {
            var pageContent = p.input.parents('.page-content');
            if (pageContent.length === 0) return;

            var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                newPaddingBottom;

            var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
            if (inputTop > pageHeight) {
                var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                if (scrollTop + pageHeight > pageScrollHeight) {
                    newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                    if (pageHeight === pageScrollHeight) {
                        newPaddingBottom = p.container.height();
                    }
                    pageContent.css({'padding-bottom': (newPaddingBottom) + 'px'});
                }
                pageContent.scrollTop(scrollTop, 300);
            }
        }
    }
    function closeOnHTMLClick(e) {
        if (inPopover()) return;
        if (p.input && p.input.length > 0) {
            if (e.target !== p.input[0] && $(e.target).parents('.picker-modal').length === 0) p.close();
        }
        else {
            if ($(e.target).parents('.picker-modal').length === 0) p.close();
        }
    }

    if (p.params.input) {
        p.input = $(p.params.input);
        if (p.input.length > 0) {
            if (p.params.inputReadOnly) p.input.prop('readOnly', true);
            if (!p.inline) {
                p.input.on('click', openOnInput);
            }
            if (p.params.inputReadOnly) {
                p.input.on('focus mousedown', function (e) {
                    e.preventDefault();
                });
            }
        }

    }

    if (!p.inline && p.params.closeByOutsideClick) $('html').on('click', closeOnHTMLClick);

    // Open
    function onPickerClose() {
        p.opened = false;
        if (p.input && p.input.length > 0) {
            p.input.parents('.page-content').css({'padding-bottom': ''});
            if (app.params.material) p.input.trigger('blur');
        }
        if (p.params.onClose) p.params.onClose(p);

        // Destroy events
        p.destroyCalendarEvents();
    }

    p.opened = false;
    p.open = function () {
        var toPopover = isPopover();
        var updateValue = false;
        if (!p.opened) {
            // Set date value
            if (!p.value) {
                if (p.params.value) {
                    p.value = p.params.value;
                    updateValue = true;
                }
            }

            // Layout
            p.layout();

            // Append
            if (toPopover) {
                p.pickerHTML = '<div class="popover popover-picker-calendar"><div class="popover-inner">' + p.pickerHTML + '</div></div>';
                p.popover = app.popover(p.pickerHTML, p.params.input, true);
                p.container = $(p.popover).find('.picker-modal');
                $(p.popover).on('close', function () {
                    onPickerClose();
                });
            }
            else if (p.inline) {
                p.container = $(p.pickerHTML);
                p.container.addClass('picker-modal-inline');
                $(p.params.container).append(p.container);
            }
            else {
                p.container = $(app.pickerModal(p.pickerHTML));
                $(p.container)
                .on('close', function () {
                    onPickerClose();
                });
            }

            // Store calendar instance
            p.container[0].f7Calendar = p;
            p.wrapper = p.container.find('.picker-calendar-months-wrapper');

            // Months
            p.months = p.wrapper.find('.picker-calendar-month');

            // Update current month and year
            p.updateCurrentMonthYear();

            // Set initial translate
            p.monthsTranslate = 0;
            p.setMonthsTranslate();

            // Init events
            p.initCalendarEvents();

            // Update input value
            if (updateValue) p.updateValue();
            else if (app.params.material && p.value) p.updateValue(true);

            // Material Focus
            if (p.input && p.input.length > 0 && app.params.material) {
                p.input.trigger('focus');
            }

        }

        // Set flag
        p.opened = true;
        p.initialized = true;
        if (p.params.onMonthAdd) {
            p.months.each(function () {
                p.params.onMonthAdd(p, this);
            });
        }
        if (p.params.onOpen) p.params.onOpen(p);
    };

    // Close
    p.close = function () {
        if (!p.opened || p.inline) return;
        if (inPopover()) {
            app.closeModal(p.popover);
            return;
        }
        else {
            app.closeModal(p.container);
            return;
        }
    };

    // Destroy
    p.destroy = function () {
        p.close();
        if (p.params.input && p.input.length > 0) {
            p.input.off('click focus', openOnInput);
        }
        $('html').off('click', closeOnHTMLClick);
    };

    if (p.inline) {
        p.open();
    }
    else {
        if (!p.initialized && p.params.value) p.setValue(p.params.value);
    }

    return p;
};
app.calendar = function (params) {
    return new Calendar(params);
};

/*===========================
Compile Template7 Templates On App Init
===========================*/
app.initTemplate7Templates = function () {
    if (!window.Template7) return;
    Template7.templates = Template7.templates || app.params.templates || {};
    Template7.data = Template7.data || app.params.template7Data || {};
    Template7.cache = Template7.cache || {};

    app.templates = Template7.templates;
    app.template7Data = Template7.data;
    app.template7Cache = Template7.cache;

    // Precompile templates on app init
    if (!app.params.precompileTemplates) return;
    $('script[type="text/template7"]').each(function () {
        var id = $(this).attr('id');
        if (!id) return;
        Template7.templates[id] = Template7.compile($(this).html());
    });
};

/*=======================================
************   Plugins API   ************
=======================================*/
var _plugins = [];
app.initPlugins = function () {
    // Initialize plugins
    for (var plugin in app.plugins) {
        var p = app.plugins[plugin](app, app.params[plugin]);
        if (p) _plugins.push(p);
    }
};
// Plugin Hooks
app.pluginHook = function (hook) {
    for (var i = 0; i < _plugins.length; i++) {
        if (_plugins[i].hooks && hook in _plugins[i].hooks) {
            _plugins[i].hooks[hook](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
    }
};
// Prevented by plugin
app.pluginPrevent = function (action) {
    var prevent = false;
    for (var i = 0; i < _plugins.length; i++) {
        if (_plugins[i].prevents && action in _plugins[i].prevents) {
            if (_plugins[i].prevents[action](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])) prevent = true;
        }
    }
    return prevent;
};
// Preprocess content by plugin
app.pluginProcess = function (process, data) {
    var processed = data;
    for (var i = 0; i < _plugins.length; i++) {
        if (_plugins[i].preprocess && process in _plugins[i].preprocess) {
            processed = _plugins[i].preprocess[process](data, arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
        }
    }
    return processed;
};


/*======================================================
************   App Init   ************
======================================================*/
app.init = function () {
    // Compile Template7 templates on app load
    if (app.initTemplate7Templates) app.initTemplate7Templates();
    
    // Init Plugins
    if (app.initPlugins) app.initPlugins();
    
    // Init Device
    if (app.getDeviceInfo) app.getDeviceInfo();
    
    // Init Click events
    if (app.initFastClicks && app.params.fastClicks) app.initFastClicks();
    if (app.initClickEvents) app.initClickEvents();

    // Init each page callbacks
    $('.page:not(.cached)').each(function () {
        app.initPageWithCallback(this);
    });

    // Init each navbar callbacks
    $('.navbar:not(.cached)').each(function () {
        app.initNavbarWithCallback(this); 
    });
    
    // Init resize events
    if (app.initResize) app.initResize();

    // Init push state
    if (app.initPushState && app.params.pushState) app.initPushState();

    // Init Live Swipeouts events
    if (app.initSwipeout && app.params.swipeout) app.initSwipeout();

    // Init Live Sortable events
    if (app.initSortable && app.params.sortable) app.initSortable();

    // Init Live Swipe Panels
    if (app.initSwipePanels && (app.params.swipePanel || app.params.swipePanelOnlyClose)) app.initSwipePanels();
    
    // Init Material Inputs
    if (app.params.material && app.initMaterialWatchInputs) app.initMaterialWatchInputs();
    
    // App Init callback
    if (app.params.onAppInit) app.params.onAppInit();

    // Plugin app init hook
    app.pluginHook('appInit');
};
if (app.params.init) app.init();

    //Return instance        
    return app;
};

/*===========================
Dom7 Library
===========================*/
var Dom7 = (function () {
    var Dom7 = function (arr) {
        var _this = this, i = 0;
        // Create array-like object
        for (i = 0; i < arr.length; i++) {
            _this[i] = arr[i];
        }
        _this.length = arr.length;
        // Return collection with methods
        return this;
    };
    var $ = function (selector, context) {
        var arr = [], i = 0;
        if (selector && !context) {
            if (selector instanceof Dom7) {
                return selector;
            }
        }
        if (selector) {
            // String
            if (typeof selector === 'string') {
                var els, tempParent, html;
                selector = html = selector.trim();
                if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
                    var toCreate = 'div';
                    if (html.indexOf('<li') === 0) toCreate = 'ul';
                    if (html.indexOf('<tr') === 0) toCreate = 'tbody';
                    if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
                    if (html.indexOf('<tbody') === 0) toCreate = 'table';
                    if (html.indexOf('<option') === 0) toCreate = 'select';
                    tempParent = document.createElement(toCreate);
                    tempParent.innerHTML = html;
                    for (i = 0; i < tempParent.childNodes.length; i++) {
                        arr.push(tempParent.childNodes[i]);
                    }
                }
                else {
                    if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                        // Pure ID selector
                        els = [document.getElementById(selector.split('#')[1])];
                    }
                    else {
                        // Other selectors
                        els = (context || document).querySelectorAll(selector);
                    }
                    for (i = 0; i < els.length; i++) {
                        if (els[i]) arr.push(els[i]);
                    }
                }
            }
            // Node/element
            else if (selector.nodeType || selector === window || selector === document) {
                arr.push(selector);
            }
            //Array of elements or instance of Dom
            else if (selector.length > 0 && selector[0].nodeType) {
                for (i = 0; i < selector.length; i++) {
                    arr.push(selector[i]);
                }
            }
        }
        return new Dom7(arr);
    };
Dom7.prototype = {
    // Classes and attriutes
    addClass: function (className) {
        if (typeof className === 'undefined') {
            return this;
        }
        var classes = className.split(' ');
        for (var i = 0; i < classes.length; i++) {
            for (var j = 0; j < this.length; j++) {
                if (typeof this[j].classList !== 'undefined') this[j].classList.add(classes[i]);
            }
        }
        return this;
    },
    removeClass: function (className) {
        var classes = className.split(' ');
        for (var i = 0; i < classes.length; i++) {
            for (var j = 0; j < this.length; j++) {
                if (typeof this[j].classList !== 'undefined') this[j].classList.remove(classes[i]);
            }
        }
        return this;
    },
    hasClass: function (className) {
        if (!this[0]) return false;
        else return this[0].classList.contains(className);
    },
    toggleClass: function (className) {
        var classes = className.split(' ');
        for (var i = 0; i < classes.length; i++) {
            for (var j = 0; j < this.length; j++) {
                if (typeof this[j].classList !== 'undefined') this[j].classList.toggle(classes[i]);
            }
        }
        return this;
    },
    attr: function (attrs, value) {
        if (arguments.length === 1 && typeof attrs === 'string') {
            // Get attr
            if (this[0]) return this[0].getAttribute(attrs);
            else return undefined;
        }
        else {
            // Set attrs
            for (var i = 0; i < this.length; i++) {
                if (arguments.length === 2) {
                    // String
                    this[i].setAttribute(attrs, value);
                }
                else {
                    // Object
                    for (var attrName in attrs) {
                        this[i][attrName] = attrs[attrName];
                        this[i].setAttribute(attrName, attrs[attrName]);
                    }
                }
            }
            return this;
        }
    },
    removeAttr: function (attr) {
        for (var i = 0; i < this.length; i++) {
            this[i].removeAttribute(attr);
        }
        return this;
    },
    prop: function (props, value) {
        if (arguments.length === 1 && typeof props === 'string') {
            // Get prop
            if (this[0]) return this[0][props];
            else return undefined;
        }
        else {
            // Set props
            for (var i = 0; i < this.length; i++) {
                if (arguments.length === 2) {
                    // String
                    this[i][props] = value;
                }
                else {
                    // Object
                    for (var propName in props) {
                        this[i][propName] = props[propName];
                    }
                }
            }
            return this;
        }
    },
    data: function (key, value) {
        if (typeof value === 'undefined') {
            // Get value
            if (this[0]) {
                if (this[0].dom7ElementDataStorage && (key in this[0].dom7ElementDataStorage)) {
                    return this[0].dom7ElementDataStorage[key];
                }
                else {
                    var dataKey = this[0].getAttribute('data-' + key);    
                    if (dataKey) {
                        return dataKey;
                    }
                    else return undefined;
                }
            }
            else return undefined;
        }
        else {
            // Set value
            for (var i = 0; i < this.length; i++) {
                var el = this[i];
                if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
                el.dom7ElementDataStorage[key] = value;
            }
            return this;
        }
    },
    removeData: function(key) {
        for (var i = 0; i < this.length; i++) {
            var el = this[i];
            if (el.dom7ElementDataStorage && el.dom7ElementDataStorage[key]) {
                el.dom7ElementDataStorage[key] = null;
                delete el.dom7ElementDataStorage[key];
            }
        }
    },
    dataset: function () {
        var el = this[0];
        if (el) {
            var dataset = {};
            if (el.dataset) {
                for (var dataKey in el.dataset) {
                    dataset[dataKey] = el.dataset[dataKey];
                }
            }
            else {
                for (var i = 0; i < el.attributes.length; i++) {
                    var attr = el.attributes[i];
                    if (attr.name.indexOf('data-') >= 0) {
                        dataset[$.toCamelCase(attr.name.split('data-')[1])] = attr.value;
                    }
                }
            }
            for (var key in dataset) {
                if (dataset[key] === 'false') dataset[key] = false;
                else if (dataset[key] === 'true') dataset[key] = true;
                else if (parseFloat(dataset[key]) === dataset[key] * 1) dataset[key] = dataset[key] * 1;
            }
            return dataset;
        }
        else return undefined;
    },
    val: function (value) {
        if (typeof value === 'undefined') {
            if (this[0]) return this[0].value;
            else return undefined;
        }
        else {
            for (var i = 0; i < this.length; i++) {
                this[i].value = value;
            }
            return this;
        }
    },
    // Transforms
    transform : function (transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
        }
        return this;
    },
    transition: function (duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    },
    //Events
    on: function (eventName, targetSelector, listener, capture) {
        function handleLiveEvent(e) {
            var target = e.target;
            if ($(target).is(targetSelector)) listener.call(target, e);
            else {
                var parents = $(target).parents();
                for (var k = 0; k < parents.length; k++) {
                    if ($(parents[k]).is(targetSelector)) listener.call(parents[k], e);
                }
            }
        }
        var events = eventName.split(' ');
        var i, j;
        for (i = 0; i < this.length; i++) {
            if (typeof targetSelector === 'function' || targetSelector === false) {
                // Usual events
                if (typeof targetSelector === 'function') {
                    listener = arguments[1];
                    capture = arguments[2] || false;
                }
                for (j = 0; j < events.length; j++) {
                    this[i].addEventListener(events[j], listener, capture);
                }
            }
            else {
                //Live events
                for (j = 0; j < events.length; j++) {
                    if (!this[i].dom7LiveListeners) this[i].dom7LiveListeners = [];
                    this[i].dom7LiveListeners.push({listener: listener, liveListener: handleLiveEvent});
                    this[i].addEventListener(events[j], handleLiveEvent, capture);
                }
            }
        }

        return this;
    },
    off: function (eventName, targetSelector, listener, capture) {
        var events = eventName.split(' ');
        for (var i = 0; i < events.length; i++) {
            for (var j = 0; j < this.length; j++) {
                if (typeof targetSelector === 'function' || targetSelector === false) {
                    // Usual events
                    if (typeof targetSelector === 'function') {
                        listener = arguments[1];
                        capture = arguments[2] || false;
                    }
                    this[j].removeEventListener(events[i], listener, capture);
                }
                else {
                    // Live event
                    if (this[j].dom7LiveListeners) {
                        for (var k = 0; k < this[j].dom7LiveListeners.length; k++) {
                            if (this[j].dom7LiveListeners[k].listener === listener) {
                                this[j].removeEventListener(events[i], this[j].dom7LiveListeners[k].liveListener, capture);
                            }
                        }
                    }
                }
            }
        }
        return this;
    },
    once: function (eventName, targetSelector, listener, capture) {
        var dom = this;
        if (typeof targetSelector === 'function') {
            listener = arguments[1];
            capture = arguments[2];
            targetSelector = false;
        }
        function proxy(e) {
            listener.call(e.target, e);
            dom.off(eventName, targetSelector, proxy, capture);
        }
        return dom.on(eventName, targetSelector, proxy, capture);
    },
    trigger: function (eventName, eventData) {
        var events = eventName.split(' ');
        for (var i = 0; i < events.length; i++) {
            for (var j = 0; j < this.length; j++) {
                var evt;
                try {
                    evt = new CustomEvent(events[i], {detail: eventData, bubbles: true, cancelable: true});
                }
                catch (e) {
                    evt = document.createEvent('Event');
                    evt.initEvent(events[i], true, true);
                    evt.detail = eventData;
                }
                this[j].dispatchEvent(evt);
            }
        }
        return this;
    },
    transitionEnd: function (callback) {
        var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i, j, dom = this;
        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    },
    animationEnd: function (callback) {
        var events = ['webkitAnimationEnd', 'OAnimationEnd', 'MSAnimationEnd', 'animationend'],
            i, j, dom = this;
        function fireCallBack(e) {
            callback(e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    },
    // Sizing/Styles
    width: function () {
        if (this[0] === window) {
            return window.innerWidth;
        }
        else {
            if (this.length > 0) {
                return parseFloat(this.css('width'));
            }
            else {
                return null;
            }
        }
    },
    outerWidth: function (includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                var styles = this.styles();
                return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));    
            }
            else
                return this[0].offsetWidth;
        }
        else return null;
    },
    height: function () {
        if (this[0] === window) {
            return window.innerHeight;
        }
        else {
            if (this.length > 0) {
                return parseFloat(this.css('height'));
            }
            else {
                return null;
            }
        }
    },
    outerHeight: function (includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                var styles = this.styles();
                return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));    
            }
            else
                return this[0].offsetHeight;
        }
        else return null;
    },
    offset: function () {
        if (this.length > 0) {
            var el = this[0];
            var box = el.getBoundingClientRect();
            var body = document.body;
            var clientTop  = el.clientTop  || body.clientTop  || 0;
            var clientLeft = el.clientLeft || body.clientLeft || 0;
            var scrollTop  = window.pageYOffset || el.scrollTop;
            var scrollLeft = window.pageXOffset || el.scrollLeft;
            return {
                top: box.top  + scrollTop  - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        }
        else {
            return null;
        }
    },
    hide: function () {
        for (var i = 0; i < this.length; i++) {
            this[i].style.display = 'none';
        }
        return this;
    },
    show: function () {
        for (var i = 0; i < this.length; i++) {
            this[i].style.display = 'block';
        }
        return this;
    },
    styles: function () {
        var i, styles;
        if (this[0]) return window.getComputedStyle(this[0], null);
        else return undefined;
    },
    css: function (props, value) {
        var i;
        if (arguments.length === 1) {
            if (typeof props === 'string') {
                if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
            }
            else {
                for (i = 0; i < this.length; i++) {
                    for (var prop in props) {
                        this[i].style[prop] = props[prop];
                    }
                }
                return this;
            }
        }
        if (arguments.length === 2 && typeof props === 'string') {
            for (i = 0; i < this.length; i++) {
                this[i].style[props] = value;
            }
            return this;
        }
        return this;
    },

    //Dom manipulation
    each: function (callback) {
        for (var i = 0; i < this.length; i++) {
            callback.call(this[i], i, this[i]);
        }
        return this;
    },
    filter: function (callback) {
        var matchedItems = [];
        var dom = this;
        for (var i = 0; i < dom.length; i++) {
            if (callback.call(dom[i], i, dom[i])) matchedItems.push(dom[i]);
        }
        return new Dom7(matchedItems);
    },
    html: function (html) {
        if (typeof html === 'undefined') {
            return this[0] ? this[0].innerHTML : undefined;
        }
        else {
            for (var i = 0; i < this.length; i++) {
                this[i].innerHTML = html;
            }
            return this;
        }
    },
    text: function (text) {
        if (typeof text === 'undefined') {
            if (this[0]) {
                return this[0].textContent.trim();
            }
            else return null;
        }
        else {
            for (var i = 0; i < this.length; i++) {
                this[i].textContent = text;
            }
            return this;
        }
    },
    is: function (selector) {
        if (!this[0] || typeof selector === 'undefined') return false;
        var compareWith, i;
        if (typeof selector === 'string') {
            var el = this[0];
            if (el === document) return selector === document;
            if (el === window) return selector === window;

            if (el.matches) return el.matches(selector);
            else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            else if (el.mozMatchesSelector) return el.mozMatchesSelector(selector);
            else if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            else {
                compareWith = $(selector);
                for (i = 0; i < compareWith.length; i++) {
                    if (compareWith[i] === this[0]) return true;
                }
                return false;
            }
        }
        else if (selector === document) return this[0] === document;
        else if (selector === window) return this[0] === window;
        else {
            if (selector.nodeType || selector instanceof Dom7) {
                compareWith = selector.nodeType ? [selector] : selector;
                for (i = 0; i < compareWith.length; i++) {
                    if (compareWith[i] === this[0]) return true;
                }
                return false;
            }
            return false;
        }

    },
    indexOf: function (el) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === el) return i;
        }
    },
    index: function () {
        if (this[0]) {
            var child = this[0];
            var i = 0;
            while ((child = child.previousSibling) !== null) {
                if (child.nodeType === 1) i++;
            }
            return i;
        }
        else return undefined;
    },
    eq: function (index) {
        if (typeof index === 'undefined') return this;
        var length = this.length;
        var returnIndex;
        if (index > length - 1) {
            return new Dom7([]);
        }
        if (index < 0) {
            returnIndex = length + index;
            if (returnIndex < 0) return new Dom7([]);
            else return new Dom7([this[returnIndex]]);
        }
        return new Dom7([this[index]]);
    },
    append: function (newChild) {
        var i, j;
        for (i = 0; i < this.length; i++) {
            if (typeof newChild === 'string') {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = newChild;
                while (tempDiv.firstChild) {
                    this[i].appendChild(tempDiv.firstChild);
                }
            }
            else if (newChild instanceof Dom7) {
                for (j = 0; j < newChild.length; j++) {
                    this[i].appendChild(newChild[j]);
                }
            }
            else {
                this[i].appendChild(newChild);
            }
        }
        return this;
    },
    appendTo: function (parent) {
        $(parent).append(this);
        return this;
    },
    prepend: function (newChild) {
        var i, j;
        for (i = 0; i < this.length; i++) {
            if (typeof newChild === 'string') {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = newChild;
                for (j = tempDiv.childNodes.length - 1; j >= 0; j--) {
                    this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
                }
                // this[i].insertAdjacentHTML('afterbegin', newChild);
            }
            else if (newChild instanceof Dom7) {
                for (j = 0; j < newChild.length; j++) {
                    this[i].insertBefore(newChild[j], this[i].childNodes[0]);
                }
            }
            else {
                this[i].insertBefore(newChild, this[i].childNodes[0]);
            }
        }
        return this;
    },
    prependTo: function (parent) {
        $(parent).prepend(this);
        return this;
    },
    insertBefore: function (selector) {
        var before = $(selector);
        for (var i = 0; i < this.length; i++) {
            if (before.length === 1) {
                before[0].parentNode.insertBefore(this[i], before[0]);
            }
            else if (before.length > 1) {
                for (var j = 0; j < before.length; j++) {
                    before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
                }
            }
        }
    },
    insertAfter: function (selector) {
        var after = $(selector);
        for (var i = 0; i < this.length; i++) {
            if (after.length === 1) {
                after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
            }
            else if (after.length > 1) {
                for (var j = 0; j < after.length; j++) {
                    after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
                }
            }
        }
    },
    next: function (selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) return new Dom7([this[0].nextElementSibling]);
                else return new Dom7([]);
            }
            else {
                if (this[0].nextElementSibling) return new Dom7([this[0].nextElementSibling]);
                else return new Dom7([]);
            }
        }
        else return new Dom7([]);
    },
    nextAll: function (selector) {
        var nextEls = [];
        var el = this[0];
        if (!el) return new Dom7([]);
        while (el.nextElementSibling) {
            var next = el.nextElementSibling;
            if (selector) {
                if($(next).is(selector)) nextEls.push(next);
            }
            else nextEls.push(next);
            el = next;
        }
        return new Dom7(nextEls);
    },
    prev: function (selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].previousElementSibling && $(this[0].previousElementSibling).is(selector)) return new Dom7([this[0].previousElementSibling]);
                else return new Dom7([]);
            }
            else {
                if (this[0].previousElementSibling) return new Dom7([this[0].previousElementSibling]);
                else return new Dom7([]);
            }
        }
        else return new Dom7([]);
    },
    prevAll: function (selector) {
        var prevEls = [];
        var el = this[0];
        if (!el) return new Dom7([]);
        while (el.previousElementSibling) {
            var prev = el.previousElementSibling;
            if (selector) {
                if($(prev).is(selector)) prevEls.push(prev);
            }
            else prevEls.push(prev);
            el = prev;
        }
        return new Dom7(prevEls);
    },
    parent: function (selector) {
        var parents = [];
        for (var i = 0; i < this.length; i++) {
            if (this[i].parentNode !== null) {
                if (selector) {
                    if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
                }
                else {
                   parents.push(this[i].parentNode);
                }
            }
        }
        return $($.unique(parents));
    },
    parents: function (selector) {
        var parents = [];
        for (var i = 0; i < this.length; i++) {
            var parent = this[i].parentNode;
            while (parent) {
                if (selector) {
                    if ($(parent).is(selector)) parents.push(parent);
                }
                else {
                    parents.push(parent);
                }
                parent = parent.parentNode;
            }
        }
        return $($.unique(parents));
    },
    closest: function (selector) {
        var closest = this;
        if (typeof selector === 'undefined') {
            return new Dom7([]);
        }
        if (!closest.is(selector)) {
            closest = closest.parents(selector).eq(0);
        }
        return closest;
    },
    find : function (selector) {
        var foundElements = [];
        for (var i = 0; i < this.length; i++) {
            var found = this[i].querySelectorAll(selector);
            for (var j = 0; j < found.length; j++) {
                foundElements.push(found[j]);
            }
        }
        return new Dom7(foundElements);
    },
    children: function (selector) {
        var children = [];
        for (var i = 0; i < this.length; i++) {
            var childNodes = this[i].childNodes;

            for (var j = 0; j < childNodes.length; j++) {
                if (!selector) {
                    if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
                }
                else {
                    if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) children.push(childNodes[j]);
                }
            }
        }
        return new Dom7($.unique(children));
    },
    remove: function () {
        for (var i = 0; i < this.length; i++) {
            if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
        }
        return this;
    },
    detach: function () {
        return this.remove();
    },
    add: function () {
        var dom = this;
        var i, j;
        for (i = 0; i < arguments.length; i++) {
            var toAdd = $(arguments[i]);
            for (j = 0; j < toAdd.length; j++) {
                dom[dom.length] = toAdd[j];
                dom.length++;
            }
        }
        return dom;
    }
};

// Shortcuts
(function () {
    var shortcuts = ('click blur focus focusin focusout keyup keydown keypress submit change mousedown mousemove mouseup mouseenter mouseleave mouseout mouseover touchstart touchend touchmove resize scroll').split(' ');
    var notTrigger = ('resize scroll').split(' ');
    function createMethod(name) {
        Dom7.prototype[name] = function (targetSelector, listener, capture) {
            var i;
            if (typeof targetSelector === 'undefined') {
                for (i = 0; i < this.length; i++) {
                    if (notTrigger.indexOf(name) < 0) {
                        if (name in this[i]) this[i][name]();
                        else {
                            $(this[i]).trigger(name);
                        }
                    }
                }
                return this;
            }
            else {
                return this.on(name, targetSelector, listener, capture);
            }
        };
    }
    for (var i = 0; i < shortcuts.length; i++) {
        createMethod(shortcuts[i]);
    }
})();

// Global Ajax Setup
var globalAjaxOptions = {};
$.ajaxSetup = function (options) {
    if (options.type) options.method = options.type;
    $.each(options, function (optionName, optionValue) {
        globalAjaxOptions[optionName]  = optionValue;
    });
};

// Ajax
var _jsonpRequests = 0;
$.ajax = function (options) {
    var defaults = {
        method: 'GET',
        data: false,
        async: true,
        cache: true,
        user: '',
        password: '',
        headers: {},
        xhrFields: {},
        statusCode: {},
        processData: true,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        timeout: 0
    };
    var callbacks = ['beforeSend', 'error', 'complete', 'success', 'statusCode'];


    //For jQuery guys
    if (options.type) options.method = options.type;

    // Merge global and defaults
    $.each(globalAjaxOptions, function (globalOptionName, globalOptionValue) {
        if (callbacks.indexOf(globalOptionName) < 0) defaults[globalOptionName] = globalOptionValue;
    });

    // Function to run XHR callbacks and events
    function fireAjaxCallback (eventName, eventData, callbackName) {
        var a = arguments;
        if (eventName) $(document).trigger(eventName, eventData);
        if (callbackName) {
            // Global callback
            if (callbackName in globalAjaxOptions) globalAjaxOptions[callbackName](a[3], a[4], a[5], a[6]);
            // Options callback
            if (options[callbackName]) options[callbackName](a[3], a[4], a[5], a[6]);
        }
    }

    // Merge options and defaults
    $.each(defaults, function (prop, defaultValue) {
        if (!(prop in options)) options[prop] = defaultValue;
    });

    // Default URL
    if (!options.url) {
        options.url = window.location.toString();
    }
    // Parameters Prefix
    var paramsPrefix = options.url.indexOf('?') >= 0 ? '&' : '?';

    // UC method
    var _method = options.method.toUpperCase();
    // Data to modify GET URL
    if ((_method === 'GET' || _method === 'HEAD' || _method === 'OPTIONS' || _method === 'DELETE') && options.data) {
        var stringData;
        if (typeof options.data === 'string') {
            // Should be key=value string
            if (options.data.indexOf('?') >= 0) stringData = options.data.split('?')[1];
            else stringData = options.data;
        }
        else {
            // Should be key=value object
            stringData = $.serializeObject(options.data);
        }
        if (stringData.length) {
            options.url += paramsPrefix + stringData;
            if (paramsPrefix === '?') paramsPrefix = '&';
        }
    }
    // JSONP
    if (options.dataType === 'json' && options.url.indexOf('callback=') >= 0) {

        var callbackName = 'f7jsonp_' + Date.now() + (_jsonpRequests++);
        var abortTimeout;
        var callbackSplit = options.url.split('callback=');
        var requestUrl = callbackSplit[0] + 'callback=' + callbackName;
        if (callbackSplit[1].indexOf('&') >= 0) {
            var addVars = callbackSplit[1].split('&').filter(function (el) { return el.indexOf('=') > 0; }).join('&');
            if (addVars.length > 0) requestUrl += '&' + addVars;
        }

        // Create script
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onerror = function() {
            clearTimeout(abortTimeout);
            fireAjaxCallback(undefined, undefined, 'error', null, 'scripterror');
        };
        script.src = requestUrl;

        // Handler
        window[callbackName] = function (data) {
            clearTimeout(abortTimeout);
            fireAjaxCallback(undefined, undefined, 'success', data);
            script.parentNode.removeChild(script);
            script = null;
            delete window[callbackName];
        };
        document.querySelector('head').appendChild(script);

        if (options.timeout > 0) {
            abortTimeout = setTimeout(function () {
                script.parentNode.removeChild(script);
                script = null;
                fireAjaxCallback(undefined, undefined, 'error', null, 'timeout');
            }, options.timeout);
        }

        return;
    }

    // Cache for GET/HEAD requests
    if (_method === 'GET' || _method === 'HEAD' || _method === 'OPTIONS' || _method === 'DELETE') {
        if (options.cache === false) {
            options.url += (paramsPrefix + '_nocache=' + Date.now());
        }
    }

    // Create XHR
    var xhr = new XMLHttpRequest();

    // Save Request URL
    xhr.requestUrl = options.url;
    xhr.requestParameters = options;

    // Open XHR
    xhr.open(_method, options.url, options.async, options.user, options.password);

    // Create POST Data
    var postData = null;

    if ((_method === 'POST' || _method === 'PUT' || _method === 'PATCH') && options.data) {
        if (options.processData) {
            var postDataInstances = [ArrayBuffer, Blob, Document, FormData];
            // Post Data
            if (postDataInstances.indexOf(options.data.constructor) >= 0) {
                postData = options.data;
            }
            else {
                // POST Headers
                var boundary = '---------------------------' + Date.now().toString(16);

                if (options.contentType === 'multipart\/form-data') {
                    xhr.setRequestHeader('Content-Type', 'multipart\/form-data; boundary=' + boundary);
                }
                else {
                    xhr.setRequestHeader('Content-Type', options.contentType);
                }
                postData = '';
                var _data = $.serializeObject(options.data);
                if (options.contentType === 'multipart\/form-data') {
                    boundary = '---------------------------' + Date.now().toString(16);
                    _data = _data.split('&');
                    var _newData = [];
                    for (var i = 0; i < _data.length; i++) {
                        _newData.push('Content-Disposition: form-data; name="' + _data[i].split('=')[0] + '"\r\n\r\n' + _data[i].split('=')[1] + '\r\n');
                    }
                    postData = '--' + boundary + '\r\n' + _newData.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';
                }
                else {
                    postData = options.contentType === 'application/x-www-form-urlencoded' ? _data : _data.replace(/&/g, '\r\n');
                }
            }
        }
        else {
            postData = options.data;
        }

    }

    // Additional headers
    if (options.headers) {
        $.each(options.headers, function (headerName, headerCallback) {
            xhr.setRequestHeader(headerName, headerCallback);
        });
    }

    // Check for crossDomain
    if (typeof options.crossDomain === 'undefined') {
        options.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(options.url) && RegExp.$2 !== window.location.host;
    }

    if (!options.crossDomain) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }

    if (options.xhrFields) {
        $.each(options.xhrFields, function (fieldName, fieldValue) {
            xhr[fieldName] = fieldValue;
        });
    }

    var xhrTimeout;
    // Handle XHR
    xhr.onload = function (e) {
        if (xhrTimeout) clearTimeout(xhrTimeout);
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
            var responseData;
            if (options.dataType === 'json') {
                try {
                    responseData = JSON.parse(xhr.responseText);
                    fireAjaxCallback('ajaxSuccess', {xhr: xhr}, 'success', responseData, xhr.status, xhr);
                }
                catch (err) {
                    fireAjaxCallback('ajaxError', {xhr: xhr, parseerror: true}, 'error', xhr, 'parseerror');
                }
            }
            else {
                responseData = xhr.responseType === 'text' || xhr.responseType === '' ? xhr.responseText : xhr.response;
                fireAjaxCallback('ajaxSuccess', {xhr: xhr}, 'success', responseData, xhr.status, xhr);
            }
        }
        else {
            fireAjaxCallback('ajaxError', {xhr: xhr}, 'error', xhr, xhr.status);
        }
        if (options.statusCode) {
            if (globalAjaxOptions.statusCode && globalAjaxOptions.statusCode[xhr.status]) globalAjaxOptions.statusCode[xhr.status](xhr);
            if (options.statusCode[xhr.status]) options.statusCode[xhr.status](xhr);
        }
        fireAjaxCallback('ajaxComplete', {xhr: xhr}, 'complete', xhr, xhr.status);
    };

    xhr.onerror = function (e) {
        if (xhrTimeout) clearTimeout(xhrTimeout);
        fireAjaxCallback('ajaxError', {xhr: xhr}, 'error', xhr, xhr.status);
    };

    // Ajax start callback
    fireAjaxCallback('ajaxStart', {xhr: xhr}, 'start', xhr);
    fireAjaxCallback(undefined, undefined, 'beforeSend', xhr);


    // Send XHR
    xhr.send(postData);

    // Timeout
    if (options.timeout > 0) {
        xhr.onabort = function () {
            if (xhrTimeout) clearTimeout(xhrTimeout);
        };
        xhrTimeout = setTimeout(function () {
            xhr.abort();
            fireAjaxCallback('ajaxError', {xhr: xhr, timeout: true}, 'error', xhr, 'timeout');
            fireAjaxCallback('ajaxComplete', {xhr: xhr, timeout: true}, 'complete', xhr, 'timeout');
        }, options.timeout);
    }

    // Return XHR object
    return xhr;
};
// Shrotcuts
(function () {
    var methods = ('get post getJSON').split(' ');
    function createMethod(method) {
        $[method] = function (url, data, success) {
            return $.ajax({
                url: url,
                method: method === 'post' ? 'POST' : 'GET',
                data: typeof data === 'function' ? undefined : data,
                success: typeof data === 'function' ? data : success,
                dataType: method === 'getJSON' ? 'json' : undefined
            });
        };
    }
    for (var i = 0; i < methods.length; i++) {
        createMethod(methods[i]);
    }
})();

// DOM Library Utilites
$.parseUrlQuery = function (url) {
    var query = {}, i, params, param;
    if (url.indexOf('?') >= 0) url = url.split('?')[1];
    else return query;
    params = url.split('&');
    for (i = 0; i < params.length; i++) {
        param = params[i].split('=');
        query[param[0]] = param[1];
    }
    return query;
};
$.isArray = function (arr) {
    if (Object.prototype.toString.apply(arr) === '[object Array]') return true;
    else return false;
};
$.each = function (obj, callback) {
    if (typeof obj !== 'object') return;
    if (!callback) return;
    var i, prop;
    if ($.isArray(obj) || obj instanceof Dom7) {
        // Array
        for (i = 0; i < obj.length; i++) {
            callback(i, obj[i]);
        }
    }
    else {
        // Object
        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                callback(prop, obj[prop]);
            }
        }
    }
};
$.unique = function (arr) {
    var unique = [];
    for (var i = 0; i < arr.length; i++) {
        if (unique.indexOf(arr[i]) === -1) unique.push(arr[i]);
    }
    return unique;
};
$.serializeObject = $.param = function (obj, parents) {
    if (typeof obj === 'string') return obj;
    var resultArray = [];
    var separator = '&';
    parents = parents || [];
    var newParents;
    function var_name(name) {
        if (parents.length > 0) {
            var _parents = '';
            for (var j = 0; j < parents.length; j++) {
                if (j === 0) _parents += parents[j];
                else _parents += '[' + encodeURIComponent(parents[j]) + ']';
            }
            return _parents + '[' + encodeURIComponent(name) + ']';
        }
        else {
            return encodeURIComponent(name);
        }
    }
    function var_value(value) {
        return encodeURIComponent(value);
    }
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            var toPush;
            if ($.isArray(obj[prop])) {
                toPush = [];
                for (var i = 0; i < obj[prop].length; i ++) {
                    if (!$.isArray(obj[prop][i]) && typeof obj[prop][i] === 'object') {
                        newParents = parents.slice();
                        newParents.push(prop);
                        newParents.push(i + '');
                        toPush.push($.serializeObject(obj[prop][i], newParents));
                    }
                    else {
                        toPush.push(var_name(prop) + '[]=' + var_value(obj[prop][i]));
                    }
                    
                }
                if (toPush.length > 0) resultArray.push(toPush.join(separator));
            }
            else if (typeof obj[prop] === 'object') {
                // Object, convert to named array
                newParents = parents.slice();
                newParents.push(prop);
                toPush = $.serializeObject(obj[prop], newParents);
                if (toPush !== '') resultArray.push(toPush);
            }
            else if (typeof obj[prop] !== 'undefined' && obj[prop] !== '') {
                // Should be string or plain value
                resultArray.push(var_name(prop) + '=' + var_value(obj[prop]));
            }
        }
    }
    return resultArray.join(separator);
};
$.toCamelCase = function (string) {
    return string.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
};
$.dataset = function (el) {
    return $(el).dataset();
};
$.getTranslate = function (el, axis) {
    var matrix, curTransform, curStyle, transformMatrix;

    // automatic axis detection
    if (typeof axis === 'undefined') {
        axis = 'x';
    }

    curStyle = window.getComputedStyle(el, null);
    if (window.WebKitCSSMatrix) {
        curTransform = curStyle.transform || curStyle.webkitTransform;
        if (curTransform.split(',').length > 6) {
            curTransform = curTransform.split(', ').map(function(a){
                return a.replace(',','.');
            }).join(', ');
        }
        // Some old versions of Webkit choke when 'none' is passed; pass
        // empty string instead in this case
        transformMatrix = new WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
    }
    else {
        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
        matrix = transformMatrix.toString().split(',');
    }

    if (axis === 'x') {
        //Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix)
            curTransform = transformMatrix.m41;
        //Crazy IE10 Matrix
        else if (matrix.length === 16)
            curTransform = parseFloat(matrix[12]);
        //Normal Browsers
        else
            curTransform = parseFloat(matrix[4]);
    }
    if (axis === 'y') {
        //Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix)
            curTransform = transformMatrix.m42;
        //Crazy IE10 Matrix
        else if (matrix.length === 16)
            curTransform = parseFloat(matrix[13]);
        //Normal Browsers
        else
            curTransform = parseFloat(matrix[5]);
    }
    
    return curTransform || 0;
};

$.requestAnimationFrame = function (callback) {
    if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
    else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
    else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
    else {
        return window.setTimeout(callback, 1000 / 60);
    }
};
$.cancelAnimationFrame = function (id) {
    if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
    else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
    else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
    else {
        return window.clearTimeout(id);
    }  
};
$.supportTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);

// Link to prototype
$.fn = Dom7.prototype;

// Plugins
$.fn.scrollTo = function (left, top, duration, easing, callback) {
    if (arguments.length === 4 && typeof easing === 'function') {
        callback = easing;
        easing = undefined;
    }
    return this.each(function () {
        var el = this;
        var currentTop, currentLeft, maxTop, maxLeft, newTop, newLeft, scrollTop, scrollLeft;
        var animateTop = top > 0 || top === 0;
        var animateLeft = left > 0 || left === 0;
        if (typeof easing === 'undefined') {
            easing = 'swing';
        }
        if (animateTop) {
            currentTop = el.scrollTop;
            if (!duration) {
                el.scrollTop = top;
            }
        }
        if (animateLeft) {
            currentLeft = el.scrollLeft;
            if (!duration) {
                el.scrollLeft = left;
            }
        }
        if (!duration) return;
        if (animateTop) {
            maxTop = el.scrollHeight - el.offsetHeight;
            newTop = Math.max(Math.min(top, maxTop), 0);
        }
        if (animateLeft) {
            maxLeft = el.scrollWidth - el.offsetWidth;
            newLeft = Math.max(Math.min(left, maxLeft), 0);
        }
        var startTime = null;
        if (animateTop && newTop === currentTop) animateTop = false;
        if (animateLeft && newLeft === currentLeft) animateLeft = false;
        function render(time) {
            if (time === undefined) {
                time = new Date().getTime();
            }
            if (startTime === null) {
                startTime = time;
            }
            var doneLeft, doneTop, done;
            var progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            var easeProgress = easing === 'linear' ? progress : (0.5 - Math.cos( progress * Math.PI ) / 2);
            if (animateTop) scrollTop = currentTop + (easeProgress * (newTop - currentTop));
            if (animateLeft) scrollLeft = currentLeft + (easeProgress * (newLeft - currentLeft));
            if (animateTop && newTop > currentTop && scrollTop >= newTop)  {
                el.scrollTop = newTop;
                done = true;
            }
            if (animateTop && newTop < currentTop && scrollTop <= newTop)  {
                el.scrollTop = newTop;
                done = true;
            }

            if (animateLeft && newLeft > currentLeft && scrollLeft >= newLeft)  {
                el.scrollLeft = newLeft;
                done = true;
            }
            if (animateLeft && newLeft < currentLeft && scrollLeft <= newLeft)  {
                el.scrollLeft = newLeft;
                done = true;
            }

            if (done) {
                if (callback) callback();
                return;
            }
            if (animateTop) el.scrollTop = scrollTop;
            if (animateLeft) el.scrollLeft = scrollLeft;
            $.requestAnimationFrame(render);
        }
        $.requestAnimationFrame(render);
    });
};
$.fn.scrollTop = function (top, duration, easing, callback) {
    if (arguments.length === 3 && typeof easing === 'function') {
        callback = easing;
        easing = undefined;
    }
    var dom = this;
    if (typeof top === 'undefined') {
        if (dom.length > 0) return dom[0].scrollTop;
        else return null;
    }
    return dom.scrollTo(undefined, top, duration, easing, callback);
};
$.fn.scrollLeft = function (left, duration, easing, callback) {
    if (arguments.length === 3 && typeof easing === 'function') {
        callback = easing;
        easing = undefined;
    }
    var dom = this;
    if (typeof left === 'undefined') {
        if (dom.length > 0) return dom[0].scrollLeft;
        else return null;
    }
    return dom.scrollTo(left, undefined, duration, easing, callback);
};
    return $;
})();

// Export Dom7 to Framework7
Framework7.$ = Dom7;

// Export to local scope
var $ = Dom7;

// Export to Window
window.Dom7 = Dom7;

/*===========================
Features Support Detection
===========================*/
Framework7.prototype.support = (function () {
    var support = {
        touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)
    };

    // Export object
    return support;
})();

/*===========================
Device/OS Detection
===========================*/
Framework7.prototype.device = (function () {
    var device = {};
    var ua = navigator.userAgent;
    var $ = Dom7;

    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;
    
    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
        device.android = true;
        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
    }
    if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
    }
    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
    }
    // iOS 8+ changed UA
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
        }
    }

    // Webview
    device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);
        
    // Minimal UI
    if (device.os && device.os === 'ios') {
        var osVersionArr = device.osVersion.split('.');
        device.minimalUi = !device.webView &&
                            (ipod || iphone) &&
                            (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
                            $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
    }

    // Check for status bar and fullscreen app mode
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    device.statusBar = false;
    if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
        device.statusBar = true;
    }
    else {
        device.statusBar = false;
    }

    // Classes
    var classNames = [];

    // Pixel Ratio
    device.pixelRatio = window.devicePixelRatio || 1;
    classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
    if (device.pixelRatio >= 2) {
        classNames.push('retina');
    }

    // OS classes
    if (device.os) {
        classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
        if (device.os === 'ios') {
            var major = parseInt(device.osVersion.split('.')[0], 10);
            for (var i = major - 1; i >= 6; i--) {
                classNames.push('ios-gt-' + i);
            }
        }
        
    }
    // Status bar classes
    if (device.statusBar) {
        classNames.push('with-statusbar-overlay');
    }
    else {
        $('html').removeClass('with-statusbar-overlay');
    }

    // Add html classes
    if (classNames.length > 0) $('html').addClass(classNames.join(' '));

    // Export object
    return device;
})();

/*===========================
Plugins prototype
===========================*/
Framework7.prototype.plugins = {};

/*===========================
Template7 Template engine
===========================*/
window.Template7 = (function () {
    function isArray(arr) {
        return Object.prototype.toString.apply(arr) === '[object Array]';
    }
    function isObject(obj) {
        return obj instanceof Object;
    }
    function isFunction(func) {
        return typeof func === 'function';
    }
    var cache = {};
    function helperToSlices(string) {
        var helperParts = string.replace(/[{}#}]/g, '').split(' ');
        var slices = [];
        var shiftIndex, i, j;
        for (i = 0; i < helperParts.length; i++) {
            var part = helperParts[i];
            if (i === 0) slices.push(part);
            else {
                if (part.indexOf('"') === 0) {
                    // Plain String
                    if (part.match(/"/g).length === 2) {
                        // One word string
                        slices.push(part);
                    }
                    else {
                        // Find closed Index
                        shiftIndex = 0;
                        for (j = i + 1; j < helperParts.length; j++) {
                            part += ' ' + helperParts[j];
                            if (helperParts[j].indexOf('"') >= 0) {
                                shiftIndex = j;
                                slices.push(part);
                                break;
                            }
                        }
                        if (shiftIndex) i = shiftIndex;
                    }
                }
                else {
                    if (part.indexOf('=') > 0) {
                        // Hash
                        var hashParts = part.split('=');
                        var hashName = hashParts[0];
                        var hashContent = hashParts[1];
                        if (hashContent.match(/"/g).length !== 2) {
                            shiftIndex = 0;
                            for (j = i + 1; j < helperParts.length; j++) {
                                hashContent += ' ' + helperParts[j];
                                if (helperParts[j].indexOf('"') >= 0) {
                                    shiftIndex = j;
                                    break;
                                }
                            }
                            if (shiftIndex) i = shiftIndex;
                        }
                        var hash = [hashName, hashContent.replace(/"/g,'')];
                        slices.push(hash);
                    }
                    else {
                        // Plain variable
                        slices.push(part);
                    }
                }
            }
        }
        return slices;
    }
    function stringToBlocks(string) {
        var blocks = [], i, j, k;
        if (!string) return [];
        var _blocks = string.split(/({{[^{^}]*}})/);
        for (i = 0; i < _blocks.length; i++) {
            var block = _blocks[i];
            if (block === '') continue;
            if (block.indexOf('{{') < 0) {
                blocks.push({
                    type: 'plain',
                    content: block
                });
            }
            else {
                if (block.indexOf('{/') >= 0) {
                    continue;
                }
                if (block.indexOf('{#') < 0 && block.indexOf(' ') < 0 && block.indexOf('else') < 0) {
                    // Simple variable
                    blocks.push({
                        type: 'variable',
                        contextName: block.replace(/[{}]/g, '')
                    });
                    continue;
                }
                // Helpers
                var helperSlices = helperToSlices(block);
                var helperName = helperSlices[0];
                var isPartial = helperName === '>';
                var helperContext = [];
                var helperHash = {};
                for (j = 1; j < helperSlices.length; j++) {
                    var slice = helperSlices[j];
                    if (isArray(slice)) {
                        // Hash
                        helperHash[slice[0]] = slice[1] === 'false' ? false : slice[1];
                    }
                    else {
                        helperContext.push(slice);
                    }
                }
                
                if (block.indexOf('{#') >= 0) {
                    // Condition/Helper
                    var helperStartIndex = i;
                    var helperContent = '';
                    var elseContent = '';
                    var toSkip = 0;
                    var shiftIndex;
                    var foundClosed = false, foundElse = false, foundClosedElse = false, depth = 0;
                    for (j = i + 1; j < _blocks.length; j++) {
                        if (_blocks[j].indexOf('{{#') >= 0) {
                            depth ++;
                        }
                        if (_blocks[j].indexOf('{{/') >= 0) {
                            depth --;
                        }
                        if (_blocks[j].indexOf('{{#' + helperName) >= 0) {
                            helperContent += _blocks[j];
                            if (foundElse) elseContent += _blocks[j];
                            toSkip ++;
                        }
                        else if (_blocks[j].indexOf('{{/' + helperName) >= 0) {
                            if (toSkip > 0) {
                                toSkip--;
                                helperContent += _blocks[j];
                                if (foundElse) elseContent += _blocks[j];
                            }
                            else {
                                shiftIndex = j;
                                foundClosed = true;
                                break;
                            }
                        }
                        else if (_blocks[j].indexOf('else') >= 0 && depth === 0) {
                            foundElse = true;
                        }
                        else {
                            if (!foundElse) helperContent += _blocks[j];
                            if (foundElse) elseContent += _blocks[j];
                        }

                    }
                    if (foundClosed) {
                        if (shiftIndex) i = shiftIndex;
                        blocks.push({
                            type: 'helper',
                            helperName: helperName,
                            contextName: helperContext,
                            content: helperContent,
                            inverseContent: elseContent,
                            hash: helperHash
                        });
                    }
                }
                else if (block.indexOf(' ') > 0) {
                    if (isPartial) {
                        helperName = '_partial';
                        if (helperContext[0]) helperContext[0] = '"' + helperContext[0].replace(/"|'/g, '') + '"';
                    }
                    blocks.push({
                        type: 'helper',
                        helperName: helperName,
                        contextName: helperContext,
                        hash: helperHash
                    });
                }
            }
        }
        return blocks;
    }
    var Template7 = function (template) {
        var t = this;
        t.template = template;
        
        function getCompileFn(block, depth) {
            if (block.content) return compile(block.content, depth);
            else return function () {return ''; };
        }
        function getCompileInverse(block, depth) {
            if (block.inverseContent) return compile(block.inverseContent, depth);
            else return function () {return ''; };
        }
        function getCompileVar(name, ctx) {
            var variable, parts, levelsUp = 0, initialCtx = ctx;
            if (name.indexOf('../') === 0) {
                levelsUp = name.split('../').length - 1;
                var newDepth = ctx.split('_')[1] - levelsUp;
                ctx = 'ctx_' + (newDepth >= 1 ? newDepth : 1);
                parts = name.split('../')[levelsUp].split('.');
            }
            else if (name.indexOf('@global') === 0) {
                ctx = 'Template7.global';
                parts = name.split('@global.')[1].split('.');
            }
            else if (name.indexOf('@root') === 0) {
                ctx = 'root';
                parts = name.split('@root.')[1].split('.');
            }
            else {
                parts = name.split('.');
            }
            variable = ctx;
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                if (part.indexOf('@') === 0) {
                    if (i > 0) {
                        variable += '[(data && data.' + part.replace('@', '') + ')]';
                    }
                    else {
                        variable = '(data && data.' + name.replace('@', '') + ')';
                    }
                }
                else {
                    if (isFinite(part)) {
                        variable += '[' + part + ']';
                    }
                    else {
                        if (part.indexOf('this') === 0) {
                            variable = part.replace('this', ctx);
                        }
                        else {
                            variable += '.' + part;       
                        }
                    }
                }
            }

            return variable;
        }
        function getCompiledArguments(contextArray, ctx) {
            var arr = [];
            for (var i = 0; i < contextArray.length; i++) {
                if (contextArray[i].indexOf('"') === 0) arr.push(contextArray[i]);
                else {
                    arr.push(getCompileVar(contextArray[i], ctx));
                }
            }

            return arr.join(', ');
        }
        function compile(template, depth) {
            depth = depth || 1;
            template = template || t.template;
            if (typeof template !== 'string') {
                throw new Error('Template7: Template must be a string');
            }
            var blocks = stringToBlocks(template);
            if (blocks.length === 0) {
                return function () { return ''; };
            }
            var ctx = 'ctx_' + depth;
            var resultString = '';
            if (depth === 1) {
                resultString += '(function (' + ctx + ', data, root) {\n';
            }
            else {
                resultString += '(function (' + ctx + ', data) {\n';
            }
            if (depth === 1) {
                resultString += 'function isArray(arr){return Object.prototype.toString.apply(arr) === \'[object Array]\';}\n';
                resultString += 'function isFunction(func){return (typeof func === \'function\');}\n';
                resultString += 'function c(val, ctx) {if (typeof val !== "undefined" && val !== null) {if (isFunction(val)) {return val.call(ctx);} else return val;} else return "";}\n';
                resultString += 'root = root || ctx_1 || {};\n';
            }
            resultString += 'var r = \'\';\n';
            var i, j, context;
            for (i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                // Plain block
                if (block.type === 'plain') {
                    resultString += 'r +=\'' + (block.content).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/'/g, '\\' + '\'') + '\';';
                    continue;
                }
                var variable, compiledArguments;
                // Variable block
                if (block.type === 'variable') {
                    variable = getCompileVar(block.contextName, ctx);
                    resultString += 'r += c(' + variable + ', ' + ctx + ');';
                }
                // Helpers block
                if (block.type === 'helper') {
                    if (block.helperName in t.helpers) {
                        compiledArguments = getCompiledArguments(block.contextName, ctx);
                        
                        resultString += 'r += (Template7.helpers.' + block.helperName + ').call(' + ctx + ', ' + (compiledArguments && (compiledArguments + ', ')) +'{hash:' + JSON.stringify(block.hash) + ', data: data || {}, fn: ' + getCompileFn(block, depth + 1) + ', inverse: ' + getCompileInverse(block, depth + 1) + ', root: root});';
                        
                    }
                    else {
                        if (block.contextName.length > 0) {
                            throw new Error('Template7: Missing helper: "' + block.helperName + '"');
                        }
                        else {
                            variable = getCompileVar(block.helperName, ctx);
                            resultString += 'if (' + variable + ') {';
                            resultString += 'if (isArray(' + variable + ')) {';
                            resultString += 'r += (Template7.helpers.each).call(' + ctx + ', ' + variable + ', {hash:' + JSON.stringify(block.hash) + ', data: data || {}, fn: ' + getCompileFn(block, depth+1) + ', inverse: ' + getCompileInverse(block, depth+1) + ', root: root});';
                            resultString += '}else {';
                            resultString += 'r += (Template7.helpers.with).call(' + ctx + ', ' + variable + ', {hash:' + JSON.stringify(block.hash) + ', data: data || {}, fn: ' + getCompileFn(block, depth+1) + ', inverse: ' + getCompileInverse(block, depth+1) + ', root: root});';
                            resultString += '}}';
                        }
                    }
                }
            }
            resultString += '\nreturn r;})';
            return eval.call(window, resultString);
        }
        t.compile = function (template) {
            if (!t.compiled) {
                t.compiled = compile(template);
            }
            return t.compiled;
        };
    };
    Template7.prototype = {
        options: {},
        partials: {},
        helpers: {
            '_partial' : function (partialName, options) {
                var p = Template7.prototype.partials[partialName];
                if (!p || (p && !p.template)) return '';
                if (!p.compiled) {
                    p.compiled = t7.compile(p.template);
                }
                var ctx = this;
                for (var hashName in options.hash) {
                    ctx[hashName] = options.hash[hashName];
                }
                return p.compiled(ctx, options.data, options.root);
            },
            'escape': function (context, options) {
                if (typeof context !== 'string') {
                    throw new Error('Template7: Passed context to "escape" helper should be a string');
                }
                return context
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;');
            },
            'if': function (context, options) {
                if (isFunction(context)) { context = context.call(this); }
                if (context) {
                    return options.fn(this, options.data);
                }
                else {
                    return options.inverse(this, options.data);
                }
            },
            'unless': function (context, options) {
                if (isFunction(context)) { context = context.call(this); }
                if (!context) {
                    return options.fn(this, options.data);
                }
                else {
                    return options.inverse(this, options.data);
                }
            },
            'each': function (context, options) {
                var ret = '', i = 0;
                if (isFunction(context)) { context = context.call(this); }
                if (isArray(context)) {
                    if (options.hash.reverse) {
                        context = context.reverse();
                    }
                    for (i = 0; i < context.length; i++) {
                        ret += options.fn(context[i], {first: i === 0, last: i === context.length - 1, index: i});
                    }
                    if (options.hash.reverse) {
                        context = context.reverse();
                    }
                }
                else {
                    for (var key in context) {
                        i++;
                        ret += options.fn(context[key], {key: key});
                    }
                }
                if (i > 0) return ret;
                else return options.inverse(this);
            },
            'with': function (context, options) {
                if (isFunction(context)) { context = context.call(this); }
                return options.fn(context);
            },
            'join': function (context, options) {
                if (isFunction(context)) { context = context.call(this); }
                return context.join(options.hash.delimiter || options.hash.delimeter);
            },
            'js': function (expression, options) {
                var func;
                if (expression.indexOf('return')>=0) {
                    func = '(function(){'+expression+'})';
                }
                else {
                    func = '(function(){return ('+expression+')})';
                }
                return eval.call(this, func).call(this);
            },
            'js_compare': function (expression, options) {
                var func;
                if (expression.indexOf('return')>=0) {
                    func = '(function(){'+expression+'})';
                }
                else {
                    func = '(function(){return ('+expression+')})';
                }
                var condition = eval.call(this, func).call(this);
                if (condition) {
                    return options.fn(this, options.data);
                }
                else {
                    return options.inverse(this, options.data);   
                }
            }
        }
    };
    var t7 = function (template, data) {
        if (arguments.length === 2) {
            var instance = new Template7(template);
            var rendered = instance.compile()(data);
            instance = null;
            return (rendered);
        }
        else return new Template7(template);
    };
    t7.registerHelper = function (name, fn) {
        Template7.prototype.helpers[name] = fn;
    };
    t7.unregisterHelper = function (name) {
        Template7.prototype.helpers[name] = undefined;  
        delete Template7.prototype.helpers[name];
    };
    t7.registerPartial = function (name, template) {
        Template7.prototype.partials[name] = {template: template};
    };
    t7.unregisterPartial = function (name, template) {
        if (Template7.prototype.partials[name]) {
            Template7.prototype.partials[name] = undefined;
            delete Template7.prototype.partials[name];
        }
    };
    
    t7.compile = function (template, options) {
        var instance = new Template7(template, options);
        return instance.compile();
    };
    
    t7.options = Template7.prototype.options;
    t7.helpers = Template7.prototype.helpers;
    t7.partials = Template7.prototype.partials;
    return t7;
})();
})();

//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){function n(n){function t(t,r,e,u,i,o){for(;i>=0&&o>i;i+=n){var a=u?u[i]:i;e=r(e,t[a],a,t)}return e}return function(r,e,u,i){e=b(e,i,4);var o=!k(r)&&m.keys(r),a=(o||r).length,c=n>0?0:a-1;return arguments.length<3&&(u=r[o?o[c]:c],c+=n),t(r,e,u,o,c,a)}}function t(n){return function(t,r,e){r=x(r,e);for(var u=O(t),i=n>0?0:u-1;i>=0&&u>i;i+=n)if(r(t[i],i,t))return i;return-1}}function r(n,t,r){return function(e,u,i){var o=0,a=O(e);if("number"==typeof i)n>0?o=i>=0?i:Math.max(i+a,o):a=i>=0?Math.min(i+1,a):i+a+1;else if(r&&i&&a)return i=r(e,u),e[i]===u?i:-1;if(u!==u)return i=t(l.call(e,o,a),m.isNaN),i>=0?i+o:-1;for(i=n>0?o:a-1;i>=0&&a>i;i+=n)if(e[i]===u)return i;return-1}}function e(n,t){var r=I.length,e=n.constructor,u=m.isFunction(e)&&e.prototype||a,i="constructor";for(m.has(n,i)&&!m.contains(t,i)&&t.push(i);r--;)i=I[r],i in n&&n[i]!==u[i]&&!m.contains(t,i)&&t.push(i)}var u=this,i=u._,o=Array.prototype,a=Object.prototype,c=Function.prototype,f=o.push,l=o.slice,s=a.toString,p=a.hasOwnProperty,h=Array.isArray,v=Object.keys,g=c.bind,y=Object.create,d=function(){},m=function(n){return n instanceof m?n:this instanceof m?void(this._wrapped=n):new m(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=m),exports._=m):u._=m,m.VERSION="1.8.3";var b=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}},x=function(n,t,r){return null==n?m.identity:m.isFunction(n)?b(n,t,r):m.isObject(n)?m.matcher(n):m.property(n)};m.iteratee=function(n,t){return x(n,t,1/0)};var _=function(n,t){return function(r){var e=arguments.length;if(2>e||null==r)return r;for(var u=1;e>u;u++)for(var i=arguments[u],o=n(i),a=o.length,c=0;a>c;c++){var f=o[c];t&&r[f]!==void 0||(r[f]=i[f])}return r}},j=function(n){if(!m.isObject(n))return{};if(y)return y(n);d.prototype=n;var t=new d;return d.prototype=null,t},w=function(n){return function(t){return null==t?void 0:t[n]}},A=Math.pow(2,53)-1,O=w("length"),k=function(n){var t=O(n);return"number"==typeof t&&t>=0&&A>=t};m.each=m.forEach=function(n,t,r){t=b(t,r);var e,u;if(k(n))for(e=0,u=n.length;u>e;e++)t(n[e],e,n);else{var i=m.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},m.map=m.collect=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=Array(u),o=0;u>o;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},m.reduce=m.foldl=m.inject=n(1),m.reduceRight=m.foldr=n(-1),m.find=m.detect=function(n,t,r){var e;return e=k(n)?m.findIndex(n,t,r):m.findKey(n,t,r),e!==void 0&&e!==-1?n[e]:void 0},m.filter=m.select=function(n,t,r){var e=[];return t=x(t,r),m.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e},m.reject=function(n,t,r){return m.filter(n,m.negate(x(t)),r)},m.every=m.all=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},m.some=m.any=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},m.contains=m.includes=m.include=function(n,t,r,e){return k(n)||(n=m.values(n)),("number"!=typeof r||e)&&(r=0),m.indexOf(n,t,r)>=0},m.invoke=function(n,t){var r=l.call(arguments,2),e=m.isFunction(t);return m.map(n,function(n){var u=e?t:n[t];return null==u?u:u.apply(n,r)})},m.pluck=function(n,t){return m.map(n,m.property(t))},m.where=function(n,t){return m.filter(n,m.matcher(t))},m.findWhere=function(n,t){return m.find(n,m.matcher(t))},m.max=function(n,t,r){var e,u,i=-1/0,o=-1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],e>i&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(u>o||u===-1/0&&i===-1/0)&&(i=n,o=u)});return i},m.min=function(n,t,r){var e,u,i=1/0,o=1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],i>e&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(o>u||1/0===u&&1/0===i)&&(i=n,o=u)});return i},m.shuffle=function(n){for(var t,r=k(n)?n:m.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=m.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},m.sample=function(n,t,r){return null==t||r?(k(n)||(n=m.values(n)),n[m.random(n.length-1)]):m.shuffle(n).slice(0,Math.max(0,t))},m.sortBy=function(n,t,r){return t=x(t,r),m.pluck(m.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=x(r,e),m.each(t,function(e,i){var o=r(e,i,t);n(u,e,o)}),u}};m.groupBy=F(function(n,t,r){m.has(n,r)?n[r].push(t):n[r]=[t]}),m.indexBy=F(function(n,t,r){n[r]=t}),m.countBy=F(function(n,t,r){m.has(n,r)?n[r]++:n[r]=1}),m.toArray=function(n){return n?m.isArray(n)?l.call(n):k(n)?m.map(n,m.identity):m.values(n):[]},m.size=function(n){return null==n?0:k(n)?n.length:m.keys(n).length},m.partition=function(n,t,r){t=x(t,r);var e=[],u=[];return m.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},m.first=m.head=m.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:m.initial(n,n.length-t)},m.initial=function(n,t,r){return l.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},m.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:m.rest(n,Math.max(0,n.length-t))},m.rest=m.tail=m.drop=function(n,t,r){return l.call(n,null==t||r?1:t)},m.compact=function(n){return m.filter(n,m.identity)};var S=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=O(n);a>o;o++){var c=n[o];if(k(c)&&(m.isArray(c)||m.isArguments(c))){t||(c=S(c,t,r));var f=0,l=c.length;for(u.length+=l;l>f;)u[i++]=c[f++]}else r||(u[i++]=c)}return u};m.flatten=function(n,t){return S(n,t,!1)},m.without=function(n){return m.difference(n,l.call(arguments,1))},m.uniq=m.unique=function(n,t,r,e){m.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=x(r,e));for(var u=[],i=[],o=0,a=O(n);a>o;o++){var c=n[o],f=r?r(c,o,n):c;t?(o&&i===f||u.push(c),i=f):r?m.contains(i,f)||(i.push(f),u.push(c)):m.contains(u,c)||u.push(c)}return u},m.union=function(){return m.uniq(S(arguments,!0,!0))},m.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=O(n);u>e;e++){var i=n[e];if(!m.contains(t,i)){for(var o=1;r>o&&m.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},m.difference=function(n){var t=S(arguments,!0,!0,1);return m.filter(n,function(n){return!m.contains(t,n)})},m.zip=function(){return m.unzip(arguments)},m.unzip=function(n){for(var t=n&&m.max(n,O).length||0,r=Array(t),e=0;t>e;e++)r[e]=m.pluck(n,e);return r},m.object=function(n,t){for(var r={},e=0,u=O(n);u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},m.findIndex=t(1),m.findLastIndex=t(-1),m.sortedIndex=function(n,t,r,e){r=x(r,e,1);for(var u=r(t),i=0,o=O(n);o>i;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},m.indexOf=r(1,m.findIndex,m.sortedIndex),m.lastIndexOf=r(-1,m.findLastIndex),m.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var E=function(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=j(n.prototype),o=n.apply(i,u);return m.isObject(o)?o:i};m.bind=function(n,t){if(g&&n.bind===g)return g.apply(n,l.call(arguments,1));if(!m.isFunction(n))throw new TypeError("Bind must be called on a function");var r=l.call(arguments,2),e=function(){return E(n,e,t,this,r.concat(l.call(arguments)))};return e},m.partial=function(n){var t=l.call(arguments,1),r=function(){for(var e=0,u=t.length,i=Array(u),o=0;u>o;o++)i[o]=t[o]===m?arguments[e++]:t[o];for(;e<arguments.length;)i.push(arguments[e++]);return E(n,r,this,this,i)};return r},m.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=m.bind(n[r],n);return n},m.memoize=function(n,t){var r=function(e){var u=r.cache,i=""+(t?t.apply(this,arguments):e);return m.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},m.delay=function(n,t){var r=l.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},m.defer=m.partial(m.delay,m,1),m.throttle=function(n,t,r){var e,u,i,o=null,a=0;r||(r={});var c=function(){a=r.leading===!1?0:m.now(),o=null,i=n.apply(e,u),o||(e=u=null)};return function(){var f=m.now();a||r.leading!==!1||(a=f);var l=t-(f-a);return e=this,u=arguments,0>=l||l>t?(o&&(clearTimeout(o),o=null),a=f,i=n.apply(e,u),o||(e=u=null)):o||r.trailing===!1||(o=setTimeout(c,l)),i}},m.debounce=function(n,t,r){var e,u,i,o,a,c=function(){var f=m.now()-o;t>f&&f>=0?e=setTimeout(c,t-f):(e=null,r||(a=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,o=m.now();var f=r&&!e;return e||(e=setTimeout(c,t)),f&&(a=n.apply(i,u),i=u=null),a}},m.wrap=function(n,t){return m.partial(t,n)},m.negate=function(n){return function(){return!n.apply(this,arguments)}},m.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},m.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},m.before=function(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}},m.once=m.partial(m.before,2);var M=!{toString:null}.propertyIsEnumerable("toString"),I=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];m.keys=function(n){if(!m.isObject(n))return[];if(v)return v(n);var t=[];for(var r in n)m.has(n,r)&&t.push(r);return M&&e(n,t),t},m.allKeys=function(n){if(!m.isObject(n))return[];var t=[];for(var r in n)t.push(r);return M&&e(n,t),t},m.values=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},m.mapObject=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=u.length,o={},a=0;i>a;a++)e=u[a],o[e]=t(n[e],e,n);return o},m.pairs=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},m.invert=function(n){for(var t={},r=m.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},m.functions=m.methods=function(n){var t=[];for(var r in n)m.isFunction(n[r])&&t.push(r);return t.sort()},m.extend=_(m.allKeys),m.extendOwn=m.assign=_(m.keys),m.findKey=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=0,o=u.length;o>i;i++)if(e=u[i],t(n[e],e,n))return e},m.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;m.isFunction(t)?(u=m.allKeys(o),e=b(t,r)):(u=S(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;c>a;a++){var f=u[a],l=o[f];e(l,f,o)&&(i[f]=l)}return i},m.omit=function(n,t,r){if(m.isFunction(t))t=m.negate(t);else{var e=m.map(S(arguments,!1,!1,1),String);t=function(n,t){return!m.contains(e,t)}}return m.pick(n,t,r)},m.defaults=_(m.allKeys,!0),m.create=function(n,t){var r=j(n);return t&&m.extendOwn(r,t),r},m.clone=function(n){return m.isObject(n)?m.isArray(n)?n.slice():m.extend({},n):n},m.tap=function(n,t){return t(n),n},m.isMatch=function(n,t){var r=m.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;e>i;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof m&&(n=n._wrapped),t instanceof m&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(m.isFunction(o)&&o instanceof o&&m.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}r=r||[],e=e||[];for(var c=r.length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if(c=n.length,c!==t.length)return!1;for(;c--;)if(!N(n[c],t[c],r,e))return!1}else{var f,l=m.keys(n);if(c=l.length,m.keys(t).length!==c)return!1;for(;c--;)if(f=l[c],!m.has(t,f)||!N(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0};m.isEqual=function(n,t){return N(n,t)},m.isEmpty=function(n){return null==n?!0:k(n)&&(m.isArray(n)||m.isString(n)||m.isArguments(n))?0===n.length:0===m.keys(n).length},m.isElement=function(n){return!(!n||1!==n.nodeType)},m.isArray=h||function(n){return"[object Array]"===s.call(n)},m.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},m.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(n){m["is"+n]=function(t){return s.call(t)==="[object "+n+"]"}}),m.isArguments(arguments)||(m.isArguments=function(n){return m.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(m.isFunction=function(n){return"function"==typeof n||!1}),m.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},m.isNaN=function(n){return m.isNumber(n)&&n!==+n},m.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===s.call(n)},m.isNull=function(n){return null===n},m.isUndefined=function(n){return n===void 0},m.has=function(n,t){return null!=n&&p.call(n,t)},m.noConflict=function(){return u._=i,this},m.identity=function(n){return n},m.constant=function(n){return function(){return n}},m.noop=function(){},m.property=w,m.propertyOf=function(n){return null==n?function(){}:function(t){return n[t]}},m.matcher=m.matches=function(n){return n=m.extendOwn({},n),function(t){return m.isMatch(t,n)}},m.times=function(n,t,r){var e=Array(Math.max(0,n));t=b(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},m.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},m.now=Date.now||function(){return(new Date).getTime()};var B={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},T=m.invert(B),R=function(n){var t=function(t){return n[t]},r="(?:"+m.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};m.escape=R(B),m.unescape=R(T),m.result=function(n,t,r){var e=null==n?void 0:n[t];return e===void 0&&(e=r),m.isFunction(e)?e.call(n):e};var q=0;m.uniqueId=function(n){var t=++q+"";return n?n+t:t},m.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var K=/(.)^/,z={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\u2028|\u2029/g,L=function(n){return"\\"+z[n]};m.template=function(n,t,r){!t&&r&&(t=r),t=m.defaults({},t,m.templateSettings);var e=RegExp([(t.escape||K).source,(t.interpolate||K).source,(t.evaluate||K).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,o,a){return i+=n.slice(u,a).replace(D,L),u=a+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":o&&(i+="';\n"+o+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var o=new Function(t.variable||"obj","_",i)}catch(a){throw a.source=i,a}var c=function(n){return o.call(this,n,m)},f=t.variable||"obj";return c.source="function("+f+"){\n"+i+"}",c},m.chain=function(n){var t=m(n);return t._chain=!0,t};var P=function(n,t){return n._chain?m(t).chain():t};m.mixin=function(n){m.each(m.functions(n),function(t){var r=m[t]=n[t];m.prototype[t]=function(){var n=[this._wrapped];return f.apply(n,arguments),P(this,r.apply(m,n))}})},m.mixin(m),m.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=o[n];m.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],P(this,r)}}),m.each(["concat","join","slice"],function(n){var t=o[n];m.prototype[n]=function(){return P(this,t.apply(this._wrapped,arguments))}}),m.prototype.value=function(){return this._wrapped},m.prototype.valueOf=m.prototype.toJSON=m.prototype.value,m.prototype.toString=function(){return""+this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return m})}).call(this);
//# sourceMappingURL=underscore-min.map
//确认web是否在APP中
var isInApp = function webIsInApp(){
    try{
        TTJSBridge.invoke("operate", "isInApp");
        return true;
    }catch(e){
        return false;
    }
}

/*
 TT JS-API
 */
function webViewApi(){
    return this;
}

webViewApi.prototype = {
    //获取profile
    getAppData: function( methods){
        var dataSet = TTJSBridge.invoke("data", methods);
        return dataSet;
    },
    //更新用户红钻
    updateUserDiamond: function( parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke("data", "updateMyRedDiamond" , parameters);
            }catch(e){
                //webErrorReport('apiError', 'Update user diamond failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //更新关注缓存
    updateUserGameFollow: function(gid, cid){
        if(isInApp()){
            try{
                TTJSBridge.invoke("gamearea", "updateAppGameFollow", '"'+ gid +','+ cid +'"');
            }catch(e){
                //webErrorReport('apiError', 'Update user game follow status failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //获取活动标题
    getActiveTitle: function(){
        var dataSet = TTJSBridge.invoke("ui", "getActivityTitle");
        return dataSet ;
    },
    //更新navbar title
    setNavbarTitle: function( parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke( "ui", "setCurrentPageTitle", '{"title":"' + parameters + '"}');
            }catch(e){
                //webErrorReport('apiError', 'Update navbar title failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }

    },
    //更新navbar button
    setNavbarButton: function(){

        return {
            showButton:function(){
                if(isInApp()){
                    try{
                        TTJSBridge.invoke("ui", "setRightTextVisibility", true);
                    }catch(e){
                        //webErrorReport('apiError', 'Navbar button is not display - ' + e.name + ": " + e.message);
                    }
                }
                else{
                    notInAppProcess();
                }
            },
            hideButton:function(){

                if(isInApp()){
                    try{
                        TTJSBridge.invoke("ui", "setRightTextVisibility", false);
                    }catch(e){
                        //webErrorReport('apiError', 'Hide navbar button failed - ' + e.name + ": " + e.message);
                    }
                }
                else{
                    notInAppProcess();
                }
            },
            setButtonText:function(parameters){

                if(isInApp()){
                    try{
                        TTJSBridge.invoke("ui", "updateRightText", parameters);
                    }catch(e){
                        //webErrorReport('apiError', 'Set navbar button text failed - ' + e.name + ": " + e.message);
                    }
                }
                else{
                    notInAppProcess();
                }
            },
            setButtonFunction:function(method){

                if(isInApp()){
                    try{
                        TTJSBridge.invoke("ui", "setRightTextRunMethod", '{"method" : ' + method +  '}');
                    }catch(e){
                        //webErrorReport('apiError', 'Method of navbar button failed - ' + e.name + ": " + e.message);
                    }
                }
                else{
                    notInAppProcess();
                }
            }
        }

    },
    //分享: {"share_type":"分享类型(qq: "QQ";qq空间:"QZone";微信:"Wechat", 微信朋友圈:"WechatMoments")","title":"分享标题", "content":"分享内容", "url":"分享url"}
    share: function(parameters){

        if(isInApp()){
            try{
                TTJSBridge.invoke("ui", "share",parameters);
            }catch(e){
                //webErrorReport('apiError', 'Share failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //调用app分享按钮
    appShare: function(parameters){

        if(isInApp()){
            try{
                TTJSBridge.invoke("data", "setShareData", parameters);
            }catch(e){
                //webErrorReport('apiError', 'App Share failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //调用tt分享action sheet
    appShareAction: function(parameters){

        if(isInApp()){
            try{
                TTJSBridge.invoke("operate", "shareData", parameters);
            }catch(e){
                //webErrorReport('apiError', 'App Share Action failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //callbackModal
    callbackModal: function(method, parameters){

        if(isInApp()){
            try{
                TTJSBridge.invoke("ui", "setInvokeMethod", '{"type" : 1, "callback" : {"method" : "' + method + '", "params" : ["'+ parameters +'"]}}');
            }catch(e){
                //webErrorReport('apiError', 'Share callback failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //web view 恢复时
    callbackFunction: function(method, parameters){

        if(isInApp()){
            try{
                TTJSBridge.invoke("operate", "onResumeInvokeMethod", '{"type" : 1, "callback" : {"method" : "' + method + '", "params" : ["'+ parameters +'"]}}');
            }catch(e){
                //webErrorReport('apiError', 'callback failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //邀请好友
    invitation: function(){

        if(isInApp()){
            try{
                TTJSBridge.invoke("nav", "inviteUser");
            }catch(e){
                //webErrorReport('apiError', 'Method of invite friend failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //APP导航
    appNav: function(parameters){

        if(isInApp()){
            try{
                //window.WebViewJavascriptBridge.call(parameters);
                TTJSBridge.invoke("operate", "jump", parameters);
            }catch(e){
                //webErrorReport('apiError', 'App navigation failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //APP打开外部web
    appNavExternal: function(parameters){

        if(isInApp()){
            try{
                TTJSBridge.invoke("gamearea", "startH5Game", parameters);
            }catch(e){
                //webErrorReport('apiError', 'App navigation failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //复制内容
    copyContent: function(parameters){

        if(isInApp()){
            try{
                TTJSBridge.invoke("operate", "copy", parameters);
            }catch(e){
                //webErrorReport('apiError', 'Copy to clipboard failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    checkAppInstalled : function (parameters){
        if(isInApp()){
            try{
                var dataSet = TTJSBridge.invoke("operate", "checkInstallApp", parameters);
                return dataSet;
            }catch(e){
                //webErrorReport('apiError', 'Check app install failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //检查游戏是否安装
    checkGameInstalled : function (parameters){
        if(isInApp()){
            try{
                var dataSet = TTJSBridge.invoke("gamearea", "isGameInstall", parameters);
                return dataSet;
            }catch(e){
                //webErrorReport('apiError', 'Check game install failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //检查游戏是否下载了
    checkGameDownloaded : function (parameters){
        if(isInApp()){
            try{
                var dataSet = TTJSBridge.invoke("gamearea", "isGameDownloaded", parameters);
                return dataSet;
            }catch(e){
                //webErrorReport('apiError', 'Check game downloaded failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //检查游戏是否正在下载
    checkGameDownloading :function (parameters){
        if(isInApp()){
            try{
                var dataSet = TTJSBridge.invoke("gamearea", "isGameDownloading", parameters);
                return dataSet;
            }catch(e){
                //webErrorReport('apiError', 'Check game downloading failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //检查游戏是否可以重试
    checkGameDownloadRepeat :function (parameters){
        if(isInApp()){
            try{
                var dataSet = TTJSBridge.invoke("gamearea", "isGameDownloadrepeat", parameters);
                return dataSet;
            }catch(e){
                //webErrorReport('apiError', 'Check game downloading failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //检查游戏下载进度
    checkGameDownloadProgress :function (parameters){
        if(isInApp()){
            try{
                var dataSet = TTJSBridge.invoke("gamearea", "getGameDownloadProgress", parameters);
                return dataSet;
            }catch(e){
                //webErrorReport('apiError', 'Check game download progress failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //检查网络状态
    checkNetworkStatus : function (){
        if(isInApp()){
            try{
                var dataSet = TTJSBridge.invoke("operate", "getNetworkState");
                return dataSet;
            }catch(e){
                //webErrorReport('apiError', 'Check network status failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //网络状态变化时
    NetworkStatusChanged : function (method, parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke("operate", "initiativeInvokeMethod", '{"type" : 1, "callback" : {"method" : "' + method + '", "params" : ["'+ parameters +'"]}}');
            }catch(e){
                //webErrorReport('apiError', 'Network status changed failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    downloadGame : function (parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke("operate", "download", parameters);
            }catch(e){
                //webErrorReport('apiError', 'Download game failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //取消下载
    CancelDownloadGame : function (parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke("gamearea", "cancelDownloadGame", parameters);
            }catch(e){
                //webErrorReport('apiError', 'Cancel download game failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //安装游戏
    installGame : function (parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke("gamearea", "installGame", parameters);
            }catch(e){
                //webErrorReport('apiError', 'Cancel download game failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    gameStartById : function (parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke("gamearea", "startGameById", parameters);
            }catch(e){
                //webErrorReport('apiError', 'Game start failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    showToast : function (parameters) {
        if(isInApp()){
            try{
                TTJSBridge.invoke("operate", "showToast" , parameters);
            }catch(e){
                //webErrorReport('apiError', 'Show toast failed - ' + e.name + ": " + e.message);
            }
        }else if(myWebview.isInSdk()){
            try{
                window.tt_sdk.toast( parameters , 0);
            }catch(e){

            }
        }
        else{
            notInAppProcess();
        }
    },
    setFullScreen: function (parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke("ui", "enterfullscreen", parameters);
            }catch(e){
                //webErrorReport('apiError', 'Set full screen failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    videoPlayer: function (parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke("operate", "playVideo",parameters);
            }catch(e){
                //webErrorReport('apiError', 'Set full screen failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //去设置页面
    toAppSetting: function (){
        if(isInApp()){
            try{
                TTJSBridge.invoke("nav", "toSetting");
            }catch(e){
                //webErrorReport('apiError', 'Go to app setting failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //去设置页面小米神隐模式
    toMiuiHideMode: function (){
        if(isInApp()){
            try{
                TTJSBridge.invoke("nav", "toMIUIHideMode");
            }catch(e){
                //webErrorReport('apiError', 'Go to miui hide mode failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //去其他设置
    toOtherAppSetting: function (parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke("nav", "toOtherApp", parameters);
            }catch(e){
                //webErrorReport('apiError', 'Go to other app setting failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //发公会招募帖
    publishGuildRecruit: function (parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke("guildrecruit", "publish", parameters)
            }catch(e){
                //webErrorReport('apiError', 'Publish guild recruit failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //修改公会招募贴
    updateGuildRecruit: function (parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke("guildrecruit", "modify", parameters)
            }catch(e){
                //webErrorReport('apiError', 'Update guild recruit failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //举报公会招募贴
    reportGuildRecruit: function (parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke("guildrecruit", "report", parameters)
            }catch(e){
                //webErrorReport('apiError', 'Report guild recruit failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    },
    //加入公会
    joinGuild: function (parameters){
        if(isInApp()){
            try{
                TTJSBridge.invoke("guildrecruit", "join", parameters)
            }catch(e){
                //webErrorReport('apiError', 'Join guild recruit failed - ' + e.name + ": " + e.message);
            }
        }
        else{
            notInAppProcess();
        }
    }
}

var myWebview = new webViewApi();

/* ===== 定义不在TT中打开网页的场景 ===== */
function notInAppProcess(){
    //myApp.alert("请在TT语音中打开~");
}

/* ===== update request token ===== */
function updateRequestToken() {
    try{
        return myWebview.getAppData("getToken");
    }catch(e){
        //webErrorReport('apiError', 'uToken获取失败 - ' + e.name + ": " + e.message);
    }
}

//set navbar button
//button: 按钮文案，callback: 执行方法名
myWebview.setShareButton = function(button, callback){
    myWebview.setNavbarButton().setButtonText(button);
    myWebview.setNavbarButton().showButton();
    myWebview.setNavbarButton().setButtonFunction(callback);
}

//是否在app中
myWebview.isInAppFunc = function() {
    try{
        TTJSBridge.invoke("operate", "isInApp");
        return true;
    }catch(e){
        return false;
    }
}

//是否在sdk中, true or false
myWebview.isInSdk = function() {
    var urlParameter = $$.parseUrlQuery(window.location.href);
    if(urlParameter.hasOwnProperty('app')){
        if(urlParameter.app == 12){
            return true
        }else {
            return false
        }
    }
}
/*jslint browser: true*/
/*global console, Framework7, alert, Dom7*/

/**
 * A plugin for Framework7 to show black little toasts
 *
 * @author www.timo-ernst.net
 * @license MIT
 */
Framework7.prototype.plugins.toast = function (app, globalPluginParams) {
  'use strict';

  var Toast = function (text, iconhtml, options) {
    var self = this,
        $$ = Dom7,
        $box;

    function hideBox($curbox) {
      if ($curbox) {
        $curbox.removeClass('fadein').transitionEnd(function () {
          $curbox.remove();
        });
      }
    }

    this.show = function (show) {
      if (show) {
        var clientLeft,
            $curbox;

        // Remove old toasts first if there are still any
        $$('.toast-container').off('click').off('transitionEnd').remove();
        $box = $$('<div class="toast-container show">');

        // Add content
        $box.html('<div class="toast-icon">' + iconhtml + '</div><div class="toast-msg">' + text + '</div>');

        // Add to DOM
        clientLeft = $box[0].clientLeft;
        $$('body').append($box);

        // Hide box on click
        $box.click(function () {
          hideBox($box);
        });

        // Dirty hack to cause relayout xD
        clientLeft = $box[0].clientLeft;

        // Fade in toast
        $box.addClass('fadein');

        // Automatically hide box after few seconds
        $curbox = $box;
        setTimeout(function () {
          hideBox($curbox);
        }, 1500);

      } else {
        hideBox($$('.toast-container'));
      }
    };

    return this;
  };

  app.toast = function (text, iconhtml, options) {
    return new Toast(text, iconhtml, options);
  };

};
// Init App
var myApp = new Framework7({
    tapHold:true, //长按保持
    // Modal Setting
    modalTitle: '提示',
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    modalPreloaderTitle: '正在载入...',
    //是否开启页面过渡动画
    animatePages: true,
    // notification settting
    notificationCloseOnClick: true, //设置为true之后，点击就可以关闭通知
    notificationTitle: '提示', //所有通知(notifications)的默认标题
    //物理按键回退
    pushState: true, //物理按键回退支持
    swipeBackPage: false, //滑动返回上一页(IOS)
    sortable: false, //排序
    swipeout: false, //滑动删除
    materialPreloaderSvg: '<div class="icon-loading"></div>', //preLoader
    //template 7
    dynamicPageUrl: '{{name}}', //动态内容链接
    template7Pages: true,
    template7Data: {

        'url:page/about.html': {
            title: 'TT语音',
            page_title: '关于TT',
            content: '测试'
        }
    }
});

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main', {
    domCache: true //内联DOM
});

// Show/hide preloader for remote ajax loaded pages
$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();
});


// plugins
//init toast
//参数 message: 文本, html: html
myApp.showToast = function(message, html){
    //var toast = myApp.toast(message, '', {hold : 3000});
    //var html;
    //if(icon){
    //    html = '<div><img src="' + icon +'" /></div>';
    //}else {
    //    html = '<div></div>'
    //}

    var toast = myApp.toast(message, html);
    toast.show(true);
}

//init mainView.router
myApp.redictNewPage = function (pageName, animation, history, pageContent, query){
    var pageInit;
    if(pageContent){
        pageInit = '<div id=' + pageName + ' data-page=' + pageName + ' class="page"></div>';
    }else {
        pageInit = '<div id=' + pageName + ' data-page=' + pageName + ' class="page"><div class="page-content"></div></div>';
    }
    mainView.router.load({
        content :pageInit,
        animatePages: animation !=null ? animation : true,
        pushState: history !=null ? history : true,
        query: query != null ? query : null
    })
}

//init confirm alert
//myApp.confirmModal = function(description, btn_text, callback) {
//    myApp.modal({
//        title: '提示',
//        text: description,
//        buttons : [
//            {
//                text:
//            }
//        ]
//    })
//}

//webview 恢复后调用方法
myWebview.webviewCallbackWhenRecover = function(){

}
//网络变化时 webview被调用方法
myWebview.webviewCallbackWhenNetworkChange = function (){

}

//进度条通知
myWebview.onGameDownloadProgress = function(parameter){

}

//init game download button


//关注
myWebview.focusAreaRequest = function (){

}

myApp.updateButtonStatus = function(status){

}

//图片浏览
//参数说明: 序号 - index: 0, gallery: ['url']
myApp.photoBrowserPage = function(index, gallery){
    var template = '<div class="toolbar tabbar photo-browser-toolbar">' +
        '<div class="toolbar-inner">' +
        '<div class="center sliding">' +
        '<span class="photo-browser-current"></span>' +
        '<span class="photo-browser-of">{{ofText}}</span>' +
        '<span class="photo-browser-total"></span>' +
        '</div>'+
        '</div>' +
        '</div>';

    var myPhotoBrowserPopupDark = myApp.photoBrowser({
        photos : gallery,
        type: 'page',
        exposition: false,
        toolbar : true,
        maxZoom: 2,
        lazyLoading:true,
        lazyLoadingInPrevNext:true,
        ofText: '/',
        toolbarTemplate : template
    });
    myPhotoBrowserPopupDark.open(index);
}

//MPA外部分享页统计
var mpa_share_page = [
    { name: 'goddess_home_share', url: 'http://i.52tt.com/goddess/index' },
    { name: 'goddess_show_share', url: 'http://i.52tt.com/goddess/show/' },
    { name: 'goddess_sdk_share', url: 'http://app.52tt.com/project/active_goddess/index.html' },
    { name: 'official_mobile_home', url: 'http://m.52tt.com/' },
    { name: 'official_mobile_guild_recruit', url: 'http://i.52tt.com/recruit/game_list' },
    { name: 'official_mobile_zone', url: 'http://i.52tt.com/game/' },
]

//下载TT语音
//参数:  alert: true 先弹框确认再下载, 不带参数表示直接下载; title: 弹框标题; msg: 弹框文案
myApp.downloadTT = function(alert, title, msg){

    var urlParam = window.location.href;
    var extendParameter = $$.parseUrlQuery(urlParam);

    function downloadApp(){

        //统计数据上报
        $$.each(mpa_share_page, function(index, item){
            if(urlParam.toString().indexOf(item.url) != -1){
                try{
                    _hmt.push(['_trackEvent', 'tt_multi_source', 'download', item.name]);
                }catch(e){

                }
            }
        })

        //执行下载逻辑
        var userAgent = navigator.userAgent.toLowerCase();
        //是否微信
        if(userAgent.match(/MicroMessenger/i) == "micromessenger") {
            //应用宝
            location.href ='http://a.app.qq.com/o/simple.jsp?pkgname=com.yiyou.ga';
        }else{
            //app
            if(myWebview.isInSdk()){
                if(window.tt_sdk.isAppInstalled("com.yiyou.ga")) {
                    window.tt_sdk.toast('正在打开TT语音', 0);
                    window.tt_sdk.openApp('com.yiyou.ga');
                }else{
                    window.tt_sdk.toast('开始下载TT语音', 0);
                    location.href = 'http://d.52tt.com/tt/official/tt.apk';
                }
            }else if(myApp.device.ios){
                location.href = 'https://itunes.apple.com/cn/app/tt-yu-yin-shou-ji-you-xi-wan/id1012317813?mt=8';
            }else if(myApp.device.android){
                location.href = 'http://d.52tt.com/tt/official/tt.apk';
            }
            else{
                location.href = 'http://m.52tt.com';
            }
        }
    }

    if(alert){
        var modalTitle = title ? title : '下载TT';
        var modalMsg = msg ? msg : '享受最强团战语音神器,千万福利礼包派不停';

        myApp.modal({
            title: modalTitle,
            text: modalMsg,
            buttons:[
                {
                    text: '暂不下载',
                    color: 'gray'
                },{
                    text: '立即下载',
                    color: 'green',
                    onClick: function(){
                        downloadApp ();
                    }
                }
            ],
        })
    }else {
        downloadApp ();
    }

}

//modal组件
//分享当前页面
//parameters = {title, description, icon, url}， callback: 分享触发时
myApp.shareCurrentPage = function(parameter, callback){
    //初始化分享弹框按钮模板
    var str = myWebview.checkAppInstalled("Wechat") === "true" ? '<div class="share-button col-25 icon-weixin" data-share-type="WechatMoments">微信朋友圈</div>' : '<div class="col-25"></div>';
    var html = '<div class="content-block">' +
        '<div class="row">' +
        '<div class="share-button col-25 icon-qzone" data-share-type="QZone">QQ空间</div>' +
        str +
        '<div class="col-25"></div>' +
        '<div class="col-25"></div>' +
        '</div>' +
        '</div>';
    //初始化按钮
    var buttons = [
        {
            text: '分享到',
            label: true,
            color: 'green'
        },
        {
            text: html,
            label: true,
        },
        {
            text: '取消',
            color: 'gray'
        },
    ];

    //调用分享弹框
    myApp.actions(buttons);

    //绑定点击分享js-api
    $$('.share-button').on('click', function () {
        //回调
        if(callback) callback();
        //关闭modal
        myApp.closeModal();
        //初始化对象
        var shareInfo = {
            "share_type": $$(this).data("share-type"),
            "title": parameter.title, //标题
            "content": parameter.description, //分享内容
            "imageUrl" : parameter.icon , //icon地址
            "url": parameter.url, //分享页地址
        };
        myWebview.share(JSON.stringify(shareInfo)); //分享API
    });
}
myApp.requestApi = function (url, parameter, success, Indicator, failure){
    if(parameter == null){
        parameter = {};
    }
    parameter.callback = 1;
    parameter.debug = 0;
    var inApp = myWebview.isInAppFunc();
    if(inApp){
        parameter.token = myWebview.getAppData("getToken");
    }

    //透传参数
    var urlString = window.location.href;
    var extendParameter = $$.parseUrlQuery(urlString);
    //过滤参数里的hash #
    extendParameter = _.mapObject(extendParameter, function(val, key) {
        if(val.toString().indexOf('#') != -1){
            return val.toString().substr(0, val.toString().indexOf('#'));
        }else {
            return val;
        }
    });
    parameter = _.extend(parameter, extendParameter);

    //接口匹配环境
    var host;
    if(urlString.indexOf('52tt.com') != -1){
        host = 'http://api.52tt.com';
    }
    else {
        host = 'http://192.168.9.230:8089';
    }
    url = url.indexOf('http://') != -1 ? url : host + url;
    //菊花是否静默
    if(Indicator){}else {
        myApp.showIndicator();
    }


    $$.ajax({
        method: "get",
        async: true,
        url: url,
        crossDomain: true,
        dataType: 'json',
        timeout: 30 * 1000,
        data: parameter,
        success: function (data) {
            setTimeout(function(){
                myApp.hideIndicator();
            }, 380);

            if (data.code === 0) {
                if(success) success(data);
            }else{
                //菊花是否静默
                if(Indicator){
                    myApp.alert(data.msg + " (" + data.code + ")" );
                }else {
                    myWebview.showToast(data.msg + " (" + data.code + ")");
                }

                if(failure) failure(data)

            }
        },
        error: function () {
            setTimeout(function(){
                myApp.hideIndicator();
            }, 300);

            console.log('error-page');
            myApp.networkErrorProcess();

        }
    });
}

myApp.networkErrorProcess = function(){
    console.log('redirect-error-page');
    myApp.redictNewPage('network-error', true, false);
}