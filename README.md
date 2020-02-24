# Target Case Study

This repositories holds my submission for the Case Study at Target.  In this reposititory, Node.js, Express.js, and MongoDB to create an API for the for products given by another API.  Follow the installation process to create a docker-compose container with MongoDB.

## Installation

To start, clone the repository into a folder.

```bash
git clone https://github.com/jmatte123/Target-Case-Study.git
```

Next, install docker via brew (if not already installed) and make sure that it is running.

```bash
brew cask install docker
```

Execute the following commands to build the server-side docker images and run the images.

```bash
docker build -t myretail . 
docker-compose up
```

## Usage

Now run some HTTP GET and PUT requests for our api in Postman.

For example: 
```
http://localhost:4000/products/13860428
```
To run a PUT request, you have to specify a body in the form of:
```
{
    value: Number,
    currency_code: String
}
```

## Testing

To run the test scripts for these two api functions. Navigate back to the root folder of the project and run:

```bash
npm test
```

## Future work
I was hoping to do the following for future work: 
* Try a different version with GraphQL and Apollo Server
* Create Delete and Post methods 
