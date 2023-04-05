using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace bluedom_be.Models;

public class Player
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Name { get; set; } = null!;

    public int Quests { get; set; }
    
    public int Tokens { get; set; }

    public List<string> Badges { get; set; } = null!;
    public List<string> Purchases { get; set; } = null!;
}