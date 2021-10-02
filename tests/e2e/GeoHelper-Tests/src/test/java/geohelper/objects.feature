Feature: Objects API

  Background:
    * url baseUrl
    * configure headers = { authorization: #(accessToken) }

  Scenario: Logged in user creating text object
    Given path 'objects'
    When method get
    Then match response == []

    Given path 'objects'
    And request =
    """
    {

    }
    """
    When method get
    Then match response == []
