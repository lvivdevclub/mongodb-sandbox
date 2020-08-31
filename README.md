# mongodb-sandbox



### Setup
- **Step 1: Start all of the containers**

```bash
docker-compose up -d
```

- **Step 2: Initialize the replica sets (config servers and shards) and routers**

```bash
docker-compose exec configsvr01 sh -c "mongo < /scripts/init-configserver.js"

docker-compose exec shard01-a sh -c "mongo < /scripts/init-shard01.js"
docker-compose exec shard02-a sh -c "mongo < /scripts/init-shard02.js"
docker-compose exec shard03-a sh -c "mongo < /scripts/init-shard03.js"
```

- **Step 3: Initializing the router**
>Note: Wait a bit for the config server and shards to elect their primaries before initializing the router

```bash
docker-compose exec mongo1 sh -c "mongo < /scripts/init-router.js"
```

- **Step 4: Enable sharding and setup sharding-key**
```bash
docker-compose exec mongo1 mongo --port 27017

// Enable sharding for database `MyDatabase`
sh.enableSharding("test")

// Setup shardingKey for collection `hashes`**
db.adminCommand( { shardCollection: "test.hashes", key: { _id: "hashed" } } )

```

### Verify

- **Verify the status of the sharded cluster**

```bash
docker-compose exec mongo1 mongo --port 27017
sh.status()
```

- **Check database status**
```bash
docker-compose exec mongo1 mongo --port 27017
use test
db.stats()
db.hashes.getShardDistribution()
```


- ** `Restart mongodb-sandbox_mongodb-sandbox_1` if needed
```bash
docker logs mongodb-sandbox_mongodb-sandbox_1
docker restart mongodb-sandbox_mongodb-sandbox_1
```

- ** Rebuild and redeploy `mongodb-sandbox`

```bash
docker-compose stop  mongodb-sandbox
docker-compose kill mongodb-sandbox
docker-compose build mongodb-sandbox
docker-compose up -d --no-deps mongodb-sandbox
```