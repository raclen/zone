---
title: "git rebase 和git merge 区别"
description: "在 Git 中， 和  都是用来整合分支的方法，但它们的工作原理和结果有所不同。以下是它们的主要区别：  1. 工作原理 - **git rebase**：将一个分支上的提交应用到另一个分支的基础上。具体来说，它会先找到两个分支的共同祖先，然后将当前分支（通常是一个特性分支）的提交一个一个地取..."
pubDate: 2024-07-18T02:28:58Z
issueNumber: 136
issueUrl: https://github.com/raclen/zone/issues/136
tags: ["Git", "idea"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


在 Git 中，`git rebase` 和 `git merge` 都是用来整合分支的方法，但它们的工作原理和结果有所不同。以下是它们的主要区别：

### 1. 工作原理
- **git rebase**：将一个分支上的提交应用到另一个分支的基础上。具体来说，它会先找到两个分支的共同祖先，然后将当前分支（通常是一个特性分支）的提交一个一个地取出，应用到目标分支的顶端。这样，当前分支的历史会被重写，变得像是从目标分支直接分叉出来的。

- **git merge**：将两个分支合并，保留两个分支的提交历史。Git 会创建一个新的合并提交（merge commit），这个提交有两个父节点，分别是两个被合并的分支的最新提交。

### 2. 提交历史
- **git rebase**：提交历史会被重写，因此历史记录更加线性和简洁。没有额外的合并提交，但需要注意的是，这种重写历史的操作会改变提交的哈希值。

- **git merge**：保留了两个分支的所有历史记录，并且增加了一个合并提交。这种方法不会改变已有提交的哈希值。

### 3. 使用场景
- **git rebase**：
  - 用于清理提交历史，使历史更加简洁。
  - 在分享代码之前使用，确保提交历史干净且线性。
  - 避免频繁重写公共分支历史，以免影响他人工作。

- **git merge**：
  - 用于将分支合并到主分支，保留所有历史记录。
  - 在合作开发时，可以安全地合并公共分支，而不影响其他人的工作。
  - 更适合已发布的分支，不会因为重写历史导致问题。

### 4. 冲突处理
- **git rebase**：每个提交在应用到目标分支时都会进行冲突检测，需要逐个解决冲突。解决完冲突后，可以继续应用后续的提交。

- **git merge**：只在合并时进行一次冲突检测，解决冲突后生成一个合并提交。

### 例子
假设有两个分支 `feature` 和 `master`，并且 `feature` 分支有一些提交需要合并到 `master`。

- 使用 `git rebase`：
  ```sh
  git checkout feature
  git rebase master
  git checkout master
  git merge feature
  ```

- 使用 `git merge`：
  ```sh
  git checkout master
  git merge feature
  ```

总结来说，`git rebase` 更适合于保持历史记录简洁和线性，而 `git merge` 更适合于需要保留完整历史记录的情况。选择哪种方法取决于具体的开发流程和团队的协作习惯。
