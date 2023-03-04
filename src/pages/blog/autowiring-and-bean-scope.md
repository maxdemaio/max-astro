---
layout: "../../layouts/BlogPost.astro"
title: Spring Basics - XML Autowiring and Bean Scope
pubDate: 'Feb 12 2022'
description: How XML autowiring works in the Spring framework.
---

In this blog post we’ll approach how autowiring works in the Spring framework. We’ll showcase autowiring via XML configuration. Also, we’ll dive into understanding singleton and prototype bean scopes.

Demos:

- [autowire byName demo](https://github.com/maxdemaio/demos/tree/main/demo5-autowire-byName-xml)
- [autowire byType demo](https://github.com/maxdemaio/demos/tree/main/demo6-autowire-byType-xml)
- [autowire constructor demo](https://github.com/maxdemaio/demos/tree/main/demo7-autowire-constructor-xml)
- [singleton scope demo](https://github.com/maxdemaio/demos/tree/main/demo8-singleton-scope-xml)
- [prototype scope demo](https://github.com/maxdemaio/demos/tree/main/demo9-prototype-scope-xml)

---

## Autowiring

By default, autowiring isn’t enabled in Spring. With autowiring enabled in Spring, we don’t have to specify all the property values in bean configurations. Autowiring is for non-primitive values and isn't for injecting primitive and string values. The Spring container will auto-initialize (autowire) the dependencies for non-primitive values. Thus, we can omit `property` and `constructor-arg` attributes in bean definitions.

We’re going to take a look at all the modes of autowiring and how to use them.

### Autowiring Modes

| Mode        | Description                                                                                                                                                                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| byName      | Bean dependency is autowired based on the property name. If the matching bean doesn’t exist in the container then the bean will remain unwired. It internally uses setter injection.                                                                                        |
| byType      | Autowires the bean dependency based on the property type. Properties for which there is no matching bean will remain unwired. Spring throws an exception if there’s more than one bean of the same type exists in the container. It internally uses setter injection.       |
| constructor | It’s the same as autowiring byType, but through constructor arguments. Spring autowires the dependency based on constructor argument type through constructor injection. Spring throws an exception if there’s more than one bean of the same type exists in the container. |
| no          | Default mode which means no autowiring.                                                                                                                                                                                                                                     |

### byName

In byName mode, Spring looks for a bean in the IoC container with the `id` with the same name as the property name to autowire the dependency. For example, we see in the below code `PostGenerator` is a dependency and it has a name of `gen`:

```java
package com.maxdemaio.demo;

public class BlogPostService {

    private PostGenerator gen;
    private int wordCount;

    public BlogPostService() {

    }

    public int getwordCount() {
        return wordCount;
    }

    public void setwordCount(int wordCount) {
        this.wordCount = wordCount;
    }

    public PostGenerator getgen() {
        return gen;
    }

    public void setgen(PostGenerator gen) {
        this.gen = gen;
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="blogPostService" class="com.maxdemaio.demo.BlogPostService" autowire="byName">
        <property name="wordCount" value="500"/>
    </bean>

    <bean id="gen" class="com.maxdemaio.demo.CoolPostGenerator"/>

    <bean id="wittyPostGenerator" class="com.maxdemaio.demo.WittyPostGenerator"/>

</beans>
```

All we need to do is specify the `autowire` attribute of our `BlogPostService` bean to `byName`. After, we’d make sure our dependency bean has the same `id` as the variable given in the `BlogPostService`. Also, we need the respective setter methods for Spring to inject the bean using setter injection.

### byType

In byType mode, Spring autowires beans in the IoC container with the same type as the property.

```java
package com.maxdemaio.demo;

public class BlogPostService {

    private PostGenerator gen;
    private int wordCount;

    public BlogPostService() {

    }

    public int getwordCount() {
        return wordCount;
    }

    public void setwordCount(int wordCount) {
        this.wordCount = wordCount;
    }

    public PostGenerator getgen() {
        return gen;
    }

    public void setgen(PostGenerator gen) {
        this.gen = gen;
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="blogPostService" class="com.maxdemaio.demo.BlogPostService" autowire="byType">
        <property name="wordCount" value="500"/>
    </bean>

    <bean id="wittyPostGenerator" class="com.maxdemaio.demo.WittyPostGenerator"/>

</beans>
```

In byType mode, we don’t need the bean `id` to be the same as property name. We autowired based on the type of the property instead of the name. Like byName, byType requires setter methods in the class for Spring to inject the bean dependency.

### constructor

In constructor mode, Spring autowires beans like byType mode. But, Spring uses constructor injection instead of setter injection. Hence, it’s required to have a parameterized constructor in the respective class.

```java
package com.maxdemaio.demo;

public class BlogPostService {

    private PostGenerator gen;
    private int wordCount;

    public BlogPostService(PostGenerator gen, int wordCount) {
        System.out.println("Parameterized Constructor");
        this.gen = gen;
        this.wordCount = wordCount;
    }

    public BlogPostService() {

    }

    public int getwordCount() {
        return wordCount;
    }

    public void setwordCount(int wordCount) {
        this.wordCount = wordCount;
    }

    public PostGenerator getgen() {
        return gen;
    }

    public void setgen(PostGenerator gen) {
        this.gen = gen;
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="blogPostService" class="com.maxdemaio.demo.BlogPostService" autowire="constructor">
        <property name="wordCount" value="500"/>
    </bean>

    <bean id="wittyPostGenerator" class="com.maxdemaio.demo.WittyPostGenerator"/>

</beans>
```

In the constructor mode of autowiring, there’s no need to have the bean id the same as the property name as the dependency. We’re now autowiring based on the type of property instead of its name. But we need a parameterized constructor in the `BlogPostService` class. This is because the dependency is now injected through the constructor.

## Bean Scope

When we create beans with configuration metadata what we’re doing is writing a recipe for those beans. This recipe serves as a template for our application when injecting dependencies. Now, this also means that like a class, you can have many object instances created from a single recipe.

### Singleton

When a bean is singleton scoped, there is one shared instance of the managed bean. All requests for beans with matching `id`s will have one bean instance returned Spring.

![Singleton Diagram](/autowiring-and-bean-scope/singleton.png)

```java
package com.maxdemaio.demo;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Client {

    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("config.xml");
        BlogPostService srv1 = (BlogPostService) context.getBean("blogPostService");
        BlogPostService srv2 = (BlogPostService) context.getBean("blogPostService");
				/*
					hash code of srv 1: 890545344
					hash code of srv 2: 890545344
				*/
        System.out.println("hash code of srv 1: " + srv1.hashCode());
        System.out.println("hash code of srv 2: " + srv2.hashCode());

    }

}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="blogPostService" class="com.maxdemaio.demo.BlogPostService" scope="singleton">
        <property name="wordCount" value="150"/>
    </bean>

</beans>
```

When we run this code, we are able to see that the hashCode of the two `BlogPostService` class instances are the same. This is because they’re referring to the same bean instance in the Spring container.

### Prototype

When a bean is protoype scoped, Spring creates a new bean instance every time a request is made for that bean. All requests for beans with matching `id`s will be created uniquely by the Spring container.

![Prototype Diagram](/autowiring-and-bean-scope/prototype.png)

```java
package com.maxdemaio.demo;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Client {

    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("config.xml");
        BlogPostService srv1 = (BlogPostService) context.getBean("blogPostService");
        BlogPostService srv2 = (BlogPostService) context.getBean("blogPostService");
        /*
            hash code of srv 1: 552936351
            hash code of srv 2: 1471086700
         */
        System.out.println("hash code of srv 1: " + srv1.hashCode());
        System.out.println("hash code of srv 2: " + srv2.hashCode());

    }

}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="blogPostService" class="com.maxdemaio.demo.BlogPostService" scope="prototype">
        <property name="wordCount" value="150"/>
    </bean>

</beans>
```

When we run this code, we see that the hashCode of the two `BlogPostService` class instances are different. This is because they refer to different bean instances in the Spring container.

## Conclusion

To conclude we’ll compare all the autowiring modes. We learned that autowiring by default is set to no mode. byName autowiring will autowire beans based on name through setter injection. byType autowiring will autowire based on the bean type through setter injection. Autowiring in constructor mode will autowire beans through the parameterized constructor of the respective class by type.

We can configure class dependencies and values from bean definitions. But, also the scope of the objects created from a particular bean definition is important. To compare between singleton and prototype scopes we can compare bean hashCodes to see whether we are getting the same bean or a different bean.

## Works Cited

- [Spring framework documentation](https://docs.spring.io/spring-framework/docs/3.0.0.M3/reference/html/ch04s04.html)
