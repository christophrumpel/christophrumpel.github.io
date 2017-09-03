---
layout: post
title: "Build a Telegram chatbot in Laravel with BotMan Studio 2.0"
article_description: "With BotMan it is really easy to setup a Facebook chatbot. This week the new 2.0 version was released. We will checkout how to setup a Facebook Messenger chatbot in this new version with BotMan Studio step by step."
---

<header>
With BotMan it is really easy to setup a Facebook chatbot. This week the new 2.0 version was released. We will checkout how to setup a Facebook Messenger chatbot in this new version with BotMan Studio.
</header>

## Preparations

Before we start, make sure to have these things prepared:

* PHP7+ environment
* [ngrok](https://ngrok.com/) or [Laravel Valet](https://laravel.com/docs/master/valet) to get a public URL to your BotMan app
* A Facebook Page where your chatbot will live
* A Facebook App which we will configure together

## Install BotMan Studio

The easiest way to install BotMan Studio is via the installer.

{% highlight PowerShell startinline %}
composer global require "botman/installer"
{% endhighlight PowerShell startinline %}

After that you can just install a new instance like that:

{% highlight PowerShell startinline %}
botman new botman-facebook
{% endhighlight PowerShell startinline %}

It is basically like the Laravel Installer. Your application is now already installed. When you use Laravel Valet you can directly check the homepage, `botman-facebook.dev` in my case. Here you will see the BotMan Studio welcome page.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot of the BotMan welcome page" src="/assets/post-images/blog_homepage.png" width="700" />

When you click `Tinker` you can immediately test your chatbot. Type `Hi` and you should get a reply. This works because this behaviour comes with BotMan Studio. You will find the code for that in your `routes/botman.php` file.

 {% highlight PHP startinline %}
  <?php
 ...
 $botman->hears('Hi', function ($bot) {
     $bot->reply('Hello!');
 });
 {% endhighlight PHP startinline %}

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing BotMan Tinker" src="/assets/post-images/blog_tinker.png" width="700" />

## Configure BotMan Studio

Now that BotMan is installed we need to configure it to work with Facebook Messenger. When you use the BotMan artisan command `php artisan botman:list-drivers` you will see the installed driver.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing terminal output for BotMan list driver command" src="/assets/post-images/blog_list_drivers.png" width="700" />

As you can see, by default only the web driver is installed. Since version 2.0 almost all drivers live in separate GitHub repositories and you need to install the ones you need. In order to install the Facebook driver we can use another artisan command.

{% highlight PowerShell startinline %}
php artisan botman:install-driver facebook
{% endhighlight PowerShell startinline %}

Next to the driver this will also add a `config/botman/facebook.php`  config file. There you'll see that BotMan requires some data from your `.env` file.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing facebook botman config file" src="/assets/post-images/blog_config_file.png" width="700" />

In order to connect our BotMan application to a Facebook app and page we need these env values:

{% highlight PowerShell startinline %}
FACEBOOK_TOKEN=YOUR_APP_FACEBOOK_PAGE_TOKEN
FACEBOOK_APP_SECRET=YOUR_APP_SECRET
FACEBOOK_VERIFICATION=YOUR_VERIFICATION
{% endhighlight PowerShell startinline %}

## Setup the Facebook app

On your [Facebook Developer site](https://developers.facebook.com) go to your app and add the Messenger product to it.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot of how to add the Messenger product to your Facebook app" src="/assets/post-images/blog_fb_app_messenger.png" width="700" />

Now you're able to create a Facebook Page Token. Just select the Facebook page, where your bot will be available, and copy the token. On your apps dashboard you will also find the Facebook App Secret. Copy it as well and put the values in your `.env` file. You can chosse the value of `FACEBOOK_VERIFICATION` yourself there. We will need that in a short.

## Connect BotMan to your Facebook app

In order to connect them we need to setup the webhook inside your Facebook app. You will find the options in the app's Messenger section like before.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot of the Facebook app webhook options" src="/assets/post-images/blog_fb_app_webhook.png" width="700" />

There we need to select the subscription fields, so the app knows what to send to our BotMan application and the URL where to send it to. The callback URL is your BotMan application public URL + `/botman` and the Verify Token is the one you used in your `.env` file. For us the `messages` and `messages_postbacks` fields are fine for now. When you did everything correctly your webhook should now be successfully setup.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot of the webhook options" src="/assets/post-images/blog_fb_app_webhook_2.png" width="700" />

<div class="note"><strong>Note:</strong> Postbacks are values that will be send when you use Buttons or other Facebook templates.</div>

The `botman` endpoint of your BotMan application is already setup in BotMan Studio. This is why that works out of the box. You will the code for that in you `routes/web.php` file.

 {% highlight PHP startinline %}
 <?php
 ...
Route::match(['get', 'post'], '/botman', 'BotManController@handle'); 
 {% endhighlight PHP startinline %}
 
 <div class="note"><strong>Note:</strong> The webhook setup request is a GET request. Every other Facebook request will be a POST one. This is why we need hear for GET and POST requests.</div>

After you have setup the webhook, you will be able to subscribe the app to a Facebook page. This makes sure that every message from the page will be sent through your app to your BotMan application.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing how to subscribe to a Facebook page" src="/assets/post-images/blog_subscribe_fb_page.png" width="700" />

## Test it out

Next we can test if everything is working like planned. So visit your Facebook page and send a message with just `Hi`. You should again get a reply with `Hello!`.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing a message and a reply in Facebook Messenger." src="/assets/post-images/blog_test_hi.png" width="700" />

You can also write to your page through the [Messenger web app](https://www.messenger.com/). This is what I am using in the screenshot. Just search for your page there in order to write a message.

<div class="note"><strong>Note:</strong> While your Facebook app or page are not published, your Facebook user needs to be an admin of the page and the app in order to make it work. </div>

Additionally we can test the example conversation, which is built in into BotMan Studio.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing how to test the BotMan example conversation" src="/assets/post-images/blog_test_conv.png" width="700" />

## First custom message

And in order to write some chatbot functionality ourselves, we add a custom listener to the `routes/botman.php` file.

{% highlight PHP startinline %}
  <?php
 ...
$botman->hears('It just works', function(BotMan $botMan) {
   $botMan->reply('Yep 🤘');
}); 
{% endhighlight PHP startinline %}
 
You will see that this works like a charm as well.
 
 <img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing first custom bot message" src="/assets/post-images/blog_test_custom.png" width="700" />
 
## Conclusion
 
Although it seems quite easy to setup BotMan Studio and Facebook you still need to be aware of a view concepts regarding Facebook. I hope I could provide them there and this article helps you to setup your next Facebook Messenger chatbots. From here you are ready to build more and more features to your bot your own. So make sure to checkout the BotMan [documentation](http://botman.io/) to get a feeling of what is possible and learn new stuff.