---
layout: post
title: "Start testing your Laravel application today"
---


<header>
In this short tutorial I will show you how to write your first Laravel application test in like no time.
</header>

Testing is a huge buzzword in the developer's world.
There are dozens of types and tools out there and it is obviously overwhelming at first.
Where do you start and the biggest question: What is testable? We don't care about all of that for some minutes.

This is why this little tutorial is perfect for you. You don't have to be aware of all the things flying around in the 
testing's sphere. Knowing that automatic testing is important is enough for now.
This tutorial is just concentrating on the biggest step: `getting you to start`

##Write your first test
Today is the perfect time to start testing your application.
This is because since version 5.1 of the Laravel framework, it provides the perfect built-in testing suite for you. So 
no excuses today!

Ok let's do it. Let's write our first test. Take your existing Laravel project or create a new one.
Make sure all dependencies are loaded and your root site "/" is working.

<div class="note"><strong>Note:</strong> If you don't know how to setup a new Laravel project, check it out <a 
href="http://laravel.com/docs/5.1/installation" alt="Laravel Installation" target="_blank">here</a>.</div>



All your tests live within your "tests" directory. Luckily Laravel already provides a basic test example in the 
`ExampleTest.php` file.

{% highlight PHP startinline %}
public function testBasicExample()
{
        $this->visit('/')
             ->see('Laravel 5');
}
{% endhighlight startinline %}

This tests if there is a string like "Laravel 5" on your root site, which is true for Laravel's welcome view.
Let's try it out. Since Laravel's tests extend the popular PHP testing framework PHPUnit, we just need to run it like 
`vendor/phpunit/phpunit/phpunit` from your console.
With this command we tell PHPUnit to run tests inside the "tests" directory.

If you still use Laravel's welcome view for the home route "/", the basic test will return a success message like:

{% highlight PowerShell startinline %}
PHPUnit 4.7.7 by Sebastian Bergmann and contributors.

Time: 163 ms, Memory: 13.75Mb

OK (1 test, 2 assertions)
{% endhighlight startinline %}

You can try to let this test fail. Just change the string "Laravel 5" to "Rails".
Now we want to write our own test. Get rid of the `testBasicExample` method and add a new one.

{% highlight PHP startinline %}
public function testHomeIsOk() {
    $this->visit('/')->assertResponseOk();
}
{% endhighlight startinline %}

<div class="note"><strong>Note:</strong> All test methods must begin with the word "test".</div>

This will check if the given request will return a status code of 200, which stands for a successful HTTP request. For 
us it just means that no error was thrown. Nice!

##Conclusion
Congratulations to your first test!

We just wrote a simple test to check our home site. From now on you will run PHPUnit every time before you push your code to a repository.
This way we will always know the status of our home site. If you made a mistake and an error is thrown, 
our test will let us know.

Of course this is just the tip of the testing iceberg. This little test doesn't mean that your whole application is 
working, but it is a start. In my next article I will show you some more great features like how to test what you're 
saving to a database or how to check an API response.




    