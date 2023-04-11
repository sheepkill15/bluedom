using bluedom_be.Models;
using Riok.Mapperly.Abstractions;

namespace bluedom_be.Views;

[Mapper]
public partial class UserMapper
{
    public partial UserView UserToUserDto(User user);
}