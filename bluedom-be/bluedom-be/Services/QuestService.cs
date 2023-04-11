using bluedom_be.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace bluedom_be.Services;

public class QuestService
{
    private readonly IMongoCollection<Quest> _questsCollection;

    public QuestService(IOptions<BluedomStoreDatabaseSettings> bluedomStoreDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            bluedomStoreDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            bluedomStoreDatabaseSettings.Value.DatabaseName);

        _questsCollection = mongoDatabase.GetCollection<Quest>(
            bluedomStoreDatabaseSettings.Value.QuestsCollectionName);
    }
    
    public async Task<List<Quest>> GetAsync() =>
        await _questsCollection.Find(_ => true).ToListAsync();

    public async Task<Quest?> GetAsync(string id) =>
        await _questsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Quest newQuest) =>
        await _questsCollection.InsertOneAsync(newQuest);

    public async Task UpdateAsync(string id, Quest updatedQuest) =>
        await _questsCollection.ReplaceOneAsync(x => x.Id == id, updatedQuest);

    public async Task RemoveAsync(string id) =>
        await _questsCollection.DeleteOneAsync(x => x.Id == id);

}