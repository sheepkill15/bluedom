using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace bluedom_be.Models;

public class Badge
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public string Name { get; set; } = null!;
    
    public string Description { get; set; } = null!;
    
    public int RequiredTokens { get; set; }
    
    public int RequiredQuests { get; set; }
}