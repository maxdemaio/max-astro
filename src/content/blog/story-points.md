---
fileName: story-points
title: Story Pointing
pubDate: 2022-05-02
description: How to story point
duration: 0
draft: true
---

## What are story points?

Each story will be given a value to express an estimate of the overall effort needed to complete it. A story point takes into account the amount of work, complexity of work, and risk or uncertainty of work. Story points are not time measurements (i.e. 1 hour, 2 days, 1 week, etc), but a relative estimate of work. When thinking about story points, there are generally three key factors: Amount, Complexity, and Risk/Uncertainty.

## Categories Defined

Amount refers to the sheer volume of work. A text change is commonly used as an example of what a 1 is, but what happens if you have a text change, in 100 locations, in 100 different repositories. The volume of this work increase outweighs both the complexity and risk, this text change is now much larger than a 1.

Complexity refers to how straightforward the solution is, or isn't. Are there a lot of moving parts? Should a piece of code not work or a bug is found, how difficult is it to troubleshoot the issue? How difficult is it to solve this problem.

Risk/Uncertainty refers to both how well-defined the story and implementation approach are, and the 'unknowns' within the code base. If the Product Manager for the story is not clear on the request or is unsure of certain requirements going into planning, this uncertainty should impact the estimate. Should the story require changing legacy code that had no automated tests or is not well documented there is both risk and uncertainty in what will happen when this code is changed. Dependence on third-party applications also increases risk/uncertainty.

Ideally, no unclear tickets are coming into Sprint Planning, but team should feel that they are able to reject such tickets from Planning.

## 1
- Amount: Almost no work - there is virtually no work to be done on the story
- Complexity: Not complex - work is all the same
- Risk/Uncertainty: None - team completely understands story and knows what to expect
- Examples:
  - Update document placeholder text
  - Add new thumbnails for new screencasts

## 2
- Amount: Small amount of work - team has little work to complete
- Complexity: Not complex - work is all the same
- Risk/Uncertainty: None - team completely understands story and knows what to expect
- Examples:
  - User entering incorrect URL routes to custom 404 page
  - All headers are title case
- Note: A 1 point and a 2 point story are almost exactly the same. The only difference is the amount of work involved.

## 3
- Amount: Small amount of work - team has a little work to complete
- Complexity: A little complex - work may contain some variations
- Risk/Uncertainty: Minor - team understands story and does not believe there will be unexpected behavior
- Examples:
  - Task status transitions to "in progress" when user has saved a task

## 5
- Amount: Medium amount of work - team has a sufficient amount of work to complete
- Complexity: Some complexity - work may contain variations
- Risk/Uncertainty: Some - team understands story but believes there could be unexpected behavior
- Examples:
  - User can download file from incident profile field
  - Success growl shown after task has been saved
  - Email notification sent when comment is posted

## 8
- Amount: Large amount of work - team has a lot of work to complete
- Complexity: Complex - work contains variations
- Risk/Uncertainty: Moderate - team mostly understands story but believes there could be unexpected behavior
- Examples:
  - Task tab navigation
  - Logout users after a specific period of inactivity or closing the browser tab 

## 13
- Amount: Large amount of work - team has a lot of work to complete, and large testing scope
- Complexity: Very complex - work contains many variations
- Risk/Uncertainty: A lot - team is not confident in full scope until they begin working on story and believes there will be unexpected behavior
- Examples:
  - Task Status Pie Chart Widget
  - Users can see a summary of score changes in assessment risks
  - Visibility rules for incident fields
- Note: We do not want to have stories this large in a sprint. When a 13 is identified, the team will work with PM to suggest options for breaking the 13 into smaller stories.
