Feature: Objects API

  Background:
    * url baseUrl
    * configure headers = { authorization: #(accessToken) }

  Scenario: Logged in user creating text object
    # Get empty list of objects
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

  Scenario: Logged in user creating audio object
    # Add audio file
    Given path 'upload'
    And multipart file file = { read: 'audio.mp3', filename: 'audio.mp3'}
    When method post
    Then status 201

    * def fileId = response.name
    * print fileId

    # Wrong url
    Given path 'object'
    And request
    """
    {
      "name": "Kremlin",
      "description": "Moscow Kremlin",
      "fileName": #(fileId),
      "type": "audio",
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

    # Wrong fileName
    Given path 'object'
    And request
    """
    {
      "name": "Kremlin",
      "description": "Moscow Kremlin",
      "url": #(fileId),
      "type": "audio",
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

    # Correct object
    Given path 'object'
    And request
    """
    {
      "name": "Kremlin",
      "description": "Moscow Kremlin",
      "url": #(fileId),
      "fileName": "audio.mp3",
      "type": "audio",
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

    # Get objects
    Given path 'objects'
    When method get
    Then status 200

    * def objId = response[0]._id

    # Delete file
    Given path 'delete_file'
    And request { url: #(fileId) }
    When method delete
    Then status 200

    # Delete object
    Given path 'object'
    And request { "_id": #(objId) }
    When method delete
    Then status 200

  Scenario: Logged in user creating 3d object
    # Add 3d model
    Given path 'upload'
    And multipart file file = { read: 'model.zip', filename: 'model.zip'}
    When method post
    Then status 201

    * def fileId = response.name
    * print fileId

    # Add 3d object
    Given path 'object'
    And request
    """
    {
      "name": "Kremlin",
      "description": "Moscow Kremlin",
      "url": #(fileId),
      "fileName": "model.zip",
      "type": "object",
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

    # Get objects
    Given path 'objects'
    When method get
    Then status 200

    * def objId = response[0]._id

    # Delete files
    Given path 'delete_file'
    And request { url: #(fileId) }
    When method delete
    Then status 200

    # Delete object
    Given path 'object'
    And request { "_id": #(objId) }
    When method delete
    Then status 200
