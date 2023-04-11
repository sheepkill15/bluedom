using bluedom_be.Models;
using bluedom_be.Services;
using Microsoft.AspNetCore.Mvc;

namespace bluedom_be.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BadgeController : ControllerBase
{
    private readonly BadgeService _badgeService;

    public BadgeController(BadgeService badgeService)
    {
        _badgeService = badgeService;
    }

    // [HttpGet]
    // public async Task<List<Badge>> Get()
    // {
    //     return await _badgeService.GetAsync();
    // }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<Badge>> Get(string id)
    {
        var badge = await _badgeService.GetAsync(id);
        if (badge is null)
        {
            return NotFound();
        }

        return badge;
    }
}