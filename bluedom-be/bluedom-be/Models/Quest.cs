using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace bluedom_be.Models;

public class Quest
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public string Name { get; set; } = null!;

    public string Text { get; set; } = null!;

    public string IssuerId { get; set; } = null!;
    
    public int Reward { get; set; }
    
    // Seconds
    public int RequiredTime { get; set; }
}