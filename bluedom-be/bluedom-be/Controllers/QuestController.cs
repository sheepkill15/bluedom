using bluedom_be.Models;
using bluedom_be.Services;
using Microsoft.AspNetCore.Mvc;

namespace bluedom_be.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestController : ControllerBase
{
    private readonly QuestService _questService;
    private readonly PlayerService _playerService;
    private readonly BadgeService _badgeService;

    public QuestController(QuestService questService, PlayerService playerService, BadgeService badgeService)
    {
        _questService = questService;
        _playerService = playerService;
        _badgeService = badgeService;
    }

    [HttpGet]
    public async Task<List<Quest>> Get()
    {
        return await _questService.GetAsync();
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<Quest>> Get(string id)
    {
        var quest = await _questService.GetAsync(id);
        if (quest is null)
        {
            return NotFound();
        }

        return quest;
    }

    [HttpPost]
    public async Task<IActionResult> CreateQuest(Quest newQuest)
    {
        var issuerPlayer = await _playerService.GetAsync(newQuest.IssuerId);
        if (issuerPlayer is null)
        {
            return NotFound();
        }
        if (issuerPlayer.Tokens < newQuest.Reward)
        {
            return ValidationProblem("Player doesn't have enough tokens.");
        }

        issuerPlayer.Tokens -= newQuest.Reward;
        await _playerService.UpdateAsync(newQuest.IssuerId, issuerPlayer);
        await _questService.CreateAsync(newQuest);
        return CreatedAtAction(nameof(Get), new { id = newQuest.Id }, newQuest);
    }
    
    [HttpPost("completed/{questId:length(24)}")]
    public async Task<IActionResult> CompletedQuest(string questId, string playerId)
    {
        var player = await _playerService.GetAsync(playerId);
        if (player is null)
        {
            return NotFound();
        }

        var quest = await _questService.GetAsync(questId);
        if (quest is null)
        {
            return NotFound();
        }
        
        player.Quests += 1;
        player.Tokens += quest.Reward;

        var issuer = await _playerService.GetAsync(quest.IssuerId);
        if (issuer is not null)
        {
            issuer.Tokens += 2 * quest.Reward;
            await _playerService.UpdateAsync(quest.IssuerId, issuer);
            await _questService.RemoveAsync(questId);
        }
        var badges = await _badgeService.GetCompletedIds(player.Tokens, player.Quests);
        if (player.Badges is not null)
        {
            foreach(var badge in badges)
            {
                if (player.Badges.Find(x => x == badge) is null)
                {
                    player.Badges.Add(badge);
                }
            }
        }
        else
        {
            player.Badges = badges;
        }
        await _playerService.UpdateAsync(playerId, player);
        return CreatedAtAction(nameof(Get), new { id = playerId }, player);
    }
}