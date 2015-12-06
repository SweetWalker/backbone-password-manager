
require.config({
    paths: {
        'jquery': 'vendor/jquery/dist/jquery',
        'underscore': 'vendor/underscore/underscore',
        'backbone': 'vendor/backbone/backbone',
        'marionette': 'vendor/backbone.marionette',
        'stickit': 'vendor/stickit',


    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        marionette: {
            exports: 'Backbone.Marionette',
            deps: ['backbone']
        }
    },
deps: ['jquery', 'underscore']

    
});

require(['application/application'], function(AppView) {

});
