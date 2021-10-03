Feature: Directions API
  Background:
    * url baseUrl
    * configure headers = { authorization: #(accessToken) }

  Scenario: Create object and find complete way to it
    # Create text object
    Given path 'object'
    And request
    """
    {"position":{"lat":55.75346593884242,"lng":37.62446547208683},"areas":[{"points":[{"lat":55.81524305714445,"lng":37.62583876310246},{"lat":55.739552585078556,"lng":37.52009535489933},{"lat":55.734140496395305,"lng":37.70274305997746}]}],"name":"Kremlin","description":"Big palace","type":"text"}
    """
    When method post
    Then status 200

    # Get object id
    Given path 'objects'
    When method get
    Then status 200

    * def objId = response[0]._id
    * print objId

    # Get complete way
    * def resp =
    """
    {
    "success": true,
    "message": {
        "end_location": {
            "entity": {
                "_id": #(objId),
                "position": {
                    "lat": 55.75346593884242,
                    "lng": 37.62446547208683
                },
                "type": "text"
            }
        },
        "steps": [
            {
                "lat": 55.7930917,
                "lng": 37.6343614,
                "id": 1
            },
            {
                "lat": 55.7930777,
                "lng": 37.6331342,
                "id": 2
            },
            {
                "lat": 55.7916035,
                "lng": 37.6331978,
                "id": 3
            },
            {
                "lat": 55.7808343,
                "lng": 37.6315626,
                "id": 4
            },
            {
                "lat": 55.77831579999999,
                "lng": 37.6306154,
                "id": 5
            },
            {
                "lat": 55.7783078,
                "lng": 37.6282184,
                "id": 6
            },
            {
                "lat": 55.7738084,
                "lng": 37.627149,
                "id": 7
            },
            {
                "lat": 55.773745,
                "lng": 37.6276091,
                "id": 8
            },
            {
                "lat": 55.7705718,
                "lng": 37.6275634,
                "id": 9
            },
            {
                "lat": 55.7704677,
                "lng": 37.6253091,
                "id": 10
            },
            {
                "lat": 55.7666072,
                "lng": 37.6233846,
                "id": 11
            },
            {
                "lat": 55.76656089999999,
                "lng": 37.62374270000001,
                "id": 12
            },
            {
                "lat": 55.7593391,
                "lng": 37.6236806,
                "id": 13
            },
            {
                "lat": 55.75917099999999,
                "lng": 37.6225376,
                "id": 14
            },
            {
                "lat": 55.7583109,
                "lng": 37.6241718,
                "id": 15
            },
            {
                "lat": 55.7569443,
                "lng": 37.6222431,
                "id": 16
            },
            {
                "lat": 55.7554419,
                "lng": 37.6247273,
                "id": 17
            },
            {
                "lat": 55.7548059,
                "lng": 37.6256042,
                "id": 18
            },
            {
                "lat": 55.75426659999999,
                "lng": 37.6240536,
                "id": 19
            }
        ]
    }
}
    """
    Given path 'direction'
    And param lat = 55.793089
    And param lng = 37.634355
    And param objectId = objId
    When method get
    Then status 200
    And match response == resp

    # Delete created object
    Given path 'objects'
    When method get
    Then status 200

    * def objId = response[0]._id

    Given path 'object'
    And request { _id: #(objId) }
    When method delete
    Then status 200

  Scenario: Create object and find compact way to it
    # Create text object
    Given path 'object'
    And request
    """
    {"position":{"lat":55.75346593884242,"lng":37.62446547208683},"areas":[{"points":[{"lat":55.81524305714445,"lng":37.62583876310246},{"lat":55.739552585078556,"lng":37.52009535489933},{"lat":55.734140496395305,"lng":37.70274305997746}]}],"name":"Kremlin","description":"Big palace","type":"text"}
    """
    When method post
    Then status 200

    # Get object id
    Given path 'objects'
    When method get
    Then status 200

    * def objId = response[0]._id
    * print objId

    # Get compact way
    * def resp =
    """
    {
    "success": true,
    "message": {
        "end_location": {
            "entity": {
                "_id": #(objId),
                "position": {
                    "lat": 55.75346593884242,
                    "lng": 37.62446547208683
                },
                "type": "text"
            }
        },
        "steps": [
            {
                "lat": 55.7930917,
                "lng": 37.6343614,
                "id": 1
            },
            {
                "lat": 55.7930777,
                "lng": 37.6331342,
                "id": 2
            },
            {
                "lat": 55.7916035,
                "lng": 37.6331978,
                "id": 3
            },
            {
                "lat": 55.7808343,
                "lng": 37.6315626,
                "id": 4
            },
            {
                "lat": 55.77831579999999,
                "lng": 37.6306154,
                "id": 5
            },
            {
                "lat": 55.7783078,
                "lng": 37.6282184,
                "id": 6
            },
            {
                "lat": 55.7738084,
                "lng": 37.627149,
                "id": 7
            },
            {
                "lat": 55.773745,
                "lng": 37.6276091,
                "id": 8
            },
            {
                "lat": 55.7705718,
                "lng": 37.6275634,
                "id": 9
            },
            {
                "lat": 55.7704677,
                "lng": 37.6253091,
                "id": 10
            },
            {
                "lat": 55.7666072,
                "lng": 37.6233846,
                "id": 11
            },
            {
                "lat": 55.76656089999999,
                "lng": 37.62374270000001,
                "id": 12
            },
            {
                "lat": 55.7593391,
                "lng": 37.6236806,
                "id": 13
            },
            {
                "lat": 55.75917099999999,
                "lng": 37.6225376,
                "id": 14
            },
            {
                "lat": 55.7583109,
                "lng": 37.6241718,
                "id": 15
            },
            {
                "lat": 55.7569443,
                "lng": 37.6222431,
                "id": 16
            },
            {
                "lat": 55.7554419,
                "lng": 37.6247273,
                "id": 17
            },
            {
                "lat": 55.7548059,
                "lng": 37.6256042,
                "id": 18
            },
            {
                "lat": 55.75426659999999,
                "lng": 37.6240536,
                "id": 19
            }
        ]
    }
}
    """
    Given path 'direction'
    And param lat = 55.793089
    And param lng = 37.634355
    And param objectId = objId
    And param compact = true
    When method get
    Then status 200
    And match response == resp

    # Delete created object
    Given path 'objects'
    When method get
    Then status 200

    * def objId = response[0]._id

    Given path 'object'
    And request { _id: #(objId) }
    When method delete
    Then status 200

  Scenario: Find compact way to point
    # Get compact way
    * def resp =
    """
    {
    "success": true,
    "message": {
        "start_location": {
            "address": "Prospekt Mira, 95с2, Moskva, Russia, 129110",
            "position": {
                "lat": 55.7930917,
                "lng": 37.6343614
            }
        },
        "end_location": {
            "address": "Ryazanskiy Pereulok, 2, Moskva, Russia, 107078",
            "position": {
                "lat": 55.7707636,
                "lng": 37.6550914
            }
        },
        "steps": [
            {
                "lat": 55.7930917,
                "lng": 37.6343614,
                "id": 1
            },
            {
                "lat": 55.7930777,
                "lng": 37.6331342,
                "id": 2
            },
            {
                "lat": 55.791673,
                "lng": 37.6333341,
                "id": 3
            },
            {
                "lat": 55.7915679,
                "lng": 37.6344555,
                "id": 4
            },
            {
                "lat": 55.78625959999999,
                "lng": 37.6348329,
                "id": 5
            },
            {
                "lat": 55.7857394,
                "lng": 37.6411407,
                "id": 6
            },
            {
                "lat": 55.77981089999999,
                "lng": 37.6444323,
                "id": 7
            },
            {
                "lat": 55.7797572,
                "lng": 37.6447761,
                "id": 8
            },
            {
                "lat": 55.7747516,
                "lng": 37.6522196,
                "id": 9
            },
            {
                "lat": 55.774417,
                "lng": 37.6541394,
                "id": 10
            },
            {
                "lat": 55.7740419,
                "lng": 37.6537053,
                "id": 11
            },
            {
                "lat": 55.77121,
                "lng": 37.654847,
                "id": 12
            }
        ]
    }
}
    """
    Given path 'direction'
    And param destination = '55.770759,37.655134'
    And param lat = 55.793089
    And param lng = 37.634355
    And param compact = true
    When method get
    Then status 200
    And match response == resp

  Scenario: Find complete way to point
    # Get compact way
    * def resp =
    """
    {
    "success": true,
    "message": {
        "geocoded_waypoints": [
            {
                "geocoder_status": "OK",
                "place_id": "ChIJLR3kmOY1tUYRYDN2i5WYyio",
                "types": [
                    "establishment",
                    "point_of_interest"
                ]
            },
            {
                "geocoder_status": "OK",
                "place_id": "ChIJv1PuAH1KtUYR1GDwN6M8rTI",
                "types": [
                    "street_address"
                ]
            }
        ],
        "routes": [
            {
                "bounds": {
                    "northeast": {
                        "lat": 55.7932183,
                        "lng": 37.6550914
                    },
                    "southwest": {
                        "lat": 55.7707636,
                        "lng": 37.6331071
                    }
                },
                "copyrights": "Map data ©2021 Google",
                "legs": [
                    {
                        "distance": {
                            "text": "3.4 km",
                            "value": 3363
                        },
                        "duration": {
                            "text": "43 mins",
                            "value": 2579
                        },
                        "end_address": "Ryazanskiy Pereulok, 2, Moskva, Russia, 107078",
                        "end_location": {
                            "lat": 55.7707636,
                            "lng": 37.6550914
                        },
                        "start_address": "Prospekt Mira, 95с2, Moskva, Russia, 129110",
                        "start_location": {
                            "lat": 55.7930917,
                            "lng": 37.6343614
                        },
                        "steps": [
                            {
                                "distance": {
                                    "text": "75 m",
                                    "value": 75
                                },
                                "duration": {
                                    "text": "1 min",
                                    "value": 53
                                },
                                "end_location": {
                                    "lat": 55.7930777,
                                    "lng": 37.6331342
                                },
                                "html_instructions": "Head <b>northwest</b> toward <b>пл. Рижская</b>",
                                "polyline": {
                                    "points": "yapsIwmudFGHGNCLAJAJ?L?NAb@L@?FD^BVDVAX"
                                },
                                "start_location": {
                                    "lat": 55.7930917,
                                    "lng": 37.6343614
                                },
                                "travel_mode": "WALKING"
                            },
                            {
                                "distance": {
                                    "text": "0.2 km",
                                    "value": 163
                                },
                                "duration": {
                                    "text": "2 mins",
                                    "value": 129
                                },
                                "end_location": {
                                    "lat": 55.791673,
                                    "lng": 37.6333341
                                },
                                "html_instructions": "Turn <b>left</b> onto <b>пл. Рижская</b>",
                                "maneuver": "turn-left",
                                "polyline": {
                                    "points": "wapsIafudFB?RBNAREh@Kt@EXCTAD?H?P?D@PFD@J?@W"
                                },
                                "start_location": {
                                    "lat": 55.7930777,
                                    "lng": 37.6331342
                                },
                                "travel_mode": "WALKING"
                            },
                            {
                                "distance": {
                                    "text": "79 m",
                                    "value": 79
                                },
                                "duration": {
                                    "text": "1 min",
                                    "value": 69
                                },
                                "end_location": {
                                    "lat": 55.7915679,
                                    "lng": 37.6344555
                                },
                                "html_instructions": "Turn <b>left</b> toward <b>пр-т Мира</b>",
                                "maneuver": "turn-left",
                                "polyline": {
                                    "points": "}xosIigudF@uD?MBYLC"
                                },
                                "start_location": {
                                    "lat": 55.791673,
                                    "lng": 37.6333341
                                },
                                "travel_mode": "WALKING"
                            },
                            {
                                "distance": {
                                    "text": "0.6 km",
                                    "value": 590
                                },
                                "duration": {
                                    "text": "8 mins",
                                    "value": 453
                                },
                                "end_location": {
                                    "lat": 55.78625959999999,
                                    "lng": 37.6348329
                                },
                                "html_instructions": "Turn <b>right</b> onto <b>пр-т Мира</b>",
                                "maneuver": "turn-right",
                                "polyline": {
                                    "points": "ixosIknudFZAd@Ab@Ab@?tBIR?L?`@?t@?L?|F@P?J?P?L@vA?pBMFAVGnBGF@?_@"
                                },
                                "start_location": {
                                    "lat": 55.7915679,
                                    "lng": 37.6344555
                                },
                                "travel_mode": "WALKING"
                            },
                            {
                                "distance": {
                                    "text": "0.4 km",
                                    "value": 406
                                },
                                "duration": {
                                    "text": "5 mins",
                                    "value": 313
                                },
                                "end_location": {
                                    "lat": 55.7857394,
                                    "lng": 37.6411407
                                },
                                "html_instructions": "Turn <b>left</b> onto <b>пер. Банный</b>",
                                "maneuver": "turn-left",
                                "polyline": {
                                    "points": "cwnsIupudF?_@@_@BkA?yA@aBB}A@g@@K@S@I?I@EDSJWDGDMHWFKBI@G@G?K@gA@WDsA@y@DsABcA?Y@S@yA?A@o@AY"
                                },
                                "start_location": {
                                    "lat": 55.78625959999999,
                                    "lng": 37.6348329
                                },
                                "travel_mode": "WALKING"
                            },
                            {
                                "distance": {
                                    "text": "0.7 km",
                                    "value": 709
                                },
                                "duration": {
                                    "text": "9 mins",
                                    "value": 523
                                },
                                "end_location": {
                                    "lat": 55.77981089999999,
                                    "lng": 37.6444323
                                },
                                "html_instructions": "Turn <b>right</b> onto <b>ул. Большая Переяславская</b>",
                                "maneuver": "turn-right",
                                "polyline": {
                                    "points": "{snsIcxvdFPMNG^Ol@U|Ae@v@UzAe@LELE\\Kl@Qr@URGb@Or@Ud@OLEl@SLE\\Mz@W\\G\\Gv@K~@SLEHEJEJGJILMNYPa@Tk@L[DKBEBI@GDUDULD"
                                },
                                "start_location": {
                                    "lat": 55.7857394,
                                    "lng": 37.6411407
                                },
                                "travel_mode": "WALKING"
                            },
                            {
                                "distance": {
                                    "text": "25 m",
                                    "value": 25
                                },
                                "duration": {
                                    "text": "1 min",
                                    "value": 26
                                },
                                "end_location": {
                                    "lat": 55.7797572,
                                    "lng": 37.6447761
                                },
                                "html_instructions": "Continue onto <b>пер. Протопоповский</b>",
                                "polyline": {
                                    "points": "ynmsIulwdFDg@B]"
                                },
                                "start_location": {
                                    "lat": 55.77981089999999,
                                    "lng": 37.6444323
                                },
                                "travel_mode": "WALKING"
                            },
                            {
                                "distance": {
                                    "text": "0.7 km",
                                    "value": 733
                                },
                                "duration": {
                                    "text": "9 mins",
                                    "value": 554
                                },
                                "end_location": {
                                    "lat": 55.7747516,
                                    "lng": 37.6522196
                                },
                                "html_instructions": "<b>пер. Протопоповский</b> turns slightly <b>right</b> and becomes <b>ул. Каланчевская</b>",
                                "polyline": {
                                    "points": "onmsI{nwdFDGNYBG@CdAkBhAmBXe@DIIQbAgBfAaBHRBEPODE|@aBLUDIFKJQBEDEHKNOFGGUb@[h@a@TQPe@DKJQP]pA{BJQXe@t@wAd@}@Xi@d@y@Rk@\\o@JQ"
                                },
                                "start_location": {
                                    "lat": 55.7797572,
                                    "lng": 37.6447761
                                },
                                "travel_mode": "WALKING"
                            },
                            {
                                "distance": {
                                    "text": "0.2 km",
                                    "value": 151
                                },
                                "duration": {
                                    "text": "2 mins",
                                    "value": 127
                                },
                                "end_location": {
                                    "lat": 55.774417,
                                    "lng": 37.6541394
                                },
                                "html_instructions": "Turn <b>left</b> at <b>пр. Академика Сахарова</b>/<wbr/><b>ул. Маши Порываевой</b>",
                                "maneuver": "turn-left",
                                "polyline": {
                                    "points": "eolsIk}xdF?SAOAKAOAOGa@Oi@Fc@AELSP_@Nc@LWJUBIBK@CBG@I@G"
                                },
                                "start_location": {
                                    "lat": 55.7747516,
                                    "lng": 37.6522196
                                },
                                "travel_mode": "WALKING"
                            },
                            {
                                "distance": {
                                    "text": "49 m",
                                    "value": 49
                                },
                                "duration": {
                                    "text": "1 min",
                                    "value": 35
                                },
                                "end_location": {
                                    "lat": 55.7740419,
                                    "lng": 37.6537053
                                },
                                "html_instructions": "Turn <b>right</b> onto <b>пл. Комсомольская</b>",
                                "maneuver": "turn-right",
                                "polyline": {
                                    "points": "cmlsIkiydFPVNTRh@DNNQ"
                                },
                                "start_location": {
                                    "lat": 55.774417,
                                    "lng": 37.6541394
                                },
                                "travel_mode": "WALKING"
                            },
                            {
                                "distance": {
                                    "text": "0.3 km",
                                    "value": 331
                                },
                                "duration": {
                                    "text": "4 mins",
                                    "value": 253
                                },
                                "end_location": {
                                    "lat": 55.77121,
                                    "lng": 37.654847
                                },
                                "html_instructions": "Turn <b>left</b> onto <b>пр-д Рязанский</b>",
                                "maneuver": "turn-left",
                                "polyline": {
                                    "points": "wjlsIufydFfBk@pA_@h@CrBq@LGv@e@vCs@"
                                },
                                "start_location": {
                                    "lat": 55.7740419,
                                    "lng": 37.6537053
                                },
                                "travel_mode": "WALKING"
                            },
                            {
                                "distance": {
                                    "text": "52 m",
                                    "value": 52
                                },
                                "duration": {
                                    "text": "1 min",
                                    "value": 44
                                },
                                "end_location": {
                                    "lat": 55.7707636,
                                    "lng": 37.6550914
                                },
                                "html_instructions": "Continue onto <b>пер. Рязанский</b><div style=\"font-size:0.9em\">Destination will be on the right</div>",
                                "polyline": {
                                    "points": "ayksIymydFnA]HQ"
                                },
                                "start_location": {
                                    "lat": 55.77121,
                                    "lng": 37.654847
                                },
                                "travel_mode": "WALKING"
                            }
                        ],
                        "traffic_speed_entry": [],
                        "via_waypoint": []
                    }
                ],
                "overview_polyline": {
                    "points": "yapsIwmudFOXEXClAL@?FHv@DVAXVBb@Gh@Kt@En@EN?V@VHJ?@W@cEBYLC`ACpEK`L@dB@xBOVGnBGF@?_@@_ABeDHsFDm@Pk@JUVu@DsBPeHBiC?iA`@UlAe@tC{@tC}@xC_AtC_Aj@SxA_@tASlAYl@]\\g@f@mAZw@F]DULDHeATa@tCeF^o@IQbAgBfAaBHRTUvAgC\\i@X[FGGUlA}@TQPe@P]bByCd@w@zAuC~@cBp@{AJQ?SC[C_@WkAFc@AE^s@l@{AJa@@GPVNTRh@DNNQxDkAh@CrBq@dAm@fFqAHQ"
                },
                "summary": "ул. Каланчевская",
                "warnings": [
                    "Walking directions are in beta. Use caution – This route may be missing sidewalks or pedestrian paths."
                ],
                "waypoint_order": []
            }
        ],
        "status": "OK"
    }
}
    """
    Given path 'direction'
    And param destination = '55.770759,37.655134'
    And param lat = 55.793089
    And param lng = 37.634355
    When method get
    Then status 200
    And match response == resp
