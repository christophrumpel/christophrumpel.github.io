---
layout: post
title: "Clean up your commits for a pull request"
---

<header>
When you contribute to an Open Source project through a pull request, the 
maintainer often wants you to clean up your commits. I will show you what that
 means and why 
 git rebase is your command of choice here.
</header>

So let's say you have made this pull request with a super amazing feature for
 an Open Source project and you're waiting for the maintainer's feedback. In 
 a perfect world your request would be perfect too and it would get merged 
 immediately to the project's core.
 
 But in reality this is not often the case. Mostly the maintainer needs you to
  change something in your code. This could be a typo, an additional test, 
  wrong indention or something else. Even if your initial pull request had just
   one beautiful commit, it now looks different.
   
   This is when someone tells you to `clean up your commits.` Maybe you think 
   this isn't importing but I can tell you it is! Working with other devs on 
   your project can get pretty fast a mess. A clean code is important when 
   you want to maintain a project successfully for a long time.
   
   So let's say we have a pull request with three commits. The first one
   is our new feature. The second is adding a test and the last one is 
   fixing a typo. The last two were necessary because of changes the project's 
   maintainer wanted. Now the commit history isn't that beautiful anymore. This is why we want 
   to merge them with `git rebase`.
     
 Git rebase solves the same problem as git merge. They both integrate 
 changes from another branch. This is not exactly what we need here, 
 but there is a `git rebase -i` too. (interactive) Typically interactive 
 rebasing is used for cleaning up your git history and this is exactly what 
 we want to do.
 
##See interactive rebasing in production
 
 Finally here is some code. We checkout the branch from our pull request 
 and start the interactive rebase session with the 
 master branch as our base. This means we want to edit all the new 
 commits from our feature branch back to the code state of the master 
 branch. (three commits in our case)
 
{% highlight PowerShell startinline %}
// Checkout the feature branch
git checkout feature/superAmazing
 
// start interactive rebase session
git rebase -i master
{% endhighlight startinline %}

 <div class="note"><strong>Note:</strong> It is possible to set a certain 
 commit as base too, instead of the master branch!</div>

This will open an editor with an overview of the commits (hash and commit 
message) and some instructions on what you can edit.

{% highlight PowerShell startinline %}
pick dae2691 add amazing feature
pick 3491879 add test
pick 3fedbd5 fix typo

# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
{% endhighlight startinline %}

We are interested in the `squash` command wich will "..use commit, but 
meld into previous commit..". Let's switch it with the `pick` command for
 our last two commits. (You can just write "s" instead of squash too)
 This means we'd like to keep all the changes, but meld
  them together under the first commit message.
 
{% highlight PowerShell startinline %}
pick dae2691 add amazing feature
squash 3491879 add test
squash 3fedbd5 fix typo
{% endhighlight startinline %}
    
After editing the file you need to save it and provide a last new commit 
message for the merge. The last thing to do, is to push the changes.
 
  <div class="note"><strong>Note:</strong> While rebasing we have to use the 
  force flag like "git push -f" in order to perform a push!</div>
  
##Conclusion

Voila. Now you got a clean commit history ready to get 
merged with just one meaningful commit. Git rebase often feels like using black 
magic first, but as you have seen it is definitely not. Use it whenever you 
need to change your commit history.
    