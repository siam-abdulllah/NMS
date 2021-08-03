using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Models
{
    public class UserLogin : Entity<int>
    {
       // public int Id { get; set; }
        public string Username { get; set; }    
        public Byte[] PasswordHash { get; set; }
        public Byte[] PasswordSalt { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedTerminal { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedTerminal { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string UserType { get; set; }
    }
}
