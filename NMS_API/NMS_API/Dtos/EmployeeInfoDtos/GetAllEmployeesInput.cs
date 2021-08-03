using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.EmployeeInfoDtos
{
    public class GetAllEmployeesInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
    }
}
