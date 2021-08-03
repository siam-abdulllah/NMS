using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos
{
    public class UserLoginDto
    {
        public string Username { get; set; }
        public Byte PasswordHash { get; set; }
        public Byte PasswordSalt { get; set; }
    }
}
