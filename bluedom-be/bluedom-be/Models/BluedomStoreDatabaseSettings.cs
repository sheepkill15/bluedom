namespace bluedom_be.Models;

public class BluedomStoreDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string PlayersCollectionName { get; set; } = null!;
    public string BadgesCollectionName { get; set; } = null!;
    public string QuestsCollectionName { get; set; } = null!;
    public string UnlockablesCollectionName { get; set; } = null!;
    public string UsersCollectionName { get; set; } = null!;
}