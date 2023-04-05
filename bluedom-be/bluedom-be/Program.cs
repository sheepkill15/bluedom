using bluedom_be.Models;
using bluedom_be.Services;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;

var builder = WebApplication.CreateBuilder(args);

// Set up MongoDB conventions
var pack = new ConventionPack
{
    new EnumRepresentationConvention(BsonType.String)
};

ConventionRegistry.Register("EnumStringConvention", pack, t => true);

// Add services to the container.
builder.Services.Configure<BluedomStoreDatabaseSettings>(builder.Configuration.GetSection("BluedomStoreDatabase"));

builder.Services.AddSingleton<PlayerService>();
builder.Services.AddSingleton<QuestService>();
builder.Services.AddSingleton<BadgeService>();
builder.Services.AddSingleton<UnlockableService>();
builder.Services.AddSingleton<UserService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();