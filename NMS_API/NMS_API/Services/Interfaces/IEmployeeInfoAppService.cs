using Abp.Application.Services;
using Abp.Application.Services.Dto;
using NMS_API.Dtos.EmployeeInfoDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Interfaces
{
    public interface IEmployeeInfoAppService : IApplicationService
    {
        Task<PagedResultDto<GetEmployeeViewDto>> GetAll(GetAllEmployeesInput input);
        Task<GetEmployeeViewDto> GetEmployeeForView(int id);

      //  Task<GetEmployeeForEditOutput> GetEmployeeForEdit(EntityDto<int> input);
        Task CreateOrEdit(CreateOrEditEmployeeDto input);

        Task Delete(EntityDto<int> input);
    }
}
