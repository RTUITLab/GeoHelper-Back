module.exports = {
    name: '',
	type: '',
	description: '',
	position: {
		lat: 0,
		lng: 0
	},
    fileName: [],
    url: [],
	files: [],
	areas: [],
	additionalLines: [],

    getObjectFromRequest: (entity) => {
        if (entity.fileName && entity.url) {
            entity.files = [{ fileName: entity.fileName, url: entity.url, type: 'default' }];
            entity.fileName = undefined;
            entity.url = undefined;
        }

        return entity;
    },

    setObjectToResponse: (entity) => {
        if (['text', 'object', 'audio'].indexOf(entity.type) !== -1) {
            if (entity.files && entity.files[0]) {
                entity.fileName = entity.files[0].fileName;
                entity.url = entity.files[0].url;
            }
        }

        return entity;
    }
}
