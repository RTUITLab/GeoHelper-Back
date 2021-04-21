const { Client } = require('@googlemaps/google-maps-services-js');

const mapClient = new Client({});

const api = {};

api.getDirection = (Entity, Token) => async (req, res) => {
    if (Token) {
        let destination = req.query.destination;
        const lat = req.query.lat;
        const lng = req.query.lng;
        const entity = { _id: req.query.objectId };

        if (entity._id) {
            try {
                const _entity = await Entity.findOne({ _id: entity._id }).exec();

                destination = `${_entity.position.lat},${_entity.position.lng}`;
                entity.position = _entity.position;
                entity.type = _entity.type;
            } catch (error) {
                return res.status(400).json({ success: false, message: 'Object not found' });
            }
        }

        if (!destination || !lat || !lng) {
            return res.status(400).send({ success: false, message: 'Destination, latitude and longitude must be defined in query' });
        }

        try {
            mapClient.directions({
                params: {
                    origin: `${lat},${lng}`,
                    destination: destination,
                    optimize: false,
                    mode: 'walking',
                    key: process.env.GOOGLE_API_KEY
                }
            })
            .then(r => {
                if (r.data.status !== 'OK') {
                    return res.status(400).send({ success: false, message: 'No way' });
                }

                if (!req.query.compact && !entity._id) {
                    return res.status(200).send({ success: true, message: r.data });
                } else {
                    const data = [];
                    let last = r.data.routes[0].legs[0].start_location;
                    let steps = r.data.routes[0].legs[0].steps;

                    while (steps.length > 0) {
                        const currentStep = steps.find((S) => S.start_location.lat === last.lat && S.start_location.lng === last.lng);

                        data.push(currentStep.start_location);
                        data[data.length - 1].id = data.length;
                        steps = steps.filter((S) => !(S.start_location.lat === last.lat && S.start_location.lng === last.lng));
                        last = currentStep.end_location;
                    }

                    if (!entity._id) {
                        return res.status(200).send({ success: true, message: {
                            start_location: {
                                address: r.data.routes[0].legs[0].start_address,
                                position: r.data.routes[0].legs[0].start_location
                            },
                            end_location: {
                                address: r.data.routes[0].legs[0].end_address,
                                position: r.data.routes[0].legs[0].end_location
                            },
                            steps: data
                        }});
                    } else {
                        return res.status(200).send({ success: true, message: {
                            end_location: {
                                entity
                            },
                            steps: data
                        }});
                    }
                }
            })
            .catch(e => console.log(e));
        } catch (e) {
            return res.status(400).send({ success: false, message: e });
        }

        // const options = {
        //     hosname: 'maps.googleapis.com',
        //     port: 443,
        //     path: `/maps/api/directions/json?origin=${lat},${lng}&destination=${destination}&key=${process.env.GOOGLE_API_KEY}`,
        //     method: 'GET',
        //     agentOptions: {
        //       ca: fs.readFileSync("C:/Users/hc/.ssh/id_rsa")
        //     }
        // }

        // const request = https.request(options, res => {
        //     res.on('data', data => {
        //         console.log(data);
        //         return res.status(200).send(data);
        //     });
        // });

        // request.on('error', (error) => {
        //     console.log(error);
        //     console.log(request);
        //     res.status(400).send({ success: false, message: error });
        // })
    } else {
        return res.status(401).send({ success: false, message: 'Unauthorized' });
    }
}

module.exports = api;
