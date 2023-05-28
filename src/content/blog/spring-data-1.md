---
fileName: spring-data-1
title: Spring Data Access - JDBC, Boot, and Spring Data
pubDate: 'May 02 2022'
description: Introduction to Spring Boot and advantages to using Spring Data
duration: 6
---

In my Spring basics series, I described how Spring is an open-source Java application framework. For the persistence layer of an application, we can use many approaches in Spring. In this post we will go over JDBC, Spring Data, and data access as a whole in Spring applications.

Developers can choose different modules for the data access layer depending on the repository type. In this series we'll develop a telecom application for adding, updating, and deleting customer and their call plans.

Demos:

- [JDBC demo](https://github.com/maxdemaio/demos/tree/main/data-demos/jdbc-example)

---

## JDBC

We'll take a look on how we'd add and remove customers with JDBC. We'd need to create a table in a SQL database like the following:

```sql
create database jdbc;

use jdbc;

create table customer(
phone_no bigint primary key,
name varchar(50),
age integer,
gender char(10),
address varchar(50),
plan_id integer
);
```

After, we'd have to define domain classes to represent customer details. We'd also need appropriate dependencies in the `pom.xml` for connecting to the database. For now, we'll mock the presentation layer by sending requests to our service layer from the `main()` method of our application.

We'd set up the data access layer with an interface `CustomerDAO` and a repository class `CustomerDAOImpl` to implement the interface.

```java
package com.maxdemaio.repository;

import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Properties;

import com.maxdemaio.entity.Customer;

public class CustomerDAOImpl implements CustomerDAO {
    Connection con = null;
    PreparedStatement stmt = null;
    ResultSet rs = null;

    @Override
    public void insert(Customer customer) {
        try (FileInputStream fis = new FileInputStream("src/main/resources/application.properties");) {
            Properties p = new Properties();
            p.load(fis);
            String dname = (String) p.get("jdbc.driverClassName");
            String url = (String) p.get("spring.datasource.url");
            String username = (String) p.get("spring.datasource.username");
            String password = (String) p.get("spring.datasource.password");
            Class.forName(dname);
            // Register driver
            con = DriverManager.getConnection(url, username, password);
            // Create connection
            String query = "insert into customer values (?,?,?,?,?,?)";
            // Create prepared statement
            stmt = con.prepareStatement(query);
            stmt.setLong(1, customer.getPhoneNumber());
            stmt.setString(2, customer.getName());
            stmt.setInt(3, customer.getAge());
            stmt.setString(4, customer.getGender().toString());
            stmt.setString(5, customer.getAddress());
            stmt.setInt(6, customer.getPlanId());
            // Execute query
            stmt.executeUpdate();
            System.out.println("Record inserted");
        } catch (Exception e) {
            System.out.println("error: " + e.getMessage());
        } finally {
            try {
                // Close the prepared statement
                stmt.close();
                // Close the connection
                con.close();
            } catch (Exception e) {
                System.out.println("error: " + e.getMessage());
            }
        }
    }

    @Override
    public int remove(Long phoneNo) {
        int result = 1;
        try (FileInputStream fis = new FileInputStream("src/main/resources/application.properties");) {
            Properties p = new Properties();
            p.load(fis);
            String dname = (String) p.get("jdbc.driverClassName");
            String url = (String) p.get("spring.datasource.url");
            String username = (String) p.get("spring.datasource.username");
            String password = (String) p.get("spring.datasource.password");
            Class.forName(dname);
            // Create connection
            con = DriverManager.getConnection(url, username, password);
            String query = "DELETE FROM Customer WHERE phone_no = ?";
            // Create prepared statement
            stmt = con.prepareStatement(query);
            stmt.setLong(1, phoneNo);
            // Execute query
            result = stmt.executeUpdate();
        } catch (Exception e) {
            System.out.println("error: " + e.getMessage());
        } finally {
            try {
                // Close the prepared statement
                stmt.close();
                // Close the connection
                con.close();
            } catch (Exception e) {
                System.out.println("error: " + e.getMessage());
            }
        }
        return result;
    }
}

```

For JDBC, we can also use the `JdbcTemplate` class to concentrate on SQL queries and their parameters. As noted in the example above, you need to configure it with a `DataSource`. Spring-JDBC also has a `JdbcDaoSupport` class that you can extend to develop your DAO.

Setting this up is tedious. We have to write the code to perform common database CRUD operations. Spring Data helps us overcome these limitations by abstracting this away. We can also add on top of the built-in functions.

## Spring Data

Spring Data is a high-level project that searches to unify data access with SQL and NoSQL data stores. There are also sub projects for technologies like MongoDB, Redis, Neo4j and more. It simplifies the data access layer by removing the implementations as shown above from your application. The only artifact that needed is the interface.

![Spring Data Image](/jpa/jpa.png)

## Spring Boot

Using only Spring for application development can be challenging. Spring Boot is a solution that has come to market by the Spring team.

Nobody likes the overhead of configuration. Spring Boot is a framework built on top of Spring that helps build Spring applications with ease. The goal is to avoid boilerplate configuration and allow for quickness. Spring Boot is opinionated. For example, it uses an embedded Tomcat as the default web container. It is also customizable. If you want to use log4j instead of Spring Boot built-in logging support you can make changes in your `pom.xml` file.

The main Spring Boot features are:

- Starter dependencies
- Automatic configuration
- Spring Boot actuator
- Easy to use embedded servlet container support

```java
@SpringBootApplication
public class ClientApplication {
    public static void main(String[] args) {
        SpringApplication.run(ClientApplication.class, args);
    }
}
```

`@SpringBootApplication` indicates that is a configuration class and triggers auto-configuration and component scanning. It is a combination of the following annotations and their default settings:

- `@EnableAutoConfiguration` - enables auto-configuration for our application based on the dependencies added
- `@ComponentScan` - enables Spring bean dependency injection feature. All application components annotated with `@Component`, `@Service`, `@Repository`, or `@Controller` are registered as Spring beans. These beans can be injected using the `@Autowired` annotation.
- `@Configuration` - enables Java based configurations

To create a Spring Boot application, we can use the following tools (I'll be using Spring Initializr throughout the series):

- Spring Initializr
- Spring Tool Suite
- Spring Boot CLI

![Spring Initializr Image](/jpa/init.png)

## Overall Data Access

When creating a data access layer we should always annotate data access objects (DAOs) with the `@Repository` annotation. This is important because it links exceptions from their underlying technologies (Hibernate, JDBC, JPA, etc.) to the proper `DataAccessException` subclass.

Thanks to the `DataAccessException` subclass, you can swap out an underlying technology and keep your try/catch statements the same. But you should usually not catch these exceptions. You shouldn't is because the underlying technology could have rolled back the transaction in question. Thus, you wouldn't want to continue execution in an alternate path if this happened. It's still important to annotate your DAOs with `@Repository` because the bean will be auto-added by the auto-scan.

Spring also provides an API for transaction management that goes well with data access. There is a matching transaction manager for local transactions or JTA for distributed transactions.

- Define data models with POJO classes with getters and setters. We'd annotate them based on the technology, but POJOs are a great start.
- Define interfaces for DAOs. 1 DAO covers 1 entity. You don't need to create one for each because the relationships suffice for navigating and loading additional entities.
- We can mock our DAOs and also develop a service layer for the business logic.
- Learn the underlying persistence technology (SQL or NoSQL). Based on this, we'd annotate our entities and implement the DAOs or you can let Spring handle this if you use Spring Data as mentioned above.

## Resources

- [Spring Docs](http://docs.spring.io/spring/docs/current/spring-framework-reference/htmlsingle/)
- [Spring Data Docs](http://docs.spring.io/spring-data/data-commons/docs/1.9.2.RELEASE/reference/html/)
