---
layout: post
title: "Build a Telegram group bot in PHP"
article_description: "Working with Facebook Messenger bots is great, but there is one thing still missing: group bots! This is why we will build a little Telegram bot today and use it inside a FantasticBurger group."
---


<header>
Working with Facebook Messengers bots is great, but there is one thing still missing: group bots! This is why we will built a little Telegram bot today and use it inside my FantasticBurger group.
</header>

## Preface

First thing to keep in mind here is that a group chatbot can be very different from a 1:1 conversation chatbot. In groups chatbots are often not a direct conversation partner but more a quiet assistant. They do not need to reply to every message. In fact that would be very annoying :-) 😒 But they can help the group with certain tasks.

With my friends we have a `FantasticBurger group` on Telegram. This is where we chat all day about our favourite topic `Burgers`. 🍔 Once a month we meet to grab one of them and drink some beers. One question we ask a lot is, how long it is till the next event. And this is the one thing our bot will do today. A Telegram command will trigger the bot and he will tell us how many days are left.

## Telegram setup

We start by creating a Telegram bot. Follow the instructions [here](https://core.telegram.org/bots) and copy the bot token, we will need that later. It is quite funny to create a bot with a bot, isn't it? :-)

Now that the bot is created you can find it through the Telegram contact search and start a conversation with it. Of course it cannot reply yet, but we will change that soon.

Next we add a command to our bot, which will trigger the message inside the Telegram group. They are like buttons everyone in the group can use to trigger a certain bot task. Creating a command can be achieved via the `BotFather` bot. Just use the `/setcommands` command inside your BotFather chat on Telegram.

 <img class="alignnone" style="max-width: 100%; height: auto;" alt="How to set a command in a Telegram bot" src="/assets/post-images/telegram_setcommand.png" width="700" />

## BotMan setup

I am a big fan of the [BotMan](https://botman.io/) library and we will use it again today. Since I am working a lot with Laravel I will use the [BotMan Laravel Starter](https://github.com/mpociot/botman-laravel-starter), which makes the setup super easy.

<div class="note"><strong>Note:</strong> Of course you do not need Laravel to use the BotMan library. Most of the code will be the same without it.</div>

Let's start by getting the BotMan Laravel Starter:

{% highlight PowerShell startinline %}
composer create-project mpociot/botman-laravel-starter telegram-group-bot
{% endhighlight PowerShell startinline %}

Then add the bot token, you got while creating the Telegram bot, to your `.env` file.

{% highlight text startinline %}
# BOTMAN SERVICE CONFIGURATION
...
TELEGRAM_TOKEN=your-bot-token
...
{% endhighlight text startinline %}

## Bring them together

Next we will connect the bot to our application. Since I am using Laravel Valet for my local development I can just type `valet share` in order to get a public URL for my application. Make sure to use the `https` one. If you are not using Valet you can install [ngrok](https://ngrok.com/) which Valet uses under hood too.

To add this public URL to our bot we need to do a HTTP POST request to `https://api.telegram.org/botYOUR-BOT-TOKEN/setWebhook` and provide one field `url` which holds our public URL. Make sure to replace `YOUR-BOT-TOKEN` with your token. 👈🏼

I am using the REST client [Insomnia](https://insomnia.rest/) for that, but you can do that with `CURL` as well.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="How to setup the Telegram bot webhook" src="/assets/post-images/telegram_webhook.png" width="700" />

To make sure everything is working out, type `Hello` in your chat with your created bot. It should response with `Hi there :)`. This works because the BotMan Laravel Starter comes with a simple example:
 
 {% highlight PHP startinline %}
 <?php
...
// Simple respond method inside BotManController
$botman->hears('Hello', function (BotMan $bot) {
	$bot->reply('Hi there :)');
});
{% endhighlight PHP startinline %}

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Telegram bot replies with hello" src="/assets/post-images/telegram_hello.png" width="700" />

## Finally some code

Now that we got everything setup, we are ready to create the logic behind our `/countdown` Telegram command. Let's change the default example to listen to our command.

{% highlight PHP startinline %}
<?php
...
 $botman->hears('/countdown', function (BotMan $bot) {
	$firstName = $bot->getUser()->getFirstName();
	$bot->reply('Hey ' . $firstName . ', next FantasticBurgerGroup event will start in 10 days.');
});
...
{% endhighlight PHP startinline %}

I am also grabbing the users's first name, to provide a more personal reply. In order to see all listed commands, you just need to type a slash.
 
  <img class="alignnone" style="max-width: 100%; height: auto;" alt="See all available Telegram commands" src="/assets/post-images/telegram_commandlist.png" width="700" />
 
 And now try our command.
 
 <img class="alignnone" style="max-width: 100%; height: auto;" alt="Our bot will reply with the text about the left days we did provide" src="/assets/post-images/telegram_leftdays.png" width="700" />
 
 It should return our string and tell us the left days. Of course this is not dynamic right now, but this is not what this article was about. The focus was to setup the Telegram bot.
 
Now that the bot is working we just need to add it to a group, like we would with a normal user. Then the slash command will be available there for everyone.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Add the bot to a Telegram group" src="/assets/post-images/telegram_addbot.png" width="700" />

## Conclusion

I hope I could show you today that it is really easy to start a Telegram group bot. With already one command it can be helpful to everyone in this group. Below you will see how I use this bot inside my FantasticBurger group. (German text) I changed his name to `Mr. Burger` and also implemented a joke command that will tell you a Chuck Norris joke ;-) 🤠 

Next time we will enhance this bot to reply automatically without the slash commands. In the meanwhile have fun building bots.


<img class="alignnone" style="max-width: 100%; height: auto;" alt="Final result, the bot showing the left days a telling a chuck norris joke" src="/assets/post-images/telegram_group.png" width="700" />



