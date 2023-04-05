using bluedom_be.Models;
using bluedom_be.Services;

var builder = WebApplication.CreateBuilder(args);

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