---
layout: post
title: "Setup a Facebook Messenger chatbot in Laravel"
article_description: "There is a new PHP library called BotMan that makes it super easy to setup a Facebook Messenger chatbot in Laravel. Let's do this."
---


<header>
There is a new PHP library called <a href="https://github.com/mpociot/botman">BotMan</a> that makes it super easy to setup a Facebook Messenger chatbot in Laravel. Let's do this.
</header>

<div class="note"><strong>Note:</strong> I wrote a <a href="http://christoph-rumpel.com/2017/09/build-a-facebook-chatbot-with-laravel-and-botman-studio/">new article</a> about building a Facebook Messenger chatbot with Laravel and BotMan Studio 2.0.</div>

## Welcome BotMan

BotMan is framework agnostic PHP library for creating chatbots. It supports multiple messenger platforms like `Telegram`, `Slack`, `Microsoft`, `Facebook` and more. It is built by [Marcel Pociot](https://twitter.com/marcelpociot) and it makes developing chatbots super easy. We are going to use it in Laravel to setup a Facebook Messenger chatbot.

## BotMan ❤️ Laravel

BotMan works perfectly together with Laravel. Marcel has provided a [BotMan Laravel Starter](https://github.com/mpociot/botman-laravel-starter) which we are going to use here. 

### Install the Laravel application
First we need to clone the repository and install the dependencies.
{% highlight Shell startinline %}
git clone git@github.com:mpociot/botman-laravel-starter.git
cd botman-laravel-starter
php composer install
{% endhighlight Shell startinline %}

And of course, like with every Laravel project, we create our environment config file and generate an application key.

{% highlight Shell startinline %}
mv .env.example .env  
php artisan key:generate  
{% endhighlight Shell startinline %}

### Configuration

Now we are ready to copy our Facebook Messenger tokens to our `.env` file. We need the `Page Access Token` which is linked to the Facebook page you want to use and the `Verify Token` which is used to hook up this application and the Messenger application.

{% highlight TEXT startinline %}
// ...inside .env file
FACEBOOK_TOKEN=your-facebook-page-token
TOKEN_VERIFY=your-wehbook-verify-token
FACEBOOK_APP_SECRET=your-facebook-app-secret
{% endhighlight TEXT startinline %}

Also make sure you have these Facebook settings inside you `config/services.php`:

{% highlight PHP startinline %}
<?php
// ..
'botman' => [
	// ...
	'facebook_token' => env('FACEBOOK_TOKEN'),
	'facebook_app_secret' => env('FACEBOOK_APP_SECRET')
],
// ..
{% endhighlight PHP startinline %}

Your application needs to be available for the Facebook webhook. I am using [Laravel valet](https://laravel.com/docs/master/valet) to generate a public HTTPS URL.
{% highlight Shell startinline %}
valet share
{% endhighlight Shell startinline %}

<div class="note"><strong>Note:</strong> If you want to see how to setup a Facebook Messenger application, the webhook and where to find the tokens, you can look it up <a href="http://christoph-rumpel.com/2016/08/build-a-php-chatbot-in-10-minutes">here</a></div>

### Chat

Now type `test` in your Messenger chat of the used page and you should get back "hello!". Also try out `Start conversation` and see an example of a `BotMan conversation`. This should look like this:
<img class="alignnone" style="max-width: 100%; height: auto;" alt="BotMan Conversation" src="/assets/post-images/botman_conv.png" width="700" />

Awesome right? When you take a look at the `botman.php` file in the routes directory you will see why the two messages already worked out of the box.
{% highlight PHP startinline %}
<?php
use App\Http\Controllers\BotManController;
// Don't use the Facade in here to support the RTM API too :)
$botman = resolve('botman');

$botman->hears('test', function($bot){
    $bot->reply('hello!');
});
$botman->hears('Start conversation', BotManController::class.'@startConversation');
{% endhighlight PHP startinline %}

Checkout the [BotMan documentation](https://github.com/mpociot/botman) to learn more about the features.

## Conclusion

Wasn't that easy? Now you got a chatbot running, try to create conversations yourself. This year will be full of chatbots and it is great to see more and more great tools like BotMan out there to help use building them. 








