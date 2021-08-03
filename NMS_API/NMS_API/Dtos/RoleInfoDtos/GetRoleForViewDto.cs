using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.RoleInfoDtos
{
    public class GetRoleForViewDto : Entity<int>
    {
        public string Name { get; set; }
        public string FullName { get; set; }
    }
}
