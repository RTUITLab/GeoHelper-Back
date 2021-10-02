Feature: Objects API

  Background:
    * url baseUrl
    * configure headers = { authorization: #(accessToken) }

  Scenario: Logged in user creating text object
    Given path 'objects'
    When method get
    Then match response == []

    # Wrong type
    Given path 'object'
    And request
    """
    {
      "name": "Kremlin",
      "description": "Moscow Kremlin",
      "type": "test",
      "position": {
        "lat":3,
        "lng":4
      },
      "areas": [
        {
          "points": [
            {
              "lat":1,
              "lng":2
            },
            {
              "lat":7,
              "lng":4
            }
          ]
        }
      ]
    }
    """
    When method post
    Then status 400

    # No areas
    Given path 'object'
    And request
    """
    {
      "name": "Kremlin",
      "description": "Moscow Kremlin",
      "type": "text",
      "position": {
        "lat":3,
        "lng":4
      }
    }
    """
    When method post
    Then status 400

    # No description
    Given path 'object'
    And request
    """
    {
      "name": "Kremlin",
      "descripion": "Moscow Kremlin",
      "type": "test",
      "position": {
        "lat":3,
        "lng":4
      },
      "areas": [
        {
          "points": [
            {
              "lat":1,
              "lng":2
            },
            {
              "lat":7,
              "lng":4
            }
          ]
        }
      ]
    }
    """
    When method post
    Then status 400

    # No type
    Given path 'object'
    And request
    """
    {
      "name": "Kremlin",
      "description": "Moscow Kremlin",
      "position": {
        "lat":3,
        "lng":4
      },
      "areas": [
        {
          "points": [
            {
              "lat":1,
              "lng":2
            },
            {
              "lat":7,
              "lng":4
            }
          ]
        }
      ]
    }
    """
    When method post
    Then status 400

    # Correct text object
    Given path 'object'
    And request
    """
    {
      "name": "Kremlin",
      "description": "Moscow Kremlin",
      "type": "text",
      "position": {
        "lat":3,
        "lng":4
      },
      "areas": [
        {
          "points": [
            {
              "lat":1,
              "lng":2
            },
            {
              "lat":7,
              "lng":4
            }
          ]
        }
      ]
    }
    """
    When method post
    Then status 200

    # Get not empty objects
    Given path 'objects'
    When method get
    Then status 200
    * def objId = response[0]._id

    # Delete created object
    Given path 'object'
    And request { "_id": #(objId) }
    When method delete
    Then status 200
