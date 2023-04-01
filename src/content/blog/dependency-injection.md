---
fileName: dependency-injection
title: Spring Basics - Dependency Injection
pubDate: 'Feb 01 2022'
description: How to use different types of dependency injection in the Spring framework.
---

In this blog post we’ll learn about Dependency Injection (DI) and how to use it. We can do this using constructor and setter injection. Also, I recommend checking out this [YouTube video by Ryan Schachte if it’s still available](https://www.youtube.com/watch?v=EPv9-cHEmQw).

DI demos:

- [constructor injection demo](https://github.com/maxdemaio/demos/tree/main/demo3-constructor-injection-xml)
- [setter injection demo](https://github.com/maxdemaio/demos/tree/main/demo4-setter-injection-xml)

---

In [my first Spring basics blog post](https://www.maxdemaio.com/posts/inversion-of-control) we explored how to create Spring beans with XML configuration.

```xml
<bean id="blogPostService" class="com.maxdemaio.service.BlogPostService" />
```

Using Spring with this config would be similar as the below Java code. An instance is created and initialized with the default values using the default constructor. But, if we use Spring with the above config, our code will be loosely coupled!

```java
BlogPostService blogPostService = new BlogPostService();
```

We can also initialize beans with specific values in Spring with DI. There are actually two ways we can do this. We can use constructor injection and setter injection.

## **Constructor Injection**

### **Primitive Values**

Let’s consider this BlogPostService class to understand constructor injection:

```java
package com.maxdemaio.service;
public class BlogPostService {
    private int wordCount;
    public BlogPostService(int wordCount) {
                this.wordCount = wordCount;
        }
    // ...
}
```

Now, to define a bean in our XML configuration to initialize values we can write the following:

```xml
<bean id="blogPostService" class="com.maxdemaio.service.BlogPostService" >
      <constructor-arg value="8"/>
</bean>
```

We'll need a parameterized constructor and a `constructor-arg` in the bean definition. Also, if we have more than one parameter in our constructor, we can pass `constructor-arg` tags in the same order.

We can also use a `name` attribute in our `constructor-arg` tag to specify constructor parameters. This avoids having to pass arguments in order. We can also specify the `type` attribute to avoid order to an extent as well. Spring will convert the String value to the appropriate type if compatible. If it cannot convert the value we’ll get an exception.

### **Non-Primitive Values**

So far we’ve seen how we can do constructor injection with primitive data types. Now we’ll take a look at how to do so with non-primitive data types. For example, let’s take our `BlogPostService` class. We'll make it dependent upon a `PostGenerator` object type to create a “cool” or “witty” blog post.

```java
package com.maxdemaio.demo;

public interface PostGenerator {
	public String generatePost(int wordCount);
}
```

```java
package com.maxdemaio.demo;

public class CoolPostGenerator implements PostGenerator {

	@Override
	public String generatePost(int wordCount) {
		return "Generated cool post with " + wordCount + " words";
	}
}
```

```java
package com.maxdemaio.demo;

public class WittyPostGenerator implements PostGenerator {

	@Override
	public String generatePost(int wordCount) {
		return "Generated witty post with " + wordCount + " words";
	}
}
```

```java
package com.maxdemaio.service;

public class BlogPostService {

    private PostGenerator gen;
    private int wordCount;

    public BlogPostService(PostGenerator gen, int wordCount) {
        System.out.println("Parameterized Constructor");
        this.gen = gen;
        this.wordCount = wordCount;
    }

		public void generatePost() {
       System.out.println(gen.generatePost(wordCount));
    }
}
```

We can see that the `PostGenerator` property of the `BlogPostService` class has not been initialized with any values. We can let Spring take care of the configuration for us.

How in the world would we configure this to generate us a “cool” or “witty” blog post? Let’s look at an example where we generate a “cool” blog post using the `ref` attribute in our `constructor-arg` tag.

```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="<http://www.springframework.org/schema/beans>"
       xmlns:xsi="<http://www.w3.org/2001/XMLSchema-instance>"
       xsi:schemaLocation="<http://www.springframework.org/schema/beans>
    <http://www.springframework.org/schema/beans/spring-beans.xsd>">

    <bean id="blogPostService" class="com.maxdemaio.demo.BlogPostService">
        <constructor-arg name="gen" ref="coolPostGenerator"/>
        <constructor-arg name="wordCount" value="150"/>
    </bean>

    <bean id="coolPostGenerator" class="com.maxdemaio.demo.CoolPostGenerator"/>

    <bean id="wittyPostGenerator" class="com.maxdemaio.demo.WittyPostGenerator"/>

</beans>
```

## **Setter Injection**

For Setter Injection, Spring invokes the setter methods of a class to initialize the properties after invoking its default constructor.

To start, let’s look at how we can inject primitive values into a class’s properties with setter injection. We'll use the `property` tag within the XML configuration.

```java
package com.maxdemaio.demo;

public class BlogPostService {

    private PostGenerator gen;
    private int wordCount;

    public BlogPostService() {}

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

    public void generatePost() {
        System.out.println(gen.generatePost(wordCount));
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="<http://www.springframework.org/schema/beans>"
       xmlns:xsi="<http://www.w3.org/2001/XMLSchema-instance>"
       xsi:schemaLocation="<http://www.springframework.org/schema/beans>
    <http://www.springframework.org/schema/beans/spring-beans.xsd>">

    <bean id="blogPostService" class="com.maxdemaio.demo.BlogPostService">
        <property name="gen" ref="wittyPostGenerator"/>
        <property name="wordCount" value="500"/>
    </bean>

    <bean id="coolPostGenerator" class="com.maxdemaio.demo.CoolPostGenerator"/>

    <bean id="wittyPostGenerator" class="com.maxdemaio.demo.WittyPostGenerator"/>

</beans>
```

For setter injection, we need a default constructor and setter methods of dependent properties. Spring will use the default constructor to create a bean. Then, Spring invokes the setter method of the respective property. This is based on the `name` attribute to initialize the values. Also, `property` tags are mandatory in the bean definition.

### **Collection Values**

We’ve learning how to inject primitive and non-primitive values with the value and ref attributes. To inject collections, Spring supports Java Collection types such as List, Set, Map, and Properties.

```java
package com.maxdemaio.demo;

import java.util.List;

public class BlogPostService {
    private List<PostGenerator> gens;

    public void setGens(List<PostGenerator> gens) {
        this.gens = gens;
    }

    public List<PostGenerator> getGens() {
        return gens;
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="<http://www.springframework.org/schema/beans>"
       xmlns:xsi="<http://www.w3.org/2001/XMLSchema-instance>"
       xsi:schemaLocation="<http://www.springframework.org/schema/beans>
    <http://www.springframework.org/schema/beans/spring-beans.xsd>">

    <bean id="blogPostService" class="com.maxdemaio.demo.BlogPostService">
        <property name="gens">
            <list>
                <ref bean="coolPostGenerator" />
                <ref bean="wittyPostGenerator" />
            </list>
        </property>
    </bean>

    <bean id="coolPostGenerator" class="com.maxdemaio.demo.CoolPostGenerator" />
    <bean id="wittyPostGenerator" class="com.maxdemaio.demo.WittyPostGenerator" />

</beans>
```

```java
package com.maxdemaio.demo;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Client {

    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("config.xml");
        BlogPostService srv = (BlogPostService) context.getBean("blogPostService");
        System.out.println(srv.getGens());
    }

}
```

## **Conclusion**

We’ve learned how to use constructor and setter injection in Spring. We can do so with primitive, non-primitive, or collection values. To conclude, we’ll take a look at the difference between the two and when you’d want to use one over the other:

| Constructor Injection                                                                               | Setter Injection                                                               |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Dependency injection via parameterized constructor                                                  | Dependency Injection via setter methods after invoking the default constructor |
| Need parameterized constructor in the POJO class                                                    | Need default constructor and setter methods in the POJO class                  |
| <constructor-arg> tag is used in configuration file                                                 | <property> tag is used in configuration file                                   |
| <constructor-arg> tag ref attribute is used to provide dependency for Object type                   | <property> tag ref attribute is used to provide dependency for Object type     |
| Good for mandatory dependencies and immutable dependencies. Concise (pass several parameters once). | Optional/changeable dependencies. Avoids circular dependencies and cycles.     |
