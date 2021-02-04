# Models
## WS models

**WS response**
```ts
{
    poiObjectModels: Array<TextObject>,
    geoAudioObjectModels: Array<AudioObject>,
    geo3dObjectModels: Array<ModelObject>
}
```

**TextObject**
```ts
{
    id: string,
    type: 'text',
    name: string,
    description: string,
    position: {
        lat: number,
        lng: number
    }
}
```

**AudioObject**
```ts
{
    id: string,
    type: 'audio',
    name: string,
    position: {
        lat: number,
        lng: number
    },
    url: string
}
```

**ModelObject**
```ts
{
    id: string,
    type: 'object',
    name: string,
    position: {
        lat: number,
        lng: number
    },
    url: string
}
```
## HTTP models

**TextObject**
```ts
{
    _id: string,
    type: 'audio',
    name: string,
    description: string,
    position: {
        lat: number,
        lng: number
    },
    areas: [
        {
            points: [
                {
                    lat: number,
                    lng: number
                }
            ]
        }
    ]
}
```

**AudioObject**
```ts
{
    _id: string,
    type: 'audio',
    name: string,
    position: {
        lat: number,
        lng: number
    },
    url: string,
    fileName: string,
    areas: [
        {
            points: [
                {
                    lat: number,
                    lng: number
                }
            ]
        }
    ]
}
```

**ModelObject**
```ts
{
    _id: string,
    type: 'object',
    name: string,
    position: {
        lat: number,
        lng: number
    },
    url: string,
    fileName: string,
    areas: [
        {
            points: [
                {
                    lat: number,
                    lng: number
                }
            ]
        }
    ]
}
```
