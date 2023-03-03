---
layout: "../../layouts/BlogPost.astro"
title: Spring Data Access - Spring Data JPA
pubDate: 'May 07 2022'
description: Overview of Spring Data JPA
---

In my previous blog post we discussed Spring Data. Spring Data JPA is project under this higher-level project. Spring Data JPA makes it easy to implement JPA (specification) based repositories. It is a data access abstraction.

Spring Data JPA can work with any JPA provider like Eclipse Link or Hibernate. With Spring or Java EE, we can even control transaction boundaries using the `@Transactional` annotation.

Spring Data JPA gives a definition to implement repositories supported under the hood through the JPA specification, using the provider we define.

demo:

- [My Spring Data JPA demo](https://github.com/maxdemaio/demos/tree/main/data-demos/jpa-queries)

## Configuration

To define a data access object (DAO) we only need an interface extending Spring's `JpaRepository<T,K>` like the following:

```java
public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
```

We've extended Spring's `JpaRepository` interface. It's recommended to name the interface after the entity class it concerns. The only two details needed:

1. Entity class name for database operations. In our case it's `Customer`.
2. The data type of the primary key of our entity class. In our case it's `Long`.

Spring scans our interface that extends this `JpaRepository` interface. It auto-generates common CRUD, paging, and sorting methods at run time through a proxy object. We can add the `@Repository` annotation, but it's optional because Spring will auto-detect this interface as a repository. Thanks to this interface, we can use method name queries as well as JPQL to access our data.

Instead of manually configuring a `DataSource` like we did in JDBC, we can do so through dependency management. It consists of injecting a `DataSource` bean into some kind of `SessionFactory` or `EntityManagerFactory` bean. For JDBC this isn't necessary because it only relies on the `DataSource`.

## CRUD Operations

We can autowire an instance of our `CustomerRepository` into our service layer. With this instance we will use repository methods provided by the `JpaRepository` interface.

Here's an example service implementation class invoking repository methods through the autowired repository:

```java
package com.maxdemaio.service;


import com.maxdemaio.exception.JpaQueriesException;
import com.maxdemaio.service.validator.CustomerDtoValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.maxdemaio.domain.Customer;
import com.maxdemaio.dto.CustomerDto;
import com.maxdemaio.repository.CustomerRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service("customerService")
public class CustomerServiceImpl implements CustomerService {
    private CustomerRepository repository;

    @Autowired
    public CustomerServiceImpl(final CustomerRepository repository) {
        this.repository = repository;
    }

    public void insertCustomer(CustomerDto customer) throws JpaQueriesException {
        CustomerDtoValidator.validateCustomer(customer);
        repository.saveAndFlush(CustomerDto.prepareCustomerEntity(customer));
        System.out.println("Record added successfully");
    }

    @Override
    public List<CustomerDto> getCustomersByAddress(String address) {
        List<Customer> customers = repository.findByAddress(address);
        List<CustomerDto> custDtos = new ArrayList<>();
        for (Customer c : customers) {
            CustomerDto custDto = c.prepareDTO(c);
            custDtos.add(custDto);
        }
        return custDtos;
    }

    @Override
    public CustomerDto getCustomer(Long phoneNo) throws JpaQueriesException {
        CustomerDtoValidator.isValidPhoneNum(phoneNo);
        Optional<Customer> optionalCust = repository.findById(phoneNo);
        Customer custEntity = optionalCust.get();
        CustomerDto custDto = Customer.prepareDTO(custEntity);
        return custDto;
    }

    @Override
    public void removeCustomer(Long phoneNo) throws JpaQueriesException {
        CustomerDtoValidator.isValidPhoneNum(phoneNo);
        repository.deleteById(phoneNo);
        return;
    }

    @Override
    public String updateCustomer(Long phoneNo, Integer newPlanId) throws JpaQueriesException {
        CustomerDtoValidator.isValidPhoneNum(phoneNo);
        Optional<Customer> optionalCust = repository.findById(phoneNo);
        Customer custEntity = optionalCust.get();
        custEntity.setPlanId(newPlanId);
        repository.save(custEntity);
        CustomerDto custDto = Customer.prepareDTO(custEntity);
        return "The plan for customer w/ phone number: " + phoneNo + " has been updated successfully";
    }

}
```

We do this by extending the `JpaRepository` like the following:

```java
package com.maxdemaio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maxdemaio.domain.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long>{
	List<Customer> findByAddress(String address);
}
```

## Pagination and Sorting

`PagingAndSortingRepository<T,ID>` is an interface that extends `CrudRepository<T,ID>` which extends `Repository<T,ID>`. In the example we saw above, `JpaRepository<T,ID>` actually extends the `PagingAndSortingRepository<T,ID>` so we get all its functionality.

The `Page<T>` object provides the data for the requested page as well as more information like total result count, index, and more.

```java
// First argument indicates page #, second argument represents # of records
Pageable pageable = PageRequest.of(0, 6);

// query using the findAll() inherited from PagingAndSortingRepository
Page<Customer> custEntities = repository.findAll(pageable);
```

With a `Sort` instance we can describe the sorting order based on an entity property.

```java
List<Customer> custEntities = repository.findAll(Sort.by(Sort.Direction.ASC, "name"));
```

With these two methods we can now have pagination and sorted queries!

## Query Approaches

There are many approaches for querying for data inherited in the `JpaRepository` interface:

- Query by method name
- Query creation using `@NamedQuery`
- Query creation using `@Query`

Also, if one or more query approach is in a Spring application there is an order of precedence:

1. @Query (highest precedence)
2. @NameQuery
3. findBy methods

## Spring Transaction

Let's say our application needed to perform an update on two tables in a database. There is a relationship between these tables. If the first table update fails, should we continue updating the other table?

If we want to maintain data integrity and consistency, the answer is no. Updating should be successful only if the update on both tables is successful. We achieve this by executing related database operations in a transaction scope.

Luckily, Spring provides a common transaction API. It works irrespective of underlying transaction technologies such as Hibernate, JDBC, JPA, or JTA. The `@Transactional` annotation is used at either the class level (for all methods) or for individual methods. The Spring team recommends using `@Transactional` in the service layer to enforce the databases to use transaction management.

Spring transactions support:

- Transaction isolation: The degree of isolation of this transaction with other transactions.
- Transaction propagation: Defines the scope of the transaction.
- Read-only status: A read-only transaction will not change any data. These can be useful for optimization in some cases.
- Transaction timeout: How long a transaction can run before timing out.

## Resources

- [PagingAndSorting Docs](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/PagingAndSortingRepository.html)
- [JpaRepository Docs](https://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html)
- [Query Methods in JPA](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods)
- [Transactionality](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#transactions)
