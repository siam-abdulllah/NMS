using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.UserRoleConfDtos
{
    public class LookupTableForAssignRoleDto
    {
        public int Id { get; set; }

        public string DisplayName { get; set; }
        public string FullName { get; set; }
    }
}
