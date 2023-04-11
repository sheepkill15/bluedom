using bluedom_be.Models;
using bluedom_be.Services;
using Microsoft.AspNetCore.Mvc;

namespace bluedom_be.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UnlockableController : ControllerBase
{
    private readonly UnlockableService _unlockableService;
    private readonly PlayerService _playerService;
    
    public UnlockableController(UnlockableService unlockableService, PlayerService playerService)
    {
        _unlockableService = unlockableService;
        _playerService = playerService;
    }

    [HttpGet]
    public async Task<List<Unlockable>> Get()
    {
        return await _unlockableService.GetAsync();
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<Unlockable>> Get(string id)
    {
        var unlockable = await _unlockableService.GetAsync(id);
        if (unlockable is null)
        {
            return NotFound();
        }

        return unlockable;
    }

    [HttpPost("{id:length(24)}")]
    public async Task<ActionResult<Unlockable>> Purchase(string id, string playerId)
    {
        var unlockable = await _unlockableService.GetAsync(id);
        if (unlockable is null)
        {
            return NotFound();
        }

        var player = await _playerService.GetAsync(playerId);
        if (player is null)
        {
            return NotFound();
        }

        if (player.Tokens < unlockable.Cost)
        {
            return ValidationProblem("Not enough tokens.");
        }
        

        player.Tokens -= unlockable.Cost;
        player.Purchases ??= new List<string>();
        if (player.Purchases.Contains(id))
        {
            return ValidationProblem("You already purchased this.");
        }
            
        player.Purchases.Add(id);

        await _playerService.UpdateAsync(playerId, player);
        return unlockable;
    }
}