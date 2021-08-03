using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.UserRoleConfDtos
{
    public class GetUserRoleConfForViewDto: Entity<int>
    {
        public string UserName { get; set; }
        public string RoleName { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
    }
}
