Feature: User API

  Background:
    * url baseUrl

  Scenario: User tries to login three times (2 are failed)
    Given path 'auth'
    * def emptyUser = {}
    And request emptyUser
    When method post
    Then status 401

    Given path 'auth'
    * def invalidUser = { username: 'test1', password: 'test123' }
    And request invalidUser
    When method post
    Then status 401

    Given path 'auth'
    * def validUser = { username: 'test', password: 'test123' }
    And request validUser
    When method post
    Then status 200

    * def token = response.token