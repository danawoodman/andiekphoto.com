
/*
    Create a simple slideshow using photos from a Flickr Set.
    
    Full description coming soon...
    
    @example $('#gallery').flickr_gallery({
        api_key: 'YOUR_FLICKR_API_KEY_HERE',
        set_id: 'YOUR_FLICKR_SET_ID_HERE'
    });
    @desc Coming sooon...
    @module
    @param Object options (required) An object of options.
    @name flickr_gallery
    @cat Plugins/UI
    @author Dana Woodman (http://www.danawoodman.com/)
*/

/*

    @module jQuery Flickr Gallery
    @file jquery.flickr_gallery.js
    @namespace $(selector).flickr_gallery()

*/
(function($) {
    
    var DEBUG = false,
        log = function (msg) {
            if (DEBUG && window.console) {
                console.log(msg);
            };
        },
        Slideshow = function (container) {
            
            var that = this, // Store the Slideshow instance.
                photos = [], // An array containing all the Photos that are part of the Slideshow.
                thumbs = [], // An array containing all the thumbnails.
                $cont = container, // jQuery container for the Slideshow.
                $gallery = $('<div class="fg-gallery ' + $cont.o.photo_size + '" />'), // The gallery into which Photos, controls, thumbnails, etc... will be loaded.
                $photo_container = $('<ul class="fg-photos" />'), // Container into which gallery photos will be loaded.
                $controls = $('<div class="fg-controls" />'), // The controls container.
                $prev = $('<a href="#" title="Show the previous photo" class="fg-prev"><span>Previous</span></a>'), // The previous Photo button.
                $next = $('<a href="#" title="Show the next photo" class="fg-next"><span>Next</span></a>'), // The next Photo button.
                $thumbs = $('<ul class="fg-thumbs" />'), // The thumbnail container box.
                initialize, // The initialize() method.
                show_gallery, // The show_gallery() method.
                show_photo_container, // The show_photo_container() method.
                show_controls, // The show_controls() method.method.
                construct_controls, // The construct_controls() method.
                show_thumbs, // The show_thumbs() method.method.
                construct_thumbs, // The construct_thumbs() method.
                active_thumb_class = 'fg-active', // The class to use for active thumbnails.
                activate_thumb, // The activate_thumb() method.
                change_photo, // The change_photo() method.
                curr_index = 0, // Index of the current Photo being viewed in the Slideshow.
                old_index = 0; // The index of the last visible Photo.
        
            initialize = function () {
            
                // show_loading_icon();
                show_gallery();
                show_photo_container();
                show_controls();
            
            };
        
            show_gallery = function () {
            
                log('Slideshow: Adding gallery container to page.');
                $cont.append($gallery);
            
            };
        
            show_photo_container = function () {
            
                log('Slideshow: Adding photo container to page.');
                $gallery.append($photo_container);
            
            };
        
            show_controls = function () {
            
                if ($cont.o.show_controls) {
                    log('Slideshow: Showing controls...');
                    $gallery.append(construct_controls());
                } else {
                    log('Slideshow: Not showing controls because they are disabled...');
                    return false;
                };
            
            };
        
            construct_controls = function () {
            
                $prev.click(function () {
                    that.show_prev();
                    return false;
                });
                $next.click(function () {
                    that.show_next();
                    return false;
                });
            
                $controls.append($prev, $next);
            
                return $controls;
            
            };
        
            show_thumbs = function () {
            
                if ($cont.o.show_thumbs) {
                    log('Slideshow: Showing thumbnails...');
                    $gallery.append(constuct_thumbs());
                
                
                
                } else {
                    log('Slideshow: Not showing thumbnails because they are disabled...');
                    return false;
                };
            
            };
        
            constuct_thumbs = function () {
            
                log('Slideshow: Construct thumbnails...');
            
                // Loop through each Photo, adding it to the thumbnails container.
                $.each(photos, function (i, photo) {
                
                    var $photo = photo.render($cont.o.thumb_size);
                    $thumbs.append($photo);
                    thumbs.push($photo); // Add the thumbnail to the list of thubs.
                
                });
            
                // Add the thumbnails to the thumbnail container.
                $.each(thumbs, function (i, $thumb) {
                
                    $thumb.show();
                    $thumb.click(function () {
                        change_photo(i);
                        return false;
                    });
                
                });
            
                return $thumbs;
            
            };
        
            /*
        
                Active the thumbnail by applying an active class to it.
            
                Also removes the active class from all other thumbnails.
            
                @method activate_thumb
                @param index {Number} The index of the thumbnail to activate.
        
            */
            activate_thumb = function (index) {
            
                var $thumb = thumbs[index];
            
                // Remove the active class from other thumbnails
                $.each(thumbs, function (i, $t) {
                    $t.removeClass(active_thumb_class);
                });
            
                // Add active class to 
                $thumb.addClass(active_thumb_class);
            
            };
        
            change_photo = function (to, from) {
            
                var to_photo = to, // The index of the Photo to show.
                    from_photo = from ? from : curr_index; // The index of the Photo to hide.

                console.log('\n\nSlideshow: Changing Photo from ' + from_photo + ' to ' + to_photo);
            
                that.hide_photo(from_photo); // Hide current Photo.
                that.show_photo(to_photo, from_photo); // Show selected Photo.
            
            };
        
            this.render = function () {
            
                log('Slideshow: Rendering Slideshow...');
            
                // Add all the Photos to the Slideshow.
                $.each(photos, function (i, photo) {
                
                    log('Slideshow: Adding Photo to Photo container: ' + photo.title);
                    $photo_container.append(photo.render());
                
                });
            
                show_thumbs(); // Show thumbnails after photos have been loaded.
            
                that.show_photo(curr_index); // Show the initial Photo in the Slideshow.
            
            };
        
            this.add_photo = function (photo) {
            
                log('Slideshow: Adding Photo to Slideshow: ' + photo.title);
                photos.push(photo);
            
                return true;
            
            };
        
            this.show_photo = function (new_index, prev_index) {
            
                var photo, // An instance of the Photo class.
                    last_item_index = (photos.length - 1); // Index of the last item in the array of photos.
            
                log('Slideshow: Showing Photo...');
            
                if (!prev_index) { // Must be the first photo...
                    log('\tNo old_index passed, setting old_index to new_index...');
                    var prev_index = old_index;
                };
            
                // Get the Photo to load.
                if (!photos) { // There are no photos.
                    log('\tThere are no photos so we cannot show any!');
                    return false; // Don't let anything else happen.
                } else if (new_index < 0) { // Photo index is less than 0.
                    log('\tRequested photo is lower than 0, show last item in the list.');
                    curr_index = last_item_index;
                    photo = photos[curr_index];
                } else if (new_index > last_item_index) { // Photo index is beyond the last item.
                    log('\tRequested photo index is beyond the last photo, so show the first item.');
                    curr_index = 0;
                    photo = photos[curr_index];
                } else { // Photo index is valid.
                    log('\tPhoto index valid.');
                    curr_index = new_index;
                    photo = photos[curr_index];
                };
            
                // Activate the correstponding thumbnail of this image, if thumbnails
                // are enabled.
                if ($cont.o.show_thumbs) {
                    activate_thumb(curr_index);
                };
            
                old_index = prev_index; // Set the last item to the previous photo.
                last_photo = photos[old_index]; // Get the last Photo that was visible.
            
                log('\tlast_photo: ' + last_photo.title);
                log('\tShowing Photo: ' + photo.title);
            
                photo.show(last_photo);
            
            };
        
            this.hide_photo = function (i) {
            
                var photo; // An instance of the Photo class.
            
                if (!photos) {
                    log('Slideshow: Cannot hide Photo because there are no Photos!');
                    return false; // Don't let anything else happen.
                } else {
                    photo = photos[i];
                    log('Slideshow: Hiding Photo: ' + photo.title);
                    photo.hide();
                };
            
            };
        
            this.show_next = function () {
            
                log('Slideshow: Showing NEXT photo...');
                new_index = curr_index + 1; // Calculate expected next Photo.

                change_photo(new_index, curr_index);
            
                // that.hide_photo(curr_index); // Hide current Photo.
                // that.show_photo(new_index, curr_index); // Show next Photo.
            
                return false; // Return false so the link URL isn't followed.
            
            };
        
            this.show_prev = function () {
            
                log('Slideshow: Showing PREV photo...');
                new_index = curr_index - 1; // Calculate expected previous Photo.
            
                change_photo(new_index, curr_index);
            
                // that.hide_photo(curr_index); // Hide current Photo.
                // that.show_photo(new_index, curr_index); // Show previous Photo.
            
                return false; // Return false so the link URL isn't followed.
            
            };
        
            this.pause = function () {};
        
            this.restart = function () {
            
                curr_index = 0;
                that.start();
            
            };
        
            initialize(); // Run initialization procedures when instance is created.
        
            return that;
        
        },
    
        /*
        
            A Photo, created from the Flickr API.
        
            When the photo is instantiated, it will automatically create a jQuery 
            object for the image and then preload it on the page.
        
            @class
    
        */
        Photo = function (data) {
        
            var $obj, // jQuery object of the instance's photo.
                $window = $(window), // Cache the jQuery window object.
                that = $.extend(this, data), // Store instance data.
                initialize, // The initialize() method.
                construct, // The construct() method.
                preload; // The preload() method.
        
            that.title = that.title ? that.title : 'Untitled'; // If there is no title, default to 'Untitled'.
        
            log('Photo <' + that.title + '>: Creating new instance of Photo.');
        
            /*
        
                Handles all initialization / instantiation behavior.
            
                @method
        
            */
            initialize = function () {
            
                log('Photo <' + that.title + '>: Initializing Photo.' );
                $obj = construct();
                preload();
            
            };
        
            /*
            
                Construct the jQuery object for the Photo.
            
                This object will be used to attach event handlers and other behavior 
                to.
            
                @method
        
            */
            construct = function (size) {
            
                log('Photo <' + that.title + '>: Constructing jQuery object for Photo.');
            
                var $photo, // The jQuery object to return.
                    photo_size = size ? size : that.options.photo_size, // Set the size to the requested size or the default.
                    photo_extension = '.jpg', // The format for the Photo. E.g. '.jpg', '.gif', '.png'
                    url; // The URL to the Photo on Flickr.
            
                // Get the corresponding Photo size.
                switch (photo_size) {
                    case 'tiny':
                        photo_size = 's'; // 75x75 square.
                        break;
                    case 'thumb':
                        photo_size = 't'; // 100px on the longest side.
                        break;
                    case 'small':
                        photo_size = 'm'; // 240px on the longest side.
                        break;
                    case 'medium':
                        photo_size = 'z'; // 640px on the longest side.
                        break;
                    case 'large':
                        photo_size = 'b'; // 1024px on the longest side.
                        break;
                    case 'original':
                        photo_size = 'o'; // Original image. May not be a JPEG!
                        break;
                    default:
                        photo_size = 'z'; // Default to the 'medium' size.
                        break;
                };
            
                if (photo_size === 'original') {
                    log('\tphoto_size is set to original, get it\'s extension...');
                    // TODO: Get extension of original photos...
                    // photo_extension = photo.extension; // Make sure to get the original's format.
                };
            
                // Get the API URL where we can find the photo.
                url = 'http://farm' + that.farm + '.static.flickr.com/' + that.server + '/' + that.id + '_' + that.secret + '_' + photo_size + photo_extension;
            
                $photo = $('<li class="fg-photo"><img src="' + url + '" alt="' + that.title + '" /></li>');
            
                // Show the info box, if enabled.
                if (that.options.show_info) { // Show option info if enabled and photos aren't too small. 
                
                    if (size === 'tiny' || size === 'thumb') {
                        log('\tNot showing info box because Photo is too small.');
                    } else {
                        log('\tShowing info box.');
                        $photo.append('<span class="fg-info">' + that.title + '</span>'); // TODO: Have titles be linkable, with option.
                    };
                
                };
            
                // Save the Photo URL/size to this object.
                $photo.url = url;
                $photo.photo_size = photo_size;
            
                $photo.hide(); // Make Photo hidden by default.
            
                // $photo.center();
            
                return $photo;
            
            };
        
            /*
        
                Preload the image.
            
                @method
        
            */
            preload = function () {
                // We append the image to the window so it will load but not be 
                // visible.
                log('Photo <' + that.title + '>: Preloading Photo.');
                $window.append($obj);
            };
        
            this.render = function (size) {
            
                if (size) {
                    return construct(size);
                } else {
                    return $obj;
                };
            
            };
        
            /*
            
                Show a hidden Photo in the slideshow.
            
                @interface
                @method
        
            */
            this.show = function (last_photo) {
            
                log('Photo <' + that.title + '>: Showing Photo.');
                log('\tWaiting for previous Photo to hide.');
            
                if (last_photo === that) { // First loaded Photo.
                    log('\tLast Photo is the same as the first Photo.');
                    // $obj.fadeIn('fast');
                    $obj.show();
                } else { // Wait for previous Photo to hide.
                    last_photo.get_object().promise().done(function() {
                        log('\tLast Photo is now hidden, showing Photo.');
                        // $obj.fadeIn('fast');
                        $obj.show();
                    });
                };
            
            };
        
            this.hide = function () {
            
                log('Photo <' + that.title + '>: Hidding Photo.');
                // $obj.fadeOut('fast');
                $obj.hide();
            
            };
        
        
            /*
        
                Get the Photo's jQuery object.
            
                This is meant to expose the jQuery object in the instance so it can 
                be listened to by other methods.
            
                @method
        
            */
            this.get_object = function () {
            
                return $obj;
            
            };
        
            initialize(); // Run initialization procedures when instance is created.
        
            return that; // Make sure to return the updated object.
        
        };
    
    $.fn.flickr_gallery = function (options) {
        
        var $obj = this, // Cache the jQuery object.
            api_prefix, // The base URL to the Flickr API.
            photoset_api_url, // URL to the set on the Flickr API.
            slideshow; // Contains an instance of the Slideshow class.
        
        $obj.o = $.extend({}, $.fn.flickr_gallery.defaults, options); // Compile the list of options.
        
        // Don't do anything if they didn't pass an API Key / Set ID.
        if (!$obj.o.set_id || !$obj.o.api_key) {
            alert('flickr_gallery: You must pass a Set ID and API key!');
            return false;
        };
        
        slideshow = new Slideshow($obj); // Initialize the Slideshow.
        
        // Construct the API URLs.
        api_prefix = 'http://api.flickr.com/services/rest/?api_key=' + $obj.o.api_key;
        photoset_api_url = api_prefix + '&method=flickr.photosets.getPhotos&photoset_id=' + $obj.o.set_id + '&nojsoncallback=1&format=json';
        
        // Connect to Flickr.
        $.ajax({
            url: photoset_api_url,
            dataType: 'json'
        })
            .success(function (data, textStatus, jqXHR) {
                
                // Loop through each photo in the set.
                $.each(data.photoset.photo, function (i, photo) {
                    
                    log(photo.title + ': Adding Photo to Slideshow.');
                    
                    var photo_data = {
                            farm: photo.farm,
                            server: photo.server,
                            secret: photo.secret,
                            title: photo.title,
                            id: photo.id,
                            options: $obj.o // Store the Slideshow options with each photo.
                            // index: i // Index in the list of returned photos.
                        },
                        p = new Photo(photo_data); // Create a new instance of the Photo class.
                    
                    slideshow.add_photo(p); // Add Photo instance to the Slideshow collection.
                    
                });
                
                slideshow.render(); // Start the slideshow after all the photos have been added.
                
            })
            .error(function (jqXHR, textStatus, errorThrown) {
                alert('flickr_gallery: Error fetching images:\n\n' + textStatus);
            });
        
    };
    
    /*
    
    @param api_key
    
    */
    $.fn.flickr_gallery.defaults = {
        api_key: null, // Flickr API key as a string. Required!
        autoplay: true, // Autoplay the slideshow on load.
        hide_animation: 'hide()', // The animation to use when hiding a Photo.
        photo_size: 'medium', // Default size of the photo to get from Flickr. Choices are: 'tiny', 'thumb', 'small', 'medium', 'large', 'original'
        replay: true, // Whether or not to replay the slideshow from the beginning after the last item is reached.
        set_id: null, // ID for the set on Flickr as a string. Required!
        show_animation: 'show()', // The animation to use when showing a Photo.
        show_controls: true, // Show the navigation controls previous and next.
        show_thumbs: false, // Show the thumbnails bar for navigating large sets of photos.
        show_info: false, // Show the info bar, which contains the title and link for a photo.
        thumb_size: 'tiny', // Size to use for thumbnails if thumbnails are enabled.
        width: null // If set, will force images to be at or under a particular width in pixels.
    };
    
})(jQuery);
