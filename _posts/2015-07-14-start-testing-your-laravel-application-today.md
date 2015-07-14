---
layout: post
title: "Start testing your Laravel application today"
---


<header>
In this short tutorial I will show you how to write your first Laravel application test.
</header>

Testing is a huge buzzword in the developer's world.
There are dozens of types and tools out there and it is obviously overwhelming at first.
Where do you start and the biggest question: What is testable?

This is why this little tutorial is perfect for you. You don't have to be aware of all the things flying around in the 
testing's sphere. Knowing that automatic testing is important is enough for now.
This tutorial is just concentrating on the biggest step: getting you to start.

##Write your first test
Today is the perfect time to start testing your application.
This is because since version 5.1 of the Laravel framework, it provides the perfect in-built testing suite for you. So 
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
We don't need that, so let's get rid of this method and write our own.

{% highlight PHP startinline %}
public function testHomeIsOk() {
    $this->visit('/')->assertResponseOk();
}
{% endhighlight startinline %}

<div class="note"><strong>Note:</strong> All test methods must begin with the word "test".</div>

This will check if the given request will return a status code of 200, which means everything is working.
Since Laravel's tests extend the popular PHP testing framework PHPUnit, we just need to 
run it like `vendor/phpunit/phpunit/phpunit` from your console.

With this command we tell PHPUnit to run tests inside the "tests" directory and hopefully your tests turn green and will 
show no failures. Awesome!

We just wrote a simple test to check our home site. From now on you will run PHPUnit every time before you push your code to a repository.
This way we will always know that this site is responding. If you made a mistake and an error is thrown on this site, 
our test will let us know.

##Conclusion
Congratulations to your first test!

Of course this is just the tip of the testing iceberg. This little test doesn't mean that your application is fully 
working, but it is a start. Laravel provides so much more testing features which I will show you in my next article.




    