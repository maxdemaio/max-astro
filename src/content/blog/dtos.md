---
fileName: dtos
title: Spring Data Transfer Objects
pubDate: 'Oct 06 2021'
description: What data transfer objects are and their importance in REST calls.
duration: 3
---

Data Transfer Objects (DTOs) carry data between processes. Each call to an application is expensive so we should try to keep them to a minimum. DTOs help solve this pesky problem! DTOs need to be serializable to go across remote connections. Usually, an assembler is used on the server side to transfer data between DTOs and any domain objects.

---

## Overview

DTO design patterns are frequently used in enterprise applications. Why? This design pattern allows us to pass data with multiple attributes in one shot from client to server, avoiding multiple calls to an application. Also, we avoid exposing the implementation details of our domain objects pulled directly from the repository layer (direct object-relational mapping from our databases to Java objects).

## Examples

When writing RESTful APIs we can even analyze an incoming request and stop it in its tracks by validating its request body data against our DTOs. This saves precious I/O since you can identify validation errors before you even get past the controller layer. I've created an [example application](https://github.com/maxdemaio/demos/tree/main/dtoExample) where I demonstrate applying validation constraints to a DTO class which I will detail here.

```java
public class PersonDTO {

	@NotNull
	@Size(min=2, max=30)
	private String name;

	@NotNull
	@Min(value = 18)
	private Integer age;

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public String toString() {
		return "Person(fileName: " + this.name + ", Age: " + this.age + ")";
	}
}
```

You can see we've flagged this class’s attributes with a few standard validation annotations. Now, let's make an example controller to demonstrate how we can stop a request in its tracks before traveling to our service layer if there are any mistakes.

```java
@RestController
public class ExampleController {
	@PostMapping("/")
	public String checkPersonInfo(@Valid @RequestBody PersonDTO personDTO) {
		return "Valid person DTO!";
	}
}
```

In the example application's repository, I've also included two Postman API calls. If we were to make a POST request with invalid age or name data, the end user receives a 400 error. However, if all fields of the request body of the POST request are valid, we receive a nice message "Valid person DTO!". In a real application, catching these types of errors early is extremely important.

## Conclusion

We now know what DTOs are used for and why they're very helpful in enterprise applications. This design pattern is very common and allows for efficient API architecture when coupled with validation. In short: validate, validate, validate!
