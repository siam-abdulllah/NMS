using Abp.Application.Services.Dto;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Dtos.RoleInfoDtos;
using NMS_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Interfaces
{
    public interface IRoleInfoRepository
    {
        Task<PagedResultDto<GetRoleForViewDto>> GetAllRoleInfos(GetAllInputFilter input);
        //Task<PagedResultDto<GetRoleForViewDto>> GetAll();
        Task<GetRoleForViewDto> GetRoleInfo(int id);
        Task<GetRoleForViewDto> EditRoleInfo(int id, GetRoleForEditOutput editOutput);
        Task<RoleInfo> CreateRoleInfo(CreateRoleDto createRoleDto);
        Task<RoleInfo> DeleteRoleInfo(int id);
        Task<bool> IsRoleExists(string name);
    }
}
