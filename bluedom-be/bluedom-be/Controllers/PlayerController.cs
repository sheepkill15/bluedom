using bluedom_be.Models;
using bluedom_be.Services;
using Microsoft.AspNetCore.Mvc;

namespace bluedom_be.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayerController : ControllerBase
{
    private readonly PlayerService _playerService;

    public PlayerController(PlayerService playerService)
    {
        _playerService = playerService;
    }

    [HttpGet]
    public async Task<List<Player>> Get()
    {
        return await _playerService.GetAsync();
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<Player>> Get(string id)
    {
        var player = await _playerService.GetAsync(id);

        if (player is null)
        {
            return NotFound();
        }

        return player;
    }

    // [HttpPost]
    // public async Task<IActionResult> Post(Player newPlayer)
    // {
    //     await _playerService.CreateAsync(newPlayer);
    //     return CreatedAtAction(nameof(Get), new { id = newPlayer.Id }, newPlayer);
    // }

    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, Player updatedPlayer)
    {
        var player = await _playerService.GetAsync(id);
        if (player is null)
        {
            return NotFound();
        }

        updatedPlayer.Id = player.Id;
        await _playerService.UpdateAsync(id, updatedPlayer);
        return NoContent();
    }
}