using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Mvc;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Interfaces
{
    public interface IEmployeeInfoRepository
    {
        Task<PagedResultDto<GetEmployeeForViewDto>> GetEmployeeInfos(GetAllInputFilter input);
        Task<GetEmployeeForViewDto> GetEmployeeInfo(int id);
        Task<GetEmployeeForViewDto> PutEmployeeInfo(int id, GetEmployeeForEditOutput editOutput);

        Task<EmployeeInfo> PostEmployeeInfo(GetEmployeeForEditOutput getEmployeeForEditOutput, int id);

        Task<EmployeeInfo> DeleteEmployeeInfo(int id);

        Task<bool> IsEmployeeEmailExists(string email);
        Task<bool> IsEmployeeUserNameExists(string username);
        Task<UserLogin> CreateUserLogin(UserLogin userLogin, string password);
        Task<bool> IsEmployeeExists(int id);
    }
}
