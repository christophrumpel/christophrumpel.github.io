---
layout: post
title: "Browser tests with Laravel Dusk"
article_description: "With Laravel 5.4 there will be also a new testing tool available called Dusk. Do we really need another testing tool? Yes we do! Let’s see why.
"
---


<header>
With Laravel 5.4 there will be also a new testing tool available called Dusk. Do we really need another testing tool? Yes we do! Let’s see why.
</header>

## The pain point

So I guess we are all already at the point where we know that testing is very important. And you probably know that Laravel provides some great [testing features]({% post_url 2015-07-14-start-testing-your-laravel-application-today %}) right out of the box. And of course there are great testing frameworks out there that you can use on top of Laravel like [Behat](http://behat.org/en/latest) or [Codeception](http://codeception.com/). So why do we need something new?

It is because of the architecture of our applications. A lot of Laravel applications just handle the backend logic and let JavaScript frameworks like Vue or Angular do the front-end. This way we can provide a better and faster experience for our users. But with these applications we have a big problem. They get separated in two pieces and it gets much harder to test them end to end.

## Laravel 5.4 and Dusk

With the upcoming release there will be also a change in Laravel testing. Until now tests in Laravel were separated in `Unit` and `Application` tests. The second one provided a lot of methods for testing HTTP request or browser behaviour. (visit, click, see etc.) Laravel uses the Symfony BrowserKit component to simulate a web browser. This was quite fine but it is still not a real browser.


In Laravel 5.4 this will change. By default the application holds a `Feature` and a `Unit` directory for tests. Feature tests are similar to Application tests, but there is no more browser stuff included. So if you want to `visit` a page, `click` a link or `see` some text you will need to pull in Dusk. Everything regarding browser automation will be part of Dusk and this time we will have a real browser available.

<blockquote>Laravel Dusk provides an expressive, easy-to-use browser automation and testing API. </blockquote>
<p class="quote-author">Taylor Otwell</p>

<div class="note"><strong>Note:</strong> Be aware that both Laravel and Dusk version are not released yet. Changes are possible.</div>

## Installation

As I mentioned before Dusk is a tool for Laravel 5.4. Since version 5.4 is not yet released, we need to install the latest `dev` version of Laravel.

{% highlight Shell startinline %}
composer create-project laravel/laravel your-project-name-here dev-develop
{% endhighlight Shell startinline %}

Then require Laravel Dusk. (Alpha version)

{% highlight Shell startinline %}
composer require laravel/dusk --dev
{% endhighlight Shell startinline %}

Next we need to register the `Dusk ServiceProvider`. Add this code to your `register` method inside your `AppServiceProvider`. We only need this Provider for our local and testing environment.

{% highlight PHP startinline %}
<?php
...
public function register()
{
	if ($this->app->environment('local', 'testing')) {
		$this->app->register(DuskServiceProvider::class);
	}
}
...
{% endhighlight PHP startinline %}

To finish the installation use the artisan command `php artisan dusk:install`. This will create a browser directory inside your tests folder and add a basic example test.

<div class="note"><strong>Note:</strong> Don't forget to add your APP_URL to your .env file. Dusk will need it to browse your application.</div>

## Examples

### Default test
Finally we are prepared for our first Dusk tests. You will find it inside `tests/Browser/ExampleTest.php`.
{% highlight PHP startinline %}
<?php
...
public function testBasicExample()
{
	$this->browse(function ($browser) {
		$browser->visit('/')
			->assertSee('Laravel');
	});
}
...
{% endhighlight PHP startinline %}

This is similar to the old default test, but now it is using the ChromeDriver. We are using the `browse` method which accepts a callback. Within this callback we get our main browser instance which we use for our assertion. There is a separate artisan command to start Dusk tests:

{% highlight Shell startinline %}
php artisan dusk
{% endhighlight Shell startinline %}

This should pass and result in `OK (1 test, 1 assertion)`. Gratulations! This was your first Dusk test! You probably saw the browser popping up for a second. This was your test. 👍

### The fun side of waiting

Instead of waiting for your whole front-end to be loaded, Dusk lets you wait for certain elements and conditions.

{% highlight PHP startinline %}
<?php
...
$this->browse(function ($browser) {
	$browser->visit('/')
		->waitForText('Hello Dusk!')
		->assertSee('Hello Dusk!');
});
...
{% endhighlight PHP startinline %}

By default it will wait a maximum of 5 seconds for the text. You can cahnge that limit by providing a second parameter: `->waitForText('Hello Dusk!', 1)`

Beside text you can wait for other elements too:

{% highlight PHP startinline %}
<?php
...
// Wait for a selector
$browser->waitFor('.selector');
...
// Wait for a selector to disapear
$browser->waitUntilMissing('.selector');
...
// Wait for a text link
$browser->waitForLink('Create');
...
{% endhighlight PHP startinline %}

Furthermore you can wait for JavaScript conditions to "come true".

{% highlight PHP startinline %}
<?php
...
$browser->waitUntil('appLoaded');
...
$browser->waitUntil('users > 0');
...
{% endhighlight PHP startinline %}

### Change text with JavaScript

Sometimes you need to change text with JavaScript. With Dusk you can now test this scenarios. As a quick example let's change the Laravel welcome blade title after two seconds. Add this script to your `welcome.blade.php` view and give the Laravel title an id of "title".
{% highlight Html startinline %}
<script>
	setTimeout(function(){
		document.getElementById("title").innerHTML = "Dusk";
	}, 2000);
</script>
{% endhighlight Html startinline %}

And now make two tests to check for the text before and after.

{% highlight PHP startinline %}
<?php
...
$this->browse(function ($browser) {
	$browser->visit('/')
		->assertSee('Laravel');
});

$this->browse(function ($browser) {
	$browser->visit('/')
		->waitForText('Dusk')
		->assertSee('Dusk');
});
...
{% endhighlight PHP startinline %}

Here is an animation showing the test.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Gif showing how the Dusk test passes" src="/assets/post-images/dusk.gif" width="700" />

<div class="note"><strong>Note:</strong> Check out <a href="https://laravel.com/docs/master/dusk#available-assertions">the docs</a> for all the possible assertions.</div>

### One browser is not enough

Now that we got one real browser, why not use two? "Why could we need two?", you might ask. Let's consider we are using Laravel envent broadcasting for a simple chat. With Dusk you could now test if browser two sees what browser one is sending. This is the example from the official docs.

{% highlight PHP startinline %}
<?php
...
$this->browse(function ($first, $second) {
    $first->loginAs(User::find(1))
            ->visit('/home')
            ->waitForText('Message');

    $second->loginAs(User::find(2))
            ->visit('/home')
            ->waitForText('Message')
            ->type('message', 'Hey Taylor')
            ->press('Send');

    $first->waitForText('Hey Taylor')
           ->assertSee('Jeffrey Way');
});
...
{% endhighlight PHP startinline %}

Let's face it: This is amazing! As you read the code you know exactly what we want to test and the fact that this is possible is even better.

## Smile when you fail

I would recommend smiling while you use Dusk. This is because it will take a photo of you when a test fails. Ok probably it will just take a screenshot, but a picture of your face while a test fails would be fun too ;-)

So let's be serious again. This feature is extremely useful. When a test fails you can checkout the screenshot at the time of the failure. This can help you to identify the problem. Be careful, because screenshots get deleted when you run `php artisan dusk` again. They are located at `tests/Browser/screenshots`.





## Conclusion

Now that we got a real browser integration in Laravel there should be no more excuses for not testing! There is still a lot to write about Dusk, but I guess it was enough for now. Maybe there will be a follow up explaining more. 🤠 I am really excited to dig deeper into Dusk and to use it in one of my daily projects. Let me know what your favourite feature is. Keep testing ;-)

More Dusk resources:

* [Official docs](https://laravel.com/docs/master/dusk)
* [Laracasts](https://laracasts.com/series/whatcha-working-on/episodes/10)
* [GitHub](https://github.com/laravel/dusk)
 



 
 

