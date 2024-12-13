---
fileName: annotation-and-java-config
description: All about annotation and Java Based Configuration in Spring.
pubDate: 2022-02-02
title: Spring Basics - Annotation and Java Based Configuration
duration: 6
---

In this blog post we’ll learn about annotation and Java based configuration. Goodbye XML configuration! We’ll dive into the ways to autowire dependencies with annotations and their pros and cons. Finally, I’ll give an example using both annotation and Java based configuration.

Demos:

- [annotation configuration on property](https://github.com/maxdemaio/demos/tree/main/demo10-autowire-annotation-property)
- [annotation configuration on constructor](https://github.com/maxdemaio/demos/tree/main/demo11-autowire-annotation-constructor)
- [annotation configuration on setter](https://github.com/maxdemaio/demos/tree/main/demo12-autowire-annotation-setter)
- [annotated constructor and java based config example](https://github.com/maxdemaio/demos/tree/main/demo13-java-config)

---

## Annotation Based Configuration

All my previous blog posts on Spring have shown how to use XML configuration. But Spring also supports annotation based configuration. This is the preferable way to configure beans in real projects alongside Java based configuration.

All types of configurations can coexist in the same project. Annotation based configuration reduces the amount of configuration required. Let’s jump into how we can create an application with annotation based configuration!

Annotation based configuration supports autowiring. We autowire with the annotation `@Autowired`. Autowiring injects dependencies based on bean type. This is exactly like `byType` mode from XML configuration. Also, auto scanning enables Spring to create beans of the required classes without using explicit `<bean>` definitions in the XML file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!--
        <context:component-scan> can also do what
        <context:annotation-config> does in addition to auto scanning.
        with just annotation config you'd still need bean definitions
    -->
    <context:component-scan base-package="com.maxdemaio.demo" />

</beans>
```

Instead of `<bean>` definitions in the XML file, we annotate our dependencies with the `@Component` annotation. This way, Spring can figure out which beans to create during its component/auto scan.

Now, how would we inject our dependencies into the proper classes? We do this by autowiring with `@Autowired`. There are three ways to do so: autowiring by constructor, autowiring the setter method, and autowiring properties/fields.

### Autowiring on Constructor

```java
@Service
public class BlogPostService {
    private PostGenerator gen;
    private int wordCount;

    @Autowired
    public BlogPostService(@Qualifier("wittyPostGenerator") PostGenerator gen, @Value("100") int wordCount) {
        this.gen = gen;
        this.wordCount = wordCount;
        System.out.println("parameterized constructor");
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

    public void generatepost() {
        System.out.println(gen.generatePost(wordCount));
    }
}
```

Let’s step through what’s actually happening here:

- The `@Service` annotation is like the `@Component` annotation but it’s lexically more specific. This lets Spring know this class relates to the service layer/business logic. This is like adding a `<bean>` definition in the XML configuration. Besides being used on the service layer, there isn’t a special use for this.
- `@Autowired` performs autowiring by type for all the arguments in the constructor.
- `@Qualifier` specifies which bean I want to use. This is because we have two classes that extend the `PostGenerator` interface (see demos provided at beginning). Since autowiring with annotations is by type, Spring will throw an error if it’s unsure of which bean to use.
  - Side note: In enterprise environments, instead of `@Qualifier` you can conditionally autowire dependencies with `@ConditionalOnProperty` based on environment variables! This way, we could create a stub class and a V1 class and choose which to use based on a value in the environment. This is known as [feature flagging/toggling/switching](https://onix-systems.com/blog/introduction-to-feature-flags-in-java-using-the-spring-boot-framework).
- `@Value` tells Spring to inject a primitive value. Autowiring isn’t for primitive values so we use this instead.

The benefit of constructor-based injection is that you can declare your injected fields as final. The fields will be initiated during class instantiation. This is good for immutable and required dependencies. Constructor-based injection is recommended for required dependencies allowing them to be immutable and preventing them to be null.

### Autowiring on Setter Method

```java
@Service
public class BlogPostService {
    private PostGenerator gen;

    @Value("120")
    private int wordCount;

    public BlogPostService() {
        System.out.println("default constructor");
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

    @Autowired
    @Qualifier("coolPostGenerator")
    public void setgen(PostGenerator gen) {
        this.gen = gen;
    }

    public void generatepost() {
        System.out.println(gen.generatePost(wordCount));
    }
}
```

In setter based injection, we annotate the setter methods with `@Autowired`. Spring will call these setter methods once the Bean is instantiated with the default constructor or a no-argument static factory method in order to inject the dependencies. We can use this for optional dependencies.

### Autowiring on Property/Field

```java
@Service
public class BlogPostService {
    @Autowired
    @Qualifier("coolPostGenerator")
    private PostGenerator gen;

    @Value("100")
    private int wordCount;

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

    public void generatepost() {
        System.out.println(gen.generatePost(wordCount));
    }
}
```

This way of dependency injection should be avoided. In fact, most static analysis tools will even show this method isn’t recommended by the Spring team. But I wanted to show it as an example.

It’s hard to inject mock objects when our `BlogPostService` is under test without a Spring container. With a Spring container you could use `@InjectMocks`. The only way to inject these fields outside the Spring container (since we aren’t using setters or constructors) is by reflection. Although elegant because we avoid having excess code, there are drawbacks.

## Java Based Configuration

We saw the above examples of annotation based configuration with the existence of an XML file to enable Spring auto scanning. We don't need an XML file when we use Java based configurations!

The `@Configuration` annotation tells the Spring container that that Java class contains bean definitions. The `@Bean` annotation defines beans within the class annotated with `@Configuration`.

```java
@Configuration
@ComponentScan("com.maxdemaio.demo")
public class AppConfig {
}
```

```java
public class Application {

    public static void main(String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        BlogPostService srv = (BlogPostService) context.getBean("blogPostService");
        srv.generatepost();
    }

}
```

## Conclusion

We’ve learned about how to autowire using annotations on constructors, setters, and properties. Also, we can ditch the XML configuration since we now have Java based configuration. We can follow the design philosophies of Spring by using these features of the framework.

## Works Cited

- [Qualifier Annotation](https://stackoverflow.com/questions/40830548/spring-autowired-and-qualifier)
- [Dependency Injection Types](https://www.youtube.com/watch?v=uO2_ZzIIV70)
- [Java Reflection](https://www.youtube.com/watch?v=FIACGmzibAM)
- [Why Field Injection Is Not Recommended](https://blog.marcnuri.com/field-injection-is-not-recommended)
- [Feature flagging](https://onix-systems.com/blog/introduction-to-feature-flags-in-java-using-the-spring-boot-framework)
