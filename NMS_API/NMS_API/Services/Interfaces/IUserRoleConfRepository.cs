using Abp.Application.Services.Dto;
using NMS_API.Dtos.CommonDtos;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Dtos.UserRoleConfDtos;
using NMS_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Interfaces
{
    public interface IUserRoleConfRepository
    {
        Task<PagedResultDto<GetUserRoleConfForViewDto>> GetAllUserRoleConfs(GetAllInputFilter input);
        Task<GetUserRoleConfForViewDto> GetUserRoleConf(int id);
        Task<UserRoleConf> CreateUserRoleConf(GetUserRoleConfForEditOutput createUserRoleDto);
        Task<GetUserRoleConfForViewDto> EditUserRoleConf(int id, GetUserRoleConfForEditOutput editOutput);
        Task<UserRoleConf> DeleteUserRoleConf(int id);
        Task<bool> IsUserRoleConfExists(int id);
        Task<bool> IsUserRoleUserIdRoleIdExists(int userId, int roleId);
        Task<bool> IsUserRoleUserIdExists(int userId);
        Task<PagedResultDto<LookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input);
        Task<PagedResultDto<LookupTableForAssignRoleDto>> GetAllRoleForLookupTable(GetAllForLookupTableInput input);
    }
}
