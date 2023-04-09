using bluedom_be.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace bluedom_be.Services;

public class PlayerService
{
    private readonly IMongoCollection<Player> _playersCollection;

    public PlayerService(IOptions<BluedomStoreDatabaseSettings> bluedomStoreDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            bluedomStoreDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            bluedomStoreDatabaseSettings.Value.DatabaseName);

        _playersCollection = mongoDatabase.GetCollection<Player>(
            bluedomStoreDatabaseSettings.Value.PlayersCollectionName);
    }
    
    public async Task<List<Player>> GetAsync() =>
        await _playersCollection.Find(_ => true).ToListAsync();

    public async Task<Player?> GetAsync(string id) =>
        await _playersCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<List<Player>> GetTop(int count) =>
        await _playersCollection.Find(_ => true).SortByDescending(player => player.Tokens).Limit(count)
            .ToListAsync();

    public async Task<long> GetBetterCount(int tokens, int quests) =>
        await _playersCollection.CountDocumentsAsync(x => x.Tokens >= tokens);
    
    public async Task CreateAsync(Player newPlayer) =>
        await _playersCollection.InsertOneAsync(newPlayer);

    public async Task UpdateAsync(string id, Player updatedPlayer) =>
        await _playersCollection.ReplaceOneAsync(x => x.Id == id, updatedPlayer);

    public async Task RemoveAsync(string id) =>
        await _playersCollection.DeleteOneAsync(x => x.Id == id);

}