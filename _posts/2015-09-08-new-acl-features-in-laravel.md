---
layout: post
title: "New ACL features in Laravel 5.1.11"
---


<header>
Since the Laravel 5.1.11 release it is providing some great new authorization features. Let's dive right in.
</header>

So we all already know about the Authentication features in Laravel. They are nice, but in many applications just a start
 in handling your users. We always need some kind of permissions too. Who is allowed to update this comment? Or
   are there some users who should be allowed to do all kind of actions? These are the questions we are going to answer 
   here.

## Setting abilities
So there is this new Laravel class `Illuminate\Auth\Access\Gate` handling setting and checking, so called, abilities.
The Laravel `AuthServiceProvider` is the recommended place to define such an ability. In our case we would like to 
protect our comments.

{% highlight PHP startinline %}
// Inside AuthServiceProvider
// ...

public function boot(GateContract $gate)
{
    parent::registerPolicies($gate);

    $gate->define('update-comment', function ($user, $comment) {
        return $user->id === $comment->user_id;
    });
}
{% endhighlight startinline %}

Inside the boot method we are defining the `update-comment` ability. We only want users to update a 
comment if it belongs to them. This is what we are checking here.

<div class="note"><strong>Note:</strong> It is also possible to set a class and method like 'Class@method' as the second
 parameter instead of
 the closure.</div>
 
## Checking abilities through the Gate facade
 
Now that we set our permission, we'd like to check it before updating a comment.
 
{% highlight PHP startinline %}
// inside the CommentController
// ...

public function update($id)
{
    $comment = comment::findOrFail($id);
    
    if (Gate::denies('update-comment', $comment)) {
        abort(403);
    }

    // Update Comment...
}
{% endhighlight startinline %}

<div class="note"><strong>Note:</strong> We do not need to pass the user object to the denies method. The Gate facade 
will take the current authenticated user automatically.</div>

It is possible to use the opposite Gate method `allows` too.

{% highlight PHP startinline %}
 
if (Gate::allows('update-comment', $comment)) {
    // Update Comment...
}

{% endhighlight startinline %}

## Checking abilities through the model instance
And of course there is another way to check our udpate-comment permission. This time we are using the user instance 
and the new `can` or `cannot` methods.

{% highlight PHP startinline %}
// Inside the CommentController
// ...

if ($request->user()->cannot('update-comment', $comment)) {
    abort(403);
}

{% endhighlight startinline %}

Both accomplish the same task, so it is up to you to decide which way you prefer.

## There is always a super admin

I guess in every application there is a super admin with super powers. Of course he or she shouldn't be hindered by our 
Gate. For this case Laravel provides an additional `before` method. Just place it inside the AuthServiceProvider again. 
Now we just need to provide the information if this user should have all rights. In this case it is a method, but it 
also could be a database field or something else. This is totally up to you.

{% highlight PHP startinline %}
$gate->before(function ($user, $ability) {
    if ($user->isSuperAdmin()) {
        return true;
    }
});
{% endhighlight startinline %}

##Conclusion
Laravel 5.1.11 was a small release, but it is still providing some great new ACL features to the framework. Read more 
about it [here](http://laravel.com/docs/5.1/authorization) and start toying around.



    