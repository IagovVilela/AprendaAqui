<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Livewire Class Namespace
    |--------------------------------------------------------------------------
    |
    | This value sets the root namespace for Livewire component classes in
    | your application. This value affects component auto-discovery and
    | any Livewire file helper commands, like `artisan make:livewire`.
    |
    | After changing this item, run: `php artisan livewire:discover`.
    |
    */

    'class_namespace' => 'App\\Livewire',

    /*
    |--------------------------------------------------------------------------
    | View Path
    |--------------------------------------------------------------------------
    |
    | This value sets the path for Livewire component views. This affects
    | file manipulation helper commands like `artisan make:livewire`.
    |
    */

    'view_path' => resource_path('views/livewire'),

    /*
    |--------------------------------------------------------------------------
    | Layout
    |--------------------------------------------------------------------------
    |
    | The default layout view that will be used when rendering a component via
    | Route::get('/some-endpoint', SomeComponent::class);. In this case the
    | the view returned by SomeComponent will be wrapped in "layouts.app"
    |
    */

    'layout' => 'layouts.app',

    /*
    |--------------------------------------------------------------------------
    | Lazy Loading Placeholder
    |--------------------------------------------------------------------------
    |
    | Livewire allows you to lazy load components that would otherwise slow down
    | the initial page load. Every component that can be lazy loaded has a
    | "placeholder" view that is rendered on the page before the actual
    | component is loaded and rendered.
    |
    */

    'lazy_placeholder' => null,

    /*
    |--------------------------------------------------------------------------
    | Temporary File Uploads Endpoint Configuration
    |--------------------------------------------------------------------------
    |
    | Livewire handles file uploads by storing uploads in a temporary directory
    | before the file is validated and stored permanently. All file uploads
    | are directed to a global endpoint for temporary storage. The config
    | items below are used for customizing the way the endpoint works.
    |
    */

    'temporary_file_upload' => [
        'disk' => null,        // Example: 'local', 's3'              Default: 'default'
        'rules' => null,       // Example: ['file', 'mimes:png,jpg']  Default: ['required', 'file', 'max:12288'] (12MB)
        'directory' => null,    // Example: 'tmp'                      Default  'livewire-tmp'
        'middleware' => null,  // Example: 'throttle:5,1'             Default: 'throttle:60,1'
        'preview_mimes' => [   // Supported file types for temporary pre-signed file URLs.
            'png', 'gif', 'bmp', 'svg', 'wav', 'mp4',
            'mov', 'avi', 'wmv', 'mp3', 'm4a',
            'jpg', 'jpeg', 'mpga', 'webp', 'wma',
        ],
        'max_upload_time' => 5, // Max time (in minutes) before an upload is invalidated.
    ],

    /*
    |--------------------------------------------------------------------------
    | Render On Redirect
    |--------------------------------------------------------------------------
    |
    | This value sets the Livewire rendering behavior when a redirect()
    | is called during a component's lifecycle. If set to false, Livewire
    | will not render the component. If set to true, Livewire will render
    | the component before redirecting.
    |
    */

    'render_on_redirect' => false,

    /*
    |--------------------------------------------------------------------------
    | Eloquent Model Binding
    |--------------------------------------------------------------------------
    |
    | Previous versions of Livewire supported automatically binding Eloquent
    | models to a Livewire component's properties using route model binding.
    | However, this behavior has been disabled as it was too unpredictable.
    | You can still manually bind Eloquent models in your mount() method.
    |
    */

    'legacy_model_binding' => false,

    /*
    |--------------------------------------------------------------------------
    | Auto-inject Frontend Assets
    |--------------------------------------------------------------------------
    |
    | By default, Livewire automatically injects its JavaScript and CSS
    | into each page that includes a Livewire component. If you want to
    | disable this behavior and manually inject the assets yourself,
    | set this to false.
    |
    */

    'inject_assets' => true,

    /*
    |--------------------------------------------------------------------------
    | Navigate (SPA mode)
    |--------------------------------------------------------------------------
    |
    | By default, Livewire includes a feature to navigate the various pages of
    | an application without the browser performing a full page refresh, similar
    | to a single-page application (SPA). You may disable this behavior if you
    | are not using Livewire's SPA features.
    |
    */

    'navigate' => [
        'show_progress_bar' => true,
        'progress_bar_color' => '#2299dd',
    ],

    /*
    |--------------------------------------------------------------------------
    | HTML Morphing
    |--------------------------------------------------------------------------
    |
    | Livewire supports morphing the existing HTML in the page with the HTML
    | returned by the component. This feature is useful for maintaining
    | state, like focus position, that would otherwise be lost during
    | a full page refresh. You can disable this feature if you need
    | to use legacy JavaScript libraries that conflict with morphing.
    |
    */

    'morphing' => [
        'key' => null,
        'tag' => 'div',
        'skip_if_empty' => true,
        'html' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Asset Bundling
    |--------------------------------------------------------------------------
    |
    | Livewire allows you to bundle its assets with your application's assets
    | using Vite. This is useful if you want to customize the assets or
    | if you want to bundle them with your application's assets.
    |
    */

    'bundle_assets' => false,

    /*
    |--------------------------------------------------------------------------
    | Back Button Cache
    |--------------------------------------------------------------------------
    |
    | Livewire supports caching the component's state when the user navigates
    | away from the page and then returns using the browser's back button.
    | This feature is useful for maintaining state, like form data, that
    | would otherwise be lost during navigation. You can disable this
    | feature if you don't need it.
    |
    */

    'back_button_cache' => false,

    /*
    |--------------------------------------------------------------------------
    | CSRF Protection
    |--------------------------------------------------------------------------
    |
    | Livewire includes built-in CSRF protection for all requests. This helps
    | prevent cross-site request forgery attacks. You can disable this
    | feature if you are handling CSRF protection elsewhere.
    |
    */

    'csrf_protection' => true,
];
