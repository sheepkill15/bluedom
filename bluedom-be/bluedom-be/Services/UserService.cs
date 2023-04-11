using bluedom_be.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace bluedom_be.Services;

public class UserService
{
    private readonly IMongoCollection<User> _usersCollection;

    public UserService(IOptions<BluedomStoreDatabaseSettings> bluedomStoreDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            bluedomStoreDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            bluedomStoreDatabaseSettings.Value.DatabaseName);

        _usersCollection = mongoDatabase.GetCollection<User>(
            bluedomStoreDatabaseSettings.Value.UsersCollectionName);

        _usersCollection.Indexes.CreateOne(new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending("Username"),
            new CreateIndexOptions { Unique = true }));

    }
    
    public async Task<User?> GetAsync(string id) =>
        await _usersCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
    
    public async Task<User?> GetByUsernameAsync(string username) =>
        await _usersCollection.Find(x => x.Username == username).FirstOrDefaultAsync();

    public async Task CreateAsync(User newUser) =>
        await _usersCollection.InsertOneAsync(newUser);

    public async Task UpdateAsync(string id, User updatedUser) =>
        await _usersCollection.ReplaceOneAsync(x => x.Id == id, updatedUser);

    public async Task RemoveAsync(string id) =>
        await _usersCollection.DeleteOneAsync(x => x.Id == id);


}