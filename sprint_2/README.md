<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#db-initialization">DB initialization</a></li>
        <ul>
            <li><a href="#db-with-docker">DB with Docker</a></li>
            <li><a href="#db-without-docker">DB without Docker</a></li>
        </ul>
        <li><a href="#start-server">Start server</a></li>
        <li><a href="#tests">Tests</a></li>
      </ul>
    </li>
    <li>
        <a href="#usage">Usage</a>
        <ul>
            <li><a href="#authentication-and-authorization">Authentication and Authorization</a></li>
            <li><a href="#http-verbs">HTTP Verbs</a></li>
            <li><a href="#contracts">Contracts</a></li>
            <ul>
                <li><a href="#login">Login</a></li>
                <li><a href="#create-user">Create User</a></li>
                <li><a href="#update-user">Update User</a></li>
                <li><a href="#add-user-to-groups">Add User to groups</a></li>
                <li><a href="#create-group">Create Group</a></li>
                <li><a href="#update-group">Update Group</a></li>
            </ul>
            <li><a href="#npm-scripts">NPM scripts</a></li>
        </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

The project is a simple REST web API developed for educational purposes. Project is uses PostgresSQL to store a coupler of simple models - Users, Groups and Users and Groups many to many relation in UserGroup table

### Built With

* [Express](https://expressjs.com/)
* [Sequelize](https://sequelize.org/)
* [PostgreSQL](https://www.postgresql.org/)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* Node.js 12.19.1 and higher
* Docker - optional

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/gogumaUno/NodeJS_2021Q2_RU_GM.git
   ```
2. Install NPM packages
   ```sh
   npm ci
   ```
3. Set environment variables according to `.env.example` file

### DB initialization

#### DB with Docker
1. Start docker containers and run db migration and seeding
   ```sh
   npm run init
   ```

#### DB without Docker
1. Run db migration and seeding
   ```sh
   npm run init:db
   ```
2. Start `PgAdmin` container (optional)
   ```sh
   npm run init:docker:admin
   ```

### Start server
```sh
npm run start
```

### Tests
```sh
npm run test
```

<!-- USAGE EXAMPLES -->
## Usage

### Authentication and Authorization
To authenticate user send user's login and password to the `/login` endpoint. The response well contain JWT token.
In order to authorize user add `Authorization` header to the request and set it to a `Bearer token`
All the app endpoints except the `/login` endpoint are guarder with auth middleware  

### HTTP Verbs
| HTTP METHOD | POST            | GET       | PUT         | DELETE |
| ----------- | --------------- | --------- | ----------- | ------ |
| CRUD OP     | CREATE          | READ      | UPDATE      | DELETE |
| /login      | Authenticate user | | | |
| /users      | Create new user | List of users | | |
| /users/{id} | | Show user | Update user | Delete user |
| /users/{id}/groups | Add user to groups | | | |
| /groups      | Create new group | List of groups | | |
| /groups/{id} | | Show group | Update group | Delete group |

### Contracts

#### Login

```
{
    login: string
    password: string
}
```

#### Create User

```
{
    login: string - should be at least 1 character long
    password: string - should contain at least one number, one letter and be at least 6 characters long
    age: number - in the range from 4 to 130
}
```

#### Update User

```
{
    login: string - should be at least 1 character long
    password: string - should contain at least one number, one letter and be at least 6 characters long
    age: number - in the range from 4 to 130
}
```

#### Add User to groups

```
{
    groupIdList: string[] - list of group guids
}
```


#### Create Group

```
{
    name: string
    permissions: string[] - list of string in range READ WRITE DELETE SHARE UPLOAD_FILES 
}
```

#### Update Group

```
{
    name: string
    permissions: string[] - list of string in range READ WRITE DELETE SHARE UPLOAD_FILES 
}
```

### NPM scripts

1. init - start docker `PosgresSQL` and `PgAdmin` services and run Sequelize migrations and seeds 
2. init:docker - start docker `PosgresSQL` and `PgAdmin` services
3. init:docker:db - start docker `PosgresSQL` service
4. init:docker:admin - start docker `PgAdmin` service
5. init:db - run Sequelize migrations and seeds
6. migrate:up - apply Sequelize migrations to DB
7. migrate:down - remove Sequelize migrations from DB
8. seed:up - apply Sequelize seeds to DB
9. seed:down - remove Sequelize seeds from DB
10. start - start server 
11. test - run tests