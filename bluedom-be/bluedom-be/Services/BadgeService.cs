using bluedom_be.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace bluedom_be.Services;

public class BadgeService
{
    private readonly IMongoCollection<Badge> _badgesCollection;

    public BadgeService(IOptions<BluedomStoreDatabaseSettings> bluedomStoreDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            bluedomStoreDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            bluedomStoreDatabaseSettings.Value.DatabaseName);

        _badgesCollection = mongoDatabase.GetCollection<Badge>(
            bluedomStoreDatabaseSettings.Value.BadgesCollectionName);
    }
    
    public async Task<List<Badge>> GetAsync() =>
        await _badgesCollection.Find(_ => true).ToListAsync();

    public async Task<Badge?> GetAsync(string id) =>
        await _badgesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<List<string>> GetCompletedIds(int tokens, int quests) =>
        await _badgesCollection.Find(x => x.RequiredTokens <= tokens && x.RequiredQuests <= quests).Project(x => x.Id)
            .ToListAsync();

    public async Task CreateAsync(Badge newBadge) =>
        await _badgesCollection.InsertOneAsync(newBadge);

    public async Task UpdateAsync(string id, Badge updatedBadge) =>
        await _badgesCollection.ReplaceOneAsync(x => x.Id == id, updatedBadge);

    public async Task RemoveAsync(string id) =>
        await _badgesCollection.DeleteOneAsync(x => x.Id == id);
    
}