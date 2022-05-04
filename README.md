# TEST EventEmitter package and comparing async vs sync processes.

On sync process we need to use emitAsync and the result will be: 

<img width="771" alt="image" src="https://user-images.githubusercontent.com/19806968/166656310-dff39ca5-8a26-4454-bd96-25ab5cbbf5b6.png">

On async process we want to process request asynchronously to process multiple events and we should use just emit, and the result will be:

<img width="769" alt="image" src="https://user-images.githubusercontent.com/19806968/166656597-e01f2e30-6c2a-4788-84e3-ffaaaf3a122c.png">

So, we noticed that when we process the calls using `emitAsync` the processes are being processed and the next emit will be emitted once the first one has been finished in the same queue, but this does not mean that they will processed like in a queue, if we emit multiple emitAsync they will be running in multiple threads, so keep in mind the rate limit, so in this case is better to consider a queue system like Bull with Redis or Mqtt.


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
