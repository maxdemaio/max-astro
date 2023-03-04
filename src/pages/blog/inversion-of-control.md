---
layout: "../../layouts/BlogPost.astro"
title: Spring Basics - Inversion of Control
pubDate: 'Jan 27 2022'
description: Inversion of control and its importance in the Spring framework.
---

Spring is an open source Java application development framework that supports all types of Java applications such as: enterprise applications, web applications, cloud based applications, and more. Spring applications are simple, easily testable, reusable, and maintainable.

Spring modules are loosely coupled. Developers can pick and choose modules as needed to build applications.

Demos for this post:

- [demo without IoC](https://github.com/maxdemaio/demos/tree/main/demo1-blog-post-java)
- [demo with IoC](https://github.com/maxdemaio/demos/tree/main/demo2-spring-ioc)

---

## Introduction to the Spring Framework

To start, I'll give a brief introduction to the features and modules of the Spring framework.

| Feature                           | Description                                                                                                                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lightweight                       | Spring JARs are small. A basic Spring app would be lesser than 10MB. They can be deployed with an embedded Tomcat server and don't require heavy-weight application servers. |
| Non-Invasive                      | Spring apps are developed using POJOs. There's no need to extend or implement any pre-defined classes.                                                                       |
| Loosely Coupled                   | Spring uses Dependency Injection and Aspect Oriented Programming to facilitate loosely coupled code.                                                                         |
| Inversion of Control (IoC)        | IoC takes care of the application objects’ life cycles along with their dependencies.                                                                                        |
| Spring Container                  | Spring container takes care of object creation, initialization, and managing object dependencies.                                                                            |
| Aspect Oriented Programming (AOP) | Promotes separation of supporting functions (concerns) such as logging, transaction, and security from the core business logic of the application.                           |

Spring 5.x has the following key module groups:

- Core Container: core modules that provide key features of the Spring framework.
- Data Access/Integration: These modules support JDBC and ORM data access
- Web: these modules provide support for web applications.
- Others: Spring also provides other modules such as Test for testing Spring applications.

![Spring Modules](/spring/springModules.png)

## Spring Inversion of Control

Usually, it's the developer's responsibility to create the dependent application objects using the `new` operator. Hence any change in the application dependencies requires code changes. This results in tight coupling and more complexity as the application grows bigger.

Inversion of Control (IoC) creates a more loosely coupled application. IoC inverts the responsibility of the application objects’ creation, initialization, and destruction from the application to a third-party aka the framework. The third party will take care of application object management and dependencies. This makes an application easy to maintain, test, and reuse. The Spring framework provides IoC implementation using dependency injection (DI).

Objects managed by Spring are called beans. Thanks to Spring, we don’t need to create objects ourselves. Dependency injection allows us to describe how objects should be created through configuration.

DI is a software design pattern that:

- Helps to create loosely coupled application architecture facilitating re-usability and easy testing.
- Separates responsibility by keeping code and configuration apart. Dependencies can be easily modified using configuration without changing the code.
- Allows us to replace actual objects with mock objects for testing. This improves testability by writing simple JUnit tests that use mock objects.

As mentioned before, the core container module of the Spring framework provides IoC using dependency injection. The Spring container knows which objects to create and when to create them through the additional details that we provide in our application called configuration metadata.

![Spring Config](/spring/config.png)

There are two types of containers Spring provides: BeanFactory and ApplicationContext (interfaces). The ApplicationContext is the preferred container for development and inherits from BeanFactory. ApplicationContext provides added features to support enterprise services such as internationalization, validation, etc.

```java
// org.springframework.context.support.ClassPathXmlApplicationContext
// is the most common implementation of ApplicationContext
ApplicationContext context = new ClassPathXmlApplicationContext("config.xml");
Object obj = context.getBean("exampleService");
```

| BeanFactory                      | ApplicationContext                                                          |
| -------------------------------- | --------------------------------------------------------------------------- |
| No annotation based DI support.  | Annotation based DI support.                                                |
| No enterprise service support.   | Enterprise service support: validations, internationalization, etc.         |
| Supports Lazy Loading by default | Supports Eager Loading by default. Beans are instantiated during load time. |

Spring allows multiple methods to configure the metadata into our POJOs:

- XML configuration
- Annotation based configuration
- Java based configuration

## Conclusion

To conclude, I will introduce a small IoC example with XML based configuration.

```java
package com.maxdemaio.service;

public class BlogPostService {
 public void display() {
        System.out.println("Hi, Welcome to the Blog Post Generation application");
    }
}
```

```xml
<!-- Example object in a config.xml file -->
<!--
1. <beans> is the root element & also includes namespace declarations

2. Bean definition

3. id attribute represents a unique bean identifier

4. class attribute represents a fully qualified class name
-->
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="blogPostService" class="com.maxdemaio.service.BlogPostService" />

</beans>
```

```java
package com.maxdemaio.client;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.maxdemaio.service.BlogPostService;

public class Client {

 public static void main(String[] args) {

 // ApplicationContext container is instantiated by loading the configuration
 // from config.xml available in application classpath
 ApplicationContext context = new ClassPathXmlApplicationContext("config.xml");

 // Access bean with id “blogPostService"
 // Typecast from Object type to blogPostService type
 BlogPostService blogPostService = (BlogPostService) context.getBean("blogPostService");
 // Invoke display method of blogPostService to display greeting on console
        blogPostService.display();
    }

}
```

Rather than using the `new` keyword, we configured a managed Spring bean to take its place. This allows us to have loosely coupled code!

## Works Cited

- [https://docs.spring.io/spring-framework/docs/5.0.0.RC2/spring-framework-reference/overview.html](https://docs.spring.io/spring-framework/docs/5.0.0.RC2/spring-framework-reference/overview.html)
