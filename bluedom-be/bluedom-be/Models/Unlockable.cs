﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace bluedom_be.Models;

public enum UnlockableType
{
    Background,
    Font,
    Effect
}

public class Unlockable
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public UnlockableType Type { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;
    
    public string Data { get; set; } = null!;
    
    public int Cost { get; set; }
}