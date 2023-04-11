using bluedom_be.Models;
using bluedom_be.Services;
using bluedom_be.Views;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace bluedom_be.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly PlayerService _playerService;

    public UserController(UserService userService, PlayerService playerService)
    {
        _userService = userService;
        _playerService = playerService;
    }


    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<UserView>> Get(string id)
    {
        var user = await _userService.GetAsync(id);

        if (user is null)
        {
            return NotFound();
        }

        var mapper = new UserMapper();
        return mapper.UserToUserDto(user);
    }

    [HttpGet("login")]
    public async Task<IActionResult> Login(string username, string password)
    {
        var user = await _userService.GetByUsernameAsync(username);
        if (user is null)
        {
            return NotFound();
        }
        var hasher = new PasswordHasher<User>();
        if (hasher.VerifyHashedPassword(user, user.Password, password) ==
            PasswordVerificationResult.Failed)
        {
            return ValidationProblem("Bad password");
        }
        var mapper = new UserMapper();
        return CreatedAtAction(nameof(Get), new { id = user.Id }, mapper.UserToUserDto(user));
    }
    
    [HttpPost]
    public async Task<IActionResult> Post(User newUser, string? name)
    {
        var hasher = new PasswordHasher<User>();
        newUser.Password = hasher.HashPassword(newUser, newUser.Password);
        try
        {
            await _userService.CreateAsync(newUser);
        }
        catch (MongoWriteException)
        {
            return ValidationProblem("Username already exists.");
        }
        var newPlayer = new Player
        {
            Name = name ?? newUser.Username
        };
        await _playerService.CreateAsync(newPlayer);
        newUser.PlayerId = newPlayer.Id;
        await _userService.UpdateAsync(newUser.Id!, newUser);
        var mapper = new UserMapper();
        return CreatedAtAction(nameof(Get), new { id = newUser.Id }, mapper.UserToUserDto(newUser));
    }
}