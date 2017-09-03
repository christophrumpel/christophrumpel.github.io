---
layout: post
title: "Build a Telegram chatbot in Laravel with BotMan Studio 2.0"
article_description: "With BotMan it is really easy to setup a Telegram chatbot. This week the new 2.0 version was released. We will checkout how to setup a Telegram chatbot in this new version with BotMan Studio step by step."
---

<header>
With BotMan it is really easy to setup a Telegram chatbot. This week the new 2.0 version was released. We will checkout how to setup a Telegram chatbot in this new version with BotMan Studio step by step.
</header>

## Preparations

Before we start, make sure to have these things prepared:

* PHP7+ environment
* [ngrok](https://ngrok.com/) or [Laravel Valet](https://laravel.com/docs/master/valet) to get a public URL to your BotMan app
* A [Telegram bot](https://core.telegram.org/bots)

## Install BotMan Studio

The easiest way to install BotMan Studio is via the installer.

{% highlight PowerShell startinline %}
composer global require "botman/installer"
{% endhighlight PowerShell startinline %}

After that you can just install a new instance like that:

{% highlight PowerShell startinline %}
botman new botman-telegram
{% endhighlight PowerShell startinline %}

It is basically like the Laravel Installer. Your application is now already installed. When you use Laravel Valet you can directly check the homepage, `botman-telegram.dev` in my case. Here you will see the BotMan Studio welcome page.

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

Now that BotMan is installed we need to configure it to work with Telegram. When you use the BotMan artisan command `php artisan botman:list-drivers` you will see the installed driver.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing terminal output for BotMan list driver command" src="/assets/post-images/blog_list_drivers.png" width="700" />

As you can see, by default only the web driver is installed. Since version 2.0 almost all drivers live in separate GitHub repositories and you need to install the ones you need. In order to install the Telegram driver we can use another artisan command.

{% highlight PowerShell startinline %}
php artisan botman:install-driver telegram
{% endhighlight PowerShell startinline %}

Next to the driver this will also add a `config/botman/telegram.php`  config file. There you'll see that BotMan requires some data from your `.env` file.

 {% highlight PHP startinline %}
  <?php
 ...
    /*
    |--------------------------------------------------------------------------
    | Telegram Token
    |--------------------------------------------------------------------------
    |
    | Your Telegram bot token you received after creating
    | the chatbot through Telegram.
    |
    */
    'token' => env('TELEGRAM_TOKEN'), 
 {% endhighlight PHP startinline %}

In order to connect our BotMan application to a Telegram bot we need the Telegram token. You will receive it when you [create a new bot](https://core.telegram.org/bots) on Telegram. Place it then in your `.env` file.

{% highlight PowerShell startinline %}
TELEGRAM_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
{% endhighlight PowerShell startinline %}

## Connect BotMan to your Telegram bot

Next we will connect the bot to our application. Since I am using Laravel Valet for my local development I can just type `valet share` in order to get a public URL for my application. Make sure to use the `https` one. If you are not using Valet you can install [ngrok](https://ngrok.com/) which Valet uses under hood too.

To add this public URL to our bot we need to do a HTTP POST request to `https://api.telegram.org/botYOUR-BOT-TOKEN/setWebhook` and provide one field `url` which holds our public URL. Make sure to replace `YOUR-BOT-TOKEN` with your token. 👈

I am using the REST client [Insomnia](https://insomnia.rest/) for that, but you can do that with `CURL` as well.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="How to setup the Telegram bot webhook" src="/assets/post-images/telegram_webhook.png" width="700" />

The `botman` endpoint of your BotMan application is already setup in BotMan Studio. This is why that works out of the box. You will find the code for that in you `routes/web.php` file.

 {% highlight PHP startinline %}
 <?php
 ...
Route::match(['get', 'post'], '/botman', 'BotManController@handle'); 
 {% endhighlight PHP startinline %}
 
## Test it out

Next we can test if everything is working like planned. So visit your Telegram bot, which you can find like any other users, and send a message with just `Hi`. You should again get a reply with `Hello!`.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing a message and a reply in Telegrram." src="/assets/post-images/telegram_test_hi.png" width="700" />

Additionally we can test the example conversation, which is built into BotMan Studio.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing how to test the BotMan example conversation" src="/assets/post-images/telegram_test_conv.png" width="700" />

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
 
 <img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing first custom bot message" src="/assets/post-images/telegram_test_custom.png" width="700" />
 
## Conclusion
 
Although it seems quite easy to setup BotMan Studio and Telegram you still need to be aware of a view things. I hope I could provide them here and this article helps you to setup your next Telegram bots. From here you are ready to build more and more features to your bot your own. So make sure to checkout the BotMan [documentation](http://botman.io/) to get a feeling of what is possible and learn new stuff.