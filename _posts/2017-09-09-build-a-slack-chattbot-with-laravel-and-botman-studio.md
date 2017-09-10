---
layout: post
title: "Build a Slack chatbot in Laravel with BotMan Studio 2.0"
article_description: "With BotMan it is really easy to setup a Slack chatbot. Last week the new 2.0 version was released. We will checkout how to setup a Slack chatbot in this new version with BotMan Studio step by step."
---

<header>
With BotMan it is really easy to setup a Slack chatbot. Last week the new 2.0 version was released. We will checkout how to setup a Slack chatbot in this new version with BotMan Studio step by step.
</header>

## Preparations

Before we start, make sure to have these things prepared:

* PHP7+ environment
* [ngrok](https://ngrok.com/) or [Laravel Valet](https://laravel.com/docs/master/valet) to get a public URL to your BotMan app
* A Slack account and team

## Install BotMan Studio

The easiest way to install BotMan Studio is via the installer.

{% highlight PowerShell startinline %}
composer global require "botman/installer"
{% endhighlight PowerShell startinline %}

After that you can just install a new instance like that:

{% highlight PowerShell startinline %}
botman new botman-Slack
{% endhighlight PowerShell startinline %}

It is basically like the Laravel Installer. Your application is now already installed. When you use Laravel Valet you can directly check the homepage, `botman-slack.dev` in my case. Here you will see the BotMan Studio welcome page.

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

Now that BotMan is installed we need to configure it to work with Slack. When you use the BotMan artisan command `php artisan botman:list-drivers` you will see the installed driver.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing terminal output for BotMan list driver command" src="/assets/post-images/blog_list_drivers.png" width="700" />

As you can see, by default only the web driver is installed. Since version 2.0 almost all drivers live in separate GitHub repositories and you need to install the ones you need. In order to install the Slack driver we can use another artisan command.

{% highlight PowerShell startinline %}
php artisan botman:install-driver slack
{% endhighlight PowerShell startinline %}

Next to the driver this will also add a `config/botman/Slack.php`  config file. There you'll see that BotMan requires some data from your `.env` file.

 {% highlight PHP startinline %}
  <?php
  
  return [
  
      /*
      |--------------------------------------------------------------------------
      | Slack token
      |--------------------------------------------------------------------------
      |
      | Your Slack bot token.
      |
      */
      'token' => env('SLACK_TOKEN'),
  
  ];

 {% endhighlight PHP startinline %}

In order to connect our BotMan application to Slack, we need the Slack token. We will receive that later.


## Create a Slack app

There are multiple ways to use BotMan with your Slack team. The recommended one is by using a Slack app. This is why I will only cover this one here. Read the [official docs](https://botman.io/master/driver-slack) for more information about the other possibilities.
 
 Visit the [Slack API](https://api.slack.com/apps?new_app=1) website in order to create a new Slack app.
 
 <img class="alignnone" style="max-width: 100%; height: auto;" alt="Create a new Slack app" src="/assets/post-images/slack_create_app.png" width="700" />
 
 Once we have an app we can configure it. Here is a list of what we want to do:
 
 * Active Interactive Messages
 * Define Events to listen to
 * Setup the Bot User
 * Install the app
 
### Active Interactive Messages
 
 When you use buttons with your Slack messages, they will trigger Interactive Messages that will be sent to BotMan. So we need to active them and place our BotMan webhook URL in the `Request URL` field.
 
 <img class="alignnone" style="max-width: 100%; height: auto;" alt="Activate interactive messages" src="/assets/post-images/slack_interactive_messages.png" width="700" />
 
### Define Events to listen to
 
In order to listen to Slack messages we need to subscribe to those events. Only then we are able to receive the messages and reply to them. Here we are saying that we want to get all messages from channels and direct messages. Again we need to fill in our BotMan webhook.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Subscribe to Slack events" src="/assets/post-images/slack_events.png" width="700" />

### Setup the Bot User

Right now we just have a configured app. But what we want is a "real" user in our Slack Team. This is what the `Bot Users` section is for. Just give your bot a display and username.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Create a Bot User" src="/assets/post-images/slack_bot_user.png" width="700" />

### Install the app

Now we're almost finished. Last step is to `install` the app. Just hit the button and you will get the tokens.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Install the Slack app" src="/assets/post-images/slack_install_before.png" width="700" />

The `Bot User OAuth Access Token` is the one that we need. Place in your .env file, because your `slack.php` config file is loading it from there.

{% highlight PowerShell startinline %}
SLACK_TOKEN=YOUR_SLACK_BOT_USER_TOKEN
{% endhighlight PowerShell startinline %}
 
## Test it out

Next we can test if everything is working like planned. So visit your Slack Team and you should see the new Slack user there. Just send a message with `Hi`. You should again get a reply with `Hello!`.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing a message and a reply in Slack." src="/assets/post-images/slack_test_hi.png" width="700" />

Additionally we can test the example conversation, which is built into BotMan Studio.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing how to test the BotMan example conversation" src="/assets/post-images/slack_test_conv.png" width="700" />

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
 
 <img class="alignnone" style="max-width: 100%; height: auto;" alt="Screenshot showing first custom bot message" src="/assets/post-images/slack_test_custom.png" width="700" />
 
## Conclusion
 
As you've seen, most of the things we need to do is on the Slack site. Once that is done BotMan just works and is easy to extend. I hope I could help you with your first steps and that this article helps you to setup your next Slack bots. From here you are ready to build more and more features to your bot your own. So make sure to checkout the BotMan [documentation](http://botman.io/) to get a feeling of what is possible and learn new stuff.