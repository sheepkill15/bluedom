using bluedom_be.Models;
using bluedom_be.Services;
using Microsoft.AspNetCore.Mvc;

namespace bluedom_be.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UnlockableController : ControllerBase
{
    private readonly UnlockableService _unlockableService;
    
    public UnlockableController(UnlockableService unlockableService)
    {
        _unlockableService = unlockableService;
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
}