using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos
{
    public class UserCredential
    {
        public int UserLoginId { get; set; }
        public int ImpOrEmpId { get; set; }
        public string Username { get; set; }
        public string ContactName { get; set; }
        public string Position { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public string OrgName { get; set; }

    }
}
