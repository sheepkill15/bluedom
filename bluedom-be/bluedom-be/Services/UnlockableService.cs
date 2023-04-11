using bluedom_be.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace bluedom_be.Services;

public class UnlockableService
{
    private readonly IMongoCollection<Unlockable> _unlockablesCollection;

    public UnlockableService(IOptions<BluedomStoreDatabaseSettings> bluedomStoreDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            bluedomStoreDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            bluedomStoreDatabaseSettings.Value.DatabaseName);

        _unlockablesCollection = mongoDatabase.GetCollection<Unlockable>(
            bluedomStoreDatabaseSettings.Value.UnlockablesCollectionName);
    }
    
    public async Task<List<Unlockable>> GetAsync() =>
        await _unlockablesCollection.Find(_ => true).ToListAsync();

    public async Task<Unlockable?> GetAsync(string id) =>
        await _unlockablesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Unlockable newUnlockable) =>
        await _unlockablesCollection.InsertOneAsync(newUnlockable);

    public async Task UpdateAsync(string id, Unlockable updatedUnlockable) =>
        await _unlockablesCollection.ReplaceOneAsync(x => x.Id == id, updatedUnlockable);

    public async Task RemoveAsync(string id) =>
        await _unlockablesCollection.DeleteOneAsync(x => x.Id == id);
    
}