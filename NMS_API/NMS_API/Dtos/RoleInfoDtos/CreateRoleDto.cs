using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.RoleInfoDtos
{
    public class CreateRoleDto : Entity<int>
    {
        [Required]
        public string  Name { get; set; }
        [Required]
        public string  FullName { get; set; }
    }
}
